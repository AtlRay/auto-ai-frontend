import { useEffect, useState } from 'react';
import {
  fetchCurrentMonthUsage,
  formatUnits,
  formatResetDate,
  STREAM_LABEL,
  STREAM_DESCRIPTION,
  type UsageState,
  type StreamTotal,
} from '@/lib/usage';

/**
 * Usage for the current billing month.
 *
 * Phase 1 is observation: raw units, no caps, no limits, no warnings. Bars are
 * a relative read across the three streams — there is no quota to be a
 * percentage of, and nothing here should imply one.
 */

function Bar({ total, max }: { total: StreamTotal; max: number }) {
  // Relative to the busiest stream this month, purely so the three rows can be
  // compared at a glance. Not a proportion of any allowance.
  const pct = max > 0 ? Math.max((total.units / max) * 100, total.units > 0 ? 2 : 0) : 0;

  return (
    <div className="py-5">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <div>
          <span className="font-medium text-white/90">{STREAM_LABEL[total.stream]}</span>
          <span className="ml-3 text-xs text-white/35">
            {STREAM_DESCRIPTION[total.stream]}
          </span>
        </div>
        <span
          className="text-sm font-semibold text-white/85"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatUnits(total.stream, total.units)}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background:
              'linear-gradient(90deg, rgba(185,120,26,0.9) 0%, rgba(245,181,61,0.95) 100%)',
            boxShadow: pct > 0 ? '0 0 12px rgba(245,181,61,0.35)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

function Empty({ headline, detail }: { headline: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
      <p className="text-sm text-white/55">{headline}</p>
      {detail && <p className="mt-2 text-xs text-white/30">{detail}</p>}
    </div>
  );
}

export function UsageSection() {
  const [state, setState] = useState<UsageState | null>(null);

  useEffect(() => {
    let alive = true;
    fetchCurrentMonthUsage()
      .then((s) => alive && setState(s))
      .catch(
        (e: unknown) =>
          alive &&
          setState({
            kind: 'error',
            message: e instanceof Error ? e.message : 'Could not load usage.',
          }),
      );
    return () => {
      alive = false;
    };
  }, []);

  const month = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-8">
        <h1 className="chrome-text mb-2 text-3xl font-bold tracking-tight">Usage</h1>
        <p className="text-sm text-white/45">{month}</p>
      </header>

      {state === null && (
        <div className="rounded-xl border border-white/8 px-6 py-12 text-center">
          <p className="text-sm text-white/35">Loading usage…</p>
        </div>
      )}

      {state?.kind === 'unconfigured' && (
        <Empty
          headline="Not connected to the backend."
          detail="Supabase environment variables aren't set for this build."
        />
      )}

      {state?.kind === 'signed-out' && (
        <Empty headline="Sign in to see your usage." />
      )}

      {/* Both of these are the honest "nothing measured" state. The capture
          side is server-side and still to land, so this is what renders. */}
      {state?.kind === 'awaiting-backend' && (
        <Empty
          headline="No usage recorded yet."
          detail="Usage measurement isn't switched on yet. Nothing has been counted."
        />
      )}

      {state?.kind === 'empty' && (
        <Empty headline="No usage recorded yet." />
      )}

      {state?.kind === 'error' && (
        <Empty headline="Couldn't load usage." detail={state.message} />
      )}

      {state?.kind === 'ready' && (
        <>
          <div className="divide-y divide-white/[0.06] rounded-xl border border-white/8 bg-white/[0.02] px-6">
            {state.totals.map((total) => (
              <Bar
                key={total.stream}
                total={total}
                max={Math.max(...state.totals.map((t) => t.units), 0)}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-white/30">
            {formatResetDate(state.periodEnd)}
          </p>
        </>
      )}
    </section>
  );
}

export default UsageSection;
