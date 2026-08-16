/**
 * The approved "Never Build Alone" treatment — DO NOT restyle without
 * sign-off. This is the one visual anchor of the whole brand system.
 *
 * Chrome stacked NEVER / BU(I)LD / (A)LONE, with the I and A carrying live
 * electric current. Sizes use clamp() rather than breakpoint steps so the
 * stack keeps its proportions and lands just as hard on a phone.
 */

interface ElectricWordmarkProps {
  size?: 'hero' | 'compact';
}

const CHROME = 'hero-chrome hero-chrome-catch font-hero font-bold tracking-wide';
const BOLT = 'hero-bolt relative inline-block font-hero font-bold';

/** Staggered so the three words land in sequence, finishing well under 1.5s. */
const DELAYS = ['0s', '0.16s', '0.32s'];

export default function ElectricWordmark({ size = 'hero' }: ElectricWordmarkProps) {
  const isHero = size === 'hero';

  // Capped so the full hero — eyebrow, stack, subhead, CTAs — clears the fold
  // at 900px tall without the lockup losing its scale.
  const outer = isHero ? 'clamp(2.4rem, 9.5vw, 5.5rem)' : '1.6rem';
  const mid = isHero ? 'clamp(3rem, 13vw, 7.25rem)' : '2.2rem';
  const boltMid = isHero ? 'clamp(4rem, 17vw, 10rem)' : '2.9rem';
  const boltLow = isHero ? 'clamp(3.4rem, 14vw, 8rem)' : '2.5rem';

  return (
    <div className="select-none text-center">
      {/* The stack is split across glyphs for the chrome and current
          treatments, which reads as "NEVER BU I LD A LONE" to a screen
          reader. Hide it and expose the tagline once, as the page heading. */}
      {isHero ? (
        <h1 className="sr-only">Never Build Alone</h1>
      ) : (
        <span className="sr-only">Never Build Alone</span>
      )}

      <div
        aria-hidden="true"
        className="hero-line leading-[0.84]"
        style={{ fontSize: outer, animationDelay: DELAYS[0] }}
      >
        <span className={CHROME} style={{ animationDelay: DELAYS[0] }}>
          NEVER
        </span>
      </div>

      <div
        aria-hidden="true"
        className="hero-line flex items-baseline justify-center leading-[0.84]"
        style={{ fontSize: mid, animationDelay: DELAYS[1] }}
      >
        <span className={CHROME} style={{ animationDelay: DELAYS[1] }}>
          BU
        </span>
        <span
          className={`${BOLT} mx-[-0.04em]`}
          style={{ fontSize: boltMid, top: '-0.06em' }}
        >
          I
        </span>
        <span className={CHROME} style={{ animationDelay: DELAYS[1] }}>
          LD
        </span>
      </div>

      <div
        aria-hidden="true"
        className="hero-line flex items-baseline justify-center leading-[0.84]"
        style={{ fontSize: outer, animationDelay: DELAYS[2] }}
      >
        <span
          className={`${BOLT} -mr-[0.02em]`}
          style={{ fontSize: boltLow, top: '0.05em' }}
        >
          A
        </span>
        <span className={CHROME} style={{ animationDelay: DELAYS[2] }}>
          LONE
        </span>
      </div>
    </div>
  );
}
