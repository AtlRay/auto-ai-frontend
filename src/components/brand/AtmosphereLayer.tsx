import PremiumParticles from './PremiumParticles';
import { useAtmosphereDensity } from '@/hooks/useViewport';

/**
 * Shared Auto AI Technologies™ atmosphere.
 *
 * Ported from the live app so the two read as the same house. Source:
 * AtlRay/auto-ai-technologies @ 1a47437 —
 *   src/components/brand/ZayraBrandBackground.tsx  (globally mounted layer)
 *   src/components/brand/ZayraLaserBackground.tsx  (aura orbs, scan line)
 *   src/styles/zayra-laser.css                     (timings)
 *
 * The full stack matters more than any one element: aura orbs, circuit grid,
 * drifting particles, bloomed diagonal beams, a slow scan sweep, edge glow and
 * a vignette. An earlier pass had only bare lines, which is why it read thin.
 *
 * Hue is gold per locked brand rule 1. The source renders these same layers in
 * violet — see the report accompanying this change.
 *
 * Fixed, pointer-events-none, behind all content. The locked hero paints its
 * own opaque ground, so this runs everywhere except there.
 */

type Beam = {
  top: number;
  rotate: number;
  /** Seconds for one drift pass. */
  duration: number;
  driftDelay: number;
  /** Staggered from the source's 2.2s / 4.4s pulse offsets. */
  pulseDelay: number;
  thickness: number;
  color: string;
  glow: string;
  blur: number;
};

/* Nine beams at 2px with heavy bloom. The source runs three at 1px; density and
   weight are raised per review of the live deploy, bloom radii kept in the
   source's 18–24px range and scaled with thickness. */
const BEAMS: Beam[] = [
  { top: 6, rotate: -18, duration: 34, driftDelay: -4, pulseDelay: 0, thickness: 2, color: 'rgba(255, 212, 122, 0.95)', glow: 'rgba(245, 181, 61, 0.75)', blur: 26 },
  { top: 17, rotate: -14, duration: 52, driftDelay: -18, pulseDelay: -2.2, thickness: 2, color: 'rgba(245, 181, 61, 0.9)', glow: 'rgba(245, 181, 61, 0.6)', blur: 24 },
  { top: 29, rotate: -20, duration: 41, driftDelay: -9, pulseDelay: -4.4, thickness: 3, color: 'rgba(255, 196, 90, 1)', glow: 'rgba(255, 196, 90, 0.7)', blur: 30 },
  { top: 40, rotate: -12, duration: 63, driftDelay: -26, pulseDelay: -1.1, thickness: 2, color: 'rgba(185, 120, 26, 0.95)', glow: 'rgba(245, 181, 61, 0.55)', blur: 22 },
  { top: 52, rotate: -17, duration: 45, driftDelay: -13, pulseDelay: -3.3, thickness: 2, color: 'rgba(255, 212, 122, 0.85)', glow: 'rgba(255, 212, 122, 0.6)', blur: 26 },
  { top: 64, rotate: -9, duration: 57, driftDelay: -31, pulseDelay: -5.5, thickness: 3, color: 'rgba(245, 181, 61, 1)', glow: 'rgba(245, 181, 61, 0.72)', blur: 32 },
  { top: 76, rotate: -15, duration: 38, driftDelay: -7, pulseDelay: -2.8, thickness: 2, color: 'rgba(255, 196, 90, 0.9)', glow: 'rgba(255, 196, 90, 0.6)', blur: 24 },
  { top: 87, rotate: -11, duration: 60, driftDelay: -22, pulseDelay: -4.9, thickness: 2, color: 'rgba(185, 120, 26, 0.9)', glow: 'rgba(245, 181, 61, 0.5)', blur: 22 },
  { top: 96, rotate: -19, duration: 47, driftDelay: -15, pulseDelay: -0.6, thickness: 2, color: 'rgba(255, 212, 122, 0.8)', glow: 'rgba(255, 212, 122, 0.55)', blur: 26 },
];

export function AtmosphereLayer() {
  // Density scales down on narrow viewports and reflows live when a foldable
  // opens or closes — no reload, no load-time width assumption.
  const { beams, particles } = useAtmosphereDensity();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash. Source uses a purple radial over near-black; same shape,
          warm hue. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(96, 58, 10, 0.34) 0%, rgba(14, 10, 5, 0.96) 48%, #050308 100%)',
        }}
      />

      {/* Aura orbs — the source's 42rem / 48rem blurred radials. These carry
          most of the depth. */}
      <div
        className="zayra-aura absolute -top-32 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 181, 61, 0.30) 0%, rgba(245, 181, 61, 0) 70%)',
        }}
      />
      <div
        className="zayra-aura absolute -right-40 -bottom-40 h-[48rem] w-[48rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 196, 90, 0.28) 0%, rgba(255, 196, 90, 0) 70%)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="zayra-aura absolute top-1/3 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(185, 120, 26, 0.16) 0%, rgba(185, 120, 26, 0) 70%)',
          animationDelay: '-1.5s',
        }}
      />

      {/* Circuit grid — 64px, masked to centre, exactly as the source. */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 181, 61, 0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 181, 61, 0.55) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 75%)',
        }}
      />

      {/* Drifting node dots. */}
      <PremiumParticles count={particles} />

      {/* Diagonal beams — travel along their own axis while the source's 7s
          pulse envelope breathes them. */}
      {BEAMS.slice(0, beams).map((beam, i) => (
        <div
          key={i}
          className="laser-line absolute -left-1/4 w-[150%]"
          style={{
            top: `${beam.top}%`,
            height: `${beam.thickness}px`,
            // Standalone `rotate` — the drift animation owns `transform`.
            rotate: `${beam.rotate}deg`,
            animationDuration: `${beam.duration}s, 7s`,
            animationDelay: `${beam.driftDelay}s, ${beam.pulseDelay}s`,
            background: `linear-gradient(90deg, transparent 0%, ${beam.color} 45%, ${beam.color} 55%, transparent 100%)`,
            boxShadow: `0 0 ${beam.blur}px ${beam.glow}, 0 0 ${beam.blur * 2.5}px ${beam.glow}`,
          }}
        />
      ))}

      {/* Slow scan sweep — the source's 9s linear pass. */}
      <div className="absolute inset-0 opacity-50 motion-reduce:hidden">
        <div
          className="zayra-scanline absolute inset-x-0 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 212, 122, 0.7) 50%, transparent 100%)',
            boxShadow: '0 0 18px rgba(255, 212, 122, 0.6)',
          }}
        />
      </div>

      {/* Top edge glow. */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245, 181, 61, 0.85) 50%, transparent 100%)',
          boxShadow: '0 0 32px rgba(245, 181, 61, 0.65)',
        }}
      />

      {/* Vignette for readability. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.62) 100%)',
        }}
      />
    </div>
  );
}

export default AtmosphereLayer;
