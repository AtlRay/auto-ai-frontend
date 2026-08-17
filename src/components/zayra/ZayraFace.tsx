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
 * Ring hue — PER-PLATFORM, per the current law.
 *
 * One Zayra: same face, same woman, one brain. Her outfit and colour
 * treatment vary by platform.
 *   violet -> canonical on the Auto AI / AAT platform (this app). Matches the
 *             live Lovable landing portrait users already know.
 *   cyan   -> her variant for other rooms, e.g. the Ask Zayra bubble inside
 *             Chachy.
 *
 * This supersedes locked rule 2's global "cyan-only" wording. The principle of
 * rule 2 survives untouched: her glow is still SOURCED from her — eyes, hair,
 * chest — which the violet render honours. Only the fixed hue changed.
 *
 * Chachy's violet is his platform UI accent; Zayra wearing violet here does
 * not put her in his room. Handled at the system level, not by this file.
 */
const ACCENT_HUE = { cyan: 190, violet: 272 } as const;

export function ZayraFace({
  size = 56,
  pulse = true,
  glow = true,
  accent = 'violet',
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
          // Tuned against the committed 1672x941 render. Note: with a 16:9
          // source in a square container, object-position's Y value has no
          // effect — cover matches height exactly, so only X overflows.
          // Vertical framing therefore comes from translateY, not Y%.
          style={{
            objectPosition: '66% 50%',
            transform: 'scale(2.6) translateY(6%)',
          }}
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
