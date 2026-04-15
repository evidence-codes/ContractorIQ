'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { MobileNav } from './MobileNav';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

export function Header() {
  const { user, ready } = useSupabaseUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <Logo />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {ready && !user && (
          <>
            <Link
              href="/login"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/5 sm:inline"
            >
              Sign up
            </Link>
          </>
        )}
        {ready && user && <UserAvatar user={user} />}
        {!ready && <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" aria-hidden />}
      </div>
    </header>
  );
}
