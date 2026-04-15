'use client';
import { UploadZone } from '@/components/upload/UploadZone';
import { useAnalysisStore } from '@/store/analysisStore';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { useSearchParams } from 'next/navigation';
import { sampleAnalysis } from '@/lib/demo/sampleAnalysis';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const { result, analysisId, analysisNotice, fileName } = useAnalysisStore();
  const isDemo = searchParams.get('demo') === '1';

  if (isDemo) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent px-5 py-4">
          <p className="text-sm font-medium text-emerald-200">Interactive demo</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Explore a full sample analysis — tabs, metrics, and counter-proposal — with no account. Upload your own
            contracts after you sign up.
          </p>
        </div>
        <AnalysisDashboard result={sampleAnalysis} isDemo />
      </div>
    );
  }

  if (result) {
    return (
      <AnalysisDashboard
        result={result}
        analysisId={analysisId || undefined}
        notice={analysisNotice || undefined}
        titleFallback={fileName || undefined}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Analyze a contract</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          We extract scope, surface risky clauses with severity, estimate hours, and help you draft a counter-proposal.
          Your file is analyzed on the server — nothing is shown in the browser until results are ready.
        </p>
      </div>
      <UploadZone />
    </div>
  );
}
