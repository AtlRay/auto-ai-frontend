import { Link } from 'react-router-dom';

/**
 * Zayra Home cards, ported from the live app.
 *
 * Source: AtlRay/auto-ai-technologies @ 1a47437 —
 *   src/components/access/AlphaWelcomeCard.tsx
 *   src/components/access/PlatformStatusBadge.tsx
 *   src/components/access/ZayraStarterPrompts.tsx
 *   src/components/founder/FounderReadinessCard.tsx
 *
 * Copy is carried across verbatim. Controls that depend on Zayra's
 * conversational layer are disabled rather than stubbed — that companion is
 * step 4 of the parity port and has no listener yet.
 */

/* ------------------------------------------------------------------ hero */

export function HomeHero() {
  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-[#f5b53d]/20 bg-gradient-to-br from-[#f5b53d]/[0.08] via-transparent to-transparent p-6 md:p-8">
      <span className="mb-3 inline-block rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] tracking-[0.18em] text-white/50 uppercase">
        Auto AI Technologies™
      </span>
      <h1 className="chrome-text text-2xl font-bold tracking-tight md:text-3xl">
        Zayra Founder OS™
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
        Your business home base. Start, organize, launch, and grow with Zayra by
        your side.
      </p>
    </header>
  );
}

/* --------------------------------------------------------- welcome card */

export function AlphaWelcomeCard() {
  return (
    <div className="mb-6 rounded-2xl border border-[#f5b53d]/25 bg-gradient-to-br from-[#f5b53d]/[0.07] via-transparent to-transparent p-5 md:p-7">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] tracking-wide text-emerald-300/90 uppercase">
          Private Founder Alpha
        </span>
        <span className="rounded border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-[10px] tracking-wide text-amber-300/90 uppercase">
          First 5 Users
        </span>
      </div>

      <h2 className="text-xl font-semibold text-white/90 md:text-2xl">
        Welcome to Zayra Founder OS™
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
        You are one of the first private-alpha users. This is early, but it is
        real. Zayra can guide, prepare, organize, and draft. Payments, live
        filing, trading, and auto-posting are disabled during private alpha.
      </p>

      <div className="mt-4 max-w-2xl rounded-xl border border-amber-400/25 bg-amber-500/5 p-3">
        <div className="mb-1 text-[10px] tracking-[0.2em] text-amber-300 uppercase">
          Your first mission
        </div>
        <p className="text-sm text-white/85">
          Tell Zayra one business idea. Let her turn it into your first founder
          plan.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          to="/founder"
          className="rounded-lg border border-[#f5b53d]/50 bg-[#f5b53d]/10 px-5 py-2.5 text-sm font-medium text-[#ffd47a] transition hover:bg-[#f5b53d]/20"
        >
          Start With Zayra →
        </Link>
        {['Talk to Zayra', 'Show Me Around', 'Send Feedback'].map((label) => (
          <button
            key={label}
            type="button"
            disabled
            title="Needs Zayra's companion, which isn't ported yet"
            className="cursor-not-allowed rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/25"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ starter prompts */

const PROMPTS: { label: string; route?: string }[] = [
  { label: 'How do I use this platform?' },
  { label: 'Help me start a business', route: '/founder' },
  { label: 'Teach me passive income' },
  { label: 'Show me what to do first' },
  { label: 'Explain Lawns & Trees' },
  { label: 'What can Zayra do?' },
];

export function StarterPrompts() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-1 text-sm font-semibold text-white/85">Ask Zayra</h3>
      <p className="mb-4 text-xs text-white/40">
        Starting points. Prompts open Zayra once her companion is ported.
      </p>
      <ul className="flex flex-wrap gap-2">
        {PROMPTS.map((p) =>
          p.route ? (
            <li key={p.label}>
              <Link
                to={p.route}
                className="inline-block rounded-full border border-[#f5b53d]/30 px-3 py-1.5 text-xs text-[#ffd47a]/90 transition hover:bg-[#f5b53d]/10"
              >
                {p.label}
              </Link>
            </li>
          ) : (
            <li key={p.label}>
              <button
                type="button"
                disabled
                title="Needs Zayra's companion, which isn't ported yet"
                className="cursor-not-allowed rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/25"
              >
                {p.label}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------ platform status */

const AVAILABLE = [
  'Founder Engine',
  'Zayra Cloud',
  'Zayra Media',
  'Entity Draft Prep',
  'Lawns & Trees Proof-of-Concept',
  'Zayra Platform Guide',
  'Founder Scholar Q&A',
];

const LOCKED = ['Live Filing', 'Payments', 'Trading', 'Auto-Posting', 'Admin Tools'];

export function PlatformStatus() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white/85">Private Alpha Status</h3>
        <span className="text-[10px] tracking-wide text-white/35 uppercase">
          Intentional, not broken
        </span>
      </div>
      <p className="mb-4 text-xs text-white/45">
        Some tools are intentionally locked while Auto AI Technologies™ tests the
        founder experience with the first alpha users.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[10px] tracking-[0.2em] text-emerald-300 uppercase">
            Available
          </div>
          <ul className="space-y-1.5">
            {AVAILABLE.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-white/80">
                <span aria-hidden="true" className="text-emerald-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-[10px] tracking-[0.2em] text-amber-300 uppercase">
            Locked During Alpha
          </div>
          <ul className="space-y-1.5">
            {LOCKED.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-white/45">
                <span aria-hidden="true" className="text-amber-400/80">🔒</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- founder readiness */

export function FounderReadiness() {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-[10px] tracking-[0.2em] text-white/35 uppercase">
        Founder
      </div>
      <h3 className="mt-1 text-lg font-semibold text-white/90 md:text-xl">
        Founder Readiness
      </h3>
      <p className="mt-2 max-w-xl text-sm text-white/45">
        Your readiness score appears here once you've taken the assessment.
        Nothing has been scored yet.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ app access */

export function AppAccessRow() {
  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-xs tracking-[0.2em] text-white/40 uppercase">
            App Access
          </h4>
          <p className="mt-1 text-xs text-white/35">
            Add Zayra to your phone. Open Zayra from your home screen anytime.
            Voice works while the app is open.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Install prompt isn't ported yet"
          className="cursor-not-allowed rounded-lg border border-white/10 px-4 py-2 text-xs text-white/25"
        >
          Add to Phone
        </button>
      </div>
    </div>
  );
}
