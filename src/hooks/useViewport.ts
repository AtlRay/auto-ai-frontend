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
  if (width < 400) return { beams: 4, particles: 20 };
  if (width < 700) return { beams: 6, particles: 32 };
  if (width < 1100) return { beams: 7, particles: 44 };
  return { beams: 9, particles: 56 };
}
