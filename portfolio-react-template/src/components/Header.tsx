const Header = () => {
  return (
    <header className="z-20 fixed top-0 right-0 left-0">
      <div className="flex max-w-7xl mr-auto ml-auto pt-4 pr-6 pb-4 pl-6 items-center justify-between">
        {/* Left: brand + primary nav */}
        <div className="flex md:gap-x-8 md:pl-2 md:pt-2 md:pr-2 md:pb-2 bg-black/80 ring-white/10 ring-1 rounded-full pt-2 pr-2 pb-2 pl-2 backdrop-blur-sm gap-x-8 gap-y-4 items-center">
          <a href="#hero" className="flex gap-x-2 gap-y-2 items-center cursor-pointer transition opacity-90">
            <span className="inline-flex items-center justify-center bg-center w-[36px] h-[36px] bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_dark.png)] bg-cover rounded-full" id="logo-dark"></span>
            <span className="inline-flex items-center justify-center bg-center hidden w-[36px] h-[36px] bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_light.png)] bg-cover rounded-full" id="logo-light"></span>
            <p className="md:text-xl md:text-white font-medium text-base font-geist text-white/80">
              Vansh
            </p>
          </a>
          <nav className="hidden md:flex gap-2 gap-x-2 gap-y-2 items-center">
            <a href="#features" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10">Skills</a>
            <a href="#projects" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist rounded-full ring-1 pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10">Projects</a>
            <a href="#about" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10">About Me</a>
            <a href="#testimonials" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10">Testimonials</a>
          </nav>
        </div>
        {/* Right: contact */}
        <div className="flex xl:pt-2 xl:pl-2 xl:pr-2 xl:pb-2 ring-1 rounded-full pt-2 pr-2 pb-2 pl-2 backdrop-blur-sm gap-x-2 gap-y-2 items-center bg-black/80 ring-white/10">
          <button className="inline-flex transition active:scale-95 w-9 h-9 rounded-full ring-1 backdrop-blur-sm items-center justify-center hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10" aria-label="Toggle theme" id="themeToggle">
            {/* Moon icon - shows by default in DARK mode */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" id="moonIcon" style={{ color: 'rgb(255, 255, 255)', width: '18px', height: '18px' }}>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className=""></path>
            </svg>
            {/* Sun icon - shows in LIGHT mode (hidden by default) */}
            <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] hidden">
              <circle cx="12" cy="12" r="4" className=""></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41" className=""></path>
            </svg>
          </button>
          <a href="#contact" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist rounded-full ring-1 pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10">Contact Me</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
