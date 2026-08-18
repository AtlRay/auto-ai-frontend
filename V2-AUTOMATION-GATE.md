# V2 AUTOMATION GATE

**Standing law:** V2 does not launch with placeholders, disabled controls, or
half-wired features. Every surface must be **fully functional via the shared
brain/backends at launch, or not present at launch.** Honest absence beats
visible dysfunction.

**Permanent exception:** the Authority approval gates — money, filing, outbound —
are *features, not gaps*. They ship as designed.

This file is the launch checklist. Every surface in the app appears below with
its real wiring status.

Legend:
- **SHIPS** — fully functional, nothing pending.
- **AUTHORITY** — an approval gate. A feature. Ships as designed.
- **WIRE OR CUT** — currently a placeholder, stub, or inert control. Must be
  wired before launch, or removed from the build.
- **BLOCKED** — waiting on a decision or an external dependency.

Last audited against the repo: see git log for this file.

---

## 1. Public surfaces

| Surface | Status | Detail |
|---|---|---|
| `/` hero + wordmark | SHIPS | Static marketing. Locked treatment, no backend. |
| `/` "What Zayra is" | SHIPS | Static copy. |
| `/` roster section | SHIPS | Honest status per character, no invented function. |
| `/` "Watch the trailer" button | **WIRE OR CUT** | Inert. No `/trailer` route, no video. Cut unless a trailer ships. |
| `/` "Enter Founder OS" | SHIPS | Anchors to `#access`. |
| `/roster` | SHIPS | Information page. Honest "in training" labels. |
| `/usage` | **WIRE OR CUT** | Display layer is built; `usage_monthly_totals` does not exist. Renders "No usage recorded yet." Needs the V1 capture side, or cut. |
| Site header / footer | SHIPS | |

## 2. App shell

| Surface | Status | Detail |
|---|---|---|
| Sidebar (5 primary + More) | SHIPS | Matches live nav, active states correct. |
| Mobile bottom nav | SHIPS | |
| Collapse rail | SHIPS | |
| Header "Watch the Trailer" | **WIRE OR CUT** | Inert, same as the hero button. |

## 3. Destinations — 13 in the registry, 2 ported

| Destination | Route | Status | Detail |
|---|---|---|---|
| Zayra Home | `/empire` | **WIRE OR CUT** | Shell + cards ship. All six tabs (Overview, Profile, Team, Companies, Revenue, Billing) show sign-in / not-available states. Needs auth + per-user data. |
| AI Builder | `/founder` | **WIRE OR CUT** | Shell, rail, progress and navigation all ship. Only stages 1 and 4 have real forms, and neither persists. Stages 2, 3, 7–11 are placeholders. |
| Operate | `/operate` | **WIRE OR CUT** | Placeholder. |
| Research & Invest | `/opportunity-os` | **BLOCKED** | Must consume the Research Engine via the shared brain. Never own stubs. Not started by design. |
| Workspace | `/zayra-cloud` | **WIRE OR CUT** | Placeholder. |
| Entity Launchpad | `/entity-launchpad` | **WIRE OR CUT** | Placeholder. |
| Commerce Launchpad | `/commerce-launchpad` | **WIRE OR CUT** | Placeholder. |
| Zayra Media | `/zayra-media` | **WIRE OR CUT** | Placeholder. |
| Command Center | `/dashboard` | **WIRE OR CUT** | Placeholder. Ruled legacy — strongest candidate to cut outright. |
| Agentic Workbench | `/workbench` | **WIRE OR CUT** | Placeholder. |
| Intelligence Center | `/intelligence` | **WIRE OR CUT** | Placeholder. |
| Email Marketing AI | `/smart-email-marketing` | **WIRE OR CUT** | Placeholder. Vera's draft-check lands here when V1 ships it. |
| Entity Launchpad Admin | `/admin/entity-launchpad` | n/a | Hidden — no admin check exists. |

## 4. Zayra systems

| System | Status | Detail |
|---|---|---|
| Wake orb | SHIPS | Opens the panel; signed-out routes to access with a return url. |
| Wake phrase listener | SHIPS | Off by default, visible indicator, stops on hidden tab / sign-out. No backend needed. |
| Sensitive-command interception | **AUTHORITY** | A wake phrase never submits money / filing / outbound. Feature. |
| Ask Zayra panel | **WIRE OR CUT** | Presence only. No chat. Needs the shared brain. |
| `speak()` / voice | **WIRE OR CUT** | No TTS provider. Returns false and never claims audio. |
| Zayra prefill hook | SHIPS | `zayra:prefill` listener is live and waiting for her form-fill hands. Nothing to build here. |
| Zayra portrait | **BLOCKED** | `public/zayra-hero.png` is the **cyan** render; the platform-canonical render is purple. Ring and orb chrome are violet, so they currently clash. |

## 5. Form Law

| Item | Status | Detail |
|---|---|---|
| Form primitives | SHIPS | Prefill, markers, always-editable, founder-submits, spelling gate. |
| Spelling confirmation gate | **AUTHORITY** | Feature. Ships as designed. |
| Founder-presses-submit | **AUTHORITY** | Feature. Zayra fills, never sends. |
| Stage 1 "Your Idea" | **WIRE OR CUT** | Form works; captures to the device only. No persistence. |
| Stage 4 "Formation" | **WIRE OR CUT** | Form works; draft only, nothing persisted. |
| Live-filing lock | **AUTHORITY** | Alpha lock. Feature. |

## 6. Platform

| Item | Status | Detail |
|---|---|---|
| Supabase client | SHIPS | Env-driven, refuses a non-anon key. |
| Auth (sign in / up) | **WIRE OR CUT** | Does not exist. No `/login`. Every per-user surface depends on this — it is the single biggest unblocker on this list. |
| Device standard | SHIPS | 0/24 failures across the 8-viewport matrix; fold-aware. |
| Self-hosted display font | SHIPS | |
| `public/zayra-office.jpg` | **WIRE OR CUT** | Absent. Hero degrades cleanly to starfield; either supply it or drop the slot. |

---

## What this law implies right now

Counted from the tables above — 43 rows in total:

| Status | Rows |
|---|---|
| SHIPS | 16 |
| WIRE OR CUT | 20 |
| AUTHORITY | 4 |
| BLOCKED | 2 |
| n/a (hidden) | 1 |

**The nav is the problem.** Twelve destinations are routed; **ten of them render
the `NotPortedYet` placeholder**, and the two that are ported — Zayra Home and
AI Builder — are themselves WIRE OR CUT, because their shells are real but the
data under them is not. Under the gate as written, V2 cannot launch with the nav
as it currently stands: those destinations either get wired or come out of the
build.

**Auth is the keystone.** Zayra Home's six tabs, `/usage`, and every per-user
surface resolve the moment auth and the shared brain land. Nothing else on this
list unblocks as much — no `/login` exists today.

**Four items are AUTHORITY gates** — sensitive-command interception, the
spelling-confirmation gate, founder-presses-submit, and the live-filing lock.
These are explicitly not gaps. They ship as designed.

**Two items are BLOCKED on something outside this repo:** Research & Invest
waits on the Research Engine landing in the shared brain, and the Zayra portrait
waits on the purple platform render replacing the cyan file currently committed.
