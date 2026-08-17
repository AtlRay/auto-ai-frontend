import ElectricWordmark from '@/components/brand/ElectricWordmark';
import ConstellationField from '@/components/hero/ConstellationField';
import { ROSTER, STATUS_LABEL } from '@/lib/roster';

/**
 * Landing page.
 *
 * Copy rules in force: no fabricated stats, no invented urgency, no pricing.
 * Pricing is intentionally absent until the RA.com wholesale-cost
 * reconciliation lands — this app must not stand up a competing price list.
 */

export function Landing() {
  return (
    <main className="relative z-10">
      {/* HERO — locked treatment ---------------------------------------
          The section paints its own opaque ground, which keeps the shared
          gold laser atmosphere off this moment entirely: the starfield is
          this section's atmosphere. Gold resumes below the fold. */}
      <section className="relative flex min-h-[86dvh] w-full flex-col justify-end overflow-hidden bg-black">
        {/* Optional photographic plate. Absent from the repo, so it removes
            itself rather than leaving a broken frame — drop
            public/zayra-office.jpg in and it appears with no code change. */}
        <img
          src="/zayra-office.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.78] saturate-[1.05]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        <ConstellationField className="absolute inset-0 z-10 h-full w-full mix-blend-screen" />

        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/5 via-25% to-black/85" />

        <div className="relative z-40 px-4 pb-14 text-center">
          <div className="mb-4 text-xs tracking-[0.3em] text-[#5fd4c4] uppercase">
            private founder alpha &middot; live
          </div>

          <ElectricWordmark size="hero" />

          <p className="font-body mx-auto mt-8 max-w-md text-sm leading-relaxed font-light text-gray-400 md:text-base">
            Zayra plans, drafts, and moves with you. Chachy hunts your next deal
            while you sleep. One system, every founder covered.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#access"
              className="hero-cta inline-flex min-h-11 items-center rounded-lg bg-gradient-to-r from-[#eaffff] to-[#3fd6ff] px-7 py-3.5 text-sm font-medium text-[#04222b] shadow-[0_0_26px_rgba(63,214,255,0.35)]"
            >
              Enter Founder OS &rarr;
            </a>
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/20 bg-black/30 px-7 py-3.5 text-sm text-gray-200 transition hover:border-white/40 hover:bg-black/50"
            >
              Watch the trailer
            </button>
          </div>
        </div>
      </section>

      {/* ACCESS anchor for the primary CTA. */}
      <div id="access" className="scroll-mt-24" />

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
          Five agents. The roster is closed.{' '}
          <a href="/roster" className="text-[#ffd47a]/80 underline underline-offset-2 hover:text-[#ffd47a]">
            See what each one actually runs
          </a>
          .
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROSTER.map((member) => {
            const realized = member.status !== 'in-training';
            return (
              <div
                key={member.name}
                className="flex flex-col rounded-2xl border p-5 transition"
                style={{
                  borderColor: realized
                    ? 'rgba(255,255,255,0.09)'
                    : 'rgba(255,255,255,0.05)',
                  background: realized
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(255,255,255,0.008)',
                }}
              >
                {/* Accent bar only where a colour is confirmed. Members
                    without one get a neutral rule, not a borrowed hue. */}
                <div
                  className="mb-3 h-1 w-8 rounded-full"
                  style={{
                    background: member.accent,
                    boxShadow: `0 0 12px ${member.accent}`,
                  }}
                />

                <h3
                  className="mb-1 font-semibold"
                  style={{ color: realized ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}
                >
                  {member.name}
                </h3>

                <p className="mb-1.5 text-[0.7rem] tracking-[0.12em] text-white/35 uppercase">
                  {member.title}
                </p>

                <p className="mb-2 text-xs leading-relaxed text-white/45">
                  {member.copy}
                </p>
                <p className="mt-auto text-[10px] tracking-wide text-white/30 uppercase">
                  {STATUS_LABEL[member.status]}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Landing;
