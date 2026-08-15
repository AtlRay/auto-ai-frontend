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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="transition hover:opacity-90">
          <AutoAILogo showFullName />
        </a>

        <nav className="flex items-center gap-6 text-sm">
          <a
            href="#what-zayra-is"
            className="hidden text-white/60 transition hover:text-white sm:inline"
          >
            What Zayra is
          </a>
          <a
            href="#the-roster"
            className="hidden text-white/60 transition hover:text-white sm:inline"
          >
            The roster
          </a>
          <a
            href="#access"
            className="rounded-full border border-[#f5b53d]/40 px-4 py-1.5 text-[#ffd47a] transition hover:border-[#f5b53d]/70 hover:bg-[#f5b53d]/10"
          >
            Request access
          </a>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
