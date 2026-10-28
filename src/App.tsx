import { lazy, Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { PageTransition } from './components/motion/PageTransition';
import { Preloader } from './components/motion/Preloader';
import { CustomCursor } from './components/motion/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { FullscreenMenu } from './components/layout/FullscreenMenu';
import { Footer } from './components/layout/Footer';
import { ContactDrawer } from './components/ui/ContactDrawer';
import { UIProvider, useUI } from './lib/ui';
import { AppRouter } from './lib/router';
import { HERO_IMAGE } from './components/sections/Hero';
import { scheduleRefresh } from './lib/gsap';
import Home from './pages/Home';

// rotas internas carregadas sob demanda (code splitting)
const AreaPage = lazy(() => import('./pages/AreaPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const LegalNoticePage = lazy(() => import('./pages/LegalNoticePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Loading = () => <div className="min-h-[100svh] bg-ink" aria-busy="true" />;

function Shell() {
  const { setReady } = useUI();
  const done = useCallback(() => { setReady(true); scheduleRefresh(50); }, [setReady]);
  return (
    <>
      <a href="#principal" onClick={(e) => { e.preventDefault(); document.getElementById('principal')?.focus(); }} className="sr-only-focusable fixed left-4 top-4 z-[300] bg-paper px-4 py-3 text-sm text-ink">Pular para o conteúdo</a>
      <Preloader onDone={done} heroImage={HERO_IMAGE} />
      <CustomCursor />
      <Navbar />
      <FullscreenMenu />
      <PageTransition
        render={(loc) => (
          <Suspense fallback={<Loading />}>
            <Routes location={loc}>
              <Route path="/" element={<Home />} />
              <Route path="/areas/:slug" element={<AreaPage />} />
              <Route path="/artigos" element={<ArticlesPage />} />
              <Route path="/artigos/:slug" element={<ArticlePage />} />
              <Route path="/equipe/:slug" element={<ProfilePage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/aviso-legal" element={<LegalNoticePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Suspense>
        )}
      />
      <ContactDrawer />
    </>
  );
}

export default function App() {
  return (
    <AppRouter>
      <SmoothScroll>
        <UIProvider>
          <Shell />
        </UIProvider>
      </SmoothScroll>
    </AppRouter>
  );
}
