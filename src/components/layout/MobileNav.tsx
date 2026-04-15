'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, LogIn, Menu, ScanSearch, Settings2, UserPlus, X } from 'lucide-react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const [open, setOpen] = useState(false);
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

  const links = !ready ? [] : user ? authedLinks : guestLinks;

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute left-0 top-12 z-30 w-56 rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl shadow-black/50">
          {!ready ? (
            <div className="space-y-2 px-2 py-2">
              <div className="h-9 animate-pulse rounded-xl bg-white/5" />
              <div className="h-9 animate-pulse rounded-xl bg-white/5" />
            </div>
          ) : (
            links.map(({ href, label, icon: Icon }) => {
              const linkPath = href.split('?')[0];
              const active =
                path === linkPath || (href.includes('demo') && path === '/analyze' && isDemo);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <Icon className={cn('h-4 w-4', active ? 'text-emerald-300' : 'text-emerald-400')} />
                  {label}
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
