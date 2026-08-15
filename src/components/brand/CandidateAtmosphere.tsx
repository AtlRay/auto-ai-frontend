/**
 * CANDIDATE atmosphere — EXPLORATION ONLY.
 *
 * This is not the brand. The locked rulebook still specifies the pure-gold
 * atmosphere in AtmosphereLayer.tsx, which remains the default. This variant
 * exists so the two can be compared side by side, and is reachable only via
 * `?atmo=candidate`.
 *
 * Reproduces the candidate spec as written:
 *   - Base #0c0a12 with a violet radial wash from bottom-right and an
 *     ice-blue radial breathing from top-right.
 *   - Diagonal laser lines at 115deg, same drift animation as the current
 *     layer, cycling a fixed 5-colour pattern.
 *   - A frost point glow top-right — "Vera's watch light".
 *
 * Vera's ice is deliberately colder and whiter than Zayra's cyan (#22d3ee).
 * That cyan stays Zayra's and is never used here.
 */

type Line = {
  /** Horizontal position as a % of viewport width. Lines are near-vertical
      at 115deg, so they distribute across X rather than Y. */
  left: number;
  duration: number;
  delay: number;
  thickness: number;
  color: string;
  glow: string;
};

/** The repeating pattern, in the specified ratio and order. */
const PATTERN = [
  { color: 'rgba(245, 185, 66, 0.5)', glow: 'rgba(245, 185, 66, 0.4)', thickness: 2 }, // 1 gold primary — leads
  { color: 'rgba(185, 230, 255, 0.55)', glow: 'rgba(185, 230, 255, 0.45)', thickness: 2 }, // 2 arctic ice — second strongest
  { color: 'rgba(217, 154, 31, 0.28)', glow: 'rgba(217, 154, 31, 0.22)', thickness: 1 }, // 3 gold secondary
  { color: 'rgba(150, 95, 235, 0.3)', glow: 'rgba(150, 95, 235, 0.25)', thickness: 1 }, // 4 violet whisper
  { color: 'rgba(210, 240, 255, 0.4)', glow: 'rgba(210, 240, 255, 0.3)', thickness: 1 }, // 5 ice secondary
];

/* Three full cycles of the pattern across the viewport. Durations vary per
   line so the field parallaxes instead of sliding as one sheet. */
const DURATIONS = [38, 52, 44, 61, 47, 35, 56, 41, 64, 49, 37, 58, 45, 67, 51];
const DELAYS = [-4, -19, -8, -27, -13, -2, -22, -11, -31, -16, -6, -24, -9, -29, -18];

const LINES: Line[] = DURATIONS.map((duration, i) => {
  const step = PATTERN[i % PATTERN.length];
  return {
    left: -8 + i * 7.6,
    duration,
    delay: DELAYS[i],
    thickness: step.thickness,
    color: step.color,
    glow: step.glow,
  };
});

export function CandidateAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base — very dark with a faint indigo undertone. */}
      <div className="absolute inset-0" style={{ backgroundColor: '#0c0a12' }} />

      {/* Soft violet wash from bottom-right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 88% 92%, rgba(58, 36, 110, 0.4) 0%, rgba(58, 36, 110, 0.18) 42%, transparent 72%)',
        }}
      />

      {/* Ice-blue radial breathing from the top-right corner. */}
      <div
        className="ice-breathe absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 62% at 96% 4%, rgba(160, 215, 255, 0.32) 0%, rgba(160, 215, 255, 0.12) 38%, transparent 68%)',
        }}
      />

      {/* Diagonal laser lines at 115deg, reusing the current drift animation. */}
      {LINES.map((line, i) => (
        <div
          key={i}
          className="laser-line absolute top-1/2 h-px w-[190%]"
          style={{
            left: `${line.left}%`,
            height: `${line.thickness}px`,
            width: '190%',
            marginLeft: '-95%',
            // Standalone `rotate` — the drift animation owns `transform`.
            rotate: '115deg',
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`,
            background: `linear-gradient(90deg, transparent 0%, ${line.color} 42%, ${line.color} 58%, transparent 100%)`,
            boxShadow: `0 0 ${10 + line.thickness * 8}px ${line.glow}`,
          }}
        />
      ))}

      {/* Vera's watch light — frost point, top-right. */}
      <div
        className="ice-breathe absolute"
        style={{
          top: '7%',
          right: '9%',
          width: '10px',
          height: '10px',
          borderRadius: '9999px',
          backgroundColor: '#dff3ff',
          boxShadow:
            '0 0 18px 6px rgba(223, 243, 255, 0.55), 0 0 44px 14px rgba(160, 215, 255, 0.25)',
        }}
      />

      {/* Vignette for readability. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}

export default CandidateAtmosphere;
