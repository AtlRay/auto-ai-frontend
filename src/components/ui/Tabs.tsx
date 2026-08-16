import { useId, useState, type ReactNode } from 'react';

/**
 * Minimal accessible tab set, standing in for Lovable's CosmicTabs.
 *
 * Keyboard behaviour follows the ARIA tabs pattern: arrow keys move between
 * tabs, Home/End jump to the ends.
 */

export type TabDef = { value: string; label: string; content: ReactNode };

export function Tabs({
  tabs,
  defaultValue,
}: {
  tabs: TabDef[];
  defaultValue?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);
  const base = useId();

  const move = (dir: number) => {
    const i = tabs.findIndex((t) => t.value === active);
    const next = (i + dir + tabs.length) % tabs.length;
    setActive(tabs[next].value);
    document.getElementById(`${base}-tab-${tabs[next].value}`)?.focus();
  };

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Zayra Home sections"
        className="grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1 min-[420px]:grid-cols-3 md:grid-cols-6"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
          if (e.key === 'Home') { e.preventDefault(); setActive(tabs[0].value); }
          if (e.key === 'End') { e.preventDefault(); setActive(tabs[tabs.length - 1].value); }
        }}
      >
        {tabs.map((t) => {
          const selected = t.value === active;
          return (
            <button
              key={t.value}
              id={`${base}-tab-${t.value}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.value)}
              className="min-h-11 rounded-lg px-2 text-sm font-medium transition"
              style={{
                background: selected ? 'rgba(245,181,61,0.12)' : 'transparent',
                color: selected ? '#ffd47a' : 'rgba(255,255,255,0.55)',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.value}
          id={`${base}-panel-${t.value}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.value}`}
          hidden={t.value !== active}
        >
          {t.value === active && t.content}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
