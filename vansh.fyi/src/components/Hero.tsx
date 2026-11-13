'use client';

import { Calendar, SendHorizontal, Sparkles } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { useViewStore } from '../state/overlayStore';
import ViewProjectsLink from './ViewProjectsLink';
import MeetingButton from './MeetingButton';
import HeroBackground from './HeroBackground';
import { warmChatView } from '../utils/chat-view';

const Hero = () => {
  const { goToChat } = useViewStore();
  const [query, setQuery] = useState('');

  const handleSendQuery = () => {
    if (query.trim()) {
      goToChat(query);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSendQuery();
    }
  };

  return (
    <section className="overflow-hidden h-screen relative" id="hero">
      {/* Decorative grid lines */}
      <div className="pointer-events-none z-10 absolute top-0 right-0 bottom-0 left-0">
        {/* Vertical lines */}
        <div className="absolute inset-y-0 left-[12.5%] w-px bg-gradient-to-b from-transparent to-transparent via-white/10"></div>
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
      <HeroBackground />
      <div className="pointer-events-none" id="wrapper">
        <div className="bg-transparent md:gradient-blur">
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
              <div className="inline-flex [animation:fadeSlideIn_1s_ease-out_0.1s_both] text-xs font-medium font-geist ring-1 rounded-full mb-5 pt-1.5 pr-3 pb-1.5 pl-3 backdrop-blur-sm gap-x-2 gap-y-2 items-center text-white/80 bg-white/10 ring-white/10 pointer-events-none">
                Product Designer
              </div>
              <h1 className="leading-tight sm:text-5xl md:text-5xl lg:text-6xl [animation:fadeSlideIn_1s_ease-out_0.2s_both] text-4xl text-white tracking-tighter font-geist font-light pointer-events-none">
                Creating
                Beyond<span className="block bg-clip-text text-transparent tracking-tighter font-regular bg-gradient-to-r from-purple-500 to-orange-300 pb-1 pointer-events-none">Imagination</span>
              </h1>
              <div className="pt-4">
                <div className="group transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-200 hover-glow focus-within:ring-2 focus-within:ring-white/50 hover:bg-black/30 hover:ring-white/20 bg-black/50 ring-white/10 ring-1 rounded-xl pt-2 pr-2 pb-2 pl-2">
                  <div className="flex gap-2 gap-x-2 gap-y-2 items-center">
                    <div className="hidden sm:flex text-white/80 bg-white/10 w-9 h-9 border-white/10 border rounded-lg items-center justify-center">
                      <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <input
                      onFocus={warmChatView}
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
                      <SendHorizontal className="w-[18px] h-[18px] text-black/80" strokeWidth={1.5} aria-hidden="true" />
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
              <p className="leading-relaxed md:text-lg text-base font-geist text-white/80 pointer-events-none">
                Collaborating and partnering with organisations to design and build solutions that drive measurable growth and competitive advantage.
              </p>
            </div>
            {/* Vertical divider */}
            <div className="hidden lg:block lg:col-span-1 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b -translate-x-1/2 from-white/20 via-white/10 to-white/5"></div>
            </div>
            {/* Column 3: Buttons */}
            <div className="md:col-span-12 lg:col-span-2 relative">
              <div className="flex flex-row lg:flex-col gap-x-3 gap-y-3">
                <ViewProjectsLink />
                <MeetingButton className="inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 bg-white hover:bg-white/80 text-sm font-medium text-black/80 font-geist ring-white/20 ring-1 rounded-full pt-2.5 pr-4 pb-2.5 pl-4">
                  Let&apos;s Connect
                  <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </MeetingButton>
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
