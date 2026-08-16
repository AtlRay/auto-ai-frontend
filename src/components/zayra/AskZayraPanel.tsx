import { useState } from 'react';

/**
 * "Ask Zayra" floating panel.
 *
 * CONTAINMENT RULE: the cosmic indigo/gold widget style is scoped to THIS
 * panel and nothing else. It must never become the page background — the page
 * keeps the shared gold-on-black atmosphere.
 *
 * The panel is presentational only. Zayra's conversational backend is not
 * wired up in this rebuild yet, so the body states that plainly rather than
 * simulating a reply.
 */
export function AskZayraPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Ask Zayra"
          className="fixed right-4 bottom-24 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#f5b53d]/25 shadow-2xl backdrop-blur-xl"
          style={{
            // Cosmic indigo + gold — contained to this panel only.
            background:
              'linear-gradient(165deg, rgba(38, 22, 84, 0.94) 0%, rgba(24, 16, 56, 0.95) 48%, rgba(14, 10, 30, 0.96) 100%)',
            boxShadow:
              '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,181,61,0.12), inset 0 1px 0 rgba(255,212,122,0.14)',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#f5b53d]/20 px-4 py-3">
            <span className="text-sm font-semibold tracking-wide text-[#ffd47a]">
              Ask Zayra
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Ask Zayra"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 px-4 py-5">
            <p className="text-sm leading-relaxed text-white/75">
              Zayra's conversational layer isn't connected in this build yet.
            </p>
            <p className="text-xs leading-relaxed text-white/45">
              This panel is the only surface that carries the cosmic indigo and
              gold treatment.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close Ask Zayra' : 'Open Ask Zayra'}
        className="fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#5ff2ff]/40 text-lg font-semibold text-[#5ff2ff] transition hover:scale-105 md:bottom-6"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(34,211,238,0.22) 0%, rgba(24,16,56,0.95) 60%)',
          boxShadow:
            '0 0 24px rgba(34,211,238,0.35), 0 8px 24px rgba(0,0,0,0.5)',
        }}
      >
        Z
      </button>
    </>
  );
}

export default AskZayraPanel;
