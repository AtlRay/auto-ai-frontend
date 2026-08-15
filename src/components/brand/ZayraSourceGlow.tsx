import type { CSSProperties, ReactNode } from 'react';

/**
 * Zayra's electric-cyan source glow.
 *
 * Brand rule: the cyan must read as light that ORIGINATES from Zayra — her
 * eyes, chest, hands, hair — and radiates outward, fading into the shared gold
 * atmosphere at the edges. It is not scattered ambient glow, so this component
 * is always anchored to an origin point rather than washed over the viewport.
 *
 * Wrap Zayra's render in <ZayraSourceGlow> and place emitters at the points
 * that should be lit.
 */

export type Emitter = {
  /** Position within the container, as a % (0-100). */
  x: number;
  y: number;
  /** Radius of the emitted light, in % of container width. */
  size: number;
  intensity: number;
};

/** Default emitter placement for a centered, front-facing Zayra render. */
export const DEFAULT_EMITTERS: Emitter[] = [
  { x: 50, y: 20, size: 26, intensity: 0.9 }, // eyes / face
  { x: 50, y: 44, size: 40, intensity: 1 }, // chest core — the brightest source
  { x: 27, y: 62, size: 22, intensity: 0.7 }, // left hand
  { x: 73, y: 62, size: 22, intensity: 0.7 }, // right hand
  { x: 50, y: 12, size: 34, intensity: 0.5 }, // hair backlight
];

type Props = {
  emitters?: Emitter[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function ZayraSourceGlow({
  emitters = DEFAULT_EMITTERS,
  className = '',
  style,
  children,
}: Props) {
  return (
    <div className={`relative ${className}`} style={style}>
      {/* Emitted light sits behind the subject so the subject reads as the
          source rather than as something lit from the front. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {emitters.map((e, i) => (
          <div
            key={i}
            className="source-glow absolute rounded-full"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: `${e.size * 2}%`,
              aspectRatio: '1',
              translate: '-50% -50%',
              animationDelay: `${i * -1.4}s`,
              background: `radial-gradient(circle, rgba(95, 242, 255, ${0.5 * e.intensity}) 0%, rgba(34, 211, 238, ${0.28 * e.intensity}) 30%, rgba(11, 124, 140, ${0.1 * e.intensity}) 55%, transparent 74%)`,
              filter: 'blur(6px)',
            }}
          />
        ))}

        {/* Falloff ring: as the cyan travels out it warms into the shared gold
            atmosphere instead of stopping at a hard edge. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 72% at 50% 46%, transparent 42%, rgba(120, 160, 150, 0.06) 62%, rgba(245, 181, 61, 0.16) 82%, rgba(245, 181, 61, 0.05) 100%)',
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ZayraSourceGlow;
