import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Usage DISPLAY layer.
 *
 * This module reads usage data. It never writes it. Capture is server-side on
 * the Lovable side (edge functions writing `usage_events`) precisely because
 * client-reported numbers are spoofable — so there is deliberately no logging
 * function in this file, and this app creates no tables and runs no migrations.
 *
 * Schema contract agreed with the Lovable side:
 *
 *   usage_events
 *     user_id    uuid
 *     stream     'brain' | 'voice' | 'phone'
 *     units      integer   -- tokens | characters | seconds
 *     feature    text
 *     created_at timestamptz
 *
 *   plus a per-user, per-billing-month aggregate view.
 *
 * The capture side does not exist yet. Until it lands, every read below
 * resolves to an honest empty state — never sample numbers.
 */

export type UsageStream = 'brain' | 'voice' | 'phone';

export const STREAMS: UsageStream[] = ['brain', 'voice', 'phone'];

/**
 * NAME NOT YET CONFIRMED. The contract specifies "a per-user per-billing-month
 * aggregate view" but not its identifier. This is the one piece both sides must
 * agree on by name — flagged for confirmation against Lovable's implementation.
 */
export const USAGE_MONTHLY_VIEW = 'usage_monthly_totals';

/** Expected row shape from that view. */
export type UsageMonthlyRow = {
  user_id: string;
  stream: UsageStream;
  total_units: number;
  period_start: string;
  period_end: string;
};

export type StreamTotal = {
  stream: UsageStream;
  units: number;
};

export type UsageState =
  /** No Supabase env vars — local setup, not a real state for users. */
  | { kind: 'unconfigured' }
  /** No session. Usage is per-user, so there is nothing to show. */
  | { kind: 'signed-out' }
  /** The aggregate view isn't deployed yet — capture side still to land. */
  | { kind: 'awaiting-backend' }
  /** Backend is live and returned nothing for this billing month. */
  | { kind: 'empty'; periodEnd: string | null }
  | { kind: 'ready'; totals: StreamTotal[]; periodEnd: string | null }
  | { kind: 'error'; message: string };

/** Postgres/PostgREST codes meaning "the relation isn't there yet". */
const MISSING_RELATION_CODES = new Set(['42P01', 'PGRST205', 'PGRST202']);

function isMissingRelation(err: { code?: string; message?: string }): boolean {
  if (err.code && MISSING_RELATION_CODES.has(err.code)) return true;
  const m = err.message?.toLowerCase() ?? '';
  return m.includes('does not exist') || m.includes('could not find the table');
}

export async function fetchCurrentMonthUsage(): Promise<UsageState> {
  if (!isSupabaseConfigured || !supabase) return { kind: 'unconfigured' };

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { kind: 'signed-out' };

  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from(USAGE_MONTHLY_VIEW)
    .select('user_id, stream, total_units, period_start, period_end')
    .eq('user_id', user.id)
    .lte('period_start', nowIso)
    .gt('period_end', nowIso);

  if (error) {
    if (isMissingRelation(error)) return { kind: 'awaiting-backend' };
    return { kind: 'error', message: error.message };
  }

  const rows = (data ?? []) as UsageMonthlyRow[];
  const periodEnd = rows[0]?.period_end ?? null;

  if (rows.length === 0) return { kind: 'empty', periodEnd };

  const totals: StreamTotal[] = STREAMS.map((stream) => ({
    stream,
    units: rows
      .filter((r) => r.stream === stream)
      .reduce((sum, r) => sum + (Number(r.total_units) || 0), 0),
  }));

  return { kind: 'ready', totals, periodEnd };
}

// ---------------------------------------------------------------------------
// Presentation — each stream counts a different unit, so each formats its own
// way. Numbers are shown raw and honest, never rounded up to look busier.
// ---------------------------------------------------------------------------

export const STREAM_LABEL: Record<UsageStream, string> = {
  brain: 'Brain',
  voice: 'Voice',
  phone: 'Phone',
};

export const STREAM_DESCRIPTION: Record<UsageStream, string> = {
  brain: 'Thinking and writing with Zayra',
  voice: 'Spoken replies generated',
  phone: 'Time on calls',
};

/** Tokens: compact above a thousand — 184000 → "184k tokens". */
function formatTokens(units: number): string {
  if (units >= 1_000_000) {
    const m = units / 1_000_000;
    return `${m >= 10 ? Math.round(m) : Number(m.toFixed(2))}M tokens`;
  }
  if (units >= 1_000) return `${Math.round(units / 1_000)}k tokens`;
  return `${units} ${units === 1 ? 'token' : 'tokens'}`;
}

/** Characters: grouped, never abbreviated — 12400 → "12,400 characters". */
function formatCharacters(units: number): string {
  return `${units.toLocaleString('en-US')} ${units === 1 ? 'character' : 'characters'}`;
}

/** Seconds stored, minutes shown — 0 → "0 min". */
function formatSeconds(units: number): string {
  if (units === 0) return '0 min';
  if (units < 60) return `${units} sec`;
  return `${Math.round(units / 60).toLocaleString('en-US')} min`;
}

export function formatUnits(stream: UsageStream, units: number): string {
  switch (stream) {
    case 'brain':
      return formatTokens(units);
    case 'voice':
      return formatCharacters(units);
    case 'phone':
      return formatSeconds(units);
  }
}

export function formatResetDate(periodEnd: string | null): string {
  if (!periodEnd) return 'Resets on your billing date.';
  const d = new Date(periodEnd);
  if (Number.isNaN(d.getTime())) return 'Resets on your billing date.';
  return `Resets on your billing date — ${d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}.`;
}
