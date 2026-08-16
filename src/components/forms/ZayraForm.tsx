import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * HOUSE FORM LAW — every form in this app is built on these primitives.
 *
 *  1. Zayra pre-fill is native: fields can be injected programmatically.
 *  2. Anything she filled carries a visible "Filled by Zayra" marker.
 *  3. Fields are ALWAYS editable — a marker never locks a field.
 *  4. The founder presses submit. Zayra can fill; she cannot send.
 *  5. Legal-string fields require visual spelling confirmation before submit
 *     enables. These are the values that end up on a filing, so the founder
 *     confirms them letter by letter.
 *
 * Retrofitting these is not allowed; forms are built compliant from birth.
 */

export type Provenance = 'founder' | 'zayra';

type FieldState = { value: string; source: Provenance; confirmed: boolean };

type FormCtx = {
  fields: Record<string, FieldState>;
  register: (name: string, opts: { legal?: boolean }) => void;
  setValue: (name: string, value: string, source: Provenance) => void;
  setConfirmed: (name: string, v: boolean) => void;
  legalNames: string[];
  /** Rule 5: every registered legal string must be confirmed. */
  canSubmit: boolean;
  /** Rule 1: programmatic injection, the Zayra pre-fill entry point. */
  applyZayraPrefill: (values: Record<string, string>) => void;
};

const Ctx = createContext<FormCtx | null>(null);

export function ZayraFormProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Record<string, FieldState>>({});
  const [legalNames, setLegalNames] = useState<string[]>([]);

  const register = useCallback((name: string, opts: { legal?: boolean }) => {
    setFields((f) =>
      f[name] ? f : { ...f, [name]: { value: '', source: 'founder', confirmed: false } },
    );
    if (opts.legal) setLegalNames((l) => (l.includes(name) ? l : [...l, name]));
  }, []);

  const setValue = useCallback((name: string, value: string, source: Provenance) => {
    setFields((f) => ({
      ...f,
      // Rule 5: any edit invalidates a previous spelling confirmation.
      [name]: { value, source, confirmed: false },
    }));
  }, []);

  const setConfirmed = useCallback((name: string, v: boolean) => {
    setFields((f) => (f[name] ? { ...f, [name]: { ...f[name], confirmed: v } } : f));
  }, []);

  const applyZayraPrefill = useCallback((values: Record<string, string>) => {
    setFields((f) => {
      const next = { ...f };
      for (const [k, v] of Object.entries(values)) {
        next[k] = { value: v, source: 'zayra', confirmed: false };
      }
      return next;
    });
  }, []);

  // Rule 1: the injection entry point Zayra calls. Mirrors the live app's
  // window-event pattern, so her backend can fill a form from anywhere
  // without this component knowing about her.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, string>>).detail;
      if (detail && typeof detail === 'object') applyZayraPrefill(detail);
    };
    window.addEventListener('zayra:prefill', onPrefill);
    return () => window.removeEventListener('zayra:prefill', onPrefill);
  }, [applyZayraPrefill]);

  const canSubmit = useMemo(
    () =>
      legalNames.every((n) => {
        const f = fields[n];
        return f && f.value.trim().length > 0 && f.confirmed;
      }),
    [legalNames, fields],
  );

  const value = useMemo(
    () => ({ fields, register, setValue, setConfirmed, legalNames, canSubmit, applyZayraPrefill }),
    [fields, register, setValue, setConfirmed, legalNames, canSubmit, applyZayraPrefill],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useZayraForm(): FormCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useZayraForm must be used inside ZayraFormProvider');
  return v;
}

/** Rule 2: the marker. Small, unmistakable, and never a lock. */
export function FilledByZayra() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-violet-200">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-violet-300" />
      Filled by Zayra
    </span>
  );
}

/** Spell a legal string out so the founder can check it character by character. */
export function spellOut(value: string): string {
  return value
    .split('')
    .map((ch) => (ch === ' ' ? '␣' : ch.toUpperCase()))
    .join(' · ');
}

export function ZayraField({
  name,
  label,
  hint,
  legal = false,
  multiline = false,
}: {
  name: string;
  label: string;
  hint?: string;
  /** Legal strings end up on a filing and need spelling confirmation. */
  legal?: boolean;
  multiline?: boolean;
}) {
  const { fields, register, setValue, setConfirmed } = useZayraForm();
  useMemo(() => register(name, { legal }), [name, legal, register]);

  const f = fields[name] ?? { value: '', source: 'founder' as Provenance, confirmed: false };
  const id = `zf-${name}`;

  return (
    <div className="mb-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="text-sm font-medium text-white/85">
          {label}
        </label>
        {legal && (
          <span className="text-[10px] tracking-wide text-amber-300/80 uppercase">
            Legal string
          </span>
        )}
        {/* Rule 2 */}
        {f.source === 'zayra' && <FilledByZayra />}
      </div>

      {hint && <p className="mb-1.5 text-xs text-white/40">{hint}</p>}

      {/* Rule 3: always editable. Never readOnly, never disabled. */}
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={f.value}
          onChange={(e) => setValue(name, e.target.value, 'founder')}
          className="w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-white/90 outline-none focus:border-violet-400/60"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={f.value}
          onChange={(e) => setValue(name, e.target.value, 'founder')}
          className="min-h-11 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 text-sm text-white/90 outline-none focus:border-violet-400/60"
        />
      )}

      {/* Rule 5: visual spelling confirmation gate. */}
      {legal && f.value.trim().length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-400/25 bg-amber-500/5 p-3">
          <div className="mb-1 text-[10px] tracking-[0.18em] text-amber-300 uppercase">
            Check the spelling
          </div>
          <p className="mb-2 font-mono text-sm break-all text-amber-100">
            {spellOut(f.value)}
          </p>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={f.confirmed}
              onChange={(e) => setConfirmed(name, e.target.checked)}
              className="h-4 w-4 accent-amber-400"
            />
            This spelling is exactly right.
          </label>
        </div>
      )}
    </div>
  );
}

/** Rule 4: only the founder submits. Disabled until rule 5 is satisfied. */
export function ZayraSubmit({
  label = 'Submit',
  onSubmit,
}: {
  label?: string;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const { canSubmit, fields, legalNames } = useZayraForm();
  const pending = legalNames.filter((n) => !fields[n]?.confirmed).length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={!canSubmit}
        onClick={() =>
          onSubmit(
            Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.value])),
          )
        }
        className="inline-flex min-h-11 items-center rounded-lg border border-[#f5b53d]/50 bg-[#f5b53d]/10 px-5 text-sm font-medium text-[#ffd47a] transition enabled:hover:bg-[#f5b53d]/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/25"
      >
        {label}
      </button>
      {!canSubmit && pending > 0 && (
        <span className="text-xs text-white/40">
          Confirm the spelling of {pending} legal {pending === 1 ? 'field' : 'fields'} to
          enable submit.
        </span>
      )}
    </div>
  );
}
