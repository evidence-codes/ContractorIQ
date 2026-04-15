/**
 * Base URL for auth redirects (magic link `emailRedirectTo`).
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. `https://your-domain.com`) so links
 * always point at your real host. The value must be listed under Supabase Dashboard →
 * Authentication → URL Configuration → Redirect URLs (e.g. `https://your-domain.com/auth/callback`).
 */
export function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}

export function getAuthCallbackUrl(): string {
  return `${getSiteOrigin()}/auth/callback`;
}
