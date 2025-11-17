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
import { useOverlayStore } from './state/overlayStore';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectOverlay from './components/overlays/ProjectOverlay';
import ChatOverlay from './components/overlays/ChatOverlay';

function App() {
  const { isProjectOverlayVisible, isChatOverlayVisible, closeProjectOverlay, closeChatOverlay } = useOverlayStore();

  useEffect(() => {
    if (isProjectOverlayVisible || isChatOverlayVisible) {
      document.body.classList.add('body-lock');
    } else {
      document.body.classList.remove('body-lock');
    }
  }, [isProjectOverlayVisible, isChatOverlayVisible]);

  // Then in your useEffect:
  useEffect(() => {
    const initUnicornStudio = () => {
      if (!window.UnicornStudio) {
        window.UnicornStudio = { init: () => { }, isInitialized: false };
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = () => {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init(); // Just call it directly, no .then()
            window.UnicornStudio.isInitialized = true;

            // Make backgrounds visible after initialization
            setTimeout(() => {
              const darkBg = document.getElementById('darkBackground');
              const lightBg = document.getElementById('lightBackground');
              if (darkBg) darkBg.style.opacity = '1';
              if (lightBg) lightBg.style.opacity = '0';
            }, 100);
          }
        };
        script.onerror = () => {
          console.error('Failed to load Unicorn Studio script');
        };
        (document.head || document.body).appendChild(script);
      } else if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;

        setTimeout(() => {
          const darkBg = document.getElementById('darkBackground');
          const lightBg = document.getElementById('lightBackground');
          if (darkBg) darkBg.style.opacity = '1';
          if (lightBg) lightBg.style.opacity = '0';
        }, 100);
      }
    };

    initUnicornStudio();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="aura-background-component fixed -z-10 w-full h-screen top-0">
        <div id="darkBackground" data-us-project="krvLrHX3sj3cg8BHywDj" data-us-lazyload="true" data-us-production="true" data-us-scale="1.0" data-us-dpi="1.0" data-us-fps="30" className="absolute top-0 left-0 -z-10 w-full h-full transition-opacity duration-500 opacity-0"></div>
        <div id="lightBackground" data-us-project="VACzULFkoQAmEcep6hU" data-us-lazyload="true" data-us-production="true" data-us-scale="0.5" data-us-dpi="1.0" data-us-fps="30" className="absolute top-0 left-0 -z-10 w-full h-full transition-opacity duration-500 opacity-0"></div>
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
      <ProjectOverlay isVisible={isProjectOverlayVisible} onClose={closeProjectOverlay} />
      <ChatOverlay isVisible={isChatOverlayVisible} onClose={closeChatOverlay} />
    </div>
  )
}

export default App
