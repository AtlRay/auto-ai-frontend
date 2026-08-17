/**
 * The house roster — locked at FIVE. No additions.
 *
 * HOUSE LAW: a character "works" only when a real system runs under them.
 * Presence without function is shown honestly as "in training". No fake jobs.
 *
 * IMPORTANT — this file describes THIS app, not V1.
 * The activation order lists what each character does on the Lovable V1
 * surface. This is a different surface, so every status below is what is
 * actually running here. Copying V1's "working today" list onto this roster
 * would claim function this app does not have, which is exactly the
 * fabrication the law forbids.
 */

export type CharacterStatus =
  /** A real system runs under them in THIS app. */
  | 'active-here'
  /** They work, but on another surface — not in this app. */
  | 'elsewhere'
  /** No system under them yet, anywhere in this app. */
  | 'in-training';

export type RosterMember = {
  name: string;
  /** House title. */
  title: string;
  role: string;
  copy: string;
  status: CharacterStatus;
  /** Accent used in this app. */
  accent: string;
  /** False where the colour is still a candidate awaiting a ruling. */
  accentLocked: boolean;
  accentNote?: string;
  /** Systems genuinely running under them here. */
  worksHere: string[];
  /** Named jobs with no system behind them yet. */
  inTraining: string[];
  /** Where their work actually lives, when it isn't here. */
  elsewhereNote?: string;
};

export const ROSTER: RosterMember[] = [
  {
    name: 'Zayra',
    title: 'The Brain',
    role: 'AI co-founder',
    copy: 'One brain, every app. She carries your business between sessions.',
    status: 'active-here',
    // Her IDENTITY colour is cyan; the purple render is her platform outfit
    // here, per the per-platform law. The roster dot shows identity, the
    // portrait shows the outfit — see the report accompanying this change.
    accent: '#5ff2ff',
    accentLocked: true,
    accentNote: 'Cyan identity · purple render on this platform',
    worksHere: ['Presence layer — orb, panel, wake phrase'],
    inTraining: [
      'Chat',
      'Voice',
      'Research engine',
      'Mailbox',
      'Form-fill hands',
      'Morning brief',
    ],
  },
  {
    name: 'Chachy',
    title: 'The Hunter',
    role: 'Sales hunter',
    copy: 'The Digital Wolf. Hunts leads so you are not cold-calling alone.',
    status: 'elsewhere',
    accent: '#a855f7',
    accentLocked: true,
    worksHere: [],
    inTraining: ['CRM touchpoints inside this app'],
    elsewhereNote: 'His CRM runs on his own product, not on this surface.',
  },
  {
    name: 'Aegis',
    title: 'The Shield',
    role: 'Compliance & deadlines',
    copy: 'Watches filing status, renewals and deadlines so none of them pass quietly.',
    status: 'in-training',
    accent: '#9aa3ad',
    accentLocked: false,
    accentNote: 'Candidate — steel with amber warning glow, pending a ruling',
    worksHere: [],
    inTraining: [
      'Deadline Ledger — first shippable job, queued on V1',
      'A2P / SMS compliance',
    ],
  },
  {
    name: 'Vera',
    title: 'The Truth',
    role: 'Truth-checker',
    copy: 'Screens every message so nothing reads as AI slop.',
    status: 'in-training',
    accent: '#b9e6ff',
    accentLocked: false,
    accentNote: 'Candidate — arctic ice, never Zayra’s cyan, pending a ruling',
    worksHere: [],
    inTraining: [
      'Outbound draft checks — first shippable job, queued on V1',
      'Review responses',
    ],
  },
  {
    name: 'Cache',
    title: 'The Money',
    role: 'Money awareness',
    copy: 'Keeps sight of what came in and what renews next. Never a guessed number.',
    status: 'in-training',
    accent: '#34d399',
    accentLocked: false,
    accentNote: 'Candidate — emerald, kept off the house gold, pending a ruling',
    worksHere: [],
    inTraining: [
      'Cache Ledger, read-only — first shippable job, queued on V1',
      'Payments and rebilling',
    ],
  },
];

export const STATUS_LABEL: Record<CharacterStatus, string> = {
  'active-here': 'Working here',
  elsewhere: 'Works elsewhere',
  'in-training': 'In training',
};
