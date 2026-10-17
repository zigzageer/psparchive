import { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { XMBBackground } from './components/XMBBackground';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { matchPath, scrollToHash, usePath } from './router';
import { ThemeProvider, useTheme } from './theme';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

// Inner pages load on demand; the home page (and its XMB) ships in the main bundle.
const Colors = lazy(() => import('./pages/Colors').then((m) => ({ default: m.Colors })));
const ColorDetail = lazy(() => import('./pages/ColorDetail').then((m) => ({ default: m.ColorDetail })));
const Models = lazy(() => import('./pages/Models').then((m) => ({ default: m.Models })));
const ModelDetail = lazy(() => import('./pages/ModelDetail').then((m) => ({ default: m.ModelDetail })));
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })));
const History = lazy(() => import('./pages/History').then((m) => ({ default: m.History })));
const Games = lazy(() => import('./pages/Games').then((m) => ({ default: m.Games })));
const Firmware = lazy(() => import('./pages/Firmware').then((m) => ({ default: m.Firmware })));
const Homebrew = lazy(() => import('./pages/Homebrew').then((m) => ({ default: m.Homebrew })));
const Guide = lazy(() => import('./pages/Guide').then((m) => ({ default: m.Guide })));

function Loading() {
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="lcd px-5 py-3 flex items-center gap-3">
        <span className="led led-blink" />
        <span className="lcd-text text-xl leading-none">NOW LOADING…</span>
      </div>
    </div>
  );
}

function Routes({ path }: { path: string }) {
  let m: Record<string, string> | null;
  if (path === '/' || path === '') return <Home />;
  if (matchPath('/colors', path)) return <Colors />;
  if ((m = matchPath('/colors/:model/:slug', path))) return <ColorDetail modelId={m.model} slug={m.slug} />;
  if (matchPath('/models', path)) return <Models />;
  if ((m = matchPath('/models/:id', path))) return <ModelDetail id={m.id} />;
  if (matchPath('/compare', path)) return <Compare />;
  if (matchPath('/history', path)) return <History />;
  if (matchPath('/games', path)) return <Games />;
  if (matchPath('/firmware', path)) return <Firmware />;
  if (matchPath('/homebrew', path)) return <Homebrew />;
  if (matchPath('/guide', path)) return <Guide />;
  return <NotFound />;
}

function Shell() {
  const path = usePath();
  const { accent } = useTheme();

  // Initial deep link with #anchor
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash, false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <XMBBackground accent={accent} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] gel gel-sm">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="relative z-10 min-h-screen">
        <Suspense fallback={<Loading />}>
          <Routes key={path} path={path} />
        </Suspense>
      </main>
      <Footer />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
