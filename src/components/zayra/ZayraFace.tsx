// ZAYRA FACE — the single canonical circular face crop of Zayra.
// Uses her real character render, cropped to the face, with her cyan
// source-glow ring. No generic icons, no invented art.
//
// Adapted from the live app's ZayraFace: the original bundles the render via
// `import zayraHero from "@/assets/zayra-hero.png"`. That asset has not
// reached this repo yet, and a bundled import of a missing file fails the
// build outright — so the render is loaded from /zayra-hero.png and the
// component degrades to her glow ring until the file is dropped into public/.
// Crop settings (objectPosition / scale) are carried across unchanged.
import { useState } from 'react';

/**
 * Ring hue. Defaults to cyan per locked brand rule 2 (Zayra's accent is
 * electric cyan, sourced from her). Parameterised only so the ring can follow
 * the render if the canonical portrait's accent is formally changed — the
 * default is not to be flipped without that ruling.
 */
const ACCENT_HUE = { cyan: 190, violet: 275 } as const;

export function ZayraFace({
  size = 56,
  pulse = true,
  glow = true,
  accent = 'cyan',
  className = '',
}: {
  size?: number;
  /** Subtle idle breathing pulse on the glow ring. */
  pulse?: boolean;
  glow?: boolean;
  accent?: keyof typeof ACCENT_HUE;
  className?: string;
}) {
  const h = ACCENT_HUE[accent];
  const [hasRender, setHasRender] = useState(true);

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: hasRender
          ? undefined
          : `radial-gradient(circle at 50% 38%, hsl(${h} 95% 60% / 0.35), hsl(${h} 60% 8%) 70%)`,
        boxShadow: glow
          ? `0 0 ${Math.round(size * 0.45)}px hsl(${h} 95% 60% / 0.55), inset 0 0 0 1.5px hsl(${h} 95% 70% / 0.65)`
          : `inset 0 0 0 1px hsl(${h} 95% 70% / 0.4)`,
      }}
    >
      {hasRender && (
        <img
          src="/zayra-hero.png"
          alt=""
          loading="eager"
          decoding="async"
          onError={() => setHasRender(false)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 20%', transform: 'scale(1.7)' }}
        />
      )}
      {/* Cyan source-glow wash, strongest around the eyes */}
      <span
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            `radial-gradient(circle at 50% 42%, hsl(${h} 100% 70% / 0.28), transparent 65%)`,
        }}
      />
      {glow && (
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${pulse ? 'animate-zayra-breathe' : ''}`}
          style={{ boxShadow: `inset 0 0 14px hsl(${h} 95% 60% / 0.45)` }}
        />
      )}
    </span>
  );
}

export default ZayraFace;
