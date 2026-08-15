import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AtmosphereLayer from '@/components/brand/AtmosphereLayer';
import AskZayraPanel from '@/components/zayra/AskZayraPanel';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Landing from '@/pages/Landing';

/**
 * Only the landing route exists so far. The consolidated route map is still
 * awaiting sign-off — the previous app's ~60 routes are deliberately NOT
 * ported, and pages get added once the map is agreed.
 */
export function App() {
  return (
    <BrowserRouter>
      {/* Shared gold atmosphere sits behind every page. */}
      <AtmosphereLayer />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>

      <AskZayraPanel />
    </BrowserRouter>
  );
}

export default App;
