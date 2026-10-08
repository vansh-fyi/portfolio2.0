'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { scrollToElement, useViewStore } from './state/overlayStore';
import { useThemeStore } from './state/themeStore';
import { useUnicornStudio } from './hooks/useUnicornStudio';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

// The overlay views (and the Markdown stack behind the chat) are not needed to paint the home page,
// so they are separate chunks; they are fetched when idle so opening one still feels instant.
const loadProjectView = () => import('./components/overlays/ProjectOverlay');
const loadChatView = () => import('./components/overlays/ChatOverlay');
const ProjectView = dynamic(loadProjectView);
const ChatView = dynamic(loadChatView);

function App() {
  const { currentView, pendingSection, clearPendingSection } = useViewStore();
  const { isLightMode } = useThemeStore();

  const showBackground = useUnicornStudio(currentView === 'main', isLightMode);

  // Handle body lock for non-main views
  useEffect(() => {
    document.body.classList.toggle('body-lock', currentView !== 'main');
  }, [currentView]);

  // Scroll to the requested section once the main view has mounted (e.g. after leaving an overlay).
  // Instant, because the page was just swapped in and a long animated scroll would feel broken.
  useEffect(() => {
    if (currentView !== 'main' || !pendingSection) return;
    scrollToElement(pendingSection, 'instant');
    clearPendingSection();
  }, [currentView, pendingSection, clearPendingSection]);

  // Warm the overlay chunks once the home page has settled
  useEffect(() => {
    if (currentView !== 'main') return;
    const warm = () => {
      loadProjectView();
      loadChatView();
    };
    // requestIdleCallback is missing in Safari, hence the optional typing and the timeout fallback
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(warm, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(warm, 2000);
    return () => window.clearTimeout(timer);
  }, [currentView]);

  // Handle theme changes
  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  // Render different views based on currentView
  if (currentView === 'projects') {
    return <ProjectView />;
  }

  if (currentView === 'chat') {
    return <ChatView />;
  }

  // Default: main portfolio view
  return (
    <div className="min-h-screen text-white" style={{ background: 'transparent' }}>
      <div className="aura-background-component bg-black md:bg-transparent fixed -z-10 w-full h-screen top-0">
        {/* Only render the active background - improves performance by stopping animations for hidden background */}
        {!isLightMode && (
          <div id="darkBackground" data-us-project="krvLrHX3sj3cg8BHywDj" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
        )}
        {isLightMode && (
          <div id="lightBackground" data-us-project="yACzULFKkgXAmEcep6hu" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
        )}
      </div>
      <Header />

      <Hero />
      <Skills />
      <Projects />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
