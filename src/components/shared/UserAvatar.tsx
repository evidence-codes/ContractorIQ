'use client';

import { useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

function getDisplayName(user?: User | null): string {
  if (!user) return 'User';
  const meta = user.user_metadata ?? {};
  return (meta.full_name || meta.name || meta.user_name || user.email || 'User') as string;
}

function getAvatarUrl(user?: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return (meta.avatar_url || meta.picture || null) as string | null;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? 'U';
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function UserAvatar({ user }: { user?: User | null }) {
  const [imageError, setImageError] = useState(false);
  const [open, setOpen] = useState(false);
  const name = useMemo(() => getDisplayName(user), [user]);
  const avatarUrl = useMemo(() => getAvatarUrl(user), [user]);
  const initials = useMemo(() => getInitials(name), [name]);
  const email = user?.email ?? '';

  return (
    <div className="relative">
      <button
        type="button"
        className="grid size-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 ring-2 ring-white/10"
        title={name}
        aria-label={`Signed in as ${name}`}
        onClick={() => setOpen((v) => !v)}
      >
        {avatarUrl && !imageError ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-64 rounded-xl border border-white/10 bg-zinc-900/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          {email && <p className="truncate text-xs text-zinc-400">{email}</p>}
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
