/**
 * The character roster — locked at five. No additions.
 *
 * Every field here is either verified or deliberately absent. Cache and Aegis
 * have no confirmed role, colour, or art, so they carry none: they render as
 * silhouettes rather than have descriptions invented for them.
 */

export type RosterMember = {
  name: string;
  /** Present only where the role is verified. */
  role: string | null;
  /** Verified one-liner. */
  copy: string | null;
  /** Accent colour, or null where none is confirmed. */
  accent: string | null;
  status: 'realized' | 'name-only';
};

export const ROSTER: RosterMember[] = [
  {
    name: 'Zayra',
    role: 'AI co-founder',
    copy: 'The Founder Operating System. Carries your business between sessions.',
    // Per-platform law: violet is her canonical accent on this platform,
    // matching the AAT landing portrait. Cyan is her other-rooms variant.
    accent: '#9f38fa',
    status: 'realized',
  },
  {
    name: 'Chachy',
    role: 'Sales hunter',
    copy: 'The Digital Wolf. Hunts leads so you are not cold-calling alone.',
    // Locked: electric violet — Chachy's own identity, not Zayra's.
    accent: '#a855f7',
    status: 'realized',
  },
  {
    name: 'Vera',
    role: 'Truth-checker',
    copy: 'Screens every message so nothing reads as AI slop.',
    // CANDIDATE COLOUR, not formally locked. Icy white-blue taken from Vera's
    // existing art — deliberately colder and whiter than Zayra's saturated
    // cyan (#22d3ee), which stays Zayra's alone.
    accent: '#b9e6ff',
    status: 'realized',
  },
  {
    name: 'Cache',
    role: null,
    copy: null,
    accent: null,
    status: 'name-only',
  },
  {
    name: 'Aegis',
    role: null,
    copy: null,
    accent: null,
    status: 'name-only',
  },
];
