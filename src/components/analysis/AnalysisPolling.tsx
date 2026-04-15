'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AnalysisPolling() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [router]);

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-3">
      <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-emerald-400" aria-hidden />
      <div>
        <p className="text-sm font-medium text-white">Analysis in progress</p>
        <p className="mt-1 text-sm text-zinc-500">
          We are reading your contract and building scope, risks, and hour estimates. This page refreshes every few
          seconds until results are ready.
        </p>
      </div>
    </div>
  );
}
