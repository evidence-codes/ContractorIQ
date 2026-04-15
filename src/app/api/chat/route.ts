import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/anthropic/client';
import { buildChatSystemPrompt } from '@/lib/anthropic/prompts';

export const maxDuration = 60;
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { analysisId, messages, contractText } = await request.json();
  const sanitizedMessages = (messages as Array<{ role: string; content: string }>).map((m) => ({
    role: m.role,
    content: sanitizeInput(m.content),
  }));
  const safeContractText = sanitizeInput(String(contractText || ''));
  const { data: analysis } = await supabase.from('analyses').select('summary_text').eq('id', analysisId).eq('user_id', user.id).single();
  if (!analysis) return Response.json({ error: 'Not found' }, { status: 404 });

  const lastUser = sanitizedMessages.filter((m) => m.role === 'user').at(-1);
  if (lastUser?.content) {
    await supabase.from('chat_messages').insert({
      analysis_id: analysisId,
      user_id: user.id,
      role: 'user',
      content: lastUser.content,
    });
  }

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: buildChatSystemPrompt(safeContractText, analysis.summary_text || ''),
    messages: sanitizedMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  });

  const encoder = new TextEncoder();
  let assistantResponse = '';
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          assistantResponse += chunk.delta.text;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
        }
      }
      if (assistantResponse.trim()) {
        await supabase.from('chat_messages').insert({
          analysis_id: analysisId,
          user_id: user.id,
          role: 'assistant',
          content: assistantResponse,
        });
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const analysisId = new URL(request.url).searchParams.get('analysisId');
  if (!analysisId) return Response.json({ error: 'analysisId is required' }, { status: 400 });

  const { data: analysis } = await supabase
    .from('analyses')
    .select('id')
    .eq('id', analysisId)
    .eq('user_id', user.id)
    .single();
  if (!analysis) return Response.json({ error: 'Not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id,role,content,created_at')
    .eq('analysis_id', analysisId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) return Response.json({ error: 'Failed to load chat history' }, { status: 500 });
  return Response.json({ messages: data || [] });
}
