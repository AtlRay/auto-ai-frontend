import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  STAGES,
  VISIBLE_STAGES,
  VISIBLE_COUNT,
  ACCENT_HEX,
  nextVisibleId,
  prevVisibleId,
} from '@/config/founderStages';
import { FounderReadiness } from '@/components/home/HomeCards';

/**
 * Founder Engine — the AI Builder journey at /founder.
 *
 * Ported from AtlRay/auto-ai-technologies @ 1a47437, src/pages/FounderEngine.tsx:
 * hero header with live stage chips, a sticky rail carrying the progress bar
 * and the nine visible stages, the stage body, founder readiness, the support
 * pair, and footer navigation.
 *
 * Behaviour matched: ?step drives state and is clamped to 1–11; hidden stages
 * 5 and 6 are omitted from the rail and skipped by next/previous while staying
 * deep-linkable; progress ignores the hidden stages so founders aren't
 * penalised for two on-hold steps.
 *
 * Stage bodies are per-stage screens in the live app and haven't been ported
 * yet, so each says so rather than showing invented content.
 */

export function FounderEngine() {
  const [params, setParams] = useSearchParams();
  // The live app clamps with Math.min/Math.max alone, which lets a
  // non-numeric ?step through as NaN and crashes the page on lookup. Fall
  // back to stage 1 instead of porting that.
  const parsed = parseInt(params.get('step') ?? '1', 10);
  const step = Number.isFinite(parsed) ? Math.min(11, Math.max(1, parsed)) : 1;
  const stage = useMemo(
    () => STAGES.find((s) => s.id === step) ?? STAGES[0],
    [step],
  );

  const goto = (n: number) => setParams({ step: String(n) });

  const nextId = nextVisibleId(step);
  const prevId = prevVisibleId(step);

  const visibleIndex = Math.max(0, VISIBLE_STAGES.findIndex((s) => s.id >= step));
  const visiblePosition = stage.hiddenInDefault ? visibleIndex : visibleIndex + 1;
  const progress = (visiblePosition / VISIBLE_COUNT) * 100;

  const stageLabel = stage.hiddenInDefault
    ? `${stage.name} (hidden)`
    : `Stage ${visiblePosition} / ${VISIBLE_COUNT}`;

  const accent = ACCENT_HEX[stage.accent];

  return (
    <div className="relative z-10">
      {/* Hero header */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <header className="rounded-2xl border border-[#f5b53d]/20 bg-gradient-to-br from-[#f5b53d]/[0.07] via-transparent to-transparent p-6 md:p-8">
          <span className="mb-3 inline-block text-xs tracking-widest text-white/40 uppercase">
            Auto AI Technologies™
          </span>
          <h1 className="chrome-text text-2xl font-bold tracking-tight md:text-3xl">
            AI Builder
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
            Your AI Builder workspace. Zayra builds with you — idea → offer →
            formation → brand → launch.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: stageLabel, color: accent },
              { label: stage.name, color: accent },
              { label: stage.tagline, color: '#f5b53d' },
              { label: 'Powered by Zayra', color: '#ffd47a' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: `${chip.color}55`,
                  color: chip.color,
                  background: `${chip.color}14`,
                }}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </header>
      </div>

      {/* Sticky stage rail */}
      <div className="sticky top-0 z-30 mt-6 border-y border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
          <div
            className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Founder journey progress"
          >
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #5ff2ff, #f5b53d, #ffd47a)',
                boxShadow: '0 0 18px rgba(245,181,61,0.6)',
              }}
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {VISIBLE_STAGES.map((s, idx) => {
              const active = s.id === step;
              const hex = ACCENT_HEX[s.accent];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goto(s.id)}
                  aria-current={active ? 'step' : undefined}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300"
                  style={{
                    borderColor: active ? `${hex}80` : 'rgba(255,255,255,0.14)',
                    color: active ? hex : 'rgba(255,255,255,0.5)',
                    background: active ? `${hex}1a` : 'transparent',
                    boxShadow: active ? `0 0 20px ${hex}40` : 'none',
                  }}
                >
                  <span className="opacity-70">{idx + 1}.</span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage body */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div
          className="overflow-hidden rounded-2xl border p-8 md:p-12"
          style={{ borderColor: `${accent}33`, background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="mx-auto max-w-xl text-center">
            <div
              className="mb-3 text-[10px] tracking-[0.22em] uppercase"
              style={{ color: accent }}
            >
              {stage.hiddenInDefault ? 'On hold' : `Stage ${stage.id}`}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white/90">{stage.name}</h2>
            <p className="mb-6 text-sm text-white/45">{stage.tagline}</p>

            <div className="rounded-xl border border-dashed border-white/10 px-6 py-10">
              <p className="text-sm text-white/55">
                {stage.hiddenInDefault
                  ? 'This stage is deliberately on hold and is not part of the default journey.'
                  : "This stage's screen hasn't been ported yet."}
              </p>
              {!stage.hiddenInDefault && (
                <p className="mt-2 text-xs text-white/30">
                  Its place in the journey matches the live app. The screen
                  itself is still to come.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <FounderReadiness />
        </div>

        {/* Founder OS Support pair. The live cards are Stripe-gated; pricing is
            parked, so no amount is shown here and no checkout is offered. */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-1 text-sm font-semibold text-white/85">
              Founder OS Support
            </h3>
            <p className="text-xs leading-relaxed text-white/45">
              Ongoing support alongside Zayra. Plan details and pricing are being
              reconciled, so nothing is offered for purchase here yet.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-1 text-sm font-semibold text-white/85">
              Talk to a human
            </h3>
            <p className="text-xs leading-relaxed text-white/45">
              Founder support contact isn't wired into this build yet.
            </p>
          </div>
        </div>

        {/* Footer nav — skips the hidden on-hold stages. */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={prevId === null}
            onClick={() => prevId !== null && goto(prevId)}
            className="rounded-lg border border-white/12 px-4 py-2 text-sm text-white/70 transition enabled:hover:bg-white/5 disabled:cursor-not-allowed disabled:text-white/20"
          >
            ‹ {prevId !== null ? `Back to ${STAGES.find((s) => s.id === prevId)!.name}` : 'Back'}
          </button>

          <div className="hidden text-xs tracking-wide text-white/35 md:block">
            Founder → Zayra → Capabilities · Never Build Alone.
          </div>

          <button
            type="button"
            disabled={nextId === null}
            onClick={() => nextId !== null && goto(nextId)}
            className="rounded-lg border border-[#f5b53d]/50 bg-[#f5b53d]/10 px-4 py-2 text-sm font-medium text-[#ffd47a] transition enabled:hover:bg-[#f5b53d]/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/20"
          >
            {nextId !== null ? `Next: ${STAGES.find((s) => s.id === nextId)!.name}` : 'Complete'} ›
          </button>
        </div>
      </main>
    </div>
  );
}

export default FounderEngine;
