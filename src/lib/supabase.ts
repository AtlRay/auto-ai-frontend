import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  isSupabaseConfigured,
  assertNotServiceRoleKey,
} from './env';

/**
 * Shared Supabase client.
 *
 * `null` when env vars are absent so the brand shell still renders during
 * local setup instead of crashing on a missing key. Call sites should check
 * `isSupabaseConfigured` before assuming a client exists.
 */
let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  assertNotServiceRoleKey(SUPABASE_PUBLISHABLE_KEY);
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = client;
export { isSupabaseConfigured };
