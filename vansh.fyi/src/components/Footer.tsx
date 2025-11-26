import { useThemeStore } from '../state/themeStore';

const Footer = () => {
  const { isLightMode } = useThemeStore();

  return (
    <footer className="border-t pt-10 pb-10 border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 gap-x-4 gap-y-4 items-center justify-between">
          <div className="flex gap-3 gap-x-3 gap-y-3 items-center">
            {/* White logo for dark mode */}
            {!isLightMode && (
              <span className="inline-flex items-center justify-center bg-center w-8 h-8 bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_dark.png)] bg-cover rounded-full" id="logo-dark-footer"></span>
            )}
            {/* Black logo for light mode */}
            {isLightMode && (
              <span className="inline-flex items-center justify-center bg-center w-8 h-8 bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_light.png)] bg-cover rounded-full" id="logo-light-footer"></span>
            )}
            <span className="font-medium text-white/80">Vansh.fyi</span>
          </div>
          <div className="flex gap-4 text-sm gap-x-2 gap-y-4 items-center">
            <a href="https://www.linkedin.com/in/vansh-fyi/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition active:scale-95 hover:bg-white/10 hover:ring-white/20 text-sm font-medium text-white/80 font-geist bg-white/5 ring-white/10 ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" className=""></path>
                <rect width="4" height="12" x="2" y="9" rx="1" className=""></rect>
                <circle cx="4" cy="4" r="2" className=""></circle>
              </svg>
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a href="https://github.com/vansh-fyi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition active:scale-95 hover:bg-white/10 hover:ring-white/20 text-sm font-medium text-white/80 font-geist bg-white/5 ring-white/10 ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M15 22v-4a4.7 4.7 0 0 0-1-3.5c3 0 6-2 6-5.5a6.9 6.9 0 0 0-.9-3.4 8.2 8.2 0 0 0 0-3.4s-1 0-3 1.4a10.38 10.38 0 0 0-8 0C6.1 2 5.1 2 5.1 2a8.2 8.2 0 0 0 0 3.4 6.9 6.9 0 0 0-.9 3.4c0 3.5 3 5.5 6 5.5a4.7 4.7 0 0 0-1 3.5v4" className=""></path>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a href="https://www.vansh.fyi/blogs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/5 ring-white/10" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="">
                <path d="M2 6h4"></path>
                <path d="M2 10h4"></path>
                <path d="M2 14h4"></path>
                <path d="M2 18h4"></path>
                <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                <path d="M9.5 8h5"></path>
                <path d="M9.5 12H16"></path>
                <path d="M9.5 16H14"></path>
              </svg>
              <span className="hidden sm:inline">Blog</span>
            </a>
          </div>
        </div>
        <div className="md:text-left text-sm text-center mt-6 text-white/50">© Vansh Grover · All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;