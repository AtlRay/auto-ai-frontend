/**
 * "Never Build Alone." wordmark.
 *
 * Chrome typography with the I and A rendered as glowing electric current —
 * the hidden A/I inside the tagline. This is the shared brand mechanism; when
 * another product needs an "AI" callout it reuses this treatment in that
 * product's accent color rather than inventing a new one.
 */

type Props = {
  className?: string;
  /** Include the trailing period. The tagline is written "Never Build Alone." */
  withPeriod?: boolean;
  /**
   * 'chrome' is the locked treatment. 'gold' exists only for the candidate
   * atmosphere preview, which calls for a muted-gold tagline.
   */
  tone?: 'chrome' | 'gold';
};

export function Wordmark({ className = '', withPeriod = true, tone = 'chrome' }: Props) {
  return (
    <span
      className={`${tone === 'gold' ? 'gold-text' : 'chrome-text'} font-[var(--font-display)] font-semibold tracking-tight ${className}`}
      // Screen readers get the plain tagline, not the split glyphs.
      aria-label={`Never Build Alone${withPeriod ? '.' : ''}`}
    >
      <span aria-hidden="true">
        Never Bu<span className="electric-glyph">i</span>ld{' '}
        <span className="electric-glyph">A</span>lone{withPeriod ? '.' : ''}
      </span>
    </span>
  );
}

export default Wordmark;
