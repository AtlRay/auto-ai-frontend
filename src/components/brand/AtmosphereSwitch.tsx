import { useSearchParams, useLocation } from 'react-router-dom';
import AtmosphereLayer from './AtmosphereLayer';
import CandidateAtmosphere from './CandidateAtmosphere';

/**
 * PREVIEW SCAFFOLDING — not part of the locked brand.
 *
 * Renders the locked gold atmosphere by default. `?atmo=candidate` swaps in
 * the exploratory ice/violet variant so the two can be compared on the same
 * page at the same viewport.
 *
 * Public pages only. Signed-in surfaces are out of scope for this comparison
 * (and don't exist in this rebuild yet).
 */

export type AtmoVariant = 'locked' | 'candidate';

export function useAtmoVariant(): AtmoVariant {
  const [params] = useSearchParams();
  return params.get('atmo') === 'candidate' ? 'candidate' : 'locked';
}

export function AtmosphereSwitch() {
  const variant = useAtmoVariant();
  return variant === 'candidate' ? <CandidateAtmosphere /> : <AtmosphereLayer />;
}

/**
 * Dev-only control for flipping the atmosphere.
 *
 * Nothing sits on the locked hero: this renders only behind `?dev=1`. The
 * atmosphere itself still switches on `?atmo=candidate` alone, so the
 * candidate can be reviewed with no chrome on screen at all.
 */
export function AtmoToggle() {
  const [params] = useSearchParams();
  const variant = useAtmoVariant();
  const { pathname } = useLocation();
  const isCandidate = variant === 'candidate';

  if (params.get('dev') !== '1') return null;
  if (pathname !== '/') return null;

  return (
    <a
      href={isCandidate ? '/?dev=1' : '/?dev=1&atmo=candidate'}
      className="fixed bottom-6 left-4 z-50 rounded-full border px-4 py-2 text-xs tracking-wide backdrop-blur-sm transition"
      style={{
        borderColor: isCandidate
          ? 'rgba(185, 230, 255, 0.4)'
          : 'rgba(245, 181, 61, 0.4)',
        color: isCandidate ? '#dff3ff' : '#ffd47a',
        background: 'rgba(0, 0, 0, 0.45)',
      }}
    >
      {isCandidate ? 'Candidate — switch to locked gold' : 'Locked gold — preview candidate'}
    </a>
  );
}

export default AtmosphereSwitch;
