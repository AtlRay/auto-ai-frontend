import { useLocation } from 'react-router-dom';
import { ALL_DESTINATIONS } from '@/config/destinations';

/**
 * Placeholder for destinations that exist in the nav but whose pages haven't
 * been ported yet.
 *
 * The port runs in order — shell, then dashboard, then founder flow, then the
 * Wake Zayra orb — so these routes are reachable before they have content.
 * They say so plainly rather than showing a mocked-up screen.
 */
export function NotPortedYet() {
  const { pathname } = useLocation();
  const dest = ALL_DESTINATIONS.find(
    (d) => pathname === d.url || pathname.startsWith(d.url + '/'),
  );

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="chrome-text mb-3 text-3xl font-bold tracking-tight">
        {dest?.title ?? 'Destination'}
      </h1>
      {dest && <p className="mb-8 text-sm text-white/40">{dest.desc}</p>}

      <div className="rounded-xl border border-dashed border-white/10 px-6 py-12">
        <p className="text-sm text-white/55">This screen hasn't been ported yet.</p>
        <p className="mt-2 text-xs text-white/30">
          The route and its place in the navigation match the live app. The
          screen itself is still to come.
        </p>
      </div>
    </section>
  );
}

export default NotPortedYet;
