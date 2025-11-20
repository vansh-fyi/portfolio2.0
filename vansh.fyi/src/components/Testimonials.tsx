const Testimonials = () => {
  return (
    <section className="scroll-animate lg:py-24 pt-20 pb-20 relative in-view" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="sm:text-4xl lg:text-5xl text-3xl font-light tracking-tighter font-geist text-white mb-6">
            Voice of{' '}
            <span className="block bg-clip-text font-light text-transparent tracking-tighter font-geist bg-gradient-to-l from-purple-500 to-orange-300">
              Creative Minds
            </span>
          </h2>
          <p className="leading-relaxed text-lg text-white/80 max-w-2xl mr-auto ml-auto">
            What my collaborators, clients and students say about working together with me to build delightful and scalable user experiences.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex items-center gap-4 mb-5">
              <img src="https://i.pravatar.cc/80?img=12" alt="Photo of Ava Thompson" className="h-12 w-12 rounded-full ring-2 ring-white/20" />
              <div className="">
                <p className="font-medium text-white/80">Dr. Gregory Dean</p>
                <p className="text-sm text-white/50">CEO, DriQ Health</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">
              "Vansh is a pleasure to work with and approaches all that he does with 100% effort and passion. His efforts have pushed our company forward and we have been very fortunate to work with him."
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex gap-4 mb-5 gap-x-4 gap-y-4 items-center">
              <img src="https://i.pravatar.cc/80?img=22" alt="Photo of Marcus Reed" className="h-12 w-12 rounded-full ring-2 ring-white/20" />
              <div className="">
                <p className="font-medium text-white/80">Varun Goyal</p>
                <p className="text-sm text-white/50">Co-Founder, Partlink Solutions</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">
              "He consistently translated complex workflows into intuitive interfaces and demonstrated a keen eye for detail, accessibility, and user-centric design."
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex items-center gap-4 mb-5">
              <img src="https://i.pravatar.cc/80?img=36" alt="Photo of Lina Park" className="w-12 h-12 rounded-full ring-white/20 ring-2" />
              <div className="">
                <p className="font-medium text-white/80">Narendra Khudania</p>
                <p className="text-sm text-white/50">Product Manager, Synoriq</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">
              "Vansh has a creative approach to problem-solving and a great eye for detail, which made a big difference in the project. He is a team player and always focused on building user-friendly solutions."
            </div>
          </div>
          {/* Testimonial 4 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex items-center gap-4 mb-5">
              <img src="https://i.pravatar.cc/80?img=36" alt="Photo of Lina Park" className="h-12 w-12 rounded-full ring-2 ring-white/20" />
              <div className="">
                <p className="font-medium text-white/80">Shreyas Dutta</p>
                <p className="text-sm text-white/50">Assistant Professor, DIT University</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">
              "He is deeply social, empathetic, and attuned to the needs of those around him, creating an inclusive and inspiring environment."
            </div>
          </div>
          {/* Testimonial 5 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex items-center gap-4 mb-5">
              <img src="https://i.pravatar.cc/80?img=36" alt="Photo of Lina Park" className="h-12 w-12 rounded-full ring-2 ring-white/20" />
              <div className="">
                <p className="font-medium text-white/80">Subrat Rao</p>
                <p className="text-sm text-white/50">Design Student, DIT University</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">"Best teacher I ever had."</div>
          </div>
          {/* Testimonial 6 */}
          <div className="fade-in-up hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/10 hover:ring-white/20 from-white/8 to-white/4 ring-white/10" style={{ transform: 'none', opacity: 1 }}>
            <div className="flex items-center gap-4 mb-5">
              <img src="https://i.pravatar.cc/80?img=36" alt="Photo of Lina Park" className="h-12 w-12 rounded-full ring-2 ring-white/20" />
              <div className="">
                <p className="font-medium text-white/80">Ankit Kumar Vishwakarma</p>
                <p className="text-sm text-white/50">Design Student, DIT University</p>
              </div>
            </div>
            <div className="leading-relaxed text-white/80">
              "My views on the subjects before you taught me was sorta technical, but I learned connecting lessons to actual life and living it everyday after your classes."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;