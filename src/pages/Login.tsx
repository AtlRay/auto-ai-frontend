import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useZayraPresence } from '@/hooks/useZayraPresence';

/**
 * The way in.
 *
 * Before this route existed, all three entry CTAs — the hero button, the header
 * "Request access" and the wake orb — resolved to `/#access`, an empty anchor
 * div. The orb was already storing `auth_return_url` for a flow that did not
 * exist. This is that flow.
 *
 * Real Supabase auth against the shared Lovable-managed project. No mock, no
 * simulated success: if the request fails the founder sees the actual error.
 *
 * HONESTY RULES IN FORCE HERE:
 *  - This is a private alpha. Creating an account does not promise access to
 *    anything that is not built — the copy says what is behind the door.
 *  - No fabricated urgency, no seat counts, no "join 2,000 founders".
 *  - When Supabase env vars are absent the form is disabled and says so,
 *    rather than presenting inputs that could never submit.
 */

type Mode = 'signin' | 'signup';

const RETURN_KEY = 'auth_return_url';

/** Only same-origin paths may be returned to — never an absolute URL. */
function safeReturnUrl(raw: string | null): string {
  if (!raw) return '/empire';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/empire';
  return raw;
}

export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { userId, authReady } = useZayraPresence();

  const [mode, setMode] = useState<Mode>(
    params.get('mode') === 'signup' ? 'signup' : 'signin',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in? There is nothing to do here.
  useEffect(() => {
    if (authReady && userId) {
      navigate(safeReturnUrl(localStorage.getItem(RETURN_KEY)), { replace: true });
    }
  }, [authReady, userId, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!supabase) {
      setError('Sign-in is not configured in this build.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        const back = safeReturnUrl(localStorage.getItem(RETURN_KEY));
        localStorage.removeItem(RETURN_KEY);
        navigate(back, { replace: true });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (err) throw err;
        // Supabase returns a user without a session when email confirmation
        // is on. Say which of the two actually happened — never assume.
        if (data.session) {
          const back = safeReturnUrl(localStorage.getItem(RETURN_KEY));
          localStorage.removeItem(RETURN_KEY);
          navigate(back, { replace: true });
        } else {
          setNotice(
            'Check your email to confirm the address, then sign in. Nothing is charged and nothing is filed.',
          );
        }
      }
    } catch (err) {
      // Surface the real reason. A wrong password must still say so — the only
      // message rewritten is the raw network failure, which reads as browser
      // noise ("Failed to fetch") rather than something a founder can act on.
      const raw = err instanceof Error ? err.message : '';
      const offline = /failed to fetch|networkerror|load failed/i.test(raw);
      setError(
        offline
          ? 'Could not reach the server. Check your connection and try again — nothing was submitted.'
          : raw || 'Sign-in failed. Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const canSubmit =
    isSupabaseConfigured && !busy && email.trim().length > 3 && password.length >= 6;

  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="mb-3 text-xs tracking-[0.28em] text-[#f5b53d]/70 uppercase">
        Private founder alpha
      </p>
      <h1 className="chrome-text mb-3 text-3xl font-bold tracking-tight">
        {mode === 'signin' ? 'Sign in' : 'Create your account'}
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-white/50">
        {mode === 'signin'
          ? 'Zayra keeps your business context with your account, so it is here next time.'
          : 'An account is how Zayra remembers your business between sessions. Live filing, payments and outbound are locked during alpha.'}
      </p>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-500/5 p-3">
          <div className="mb-1 text-[10px] tracking-[0.2em] text-amber-300 uppercase">
            Sign-in unavailable in this build
          </div>
          <p className="text-xs leading-relaxed text-white/70">
            This copy of the app was built without its backend credentials, so
            there is nothing to sign in to. The form below is disabled rather
            than pretending to work.
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/85">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          disabled={!isSupabaseConfigured}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 min-h-11 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 text-sm text-white/90 outline-none focus:border-[#f5b53d]/60 disabled:opacity-40"
        />

        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/85">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          disabled={!isSupabaseConfigured}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 text-sm text-white/90 outline-none focus:border-[#f5b53d]/60 disabled:opacity-40"
        />
        <p className="mt-1.5 mb-5 text-[11px] text-white/35">
          At least 6 characters.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs leading-relaxed text-emerald-100">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="hero-cta inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#ffe6ad] to-[#f5b53d] px-7 text-sm font-medium text-[#2b1c04] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy
            ? 'Working…'
            : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin');
          setError(null);
          setNotice(null);
        }}
        className="mt-5 min-h-11 text-sm text-white/50 underline underline-offset-4 transition hover:text-white/80"
      >
        {mode === 'signin'
          ? 'No account yet? Create one'
          : 'Already have an account? Sign in'}
      </button>

      <p className="mt-8 text-[11px] leading-relaxed text-white/30">
        Alpha locks are on for everyone: no live state filing, no payments, no
        trading, no outbound messaging.{' '}
        <Link to="/roster" className="underline underline-offset-2 hover:text-white/60">
          See what each agent actually runs
        </Link>
        .
      </p>
    </main>
  );
}

export default Login;
