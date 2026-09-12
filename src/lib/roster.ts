/**
 * The house roster — locked at FIVE. No additions.
 *
 * HOUSE LAW: a character "works" only when a real system runs under them.
 * Presence without function is shown honestly as "in training". No fake jobs.
 *
 * CANONICAL JOBS (house context, 12 Sep 2026). These are what each character
 * IS across the ecosystem — not a claim about what runs on this surface:
 *   Zayra  — AI CEO / Digital COO. Runs the business. The core product.
 *   Chachy — sales hunter: lead scanning, scoring, outreach. Lives BOTH inside
 *            the main app AND as a separate paid product, Chachy Hunter Core.
 *   Vera   — truth-checker. Screens Chachy's outreach for AI slop before send.
 *   Cache  — cash / runway tracker. Lives inside Zayra.
 *   Aegis  — compliance guardian: filing deadlines, contract risk,
 *            registered-agent status. Lives inside Zayra.
 * Keep `copy` and `role` below faithful to these. The `status` fields are a
 * separate question and answer only for this app.
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
    role: 'AI CEO · Digital COO',
    copy: 'One brain, every app. She runs the business with you and carries your context between sessions.',
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
    copy: 'The Digital Wolf. Scans, scores and works your leads so you are not cold-calling alone.',
    status: 'elsewhere',
    accent: '#a855f7',
    accentLocked: true,
    worksHere: [],
    inTraining: ['His in-app surface here — scanning, scoring, outreach'],
    elsewhereNote:
      'He belongs in this app too. Today he only runs as the separate paid product, Chachy Hunter Core — nothing of his is wired on this surface yet.',
  },
  {
    name: 'Aegis',
    title: 'The Shield',
    role: 'Compliance guardian',
    copy: 'Watches filing deadlines, contract risk and registered-agent status so none of them pass quietly.',
    status: 'in-training',
    accent: '#9aa3ad',
    accentLocked: false,
    accentNote: 'Candidate — steel with amber warning glow, pending a ruling',
    worksHere: [],
    inTraining: [
      'Deadline Ledger — part of the Aegis hub, being built on V1',
      'Formation and trademark protection — same hub',
      'Contract risk',
      'Registered-agent status',
      'A2P / SMS compliance',
    ],
  },
  {
    name: 'Vera',
    title: 'The Truth',
    role: 'Truth-checker',
    copy: "Screens Chachy's outreach before it sends, so nothing goes out reading as AI slop.",
    status: 'in-training',
    accent: '#b9e6ff',
    accentLocked: false,
    accentNote: 'Candidate — arctic ice, never Zayra’s cyan, pending a ruling',
    worksHere: [],
    inTraining: [
      "Screening Chachy's outreach — first shippable job, queued on V1",
      'Review responses',
    ],
  },
  {
    name: 'Cache',
    title: 'The Money',
    role: 'Cash & runway',
    copy: 'Tracks cash in, what renews next, and how much runway that leaves. Never a guessed number.',
    status: 'in-training',
    accent: '#34d399',
    accentLocked: false,
    accentNote: 'Candidate — emerald, kept off the house gold, pending a ruling',
    worksHere: [],
    inTraining: [
      'Cache Ledger, read-only — first shippable job, queued on V1',
      'Runway tracking',
      'Payments and rebilling',
    ],
  },
];

export const STATUS_LABEL: Record<CharacterStatus, string> = {
  'active-here': 'Working here',
  elsewhere: 'Works elsewhere',
  'in-training': 'In training',
};
