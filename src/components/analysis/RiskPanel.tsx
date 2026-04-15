import type { RiskFlag } from '@/types/analysis';
import { RiskBadge } from './RiskBadge';

export function RiskPanel({ flags }: { flags: RiskFlag[] }) {
  const severityOrder = ['critical', 'moderate', 'minor'] as const;
  const grouped = severityOrder.map((severity) => ({
    severity,
    items: flags.filter((f) => f.severity === severity),
  }));

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <div key={group.severity} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {group.severity} <span className="text-zinc-600">({group.items.length})</span>
          </p>
          {group.items.map((flag) => (
            <div
              key={flag.id}
              className={`rounded-xl border border-white/10 bg-zinc-900/80 p-4 ${
                flag.severity === 'critical' ? 'border-l-4 border-l-rose-500 bg-rose-950/20' : ''
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <RiskBadge severity={flag.severity} />
                <span className="text-sm font-medium text-white">{flag.category}</span>
                {flag.clause_location && (
                  <span className="text-xs text-zinc-500">{flag.clause_location}</span>
                )}
              </div>
              <p className="font-mono text-sm leading-relaxed text-zinc-300">&quot;{flag.clause}&quot;</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{flag.reason}</p>
              <details className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                <summary className="cursor-pointer font-medium text-zinc-200">Suggested fix &amp; impact</summary>
                <p className="mt-2">
                  <span className="font-semibold text-white">Suggested fix:</span> {flag.suggested_fix}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-white">Impact:</span> {flag.impact}
                </p>
              </details>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
