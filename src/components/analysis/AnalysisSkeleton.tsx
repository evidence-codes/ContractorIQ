export function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/60" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/40" />
    </div>
  );
}
