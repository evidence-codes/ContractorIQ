import type { HourEstimate } from '@/types/analysis';

export function HoursPanel({ hours, rate }: { hours: HourEstimate[]; rate: number }) {
  const totals = hours.reduce(
    (a, h) => ({ low: a.low + h.low, mid: a.mid + h.mid, high: a.high + h.high }),
    { low: 0, mid: 0, high: 0 }
  );
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[480px] text-sm text-zinc-300">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-900/80 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3">Task</th>
              <th className="px-2 py-3 text-center">Low</th>
              <th className="px-2 py-3 text-center">Mid</th>
              <th className="px-2 py-3 text-center">High</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 text-white">{h.task}</td>
                <td className="px-2 py-3 text-center tabular-nums">{h.low}</td>
                <td className="px-2 py-3 text-center tabular-nums text-emerald-300/90">{h.mid}</td>
                <td className="px-2 py-3 text-center tabular-nums">{h.high}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-zinc-400">
        Estimated value at illustrative {rate}/hr:{' '}
        <span className="font-medium text-emerald-300">
          {(totals.low * rate).toLocaleString()} – {(totals.high * rate).toLocaleString()} {''}
        </span>
      </p>
    </div>
  );
}
