import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AtmosphereSwitch, { AtmoToggle } from '@/components/brand/AtmosphereSwitch';
import AskZayraPanel from '@/components/zayra/AskZayraPanel';
import WakeZayraOrb from '@/components/zayra/WakeZayraOrb';
import ZayraWakeListener from '@/components/zayra/ZayraWakeListener';
import { ZayraPresenceProvider } from '@/hooks/useZayraPresence';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import AppShell from '@/components/app/AppShell';
import NotPortedYet from '@/pages/app/NotPortedYet';
import ZayraHome from '@/pages/app/ZayraHome';
import FounderEngine from '@/pages/app/FounderEngine';
import { ALL_DESTINATIONS } from '@/config/destinations';
import Landing from '@/pages/Landing';
import Usage from '@/pages/Usage';
import Roster from '@/pages/Roster';

/**
 * Two shells.
 *
 * Public pages keep the marketing layout — site header, hero, footer.
 * Signed-in destinations render inside AppShell, which mirrors the live
 * Lovable app's sidebar + header so the eventual switch is invisible.
 *
 * Destination routes come from the shared registry, so nav and router can
 * never drift apart. Screens are ported in order; until each lands its route
 * renders an honest placeholder rather than mocked content.
 */

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ZayraPresenceProvider>
      {/* Locked gold atmosphere by default; `?atmo=candidate` previews the
          exploratory variant. The hero paints over it by design. */}
      <AtmosphereSwitch />

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />
        <Route
          path="/usage"
          element={
            <PublicLayout>
              <Usage />
            </PublicLayout>
          }
        />
        <Route
          path="/roster"
          element={
            <PublicLayout>
              <Roster />
            </PublicLayout>
          }
        />

        {/* Signed-in destinations, inside the ported app shell. */}
        <Route element={<AppShell />}>
          {/* Zayra Home is the anchor destination and is ported. */}
          <Route path="/empire/*" element={<ZayraHome />} />
          {/* AI Builder — the founder journey. */}
          <Route path="/founder/*" element={<FounderEngine />} />
          {ALL_DESTINATIONS.filter((d) => !['/empire', '/founder'].includes(d.url)).map((d) => (
            <Route key={d.url} path={`${d.url}/*`} element={<NotPortedYet />} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AskZayraPanel />
      <WakeZayraOrb />
      <ZayraWakeListener />
      <AtmoToggle />
      </ZayraPresenceProvider>
    </BrowserRouter>
  );
}

export default App;
