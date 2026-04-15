import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { extractPdfText } from '@/lib/parsers/pdf';
import { extractDocxText } from '@/lib/parsers/docx';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  let stage = 'initializing request';
  try {
    stage = 'creating Supabase server client';
    const supabase = await createClient();
    stage = 'loading authenticated user';
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    stage = 'reading multipart form data';
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const lowerName = file.name.toLowerCase();
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Only PDF and DOCX files are supported' }, { status: 400 });
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx')) {
      return NextResponse.json({ error: 'File extension must be .pdf or .docx' }, { status: 400 });
    }

    stage = 'hashing uploaded file';
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    stage = 'checking for cached analysis';
    const { data: existing } = await supabase
      .from('analyses')
      .select('id,file_url')
      .eq('user_id', user.id)
      .eq('file_hash', fileHash)
      .eq('status', 'complete')
      .maybeSingle();
    if (existing) {
      let signedUrl: string | null = null;
      try {
        const { data: signed } = await supabase.storage.from('contracts').createSignedUrl(existing.file_url, 3600);
        signedUrl = signed?.signedUrl || null;
      } catch {
        signedUrl = null;
      }
      return NextResponse.json({ cached: true, analysisId: existing.id, signedUrl });
    }

    stage = 'checking daily usage limits';
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from('analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString());
    if ((todayCount || 0) >= 10) {
      return NextResponse.json({ error: 'Daily analysis limit reached (10/day on free tier)' }, { status: 429 });
    }

    stage = 'uploading file to storage';
    const key = `${user.id}/${fileHash}-${file.name}`;
    let { data: uploadData, error: uploadError } = await supabase.storage
      .from('contracts')
      .upload(key, buffer, { contentType: file.type, upsert: false });
    let filePath = uploadData?.path ?? key;
    let storageAvailable = true;
    if (uploadError) {
      const resourceExists = uploadError.message.toLowerCase().includes('already exists');
      const isFetchFailure = uploadError.message.toLowerCase().includes('fetch failed');
      if (isFetchFailure && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // Fallback: retry with server-side service role client when auth-scoped storage call fails at network layer.
        stage = 'uploading file to storage via service-role fallback';
        const admin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const retried = await admin.storage
          .from('contracts')
          .upload(key, buffer, { contentType: file.type, upsert: false });
        uploadData = retried.data ?? uploadData;
        uploadError = retried.error ?? null;
        filePath = uploadData?.path ?? key;
      }

      if (uploadError) {
      if (resourceExists) {
        // If the object already exists for this deterministic key, reuse it.
        filePath = key;
      } else if (uploadError.message.toLowerCase().includes('fetch failed')) {
        // Degrade gracefully: continue analysis even if Storage is temporarily unreachable.
        // We still persist the analysis record and allow users to get AI output.
        storageAvailable = false;
        filePath = key;
      } else {
      const hint = uploadError.message.toLowerCase().includes('fetch failed')
        ? ' Supabase storage request failed — check NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY, project status, and local network/DNS.'
        : '';
      console.error('[upload-api] storage upload failed', {
        stage,
        message: uploadError.message,
        key,
        userId: user.id,
      });
      return NextResponse.json(
        { error: `Upload failed during ${stage}: ${uploadError.message}.${hint}`.trim() },
        { status: 500 }
      );
      }
      }
    }

    let extractedText = '';
    stage = 'extracting document text';
    try { extractedText = file.type === 'application/pdf' ? await extractPdfText(buffer) : await extractDocxText(buffer); }
    catch { return NextResponse.json({ error: 'Could not read file content' }, { status: 422 }); }

    stage = 'creating analysis database record';
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({ user_id: user.id, file_name: file.name, file_url: filePath, file_hash: fileHash, file_size: file.size, status: 'pending' })
      .select('id')
      .single();
    if (analysisError || !analysis?.id) {
      return NextResponse.json(
        { error: `Failed to create analysis record: ${analysisError?.message ?? 'unknown error'}` },
        { status: 500 }
      );
    }
    stage = 'creating signed preview URL';
    let signedUrl: string | null = null;
    if (storageAvailable) {
      try {
        const { data: signed } = await supabase.storage.from('contracts').createSignedUrl(filePath, 3600);
        signedUrl = signed?.signedUrl || null;
      } catch {
        signedUrl = null;
      }
    }

    return NextResponse.json({ analysisId: analysis.id, extractedText, fileName: file.name, signedUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unexpected runtime error';
    const cause =
      e && typeof e === 'object' && 'cause' in e
        ? String((e as { cause?: unknown }).cause ?? '')
        : '';
    const isFetchFailure = msg.toLowerCase().includes('fetch failed') || cause.toLowerCase().includes('fetch failed');
    const hint = isFetchFailure
      ? ' Supabase network call failed — verify NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY, project is active, and local network/DNS.'
      : '';
    console.error('[upload-api] unexpected failure', {
      stage,
      message: msg,
      cause,
    });
    return NextResponse.json(
      { error: `Upload failed during ${stage}: ${msg}.${hint}`.trim() },
      { status: 500 }
    );
  }
}
