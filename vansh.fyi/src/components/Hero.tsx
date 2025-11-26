import { useState } from 'react';
import { useViewStore } from '../state/overlayStore';

const Hero = () => {
  const { goToChat } = useViewStore();
  const [query, setQuery] = useState('');

  const handleSendQuery = () => {
    if (query.trim()) {
      goToChat(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSendQuery();
    }
  };

  return (
    <section className="overflow-hidden h-screen relative" id="hero">
      {/* Decorative grid lines */}
      <div className="pointer-events-none z-10 absolute top-0 right-0 bottom-0 left-0">
        {/* Vertical lines */}
        <div className="w-px bg-gradient-to-b from-transparent to-transparent absolute top-0 bottom-0 left-[12.5%] via-white/10"></div>
        <div className="absolute inset-y-0 left-[25%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-y-0 left-[37.5%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-y-0 left-[62.5%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-y-0 left-[75%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-y-0 left-[87.5%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
        {/* Horizontal lines */}
        <div className="absolute inset-x-0 top-[20%] h-px bg-gradient-to-r from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-x-0 top-[40%] h-px bg-gradient-to-r from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-x-0 top-[60%] h-px bg-gradient-to-r from-transparent to-transparent via-white/10"></div>
        <div className="absolute inset-x-0 top-[80%] h-px bg-gradient-to-r from-transparent to-transparent via-white/10"></div>
      </div>
      {/* Background image */}
      <img id="dark-bg-image" src="https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/hero_dark_focus.webp" alt="" className="pointer-events-none transition-opacity duration-500 ease-in-out opacity-40 w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0" />
      <img id="light-bg-image" src="https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/hero_light_focus.webp" alt="" className="pointer-events-none transition-opacity duration-500 ease-in-out opacity-0 w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0" />
      <div className="pointer-events-none" id="wrapper">
        <div className="gradient-blur">
          <div className=""></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {/* Main content */}
      <main className="flex h-screen z-10 pt-20 relative items-end">
        <section className="md:px-8 md:pb-16 lg:pb-20 w-full max-w-7xl mr-auto ml-auto pr-6 pb-16 pl-6">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-6 lg:gap-10 gap-x-8 gap-y-8 items-end">
            {/* Column 1: Tag + Headline */}
            <div className="md:col-span-5 lg:col-span-5 relative">
              <div className="inline-flex [animation:fadeSlideIn_1s_ease-out_0.1s_both] text-xs font-medium font-geist ring-1 rounded-full mb-5 pt-1.5 pr-3 pb-1.5 pl-3 backdrop-blur-sm gap-x-2 gap-y-2 items-center text-white/80 bg-white/10 ring-white/10">
                Product Designer
              </div>
              <h1 className="leading-tight sm:text-5xl md:text-5xl lg:text-6xl [animation:fadeSlideIn_1s_ease-out_0.2s_both] text-4xl text-white tracking-tighter font-geist font-light">
                Creating
                Beyond<span className="block bg-clip-text text-transparent tracking-tighter font-regular bg-gradient-to-r from-purple-500 to-orange-300 pb-1">Imagination</span>
              </h1>
              <div className="pt-4">
                <div className="group transition-all duration-200 hover-glow focus-within:ring-2 focus-within:ring-white/50 hover:bg-black/30 hover:ring-white/20 bg-black/50 ring-white/10 ring-1 rounded-xl pt-2 pr-2 pb-2 pl-2">
                  <div className="flex gap-2 gap-x-2 gap-y-2 items-center">
                    <div className="hidden sm:flex text-white/80 bg-white/10 w-9 h-9 border-white/10 border rounded-lg items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" className=""></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      aria-label="Chat with AI agent"
                      className="focus:outline-none text-sm text-white bg-transparent w-full h-10 pr-3 pl-3"
                      placeholder="Ask anything about me !"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      className="inline-flex transition-colors active:scale-95 w-9 h-9 border rounded-lg items-center justify-center hover:bg-white bg-white/80 border-white/10"
                      aria-label="Send message"
                      onClick={handleSendQuery}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-black/80">
                        <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" className=""></path>
                        <path d="M6 12h16" className=""></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Vertical divider */}
            <div className="hidden md:block md:col-span-1 lg:col-span-1 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b -translate-x-1/2 from-white/20 via-white/10 to-white/10"></div>
            </div>
            {/* Column 2: Description */}
            <div className="md:col-span-4 lg:col-span-3 [animation:fadeSlideIn_1s_ease-out_0.3s_both] relative">
              <p className="leading-relaxed md:text-lg text-base font-geist text-white/80">
                Collaborating and partnering with forward-thinking organisations to design unique user interfaces and AI systems that drive measurable growth and competitive advantage.
              </p>
            </div>
            {/* Vertical divider */}
            <div className="hidden lg:block lg:col-span-1 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b -translate-x-1/2 from-white/20 via-white/10 to-white/5"></div>
            </div>
            {/* Column 3: Buttons */}
            <div className="md:col-span-12 lg:col-span-2 relative">
              <div className="flex flex-row lg:flex-col gap-x-3 gap-y-3">
                <a href="#projects" className="inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 text-sm font-medium font-geist ring-1 rounded-full pt-2.5 pr-4 pb-2.5 pl-4 backdrop-blur-sm hover:bg-white/20 hover:ring-white/30 text-white/80 bg-white/10 ring-white/15">
                  View Projects
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-4 w-4">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 bg-white hover:bg-white/80 text-sm font-medium text-black/80 font-geist ring-white/20 ring-1 rounded-full pt-2.5 pr-4 pb-2.5 pl-4">
                  Let's Connect
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-4 w-4">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Bottom divider */}
        </section>
      </main>
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0"></div>
    </section>
  );
};

export default Hero;
