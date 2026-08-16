import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { MAIN_ITEMS } from '@/config/destinations';

/**
 * Authenticated app shell — mirrors Lovable's AppLayout:
 *   desktop → collapsible sidebar + a 3.5rem header
 *   mobile  → content with a bottom navigation bar
 *
 * Three header controls from Lovable (CosmicThemeToggle, VoiceAssistantToggle,
 * AccountBadge) are not ported yet and are deliberately absent rather than
 * stubbed — their behaviour hasn't been read across.
 */

function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-black/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      {MAIN_ITEMS.map((item) => {
        const active = pathname === item.url || pathname.startsWith(item.url + '/');
        return (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 px-1 py-2.5 text-[0.6rem] leading-tight"
            style={{ color: active ? '#ffd47a' : 'rgba(255,255,255,0.45)' }}
          >
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full"
              style={{
                background: active ? '#f5b53d' : 'rgba(255,255,255,0.3)',
                boxShadow: active ? '0 0 8px rgba(245,181,61,0.9)' : 'none',
              }}
            />
            <span className="px-1 text-center">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div data-zayra-layout className="relative z-10 flex min-h-screen w-full">
      <div className="hidden md:flex">
        <AppSidebar collapsed={collapsed} />
      </div>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-white/5 bg-black/40 px-3 backdrop-blur-md sm:px-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-md text-white/50 transition hover:bg-white/10 hover:text-white md:inline-flex"
            >
              ☰
            </button>
            <span className="truncate text-sm font-medium text-white/45">
              <span className="hidden sm:inline">Auto AI Technologies™ · </span>Never Build Alone
            </span>
          </div>

          {/* Inert until the route map is approved — no dead route, no fake
              destination. */}
          <span
            className="hidden shrink-0 cursor-not-allowed text-sm font-medium text-white/25 sm:inline"
            title="Not available yet"
          >
            Watch the Trailer
          </span>
        </header>

        <div className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default AppShell;
