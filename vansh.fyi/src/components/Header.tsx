'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../state/themeStore';
import { useViewStore, type SectionId } from '../state/overlayStore';

const Header = () => {
  const { isLightMode, toggleTheme } = useThemeStore();
  const { scrollToSection } = useViewStore();

  // Works from any view: overlays switch back to main first, then scroll
  const goTo = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="z-20 fixed top-0 right-0 left-0">
      <div className="flex max-w-7xl mr-auto ml-auto pt-4 pr-6 pb-4 pl-6 items-center justify-between">
        {/* Left: brand + primary nav */}
        <div className="flex md:gap-x-8 md:pl-2 md:pt-2 md:pr-2 md:pb-2 bg-black/80 ring-white/10 ring-1 rounded-full pt-2 pr-4 pb-2 pl-2 backdrop-blur-sm gap-x-8 gap-y-4 items-center">
          <a href="#hero" onClick={goTo('hero')} className="flex gap-x-2 gap-y-2 items-center cursor-pointer transition-[transform,translate,scale,opacity,background-color,border-color,color] opacity-90">
            {/* White logo for dark mode */}
            {!isLightMode && (
              <span className={`inline-flex items-center justify-center bg-center w-[36px] h-[36px] bg-[url(/images/logo_dark.png)] bg-cover rounded-full ${isLightMode ? 'hidden' : ''}`} id="logo-dark"></span>
            )}
            {/* Black logo for light mode */}
            {isLightMode && (
              <span className={`inline-flex items-center justify-center bg-center w-[36px] h-[36px] bg-[url(/images/logo_light.png)] bg-cover rounded-full ${isLightMode ? '' : 'hidden'}`} id="logo-light"></span>
            )}
            <p className="md:text-xl md:text-white font-medium text-base font-geist text-white/80">
              Vansh
            </p>
          </a>
          <nav className="hidden md:flex gap-2 gap-x-2 gap-y-2 items-center">
            <a href="#features" onClick={goTo('features')} className="inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10 cursor-pointer">Skills</a>
            <a href="#projects" onClick={goTo('projects')} className="inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist rounded-full ring-1 pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10 cursor-pointer">Projects</a>
            <a href="#about" onClick={goTo('about')} className="inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10 cursor-pointer">About Me</a>
            <a href="#testimonials" onClick={goTo('testimonials')} className="inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10 cursor-pointer">Testimonials</a>
          </nav>
        </div>
        {/* Right: contact */}
        <div className="flex xl:pt-2 xl:pl-2 xl:pr-2 xl:pb-2 ring-1 rounded-full pt-2 pr-2 pb-2 pl-2 backdrop-blur-sm gap-x-2 gap-y-2 items-center bg-black/80 ring-white/10">
          <button onClick={handleThemeToggle} className="inline-flex transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 w-9 h-9 rounded-full ring-1 backdrop-blur-sm items-center justify-center hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10" aria-label="Toggle theme" id="themeToggle">
            {/* Moon icon - shows by default in DARK mode */}
            <Moon className={`w-[18px] h-[18px] text-white ${isLightMode ? 'hidden' : ''}`} id="moonIcon" strokeWidth={1.5} aria-hidden="true" />
            {/* Sun icon - shows in LIGHT mode (hidden by default) */}
            <Sun id="sunIcon" className={`w-[18px] h-[18px] ${isLightMode ? '' : 'hidden'}`} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <a href="#contact" onClick={goTo('contact')} className="inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist rounded-full ring-1 pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10 cursor-pointer">Contact Me</a>
        </div>
      </div >
    </header >
  );
};

export default Header;
