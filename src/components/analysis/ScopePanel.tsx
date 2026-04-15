import type { ScopeItem } from '@/types/analysis';

export function ScopePanel({ scope }: { scope: ScopeItem[] }) {
  return (
    <div className="space-y-3">
      {scope.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-inner"
        >
          <p className="font-medium text-white">{item.task}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.deliverable}</p>
          {item.ambiguity_score != null && (
            <p className="mt-2 text-xs text-zinc-500">
              Ambiguity: {(item.ambiguity_score * 100).toFixed(0)}%
              {item.ambiguity_reason ? ` — ${item.ambiguity_reason}` : ''}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
