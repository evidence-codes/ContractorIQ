'use client';

import { useEffect, useState } from 'react';
import type { CounterProposalResult, RiskFlag } from '@/types/analysis';
import { ExportButton } from '@/components/shared/ExportButton';

export function CounterProposalPanel({
  analysisId,
  flags,
  existing,
  readOnly = false,
}: {
  analysisId?: string;
  flags: RiskFlag[];
  existing: CounterProposalResult | null;
  readOnly?: boolean;
}) {
  const [result, setResult] = useState<CounterProposalResult | null>(existing);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    flags.filter((f) => f.severity !== 'minor').map((f) => f.id)
  );

  useEffect(() => {
    setResult(existing);
  }, [existing]);

  const generate = async () => {
    if (readOnly || !analysisId) return;
    setLoading(true);
    const res = await fetch('/api/counter-proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId, selectedFlagIds: selectedIds }),
    });
    const json = await res.json();
    if (res.ok) {
      setResult(json.result);
      setStatus('Counter-proposal generated.');
    } else {
      setStatus(json.error || 'Generation failed.');
    }
    setLoading(false);
  };

  if (!result) {
    if (readOnly) {
      return <p className="text-sm text-zinc-400">No sample counter-proposal loaded.</p>;
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">
          Select the risk flags you want addressed, then generate professional replacement language.
        </p>
        <div className="space-y-2">
          {flags
            .filter((f) => f.severity !== 'minor')
            .map((flag) => (
              <label
                key={flag.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-300 transition hover:border-white/20"
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-emerald-500"
                  checked={selectedIds.includes(flag.id)}
                  onChange={(e) =>
                    setSelectedIds((prev) =>
                      e.target.checked ? [...prev, flag.id] : prev.filter((id) => id !== flag.id)
                    )
                  }
                />
                <span>
                  <span className="font-medium text-white">{flag.category}</span>
                  <span className="block text-zinc-500">{flag.reason}</span>
                </span>
              </label>
            ))}
        </div>
        <button
          type="button"
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
          onClick={generate}
          disabled={loading || selectedIds.length === 0 || !analysisId}
        >
          {loading ? 'Generating…' : 'Generate counter-proposal'}
        </button>
        {status && <p className="text-sm text-zinc-400">{status}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-zinc-200">
      <p className="leading-relaxed text-zinc-300">{result.cover_note}</p>
      <div className="flex flex-wrap gap-2">
        <ExportButton coverNote={result.cover_note} clauses={result.clauses} />
      </div>
      {result.clauses.map((c) => (
        <div key={c.id} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Original</p>
          <p className="mt-1 text-sm text-zinc-300">{c.original}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Replacement</p>
          <p className="mt-1 text-sm text-white">{c.replacement}</p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
            onClick={() => navigator.clipboard.writeText(c.replacement)}
          >
            Copy replacement
          </button>
        </div>
      ))}
    </div>
  );
}
