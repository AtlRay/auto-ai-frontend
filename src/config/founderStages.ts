/**
 * Founder Engine stages — the AI Builder journey at /founder.
 *
 * Source: AtlRay/auto-ai-technologies @ 1a47437, src/pages/FounderEngine.tsx.
 * Ids, names, taglines, accents and hidden flags carried across verbatim.
 *
 * Stages 5 and 6 are hidden from the default journey and skipped by
 * next/previous, but remain deep-linkable so ?step=5 and ?step=6 still resolve
 * as informational "Coming Soon" — exactly as the live app behaves.
 */

export type Accent = 'primary' | 'cyan' | 'gold' | 'green' | 'pink';

export type Stage = {
  id: number;
  name: string;
  tagline: string;
  accent: Accent;
  hiddenInDefault?: boolean;
};

export const STAGES: Stage[] = [
  { id: 1, name: 'Your Idea', tagline: 'Zayra meets you — capture the idea', accent: 'cyan' },
  { id: 2, name: 'Who You Serve', tagline: 'Opportunity scan • target customer', accent: 'gold' },
  { id: 3, name: 'Your Offer', tagline: 'Validate demand • capture signals', accent: 'green' },
  { id: 4, name: 'Formation', tagline: 'LLC + EIN filing', accent: 'cyan' },
  { id: 5, name: 'Launch Preparation', tagline: 'Coming Soon — dual business + token launch on hold', accent: 'pink', hiddenInDefault: true },
  { id: 6, name: 'Token Center', tagline: 'Coming Soon — token launching on permanent hold', accent: 'gold', hiddenInDefault: true },
  { id: 7, name: 'Customer Acquisition', tagline: 'Smart email + outreach', accent: 'cyan' },
  { id: 8, name: 'Trusted Providers', tagline: 'Green Book — vetted vendors & services', accent: 'green' },
  { id: 9, name: 'Zayra Autonomy', tagline: 'Set Zayra authority per tool', accent: 'primary' },
  { id: 10, name: 'Scale', tagline: 'Empire Hub — multi-business', accent: 'gold' },
  { id: 11, name: 'Founder Mode', tagline: 'Advanced founder path', accent: 'pink' },
];

export const VISIBLE_STAGES = STAGES.filter((s) => !s.hiddenInDefault);
export const VISIBLE_COUNT = VISIBLE_STAGES.length;

export const ACCENT_HEX: Record<Accent, string> = {
  primary: '#f5b53d',
  cyan: '#5ff2ff',
  gold: '#ffd47a',
  green: '#4ade80',
  pink: '#f472b6',
};

export function nextVisibleId(from: number): number | null {
  const c = VISIBLE_STAGES.filter((s) => s.id > from);
  return c.length ? c[0].id : null;
}

export function prevVisibleId(from: number): number | null {
  const c = VISIBLE_STAGES.filter((s) => s.id < from);
  return c.length ? c[c.length - 1].id : null;
}
