'use client';

import { useMemo, useState } from 'react';
import type { AnalysisResult } from '@/types/analysis';
import { ScopePanel } from './ScopePanel';
import { RiskPanel } from './RiskPanel';
import { HoursPanel } from './HoursPanel';
import { CounterProposalPanel } from './CounterProposalPanel';
import { ContractChat } from './ContractChat';
import { sampleCounterProposal } from '@/lib/demo/sampleAnalysis';
import { cn } from '@/lib/utils';

type Tab = 'risks' | 'scope' | 'hours' | 'counter';

export function AnalysisDashboard({
  result,
  analysisId,
  isDemo = false,
  notice,
  titleFallback,
}: {
  result: AnalysisResult;
  analysisId?: string;
  isDemo?: boolean;
  notice?: string;
  titleFallback?: string;
}) {
  const [tab, setTab] = useState<Tab>('risks');
  const totals = useMemo(
    () => result.hours.reduce((acc, h) => ({ low: acc.low + h.low, mid: acc.mid + h.mid, high: acc.high + h.high }), { low: 0, mid: 0, high: 0 }),
    [result.hours]
  );
  const criticalCount = useMemo(() => result.flags.filter((f) => f.severity === 'critical').length, [result.flags]);
  const rate = 100;
  const valueLow = totals.low * rate;
  const valueHigh = totals.high * rate;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'risks', label: 'Risks', badge: result.flags.length },
    { id: 'scope', label: 'Scope', badge: result.scope.length },
    { id: 'hours', label: 'Hours' },
    { id: 'counter', label: 'Counter-proposal' },
  ];

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {notice}
        </div>
      )}
      {/* Summary metrics — Claude-style strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Risk score" value={`${result.risk_score}`} suffix="/ 100" accent={result.risk_score >= 60 ? 'amber' : 'emerald'} />
        <MetricCard label="Critical flags" value={`${criticalCount}`} accent="rose" />
        <MetricCard label="Est. hours" value={`${totals.low}–${totals.high}`} sub="low–high range" accent="slate" />
        <MetricCard
          label="Project value"
          value={`$${(valueLow / 1000).toFixed(1)}k–$${(valueHigh / 1000).toFixed(1)}k`}
          sub={`@${rate}/hr illustrative`}
          accent="emerald"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-sm md:p-6">
        <div className="border-b border-white/10 pb-4">
          <p className="text-lg font-medium tracking-tight text-white">
            {result.project_name || titleFallback || 'Untitled project'}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{result.client_name || 'Unknown client'}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{result.summary}</p>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                tab === t.id
                  ? 'bg-white text-zinc-900 shadow'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
              )}
            >
              {t.label}
              {t.badge != null && (
                <span className={cn('rounded-full px-2 py-0.5 text-xs', tab === t.id ? 'bg-zinc-200 text-zinc-800' : 'bg-white/10 text-zinc-400')}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-5 min-h-[280px]">
          {tab === 'scope' && (
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <ScopePanel scope={result.scope} />
            </div>
          )}
          {tab === 'risks' && (
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <RiskPanel flags={result.flags} />
            </div>
          )}
          {tab === 'hours' && (
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <HoursPanel hours={result.hours} rate={rate} />
            </div>
          )}
          {tab === 'counter' && (
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              {isDemo ? (
                <CounterProposalPanel flags={result.flags} existing={sampleCounterProposal} readOnly />
              ) : analysisId ? (
                <CounterProposalPanel analysisId={analysisId} flags={result.flags} existing={null} />
              ) : (
                <p className="text-sm text-zinc-400">Save an analysis to generate a counter-proposal from your contract.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ContractChat analysisId={isDemo ? undefined : analysisId} isDemo={isDemo} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  sub,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub?: string;
  accent: 'emerald' | 'amber' | 'rose' | 'slate';
}) {
  const ring =
    accent === 'emerald'
      ? 'from-emerald-500/20 to-teal-500/5'
      : accent === 'amber'
        ? 'from-amber-500/20 to-yellow-500/5'
        : accent === 'rose'
          ? 'from-rose-500/20 to-red-500/5'
          : 'from-zinc-500/20 to-zinc-600/5';
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${ring} p-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {value}
        {suffix && <span className="text-lg font-normal text-zinc-400">{suffix}</span>}
      </p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}
