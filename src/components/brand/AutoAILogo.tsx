/**
 * Auto AI Technologies™ logo.
 *
 * "AUTO" in chrome, with the A and I stacked top-to-bottom and rendered as
 * glowing electric current — the same mechanism as the wordmark.
 */

type Props = {
  className?: string;
  /** Render the ™ and full company name alongside the mark. */
  showFullName?: boolean;
};

export function AutoAILogo({ className = '', showFullName = false }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Auto AI Technologies"
    >
      {/* text-xl on the wrapper so the stack's `em` sizing resolves against the
          same base as AUTO — otherwise the glyphs shrink to the root font size
          and the I all but disappears. */}
      <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-xl">
        <span className="chrome-text font-[var(--font-display)] font-bold tracking-[0.18em]">
          AUTO
        </span>

        {/* Stacked A over I — reads top-to-bottom as "AI". Sized so the two
            lines together occupy roughly AUTO's own height. */}
        <span className="inline-flex flex-col items-center">
          <span className="electric-glyph block font-[var(--font-display)] text-[0.62em] leading-[0.86] font-extrabold">
            A
          </span>
          <span className="electric-glyph block font-[var(--font-display)] text-[0.62em] leading-[0.86] font-extrabold">
            I
          </span>
        </span>
      </span>

      {showFullName && (
        <span className="ml-1 text-xs tracking-[0.2em] text-white/45 uppercase">
          Technologies™
        </span>
      )}
    </span>
  );
}

export default AutoAILogo;
