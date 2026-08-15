import { useSearchParams } from 'react-router-dom';
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

/** Small on-screen control so the two can be flipped without editing URLs. */
export function AtmoToggle() {
  const variant = useAtmoVariant();
  const isCandidate = variant === 'candidate';

  return (
    <a
      href={isCandidate ? '/' : '/?atmo=candidate'}
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
