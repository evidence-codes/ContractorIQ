/** Decorative static preview — matches in-app analysis styling for marketing. */
export function AnalysisPreviewMock() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-2xl ring-1 ring-white/5 backdrop-blur-sm sm:p-5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Risk score', value: '74', suffix: '/ 100', tone: 'from-amber-500/15 to-transparent' },
          { label: 'Critical flags', value: '3', tone: 'from-rose-500/15 to-transparent' },
          { label: 'Est. hours', value: '62–114', sub: 'low–high range', tone: 'from-zinc-500/15 to-transparent' },
          { label: 'Project value', value: '$6.2k–$11.4k', sub: 'illustrative @100/hr', tone: 'from-emerald-500/15 to-transparent' },
        ].map((m) => (
          <div
            key={m.label}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${m.tone} p-3`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{m.label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white">
              {m.value}
              {m.suffix && <span className="text-sm font-normal text-zinc-400">{m.suffix}</span>}
            </p>
            {m.sub && <p className="mt-0.5 text-[10px] text-zinc-500">{m.sub}</p>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {['Risks', 'Scope', 'Hours', 'Counter-proposal'].map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              i === 0 ? 'bg-white text-zinc-900' : 'bg-white/5 text-zinc-400'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-zinc-950/60 p-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-300">
            Critical
          </span>
          <span className="text-xs font-medium text-white">IP &amp; deliverables</span>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-400">
          Sample output: ambiguous ownership language is flagged with suggested replacement clauses you can paste into
          your reply.
        </p>
      </div>
    </div>
  );
}
