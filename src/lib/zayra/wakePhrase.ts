/**
 * Zayra Wake Phrase System — official architecture rules.
 *
 * Ported verbatim from the live app (src/lib/zayra/wakePhrase.ts). These rules
 * are law and are enforced by ZayraWakeListener:
 *   - Off by default; opt-in only (stored in localStorage).
 *   - App-open only on web/PWA. Native background wake is a future phase.
 *   - Visible listening indicator required whenever the recognizer is armed.
 *   - Stops on logout, on toggle off, and when the tab is hidden.
 *   - Never secretly listens.
 *   - Sensitive actions (money, filings, posting, payments, deletes, emails,
 *     billing) require explicit confirmation — wake phrase alone never
 *     submits them.
 *
 * Wake phrases:
 *   Primary: "Hey Zayra"
 *   Brand  : "Never Build Alone"
 */

function isMobileUA(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

export const WAKE_STORAGE_KEY = 'zayra-wake-enabled-v1';

export const WAKE_PHRASES = {
  primary: 'hey zayra',
  brand: 'never build alone',
} as const;

export type WakeStatus =
  | 'off'
  | 'unsupported'
  | 'starting'
  | 'mic-blocked'
  | 'armed' // listening for wake phrase
  | 'active'; // user spoke the wake phrase, command pending

/**
 * Phrases that imply a sensitive, real-world side effect. Wake phrase
 * commands matching any of these patterns must be intercepted and require
 * explicit confirmation from the founder before Zayra acts.
 */
export const SENSITIVE_COMMAND_PATTERNS: RegExp[] = [
  /\bfile (?:my |the )?(?:llc|filing|entity|incorporation)\b/i,
  /\bsubmit (?:the )?(?:filing|incorporation|llc)\b/i,
  /\bpost (?:this|it|that|everywhere|now)\b/i,
  /\bpublish\b/i,
  /\bpay (?:for|the|now|it)\b/i,
  /\b(?:make|charge) (?:a )?payment\b/i,
  /\bcharge (?:my|the) card\b/i,
  /\bchange (?:my )?billing\b/i,
  /\bdelete (?:my|the|all)\b/i,
  /\bsend (?:the |an |this )?email\b/i,
  /\btransfer (?:funds|money)\b/i,
];

export function isSensitiveCommand(text: string): boolean {
  if (!text) return false;
  return SENSITIVE_COMMAND_PATTERNS.some((re) => re.test(text));
}

/**
 * Detect a wake phrase in a transcript. Returns the matched phrase and the
 * remainder of the utterance (the command), or null if no wake was heard.
 */
export function detectWake(
  transcript: string,
): { phrase: 'primary' | 'brand'; command: string } | null {
  if (!transcript) return null;
  const t = transcript
    .toLowerCase()
    .replace(/[.,!?]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return null;

  // Brand phrase first — it's the longer, more distinctive token.
  const brandIdx = t.indexOf(WAKE_PHRASES.brand);
  if (brandIdx !== -1) {
    return { phrase: 'brand', command: t.slice(brandIdx + WAKE_PHRASES.brand.length).trim() };
  }

  const primaryIdx = t.indexOf(WAKE_PHRASES.primary);
  if (primaryIdx !== -1) {
    return { phrase: 'primary', command: t.slice(primaryIdx + WAKE_PHRASES.primary.length).trim() };
  }

  // Tolerate the common mishear "hey zara" / "hey zaira" / "hey zera".
  const fuzzy = /\bhey z[ae]i?[rl]a\b/.exec(t);
  if (fuzzy) {
    return { phrase: 'primary', command: t.slice(fuzzy.index + fuzzy[0].length).trim() };
  }

  return null;
}

export function isWakeSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as Record<string, unknown>;
  if (w.SpeechRecognition || w.webkitSpeechRecognition) return true;
  return isMobileUA() && Boolean(navigator?.mediaDevices?.getUserMedia);
}

export function getWakeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(WAKE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setWakeEnabled(on: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WAKE_STORAGE_KEY, on ? '1' : '0');
    window.dispatchEvent(new CustomEvent('zayra-wake-toggled', { detail: { on } }));
  } catch {
    /* storage unavailable — wake simply stays off */
  }
}
