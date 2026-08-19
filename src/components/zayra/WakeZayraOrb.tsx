// WAKE ZAYRA ORB
// The one guaranteed entry point to Zayra. Small, minimal, in her platform
// accent — violet here, per the per-platform law — deliberately NOT the
// cosmic indigo/gold treatment, which stays contained inside the Ask Zayra
// panel itself. Mounted globally in App.tsx so it
// survives every nav change, on public and signed-in routes alike.
//
// Signed in  -> opens the Ask Zayra panel + a short greeting.
// Signed out -> routes into the alpha-access flow. Never a dead tap.
//
// Ported from the live app. Three adaptations, all forced by what exists here:
//   - useAuth -> the presence context's userId (no AuthContext in this repo).
//   - unlockZayraAudio / speak -> no voice provider is wired, so the greeting
//     is shown as text rather than a "tap to play" chip that would imply
//     audio is coming.
//   - signed-out routes to /login. It stores auth_return_url first, and
//     /login sends the founder back to exactly where they tapped.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useZayraPresence } from '@/hooks/useZayraPresence';
import { ZayraFace } from '@/components/zayra/ZayraFace';

// Routes where any floating Zayra affordance is intentionally suppressed
// (mirrors ZayraLivingCompanion's own hide list) plus the face-to-face
// stage routes, where the panel is already the whole page.
const HIDE_ON = ['/auth/callback', '/install', '/trailer'];
const STAGE_ROUTES = ['/zayra-voice', '/zayra-voice-concierge', '/zayra/face'];

const GREETINGS = [
  "I'm here, Founder. What are we working on?",
  'Right here. What do you need?',
  'Awake and listening, Founder.',
];

const PILL_KEY = 'zayra_wake_pill_dismissed';

export function WakeZayraOrb() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { open, setOpen, speak, setCaption, canSpeak, userId, authReady } =
    useZayraPresence();
  const [pendingGreeting, setPendingGreeting] = useState<string | null>(null);
  // First visit per session: a small "Wake Zayra" pill sits beside the orb.
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    try {
      setShowPill(sessionStorage.getItem(PILL_KEY) !== '1');
    } catch {
      setShowPill(true);
    }
  }, []);

  const dismissPill = () => {
    setShowPill(false);
    try {
      sessionStorage.setItem(PILL_KEY, '1');
    } catch {
      /* session storage unavailable — the pill simply shows again */
    }
  };

  const hidden =
    open ||
    HIDE_ON.some((p) => pathname.startsWith(p)) ||
    STAGE_ROUTES.some((p) => pathname.startsWith(p));

  if (hidden) return null;

  const greet = async (line: string) => {
    const spoke = await speak(line);
    // Only offer the text fallback when audio genuinely did not play.
    setPendingGreeting(spoke ? null : line);
  };

  const onTap = () => {
    dismissPill();
    if (authReady && !userId) {
      try {
        localStorage.setItem('auth_return_url', pathname + window.location.search);
      } catch {
        /* storage unavailable — return url simply is not restored */
      }
      navigate('/login');
      return;
    }
    const line = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setOpen(true);
    setCaption(line);
    void greet(line);
  };

  const label = !authReady || userId ? 'Wake Zayra' : 'Sign in to talk to Zayra';

  return (
    <>
      <div className="fixed right-5 bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)] z-[120] flex items-center gap-2 md:right-6 md:bottom-6">
        {showPill && (
          <span className="hidden items-center rounded-full border border-violet-400/40 bg-black/85 px-3 py-1.5 text-[11px] font-semibold text-violet-100 shadow-[0_0_20px_hsl(272_95%_62%/0.28)] backdrop-blur sm:inline-flex">
            Wake Zayra
          </span>
        )}
        <button
          type="button"
          onClick={onTap}
          aria-label={label}
          title={label}
          className="relative grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:outline-none active:scale-95"
        >
          <ZayraFace size={56} />
          <span className="sr-only">{label}</span>
        </button>
      </div>

      {pendingGreeting && (
        <div
          className="fixed right-5 bottom-[calc(env(safe-area-inset-bottom,0px)+9rem)] z-[120] max-w-[16rem] rounded-xl border border-violet-400/40 bg-black/90 px-3 py-2 text-left text-[11px] text-violet-50 shadow-lg backdrop-blur md:right-6 md:bottom-24"
          role="status"
        >
          <span className="block font-semibold text-violet-200">Zayra</span>
          <span className="mt-0.5 block leading-snug">{pendingGreeting}</span>
          {!canSpeak && (
            <span className="mt-1 block text-[10px] text-violet-100/40">
              Voice isn't connected in this build.
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default WakeZayraOrb;
