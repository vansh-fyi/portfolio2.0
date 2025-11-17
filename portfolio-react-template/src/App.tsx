import { useEffect } from 'react';
declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      isInitialized?: boolean;
    };
  }
}
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
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
