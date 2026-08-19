import AutoAILogo from '@/components/brand/AutoAILogo';

/**
 * Nav skeleton.
 *
 * Deliberately minimal: the consolidated route map is still awaiting sign-off,
 * so this links only to sections that actually exist. Nav items are added as
 * routes are approved and built — no links to pages that aren't there.
 */
export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-white/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <a href="/" className="flex min-h-11 min-w-0 items-center transition hover:opacity-90">
          <AutoAILogo showFullName />
        </a>

        <nav className="flex items-center gap-6 text-sm">
          <a
            href="#what-zayra-is"
            className="hidden min-h-11 items-center text-white/60 transition hover:text-white md:inline-flex"
          >
            What Zayra is
          </a>
          <a
            href="#the-roster"
            className="hidden min-h-11 items-center text-white/60 transition hover:text-white md:inline-flex"
          >
            The roster
          </a>
          <a
            href="/login?mode=signup"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[#f5b53d]/40 px-4 text-[#ffd47a] transition hover:border-[#f5b53d]/70 hover:bg-[#f5b53d]/10"
          >
            Request access
          </a>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
