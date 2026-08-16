import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Zayra presence — the shared state the orb, the panel and the wake listener
 * all talk to. Stands in for the live app's useZayraPresence.
 *
 * `speak` is deliberately honest: no text-to-speech provider is wired into
 * this rebuild, so it never claims to have spoken. It surfaces the line as a
 * visible caption and reports back whether audio actually played, which is
 * false here. Callers use that to fall back to text rather than pretending.
 */

type PresenceValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  caption: string | null;
  setCaption: (v: string | null) => void;
  /** Resolves true only if audio genuinely played. Currently always false. */
  speak: (line: string) => Promise<boolean>;
  /** Whether a voice provider exists at all. */
  canSpeak: boolean;
  /** Signed-in user id, or null. Drives the orb's signed-out path. */
  userId: string | null;
  authReady: boolean;
};

const Ctx = createContext<PresenceValue | null>(null);

export function ZayraPresenceProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!isSupabaseConfigured || !supabase) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUserId(data?.user?.id ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (alive) setUserId(session?.user?.id ?? null);
    });
    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // No TTS provider in this build. Never claim speech that did not happen.
  const speak = useCallback(async (line: string) => {
    setCaption(line);
    return false;
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, caption, setCaption, speak, canSpeak: false, userId, authReady }),
    [open, caption, speak, userId, authReady],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useZayraPresence(): PresenceValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useZayraPresence must be used inside ZayraPresenceProvider');
  return v;
}
