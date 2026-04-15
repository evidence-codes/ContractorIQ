import Link from 'next/link';
import type { Analysis } from '@/types/analysis';
import { ContractCard } from './ContractCard';
import { Plus } from 'lucide-react';

export function ContractList({ analyses }: { analyses: Analysis[] }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Your analyses</h1>
          <p className="mt-1 text-sm text-zinc-500">Open any row to review scope, risks, hours, and counter-proposals.</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          New analysis
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {analyses.map((a) => (
          <ContractCard key={a.id} analysis={a} />
        ))}
      </div>
    </div>
  );
}
