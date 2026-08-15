/**
 * Environment access for the standalone Auto AI Technologies frontend.
 *
 * Values come from Vite env vars only — nothing here is hardcoded. The
 * Supabase instance is the Lovable Cloud-managed project shared with the live
 * Lovable app; this app is a frontend rebuild and never provisions a backend.
 */

function readEnv(key: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === 'string' ? value.trim() : '';
}

export const APP_NAME = readEnv('VITE_APP_NAME') || 'Auto AI Technologies';

export const SUPABASE_URL = readEnv('VITE_SUPABASE_URL');
export const SUPABASE_PUBLISHABLE_KEY = readEnv('VITE_SUPABASE_PUBLISHABLE_KEY');

/** True only when both Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/**
 * A service-role key must never reach the browser. If one is pasted into the
 * publishable-key slot by mistake, fail loudly in dev rather than shipping it.
 */
export function assertNotServiceRoleKey(key: string): void {
  if (!key) return;
  const [, payload] = key.split('.');
  if (!payload) return;
  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (decoded?.role && decoded.role !== 'anon') {
      throw new Error(
        `VITE_SUPABASE_PUBLISHABLE_KEY has role "${decoded.role}". ` +
          'Only an anon/publishable key may be used in frontend code.',
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Only an anon')) throw err;
    // Non-JWT publishable keys (sb_publishable_...) have no payload to read.
  }
}
