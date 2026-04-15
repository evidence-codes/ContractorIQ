import { createClient } from '@/lib/supabase/server';
import { AnalysisSkeleton } from '@/components/analysis/AnalysisSkeleton';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { AnalysisPolling } from '@/components/analysis/AnalysisPolling';
import type { AnalysisResult } from '@/types/analysis';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('analyses')
    .select('id,status,file_name,scope_json,flags_json,hours_json,summary_text,client_name,project_name,risk_score,counter_json')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 px-6 py-12 text-center">
        <p className="text-white">This analysis was not found or you do not have access.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }
  if (data.status !== 'complete') {
    return (
      <div className="space-y-4">
        <AnalysisPolling />
        <AnalysisSkeleton />
      </div>
    );
  }
  const result: AnalysisResult = {
    scope: (data.scope_json || []) as AnalysisResult['scope'],
    flags: (data.flags_json || []) as AnalysisResult['flags'],
    hours: (data.hours_json || []) as AnalysisResult['hours'],
    summary: data.summary_text || '',
    client_name: data.client_name || undefined,
    project_name: data.project_name || undefined,
    contract_type: 'unknown',
    risk_score: data.risk_score || 0,
  };
  return <AnalysisDashboard result={result} analysisId={id} titleFallback={data.file_name || undefined} />;
}
