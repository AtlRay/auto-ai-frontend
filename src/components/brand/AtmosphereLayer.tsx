/**
 * Shared Auto AI Technologies™ atmosphere layer.
 *
 * This is the one element every product in the ecosystem shares: gold/amber
 * diagonal laser lines, actively moving. It is deliberately NOT the cosmic
 * indigo wash — that style is contained to the floating "Ask Zayra" panel.
 *
 * Fixed, pointer-events-none, sits behind all content. Pure CSS motion, no
 * timers and no randomness in render.
 */

type Line = {
  /** Vertical position, as a % of viewport height. */
  top: number;
  rotate: number;
  /** Seconds for one drift pass. */
  duration: number;
  delay: number;
  thickness: number;
  color: string;
  glow: string;
  opacity: number;
};

/* Stable, hand-tuned field. Varying duration per line creates parallax so the
   layer never reads as a single sliding sheet. */
const LINES: Line[] = [
  { top: 12, rotate: -18, duration: 34, delay: -4, thickness: 1, color: 'rgba(245, 181, 61, 0.95)', glow: 'rgba(245, 181, 61, 0.6)', opacity: 0.95 },
  { top: 26, rotate: -14, duration: 52, delay: -18, thickness: 2, color: 'rgba(255, 212, 122, 0.7)', glow: 'rgba(255, 212, 122, 0.5)', opacity: 0.75 },
  { top: 41, rotate: -20, duration: 41, delay: -9, thickness: 1, color: 'rgba(255, 196, 90, 0.9)', glow: 'rgba(245, 181, 61, 0.55)', opacity: 0.85 },
  { top: 58, rotate: -12, duration: 63, delay: -26, thickness: 1, color: 'rgba(245, 181, 61, 0.8)', glow: 'rgba(245, 181, 61, 0.45)', opacity: 0.8 },
  { top: 72, rotate: -17, duration: 45, delay: -13, thickness: 2, color: 'rgba(255, 212, 122, 0.6)', glow: 'rgba(255, 212, 122, 0.42)', opacity: 0.7 },
  { top: 88, rotate: -9, duration: 57, delay: -31, thickness: 1, color: 'rgba(255, 196, 90, 0.85)', glow: 'rgba(245, 181, 61, 0.5)', opacity: 0.75 },
];

export function AtmosphereLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Neutral base. Keeps the gold readable without tinting the page. */}
      <div className="absolute inset-0 bg-[#06060a]" />

      {/* Faint warm floor so the gold field feels lit from within. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 108%, rgba(185, 120, 26, 0.16) 0%, rgba(185, 120, 26, 0.05) 45%, transparent 72%)',
        }}
      />

      {/* Moving gold laser lines. */}
      {LINES.map((line, i) => (
        <div
          key={i}
          className="laser-line absolute -left-1/4 w-[150%]"
          style={{
            top: `${line.top}%`,
            height: `${line.thickness}px`,
            // Standalone `rotate` property, not `transform` — the drift
            // animation owns `transform`, and setting both would clobber the
            // angle. Applied before `transform`, so each line travels along
            // its own diagonal rather than straight across.
            rotate: `${line.rotate}deg`,
            opacity: line.opacity,
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`,
            background: `linear-gradient(90deg, transparent 0%, ${line.color} 45%, ${line.color} 55%, transparent 100%)`,
            boxShadow: `0 0 ${12 + line.thickness * 8}px ${line.glow}`,
          }}
        />
      ))}

      {/* Vignette for text readability. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 100%)',
        }}
      />
    </div>
  );
}

export default AtmosphereLayer;
