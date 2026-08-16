import { useMemo } from 'react';

/**
 * Premium particle field — ported from the live app's PremiumParticles.
 * Source: AtlRay/auto-ai-technologies @ 1a47437, src/components/PremiumParticles.tsx
 *
 * Sizes, glow ratio, drift range and durations are carried across verbatim.
 * The palette is gold/amber per the locked atmosphere rule; the source uses
 * violets and cyan.
 *
 * Pure CSS animation, stable randomisation memoised once, pointer-events-none.
 * Tiny luminous dots that drift — not orbs, not planets.
 */

interface Props {
  count?: number;
  className?: string;
}

export function PremiumParticles({ count = 56, className = '' }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const palette = ['#f5b53d', '#ffd47a', '#b9781a', '#ffe6ab'];
        return {
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: 1 + Math.random() * 2.5,
          color: palette[i % palette.length],
          delay: -Math.random() * 18,
          duration: 14 + Math.random() * 12,
          drift: (Math.random() * 40 - 20).toFixed(1),
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="zayra-particle"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--zp-drift': `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default PremiumParticles;
