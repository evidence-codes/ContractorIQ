import Link from 'next/link';
import type { Analysis } from '@/types/analysis';
import { ChevronRight, FileText } from 'lucide-react';

export function ContractCard({ analysis }: { analysis: Analysis }) {
  return (
    <Link
      href={`/analysis/${analysis.id}`}
      className="group flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition hover:border-emerald-500/30 hover:bg-zinc-900/80"
    >
      <div className="flex min-w-0 gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <FileText className="h-5 w-5 text-emerald-400/90" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{analysis.file_name}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Status: <span className="text-zinc-300">{analysis.status}</span>
            {analysis.risk_score != null && (
              <>
                {' · '}
                Risk <span className="text-zinc-300">{analysis.risk_score}</span>/100
              </>
            )}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-400" />
    </Link>
  );
}
