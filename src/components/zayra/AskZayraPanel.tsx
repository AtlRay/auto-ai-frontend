import { useZayraPresence } from '@/hooks/useZayraPresence';

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
  const { open, setOpen, caption } = useZayraPresence();

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
            {caption && (
              <p className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-sm leading-relaxed text-violet-100">
                {caption}
              </p>
            )}
            <p className="text-sm leading-relaxed text-white/75">
              Zayra's conversational layer isn't connected in this build yet.
            </p>
            <p className="text-xs leading-relaxed text-white/45">
              She’ll answer here once the shared brain is wired up. Nothing you
              type would reach her yet, so there’s no box to type in.
            </p>
          </div>
        </div>
      )}

</>
  );
}

export default AskZayraPanel;
