'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, LogIn, ScanSearch, Settings2, Sparkles, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

export function Sidebar() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === '1';
  const { user, ready } = useSupabaseUser();

  const authedLinks = useMemo(() => {
    const base: { href: string; label: string; icon: LucideIcon }[] = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: isDemo ? '/analyze?demo=1' : '/analyze', label: 'Analyze', icon: ScanSearch },
    ];
    if (!isDemo) base.push({ href: '/settings', label: 'Settings', icon: Settings2 });
    return base;
  }, [isDemo]);

  const guestLinks: { href: string; label: string; icon: LucideIcon }[] = [
    { href: '/analyze?demo=1', label: 'Live demo', icon: ScanSearch },
    { href: '/login', label: 'Log in', icon: LogIn },
    { href: '/signup', label: 'Sign up', icon: UserPlus },
  ];

  return (
    <aside className="flex h-full min-h-screen w-[260px] flex-col border-r border-white/10 bg-zinc-950/95 px-4 py-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">ContractorIQ</p>
          <p className="text-[11px] text-zinc-500">Contract intelligence</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {!ready ? (
          <>
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
          </>
        ) : user ? (
          authedLinks.map(({ href, label, icon: Icon }) => {
            const linkPath = href.split('?')[0];
            const active =
              linkPath === '/dashboard'
                ? path === '/dashboard'
                : path === linkPath || path.startsWith(`${linkPath}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
                {label}
              </Link>
            );
          })
        ) : (
          guestLinks.map(({ href, label, icon: Icon }) => {
            const linkPath = href.split('?')[0];
            const active =
              path === linkPath || (href.includes('demo') && path === '/analyze' && isDemo);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
                {label}
              </Link>
            );
          })
        )}
      </nav>

      <div className="mt-auto rounded-xl border border-white/5 bg-zinc-900/50 p-3 text-xs leading-relaxed text-zinc-500">
        {!ready ? null : user ? (
          isDemo ? (
            <>
              You are viewing sample data.{' '}
              <Link href="/signup" className="font-medium text-zinc-400 underline-offset-2 hover:text-white hover:underline">
                Sign up
              </Link>{' '}
              to run real analyses and open preferences.
            </>
          ) : (
            <>
              Preferences in <span className="text-zinc-400">Settings</span> tune how AI analyzes contracts and drafts
              counter-proposals.
            </>
          )
        ) : (
          <>
            <span className="text-zinc-400">Account required</span> for Dashboard, Analyze, and Settings. Try the live demo
            or sign in.
          </>
        )}
      </div>
    </aside>
  );
}
