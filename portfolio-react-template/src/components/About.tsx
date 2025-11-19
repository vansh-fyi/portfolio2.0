const About = () => {
  return (
    <section className="pt-24 pb-24 relative" style={{ opacity: 1, transform: 'translateY(0px)' }} id="about">
      <div className="sm:px-6 lg:px-8 max-w-7xl mr-auto ml-auto pt-8 pr-4 pb-8 pl-4">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-8 h-full items-stretch">
          <div className="fade-in-up transition-all duration-500 cursor-pointer group lg:col-span-5 hover:from-white/12 hover:to-white/10 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg" style={{ transform: 'none', opacity: 1 }}>
            <div className="mb-6">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 rounded-xl overflow-hidden ring-1 mb-4 via-purple-600 to-pink-600 ring-white/10">
                <img src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="Alex Chen Portrait" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              {/* New content added below the image */}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-[1.05] font-medium tracking-tight mb-4 font-geist text-white">
              About Me
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-white/80">
              <p className="">
                Hello! I'm Vansh. I'm a Product Designer with 2.5+ years of experience, but I didn't start here. My journey began in Physics (I still qualify as a physics nerd), but I made the jump to design coz I needed an artistic flair and human stories to go with my numbers and stats.
              </p>
              <p className="">
                Today, I specialize in simplifying overwhelming user-flows, building modern web applications, designing intuitive user interfaces, and creating interactive experiences that captivate and engage users. I believe great design should be accessible, performant, and meaningful.
              </p>
              <p className="">
                When I'm not working, you'll find me exploring my personal passions. I'm always reading papers, getting lost in Music, planning my next big travel adventure or just daydreaming. I'm just endlessly curious about how things work... and how to make them work better.
              </p>
            </div>
            <div className="flex flex-wrap pt-10 pb-10 gap-x-2 gap-y-2">
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Explorer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Wanderer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Daydreamer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Creative</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Artist</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Nyctophile</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Aphant</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2">Polymath</span>
            </div>
          </div>
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 gap-x-6 gap-y-6">
              {/* Education */}
              <div className="transition-all duration-500 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium text-white font-geist mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-4 h-4 text-white/80">
                    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" className=""></path>
                    <path d="M22 10v6"></path>
                    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" className=""></path>
                  </svg>
                  Education
                </h3>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80">Batchelor of Science (Honors), Physics</p>
                    <p className="text-xs text-white/50">University of Delhi • 2019</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80">Master of Design, User Experience Design</p>
                    <p className="text-xs text-white/50">DIT University • 2020</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80">Post Graduate Program in Artificial Intelligence and Machine Learning</p>
                    <p className="text-xs text-white/50">Caltech CTME • 2020</p>
                  </div>
                </div>
              </div>
              {/* Interests */}
              <div className="transition-all duration-500 bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-4 h-4 text-white/80">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6" className=""></circle>
                  </svg>
                  Certifications
                </h3>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80">Python for Data Science</p>
                    <p className="text-xs text-white/50">IBM • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80">CS50's Introduction to Computer Science</p>
                    <p className="text-xs text-white/50">HarvardX • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80">Brand Management: Aligning Business, Brand and Behavior</p>
                    <p className="text-xs text-white/50">London Business School • 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 mt-6 gap-x-6 gap-y-6">
              {/* Certifications */}
              <div className="transition-all duration-500 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
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
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Winner-BrandX</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">DST-INSPIRE Scholar</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Runner-Up VibeX Designathon</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Runner-Up Code Red 4.0 Design-a-thon</span>
                </div>
              </div>
              {/* Achievements */}
              <div className="transition-all duration-500 hover:from-white/12 hover:to-white/6 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-[16px] h-[16px] text-white/80">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" className=""></path>
                  </svg>
                  Interests
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">HCI Research</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Robotics</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Psychology</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Mixed Media Art</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Music</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Poetry</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Reading</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10">Travel</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-1 flex-grow pt-6 gap-x-6 gap-y-6">
              <img src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="Alex Chen Portrait" className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;