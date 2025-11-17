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

  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { init: () => { }, isInitialized: true };
      const i = document.createElement("script");
      i.src = "https://cdn.jsdelivr.net/gh/hunicornstudio/unicornstudio.js@1.4.29/dist/UnicornStudio.umd.js";
      onload = function () {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(i);
    } else if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="aura-background-component fixed -z-10 w-full h-screen top-0">
        <div id="darkBackground" data-us-project="krvLRHX3sj3CqBBHyMDj" data-us-lazyload="true" data-us-production="true" data-us-scale="1.0" data-us-dpi="1.0" data-us-fps="30" className="absolute top-0 left-0 -z-10 w-full h-full transition-opacity duration-500 opacity-0"></div>
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
