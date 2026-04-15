import type { AuthError } from '@supabase/supabase-js';

/** User-facing copy for common Supabase Auth errors. */
export function formatAuthError(err: AuthError | null | undefined): string {
  if (!err) return 'Something went wrong. Please try again.';
  const code = err.code ?? '';
  const msg = err.message ?? '';

  if (code === 'over_email_send_rate_limit' || msg.toLowerCase().includes('rate limit')) {
    return 'Too many sign-in emails were requested in a short window (Supabase’s anti-abuse limit). Wait several minutes and try again, or use Google — it does not send a magic link email.';
  }

  if (code === 'otp_expired' || msg.includes('expired')) {
    return 'That sign-in link has expired. Request a new one from this page.';
  }

  if (code === 'user_not_found' || msg.includes('User not found')) {
    return 'No account exists for that email yet. Use “Create an account” first, or sign in with Google.';
  }

  return msg;
}
