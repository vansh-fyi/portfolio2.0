const About = () => {
  return (
    <section className="pt-24 pb-24 relative" style={{ opacity: 1, transform: 'translateY(0px)' }} id="about">
      <div className="sm:px-6 lg:px-8 max-w-7xl mr-auto ml-auto pt-8 pr-4 pb-8 pl-4">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-8 h-full items-stretch">
          <div className="fade-in-up hover:-translate-y-1 transition-all duration-500 group lg:col-span-5 hover:from-white/12 hover:to-white/10 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg" style={{ transform: 'none', opacity: 1 }}>
            <div className="mb-6">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 rounded-xl overflow-hidden ring-1 mb-4 via-purple-600 to-pink-600 ring-white/10">
                <img src="https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/about_main.webp" alt="Vansh Portrait" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              {/* New content added below the image */}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-[1.05] font-medium tracking-tight mb-4 font-geist text-white">
              About Me
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-white/80">
              <p className="pointer-events-none">
                Hello! I'm Vansh. I'm a Product Designer, but I didn't start here. My journey began in Physics, into the mind boggling stories of the universe and the art of playing with math. I absolutely love the subject to this day but it only did a partial job of defining me. I needed to have a multidisciplinary discipline which defines me. And then, I found design...
              </p>
              <p className="pointer-events-none">
                Today, I specialize in simplifying user-flows, building modern web applications with AI, designing intuitive interfaces, helping out in cross functional settings, communicating design needs and creating interactive experiences that captivate and engage. I believe great design should be accessible, performant, and meaningful.
              </p>
              <p className="pointer-events-none">
                When I'm not working, you'll find me exploring my personal passions. I'm always reading research papers, getting lost in Music, planning my next big travel adventure or just daydreaming. I'm just endlessly curious about how things work... and how to make them work better.
              </p>
            </div>

            <h3 className="text-md md:text-xl leading-[1.05] tracking-tight mt-8 font-geist font-light text-white/80 pointer-events-none">
              "you <span className="tracking-wide font-semibold text-white pointer-events-none">Draw</span> for yourself, you <span className="tracking-wide font-semibold text-white pointer-events-none">Design</span> for others."
            </h3>

            <div className="flex flex-wrap pt-10 pb-2 gap-x-2 gap-y-2">
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Explorer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Wanderer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Daydreamer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Creative</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Artist</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Nyctophile</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Aphant</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Polymath</span>
            </div>
          </div>
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 gap-x-6 gap-y-6">
              {/* Education */}
              <div className="transition-all duration-500 hover:-translate-y-2 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium text-white font-geist mb-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-4 h-4 text-white/80">
                    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" className=""></path>
                    <path d="M22 10v6"></path>
                    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" className=""></path>
                  </svg>
                  Education
                </h3>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Batchelor of Science (Honors), Physics</p>
                    <p className="text-xs text-white/50 pointer-events-none">University of Delhi • 2019</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Master of Design, User Experience Design</p>
                    <p className="text-xs text-white/50 pointer-events-none">DIT University • 2020</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Post Graduate Program in Artificial Intelligence and Machine Learning</p>
                    <p className="text-xs text-white/50 pointer-events-none">Caltech CTME • 2025</p>
                  </div>
                </div>
              </div>
              {/* Interests */}
              <div className="transition-all hover:-translate-y-2 duration-500 bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-4 h-4 text-white/80">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6" className=""></circle>
                  </svg>
                  Certifications
                </h3>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Python for Data Science</p>
                    <p className="text-xs text-white/50 pointer-events-none">IBM • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">CS50's Introduction to Computer Science</p>
                    <p className="text-xs text-white/50 pointer-events-none">HarvardX • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Brand Management: Aligning Business, Brand and Behavior</p>
                    <p className="text-xs text-white/50 pointer-events-none">London Business School • 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 mt-6 gap-x-6 gap-y-6">
              {/* Certifications */}
              <div className="transition-all hover:-translate-y-2 duration-500 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3">
                  {' '}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy w-4 h-4 text-white/80">
                    <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"></path>
                    <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"></path>
                    <path d="M18 9h1.5a1 1 0 0 0 0-5H18" className=""></path>
                    <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" className=""></path>
                    <path d="M6 9H4.5a1 1 0 0 1 0-5H6"></path>
                  </svg>{' '}
                  Recognitions
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Winner-BrandX</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">DST-INSPIRE Scholar</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Runner-Up VibeX Designathon</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Runner-Up Code-Red 4.0 Design-a-thon</span>
                </div>
              </div>
              {/* Achievements */}
              <div className="transition-all hover:-translate-y-2 duration-500 hover:from-white/12 hover:to-white/6 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-[16px] h-[16px] text-white/80">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" className=""></path>
                  </svg>
                  Interests
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">HCI</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">HRI</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Psychology</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Mixed Media Art</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Music</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Poetry</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Reading</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Travel</span>
                </div>
              </div>
            </div>
            <div className="transition-all hover:-translate-y-1 duration-500 grid md:grid-cols-1 flex-grow pt-6 gap-x-6 gap-y-6">
              <img src="https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/about_theme.webp" alt="Vansh Grover" className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;