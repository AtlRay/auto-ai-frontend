import { useEffect, useState } from 'react';

/**
 * Live viewport width.
 *
 * Foldables change viewport size while the app is running, so nothing may
 * depend on load-time width. This updates on resize and on orientation change
 * so layers reflow without a reload.
 */
export function useViewportWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return width;
}

/**
 * Atmosphere density, scaled down on narrow viewports so the field never
 * clutters a Fold cover screen. Width ranges, not device assumptions.
 */
export function useAtmosphereDensity() {
  const width = useViewportWidth();
  // Line counts calibrated to the reference: ~30 at desktop, ~10-14 on a
  // Fold cover screen. Node dots held at the reference's 10-15 at desktop.
  if (width < 400) return { beams: 12, particles: 7 };
  if (width < 700) return { beams: 18, particles: 9 };
  if (width < 1100) return { beams: 24, particles: 12 };
  return { beams: 30, particles: 14 };
}
