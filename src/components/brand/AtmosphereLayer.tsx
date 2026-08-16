import { useMemo } from 'react';
import PremiumParticles from './PremiumParticles';
import { useAtmosphereDensity } from '@/hooks/useViewport';

/**
 * Shared Auto AI Technologies™ atmosphere.
 *
 * Calibrated against the live app's AI Builder and Founder OS screens.
 *
 * Composition, per the reference:
 *  - A dense population (~30 lines at desktop), not a handful of beams.
 *  - Dead-straight segments crossing at MANY varied angles — deliberately not
 *    clustered around one diagonal, which is what an earlier pass got wrong.
 *  - Long: most span 30–90% of the viewport, and several run past the edges so
 *    they have no visible start or end.
 *  - Mostly hairline whispers with a few brighter hero beams — that mix is the
 *    signature; a uniform field reads flat.
 *  - Gold-led at roughly 70%, teal/spring secondary at roughly 30%.
 *  - Zero violet beams, per the final colour ruling. Violet appears only as
 *    soft nebula glow in the backdrop — lower corners and behind the headline
 *    — at low opacity and heavily blurred. It is the room's shadow, never its
 *    light, and never the field's identity.
 *
 * Motion: slow drift dominates, breathing on the source's 7s pulse envelope.
 * Nothing strobes.
 */

type Line = {
  topPct: number;
  leftPct: number;
  widthPct: number;
  rotate: number;
  thickness: number;
  color: string;
  glow: string;
  blur: number;
  duration: number;
  driftDelay: number;
  pulseDelay: number;
};

/** Deterministic PRNG — a stable field, no randomness during render. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLD = [
  { color: 'rgba(255, 212, 122, ', glow: 'rgba(245, 181, 61, ' },
  { color: 'rgba(245, 181, 61, ', glow: 'rgba(245, 181, 61, ' },
  { color: 'rgba(255, 196, 90, ', glow: 'rgba(255, 196, 90, ' },
  { color: 'rgba(212, 160, 60, ', glow: 'rgba(212, 160, 60, ' },
];

/** Teal skewing spring-green through cyan, as the two reference screens do. */
const TEAL = [
  { color: 'rgba(120, 240, 210, ', glow: 'rgba(80, 220, 190, ' },
  { color: 'rgba(150, 232, 255, ', glow: 'rgba(34, 211, 238, ' },
  { color: 'rgba(110, 230, 180, ', glow: 'rgba(90, 210, 165, ' },
];

function buildField(count: number): Line[] {
  const rand = mulberry32(0x5eed);
  // 3–5 hero beams per screen regardless of population size.
  const heroCount = Math.max(3, Math.min(5, Math.round(count * 0.14)));
  const heroIdx = new Set<number>();
  while (heroIdx.size < heroCount) heroIdx.add(Math.floor(rand() * count));

  return Array.from({ length: count }, (_, i) => {
    const isHero = heroIdx.has(i);
    // Gold leads at exactly 70%. Deterministic by index rather than a coin
    // flip, so the ratio still holds at the small counts a Fold cover screen
    // gets — a probabilistic split drifted to 91:9 at 12 lines.
    const isGold = i % 10 >= 3;
    const palette = isGold ? GOLD : TEAL;
    const tone = palette[Math.floor(rand() * palette.length)];

    // Angles spread across the full range so lines genuinely cross rather
    // than running parallel.
    const rotate = Math.round(-90 + rand() * 180);

    const alpha = isHero ? 0.85 + rand() * 0.15 : 0.3 + rand() * 0.3;
    const glowA = isHero ? 0.5 + rand() * 0.2 : 0.16 + rand() * 0.14;

    return {
      // Overscan the placement box so many lines start and end off-screen.
      topPct: -12 + rand() * 124,
      leftPct: -30 + rand() * 70,
      widthPct: 40 + rand() * 90,
      rotate,
      thickness: isHero ? 2 : 1,
      color: `${tone.color}${alpha.toFixed(2)})`,
      glow: `${tone.glow}${glowA.toFixed(2)})`,
      blur: isHero ? 22 + rand() * 12 : 8 + rand() * 8,
      duration: 34 + rand() * 46,
      driftDelay: -rand() * 40,
      pulseDelay: -rand() * 7,
    };
  });
}

export function AtmosphereLayer() {
  // Density scales down on narrow viewports and reflows live when a foldable
  // opens or closes — no reload, no load-time width assumption.
  const { beams, particles } = useAtmosphereDensity();
  const lines = useMemo(() => buildField(beams), [beams]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Near-black ground. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(96, 58, 10, 0.22) 0%, rgba(12, 9, 5, 0.97) 46%, #050308 100%)',
        }}
      />

      {/* Violet/indigo nebula zones — backdrop texture only. Low opacity and
          soft-blurred so they read as shadow behind the room, never as a
          coloured field and never as beams. */}
      <div
        className="absolute -bottom-40 -left-32 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.13) 0%, rgba(88, 40, 170, 0.05) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute -right-36 -bottom-48 h-[44rem] w-[44rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(99, 60, 220, 0.12) 0%, rgba(70, 35, 150, 0.045) 45%, transparent 72%)',
        }}
      />
      {/* Behind the headline. */}
      <div
        className="absolute -top-24 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(112, 62, 214, 0.11) 0%, rgba(80, 45, 165, 0.04) 50%, transparent 74%)',
        }}
      />

      {/* Aura orbs — depth at the edges, colour off the content. */}
      <div
        className="zayra-aura absolute -top-32 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 181, 61, 0.24) 0%, rgba(245, 181, 61, 0) 70%)',
        }}
      />
      <div
        className="zayra-aura absolute -right-40 -bottom-40 h-[48rem] w-[48rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 196, 90, 0.22) 0%, rgba(255, 196, 90, 0) 70%)',
          animationDelay: '-3s',
        }}
      />

      {/* Faint ice horizon — linear highlight, not an orb. */}
      <div
        className="absolute inset-x-0 top-1/3 h-px opacity-60"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.5) 50%, transparent 100%)',
          boxShadow: '0 0 40px rgba(34, 211, 238, 0.25)',
        }}
      />

      {/* Barely-there grid — texture, not feature. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 181, 61, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 181, 61, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at 50% 78%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 78%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Node dots. */}
      <PremiumParticles count={particles} />

      {/* The line field. */}
      {lines.map((l, i) => (
        <div
          key={i}
          className="laser-line absolute"
          style={{
            top: `${l.topPct}%`,
            left: `${l.leftPct}%`,
            width: `${l.widthPct}%`,
            height: `${l.thickness}px`,
            // Standalone `rotate` — the drift animation owns `transform`.
            rotate: `${l.rotate}deg`,
            animationDuration: `${l.duration}s, 7s`,
            animationDelay: `${l.driftDelay}s, ${l.pulseDelay}s`,
            background: `linear-gradient(90deg, transparent 0%, ${l.color} 18%, ${l.color} 82%, transparent 100%)`,
            boxShadow: `0 0 ${l.blur}px ${l.glow}`,
          }}
        />
      ))}

      {/* Slow scan sweep. */}
      <div className="absolute inset-0 opacity-40 motion-reduce:hidden">
        <div
          className="zayra-scanline absolute inset-x-0 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 212, 122, 0.6) 50%, transparent 100%)',
            boxShadow: '0 0 18px rgba(255, 212, 122, 0.5)',
          }}
        />
      </div>

      {/* Vignette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}

export default AtmosphereLayer;
