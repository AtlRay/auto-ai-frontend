/**
 * Navigation registry — mirrors the live Lovable app's AppSidebar so the
 * eventual switch is invisible to users.
 *
 * Source of truth: AtlRay/auto-ai-technologies, src/components/AppSidebar.tsx
 * (read at commit 1a47437, 2026-08-14).
 *
 * Structure there is 5 primary destinations + a collapsible "More" group of 7
 * + one admin entry gated on isAdmin — not a flat list. Titles, routes and
 * descriptions below are copied verbatim; route paths are unchanged.
 */

export type Destination = {
  title: string;
  url: string;
  desc: string;
  /** Lovable marks two primary items as featured. */
  featured?: boolean;
};

/** PR 1 — Nav rebrand: 5 primary destinations. Route paths unchanged. */
export const MAIN_ITEMS: Destination[] = [
  { title: 'Zayra Home', url: '/empire', desc: 'Your founder home base' },
  { title: 'AI Builder', url: '/founder', desc: 'Idea → business → launch', featured: true },
  { title: 'Operate', url: '/operate', desc: 'Grow, message, follow up' },
  // STANDING CONSTRAINT — read before porting this surface.
  // Zayra's Research Engine (live market/coin/stock lookups + Nimble web
  // research) is being wired in the V1 backend as SHARED-BRAIN TOOLS. This
  // UI consumes those tools through the shared brain and must never
  // implement its own lookup or research stubs. Until that connection
  // exists, render an honest empty state — "research connects when the
  // shared brain lands" — the same as every other disabled control here.
  { title: 'Research & Invest', url: '/opportunity-os', desc: 'Find your next move' },
  { title: 'Workspace', url: '/zayra-cloud', desc: 'Files, memory, projects', featured: true },
];

export const MORE_ITEMS: Destination[] = [
  // STANDING CONSTRAINT — read before porting this surface.
  // Lovable is building the AEGIS HUB in V1 right now: formation, the Deadline
  // Ledger and trademark protection unified under one shield page. Do NOT
  // design a competing version here, and do not scaffold any of its three
  // parts separately. When V1's flow is proven it ports across per V2-Better
  // law. Until then this stays an honest placeholder — tracked, not built.
  { title: 'Entity Launchpad', url: '/entity-launchpad', desc: 'Business setup & filing' },
  { title: 'Commerce Launchpad', url: '/commerce-launchpad', desc: 'Offers & payments' },
  { title: 'Zayra Media', url: '/zayra-media', desc: 'Newsroom & content' },
  { title: 'Command Center', url: '/dashboard', desc: 'Ops, logs, performance' },
  { title: 'Agentic Workbench', url: '/workbench', desc: 'Build AI workers' },
  { title: 'Intelligence Center', url: '/intelligence', desc: 'Research & insights' },
  { title: 'Email Marketing AI', url: '/smart-email-marketing', desc: 'Campaigns by Zayra' },
];

/** Gated on isAdmin in Lovable. No admin check exists here yet, so it stays
 *  hidden rather than being shown to everyone. */
export const ADMIN_ITEMS: Destination[] = [
  { title: 'Entity Launchpad Admin', url: '/admin/entity-launchpad', desc: 'Admin tools' },
];

export const ALL_DESTINATIONS = [...MAIN_ITEMS, ...MORE_ITEMS];
