import { useEffect } from 'react';
import { scrollToElement, useViewStore } from './state/overlayStore';
import { useUrlSync } from './state/useUrlSync';
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
import ProjectView from './components/overlays/ProjectOverlay';
import ChatView from './components/overlays/ChatOverlay';

function App() {
  const { currentView, pendingSection, clearPendingSection } = useViewStore();
  const { isLightMode } = useThemeStore();

  useUrlSync();
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
