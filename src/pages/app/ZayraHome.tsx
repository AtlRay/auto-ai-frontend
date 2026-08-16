import Tabs, { type TabDef } from '@/components/ui/Tabs';
import {
  HomeHero,
  AlphaWelcomeCard,
  StarterPrompts,
  PlatformStatus,
  FounderReadiness,
  AppAccessRow,
} from '@/components/home/HomeCards';

/**
 * Zayra Home — the anchor destination, at /empire.
 *
 * Ported from AtlRay/auto-ai-technologies @ 1a47437, src/pages/AutoAIHQ.tsx:
 * flagship hero, alpha welcome card, starter prompts beside platform status,
 * founder readiness, six tabs, then the app-access row.
 *
 * Command Center (/dashboard) is legacy; nothing is pulled from it here.
 *
 * The data-backed tabs read per-user records. Auth isn't wired in this rebuild
 * yet, so they say so rather than showing invented numbers.
 */

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <h3 className="mb-2 text-sm font-semibold text-white/70">{title}</h3>
      <p className="mx-auto max-w-md text-xs leading-relaxed text-white/35">{body}</p>
    </div>
  );
}

const TABS: TabDef[] = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <Panel
        title="Sign in to see your overview"
        body="Your founder overview is built from your own records. Nothing is shown until you're signed in."
      />
    ),
  },
  {
    value: 'profile',
    label: 'Profile',
    content: (
      <Panel
        title="Sign in to see your profile"
        body="Your founder profile lives with your account."
      />
    ),
  },
  {
    // Verbatim from the live app — this is genuinely an empty state there too.
    value: 'team',
    label: 'Team',
    content: (
      <Panel
        title="Team Management"
        body="Invite operators, assign roles, and share dashboards. Coming online."
      />
    ),
  },
  {
    value: 'companies',
    label: 'Companies',
    content: (
      <Panel
        title="Sign in to see your companies"
        body="Entities you've formed appear here, with their filing status."
      />
    ),
  },
  {
    value: 'revenue',
    label: 'Revenue',
    content: (
      <Panel
        title="Sign in to see revenue"
        body="Revenue is read from your connected records. No figures are estimated or filled in."
      />
    ),
  },
  {
    // Pricing is parked by Ray's decision — no price list is rendered here, and
    // this app must not stand up a second one.
    value: 'billing',
    label: 'Billing',
    content: (
      <Panel
        title="Billing isn't available here yet"
        body="Plans and pricing are being reconciled. This screen will show your plan once that's settled."
      />
    ),
  },
];

export function ZayraHome() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <HomeHero />
      <AlphaWelcomeCard />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StarterPrompts />
        <PlatformStatus />
      </div>

      <FounderReadiness />

      <Tabs tabs={TABS} defaultValue="overview" />

      <AppAccessRow />
    </div>
  );
}

export default ZayraHome;
