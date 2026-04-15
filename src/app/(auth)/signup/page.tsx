'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getAuthCallbackUrl } from '@/lib/auth/site-origin';
import { formatAuthError } from '@/lib/auth/format-auth-error';
import { AuthShell } from '@/components/auth/AuthShell';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useOtpCooldown } from '@/hooks/useOtpCooldown';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { remaining, start, isCooling } = useOtpCooldown(60);

  const clearAlerts = () => {
    setMessage(null);
    setError(null);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Google creates your account without a magic-link email (best for testing and for avoiding email rate limits). You can still use email if you prefer."
    >
      <ul className="mb-6 space-y-2 text-xs text-zinc-500">
        <li className="flex gap-2">
          <span className="text-emerald-500">✓</span>
          Upload contracts and run real analyses
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500">✓</span>
          Save preferences for hours, IP stance, and counter-proposals
        </li>
      </ul>

      <div className="space-y-3">
        <GoogleSignInButton
          onError={(msg) => setError(msg)}
          onInteractionStart={clearAlerts}
        />
        <p className="text-center text-[11px] leading-relaxed text-zinc-600">
          Enable Google under Supabase → Authentication → Providers if you see a configuration error.
        </p>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-900/95 px-3 text-zinc-500">or use email</span>
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isCooling) return;
          setLoading(true);
          clearAlerts();
          const { error: authError } = await createClient().auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: getAuthCallbackUrl(),
              shouldCreateUser: true,
            },
          });
          if (authError) {
            setError(formatAuthError(authError));
            start(authError.code === 'over_email_send_rate_limit' ? 180 : 60);
          } else {
            setMessage('Check your inbox — we sent a link to finish setting up your account.');
            start(60);
          }
          setLoading(false);
        }}
      >
        <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-300">
          Work email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            id="signup-email"
            className={cn(inputClass, 'pl-11')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={loading || isCooling}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending link…
            </>
          ) : isCooling ? (
            `Wait ${remaining}s to send again`
          ) : (
            'Continue with email'
          )}
        </button>
      </form>

      {message && (
        <div className="mt-6 flex gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className="mt-6 flex gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-10 space-y-4 border-t border-white/10 pt-8 text-center text-sm">
        <p className="text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
            Sign in
          </Link>
        </p>
        <p>
          <Link
            href="/analyze?demo=1"
            className="text-zinc-400 transition hover:text-white hover:underline"
          >
            Explore the demo without signing up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
