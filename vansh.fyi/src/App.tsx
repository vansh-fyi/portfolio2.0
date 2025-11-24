import { useEffect } from 'react';
import { Element } from 'react-scroll';

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      isInitialized?: boolean;
    };
  }
}
import { useViewStore } from './state/overlayStore';
import { useThemeStore } from './state/themeStore';
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
  const { currentView } = useViewStore();
  const { isLightMode } = useThemeStore();


  // Handle body lock for non-main views
  useEffect(() => {
    if (currentView !== 'main') {
      document.body.classList.add('body-lock');
    } else {
      document.body.classList.remove('body-lock');
    }
  }, [currentView]);

  // Handle theme changes
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // Initialize Unicorn Studio when on main view or theme changes
  useEffect(() => {
    // Only initialize when on main view
    if (currentView !== 'main') return;

    const initUnicornStudio = () => {
      if (!window.UnicornStudio) {
        window.UnicornStudio = { init: () => { }, isInitialized: false };
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = () => {
          if (window.UnicornStudio) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
          }
        };
        script.onerror = () => {
          console.error('Failed to load Unicorn Studio script');
        };
        (document.head || document.body).appendChild(script);
      } else {
        // Re-initialize when theme changes or returning to main view
        if (window.UnicornStudio) {
          window.UnicornStudio.init();
        }
      }
    };

    initUnicornStudio();

    // Cleanup: Remove Unicorn Studio script when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[src*="unicornstudio"]');
      scripts.forEach(script => script.remove());
    };
  }, [currentView, isLightMode]);

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
          <div id="darkBackground" data-us-project="krvLrHX3sj3cg8BHywDj" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className="absolute top-0 left-0 -z-10 w-full h-full invisible md:visible"></div>
        )}
        {isLightMode && (
          <div id="lightBackground" data-us-project="yACzULFKkgXAmEcep6hu" data-us-lazyload="true" data-us-production="true" data-us-scale="0.5" data-us-dpi="1.0" data-us-fps="30" className="absolute top-0 left-0 -z-10 w-full h-full invisible md:visible"></div>
        )}
      </div>
      <Header />

      <div id="hero">
        <Hero />
      </div>
      <Element name="features">
        <Skills />
      </Element>
      <Element name="projects">
        <Projects />
      </Element>
      <Element name="about">
        <About />
      </Element>
      <Element name="testimonials">
        <Testimonials />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
      <Footer />
    </div>
  )
}

export default App
