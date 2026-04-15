'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAuthCallbackUrl } from '@/lib/auth/site-origin';
import { formatAuthError } from '@/lib/auth/format-auth-error';
import { Loader2 } from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const showGoogle =
  typeof process.env.NEXT_PUBLIC_SHOW_GOOGLE_OAUTH === 'undefined' ||
  process.env.NEXT_PUBLIC_SHOW_GOOGLE_OAUTH !== 'false';

type Props = {
  onError: (message: string) => void;
  /** Clear prior messages before starting OAuth. */
  onInteractionStart?: () => void;
};

export function GoogleSignInButton({ onError, onInteractionStart }: Props) {
  const [loading, setLoading] = useState(false);

  if (!showGoogle) return null;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        onInteractionStart?.();
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: getAuthCallbackUrl(),
          },
        });
        if (error) {
          onError(formatAuthError(error));
          setLoading(false);
          return;
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        onError('Could not start Google sign-in. Enable the Google provider in the Supabase dashboard (Authentication → Providers).');
        setLoading(false);
      }}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
      ) : (
        <>
          <GoogleIcon className="h-5 w-5 text-zinc-800" />
          Continue with Google
        </>
      )}
    </button>
  );
}
