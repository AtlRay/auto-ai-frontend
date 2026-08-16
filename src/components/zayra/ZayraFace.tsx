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

export function ZayraFace({
  size = 56,
  pulse = true,
  glow = true,
  className = '',
}: {
  size?: number;
  /** Subtle idle breathing pulse on the glow ring. */
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}) {
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
          : 'radial-gradient(circle at 50% 38%, hsl(190 95% 60% / 0.35), hsl(200 60% 8%) 70%)',
        boxShadow: glow
          ? `0 0 ${Math.round(size * 0.45)}px hsl(190 95% 60% / 0.55), inset 0 0 0 1.5px hsl(190 95% 70% / 0.65)`
          : 'inset 0 0 0 1px hsl(190 95% 70% / 0.4)',
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
            'radial-gradient(circle at 50% 42%, hsl(190 100% 70% / 0.28), transparent 65%)',
        }}
      />
      {glow && (
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${pulse ? 'animate-zayra-breathe' : ''}`}
          style={{ boxShadow: 'inset 0 0 14px hsl(190 95% 60% / 0.45)' }}
        />
      )}
    </span>
  );
}

export default ZayraFace;
