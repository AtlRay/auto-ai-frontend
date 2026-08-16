import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MAIN_ITEMS, MORE_ITEMS, type Destination } from '@/config/destinations';

/**
 * Desktop sidebar — mirrors the live Lovable app's AppSidebar structure and
 * behaviour: 5 primary destinations, a collapsible "More" group of 7, active
 * state matching on exact path or a nested path, and two featured items.
 *
 * Styling follows this app's own atmosphere rather than Lovable's shadcn
 * theme, since the brand shell is a deliberate upgrade.
 */

function isActivePath(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(url + '/');
}

function NavItem({ item, collapsed }: { item: Destination; collapsed: boolean }) {
  const { pathname } = useLocation();
  const active = isActivePath(pathname, item.url);

  return (
    <NavLink
      to={item.url}
      title={collapsed ? `${item.title} — ${item.desc}` : undefined}
      className="group flex min-h-11 items-start gap-3 rounded-lg px-3 py-2.5 transition"
      style={{
        background: active ? 'rgba(245,181,61,0.10)' : 'transparent',
        boxShadow: active ? 'inset 2px 0 0 #f5b53d' : 'none',
      }}
    >
      <span
        aria-hidden="true"
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: active
            ? '#f5b53d'
            : item.featured
              ? 'rgba(95,242,255,0.55)'
              : 'rgba(255,255,255,0.18)',
          boxShadow: active ? '0 0 10px rgba(245,181,61,0.8)' : 'none',
        }}
      />
      {!collapsed && (
        <span className="min-w-0">
          <span
            className="block truncate text-sm font-medium"
            style={{ color: active ? '#ffd47a' : 'rgba(255,255,255,0.82)' }}
          >
            {item.title}
          </span>
          <span className="block truncate text-xs text-white/35">{item.desc}</span>
        </span>
      )}
    </NavLink>
  );
}

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const { pathname } = useLocation();
  const moreHasActive = MORE_ITEMS.some((i) => isActivePath(pathname, i.url));
  const [moreOpen, setMoreOpen] = useState(moreHasActive);

  return (
    <aside
      className="relative z-20 flex shrink-0 flex-col border-r border-white/5 bg-black/40 backdrop-blur-md transition-[width] duration-200"
      style={{ width: collapsed ? '4rem' : '16rem' }}
    >
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {MAIN_ITEMS.map((item) => (
            <li key={item.url}>
              <NavItem item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-xs tracking-[0.14em] text-white/40 uppercase transition hover:text-white/70"
          >
            {!collapsed && <span>More</span>}
            <span aria-hidden="true">{moreOpen ? '−' : '+'}</span>
          </button>

          {moreOpen && (
            <ul className="mt-1 space-y-1">
              {MORE_ITEMS.map((item) => (
                <li key={item.url}>
                  <NavItem item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default AppSidebar;
