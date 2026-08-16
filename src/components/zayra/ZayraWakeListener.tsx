import { useCallback, useEffect, useRef, useState } from 'react';
import {
  detectWake,
  getWakeEnabled,
  isSensitiveCommand,
  isWakeSupported,
  setWakeEnabled,
  type WakeStatus,
} from '@/lib/zayra/wakePhrase';
import { useZayraPresence } from '@/hooks/useZayraPresence';

/**
 * Wake phrase listener.
 *
 * The rules in wakePhrase.ts are law and are enforced here:
 *   - OFF BY DEFAULT. Opt-in only, persisted in localStorage.
 *   - A VISIBLE INDICATOR is rendered whenever the recognizer is armed. The
 *     listener never runs without it.
 *   - STOPS on toggle off, on sign-out, and when the tab is hidden.
 *   - NEVER SECRETLY LISTENS — every listening state is on screen.
 *   - A wake phrase alone NEVER submits a sensitive action. Sensitive
 *     commands are held for explicit confirmation and nothing is executed.
 *
 * Recognition uses the browser's SpeechRecognition where available. Nothing is
 * sent anywhere: transcripts are matched locally and discarded.
 */

type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

export function ZayraWakeListener() {
  const { setOpen, setCaption, userId, authReady } = useZayraPresence();
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<WakeStatus>('off');
  const [heldCommand, setHeldCommand] = useState<string | null>(null);
  const recRef = useRef<SR | null>(null);

  // Opt-in state, and live response to the toggle event.
  useEffect(() => {
    setEnabled(getWakeEnabled());
    const onToggle = (e: Event) =>
      setEnabled(Boolean((e as CustomEvent<{ on: boolean }>).detail?.on));
    window.addEventListener('zayra-wake-toggled', onToggle);
    return () => window.removeEventListener('zayra-wake-toggled', onToggle);
  }, []);

  const stop = useCallback(() => {
    const r = recRef.current;
    recRef.current = null;
    if (r) {
      r.onresult = null;
      r.onerror = null;
      r.onend = null;
      try {
        r.stop();
      } catch {
        /* already stopped */
      }
    }
    setStatus((s) => (s === 'off' ? s : 'off'));
  }, []);

  const handleTranscript = useCallback(
    (text: string) => {
      const hit = detectWake(text);
      if (!hit) return;
      setStatus('active');
      // Law: a wake phrase alone never submits a sensitive action.
      if (hit.command && isSensitiveCommand(hit.command)) {
        setHeldCommand(hit.command);
        setCaption('That needs your explicit confirmation before I act.');
        setOpen(true);
        return;
      }
      setOpen(true);
      setCaption(hit.command ? `Heard: "${hit.command}"` : "I'm here, Founder.");
    },
    [setCaption, setOpen],
  );

  useEffect(() => {
    // Every reason not to listen, checked before anything is started.
    if (!enabled) return stop();
    if (!authReady) return;
    if (!userId) return stop(); // stops on sign-out
    if (!isWakeSupported()) {
      setStatus('unsupported');
      return;
    }
    if (document.visibilityState === 'hidden') return stop();

    const w = window as unknown as Record<string, new () => SR>;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setStatus('unsupported');
      return;
    }

    setStatus('starting');
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const text = last?.[0]?.transcript ?? '';
      handleTranscript(text);
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setStatus('mic-blocked');
        stop();
      }
    };
    rec.onend = () => {
      // Only re-arm if still permitted; never silently restart otherwise.
      if (recRef.current === rec && getWakeEnabled() && document.visibilityState === 'visible') {
        try {
          rec.start();
        } catch {
          /* transient */
        }
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      setStatus('armed');
    } catch {
      setStatus('mic-blocked');
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [enabled, userId, authReady, handleTranscript, stop]);

  const listening = status === 'armed' || status === 'active' || status === 'starting';

  // Nothing renders when wake is off — and wake never runs without this
  // indicator on screen.
  if (!enabled && !heldCommand) return null;

  return (
    <>
      {listening && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-4 z-[120] flex items-center gap-2 rounded-full border border-cyan-300/40 bg-black/85 px-3 py-2 text-[11px] text-cyan-100 backdrop-blur"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]"
          />
          Listening for "hey zayra"
          <button
            type="button"
            onClick={() => setWakeEnabled(false)}
            className="ml-1 inline-flex min-h-11 items-center px-2 text-cyan-200/70 underline underline-offset-2 hover:text-cyan-100"
          >
            Stop
          </button>
        </div>
      )}

      {enabled && status === 'mic-blocked' && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-4 z-[120] rounded-full border border-amber-300/40 bg-black/85 px-3 py-2 text-[11px] text-amber-100 backdrop-blur">
          Microphone blocked — wake phrase is off.
        </div>
      )}

      {heldCommand && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)] left-4 z-[120] max-w-[20rem] rounded-xl border border-amber-300/40 bg-black/90 px-3 py-2 text-[11px] text-amber-50 backdrop-blur">
          <span className="block font-semibold text-amber-200">Needs confirmation</span>
          <span className="mt-0.5 block leading-snug">
            “{heldCommand}” is a sensitive action. Zayra will not act on it from
            a voice command alone.
          </span>
          <button
            type="button"
            onClick={() => setHeldCommand(null)}
            className="mt-1 inline-flex min-h-11 items-center text-amber-200/80 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

export default ZayraWakeListener;
