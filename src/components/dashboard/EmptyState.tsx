import Link from 'next/link';
import { ScanSearch } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
        <ScanSearch className="h-7 w-7 text-emerald-400" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-white">No analyses yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        Upload a contract to extract scope, flag risky clauses, estimate hours, and draft a counter-proposal.
      </p>
      <Link
        href="/analyze"
        className="mt-8 inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
      >
        Start first analysis
      </Link>
      <p className="mt-6 text-xs text-zinc-600">
        Prefer to look around first?{' '}
        <Link href="/analyze?demo=1" className="text-emerald-400 hover:underline">
          Try the interactive demo
        </Link>
      </p>
    </div>
  );
}
