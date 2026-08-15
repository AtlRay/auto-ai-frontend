import Wordmark from '@/components/brand/Wordmark';
import ZayraSourceGlow from '@/components/brand/ZayraSourceGlow';
import { useAtmoVariant } from '@/components/brand/AtmosphereSwitch';

/**
 * Landing page.
 *
 * Copy rules in force: no fabricated stats, no invented urgency, no pricing.
 * Pricing is intentionally absent until the RA.com wholesale-cost
 * reconciliation lands — this app must not stand up a competing price list.
 */

/** Locked roster of five. Roles are only stated where they are confirmed. */
const ROSTER = [
  {
    name: 'Zayra',
    role: 'AI co-founder — the Founder Operating System.',
    accent: '#5ff2ff',
  },
  {
    name: 'Chachy',
    role: 'AI sales-hunting agent. The Digital Wolf.',
    accent: '#a855f7',
  },
  { name: 'Vera', role: null, accent: '#f5b53d' },
  { name: 'Cache', role: null, accent: '#f5b53d' },
  { name: 'Aegis', role: null, accent: '#f5b53d' },
];

export function Landing() {
  // Candidate preview calls for the tagline in muted gold; the locked
  // treatment is chrome.
  const taglineTone = useAtmoVariant() === 'candidate' ? 'gold' : 'chrome';

  return (
    <main className="relative z-10">
      {/* HERO ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-xs tracking-[0.28em] text-[#f5b53d]/70 uppercase">
              Founder Operating System
            </p>

            <h1 className="chrome-text mb-6 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Start the company you keep saying you'll start.
            </h1>

            <p className="mb-8 max-w-md text-lg leading-relaxed text-white/60">
              Zayra works alongside you — from the first idea through forming
              the entity and getting to a real launch.
            </p>

            <div className="mb-10">
              <Wordmark className="text-3xl sm:text-4xl" tone={taglineTone} />
            </div>

            <a
              id="access"
              href="#access"
              className="inline-flex items-center gap-2 rounded-full border border-[#f5b53d]/50 bg-[#f5b53d]/10 px-7 py-3 font-medium text-[#ffd47a] transition hover:border-[#f5b53d] hover:bg-[#f5b53d]/20"
            >
              Request alpha access
            </a>
            <p className="mt-3 text-xs text-white/35">
              Auto AI Technologies is in private alpha.
            </p>
          </div>

          {/* Zayra's light is sourced from her, fading into the gold
              atmosphere at the edges. The render itself is not in this repo
              yet — the frame below marks where it goes. */}
          <ZayraSourceGlow className="mx-auto w-full max-w-sm">
            <div className="flex aspect-[3/4] items-center justify-center rounded-3xl border border-dashed border-[#5ff2ff]/25 bg-white/[0.02]">
              <span className="px-6 text-center text-xs leading-relaxed tracking-wider text-[#5ff2ff]/50 uppercase">
                Zayra render
                <span className="mt-2 block text-white/25 normal-case">
                  asset not yet added to this repo
                </span>
              </span>
            </div>
          </ZayraSourceGlow>
        </div>
      </section>

      {/* WHAT ZAYRA IS -------------------------------------------------- */}
      <section id="what-zayra-is" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="chrome-text mb-10 text-3xl font-bold tracking-tight">
          What Zayra is
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'A co-founder, not a chatbot',
              body: 'Zayra carries the context of your business between sessions instead of starting over every time.',
            },
            {
              title: 'Formation to launch',
              body: 'Entity setup, the founder profile behind it, and the checklist that follows — in one place.',
            },
            {
              title: 'Honest about what works',
              body: 'Features are labelled by what is actually wired up. Nothing is described as live before it is.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-[#f5b53d]/25"
            >
              <h3 className="mb-2 font-semibold text-white/90">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROSTER --------------------------------------------------------- */}
      <section id="the-roster" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="chrome-text mb-3 text-3xl font-bold tracking-tight">
          The roster
        </h2>
        <p className="mb-10 text-sm text-white/40">
          Five agents. The roster is closed.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROSTER.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
            >
              <div
                className="mb-3 h-1 w-8 rounded-full"
                style={{
                  background: member.accent,
                  boxShadow: `0 0 12px ${member.accent}`,
                }}
              />
              <h3 className="mb-1.5 font-semibold text-white/90">{member.name}</h3>
              <p className="text-xs leading-relaxed text-white/45">
                {member.role ?? 'Role not yet published.'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Landing;
