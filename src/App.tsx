import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AtmosphereSwitch, { AtmoToggle } from '@/components/brand/AtmosphereSwitch';
import AskZayraPanel from '@/components/zayra/AskZayraPanel';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Landing from '@/pages/Landing';
import Usage from '@/pages/Usage';

/**
 * Only the landing route exists so far. The consolidated route map is still
 * awaiting sign-off — the previous app's ~60 routes are deliberately NOT
 * ported, and pages get added once the map is agreed.
 */
export function App() {
  return (
    <BrowserRouter>
      {/* Locked gold atmosphere by default; `?atmo=candidate` previews the
          exploratory variant. Public pages only. */}
      <AtmosphereSwitch />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            {/* Folds into /dashboard once the route map is signed off. */}
            <Route path="/usage" element={<Usage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>

      <AskZayraPanel />
      <AtmoToggle />
    </BrowserRouter>
  );
}

export default App;
