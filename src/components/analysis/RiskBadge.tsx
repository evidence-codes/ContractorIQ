import type { RiskSeverity } from '@/types/analysis';
import { cn } from '@/lib/utils';

const styles: Record<RiskSeverity, string> = {
  critical: 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/30',
  moderate: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25',
  minor: 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20',
};

export function RiskBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', styles[severity])}>
      {severity}
    </span>
  );
}
