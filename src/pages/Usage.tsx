import UsageSection from '@/components/usage/UsageSection';

/**
 * Standalone usage route.
 *
 * This is an account surface, so under the proposed route map it folds into
 * `/dashboard`. That map isn't signed off yet, so it lives on its own route
 * for now rather than pre-empting the decision.
 */
export function Usage() {
  return <UsageSection />;
}

export default Usage;
