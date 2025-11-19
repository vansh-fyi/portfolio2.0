import { useViewStore } from '../state/overlayStore';

const Projects = () => {
  const { goToProjects } = useViewStore();

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goToProjects();
  };

  return (
    <section
      className="scroll-animate lg:py-24 in-view pt-20 pb-20 relative"
      id="projects"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-geist font-light text-white tracking-tighter">
            Where creativity meets
            <span className="block bg-gradient-to-r bg-clip-text text-transparent font-geist font-light tracking-tighter bg-gradient-to-l from-purple-500 to-orange-300">
              Precision
            </span>
          </h2>
          <p className="leading-relaxed text-lg text-white/80 max-w-2xl mr-auto ml-auto">
            Discover my explorations and creations from my personal and professional blend of mixing data, insights and curiosity.
          </p>
        </div>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 gap-x-6 gap-y-6">
          {/* Project 1 */}
          <div
            onClick={handleProjectClick}
            className="group relative overflow-hidden rounded-2xl border ring-1 md:col-span-2 lg:row-span-2 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80"
              alt="Abstract Portrait"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-black/30 ring-white/10 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-xl">
                <h4 className="text-lg font-semibold text-white mb-2">Aether: AI Powered Design System Generator</h4>
                <p className="text-sm max-w-md text-white/80">
                  Generate code components and create your design system for vibe coding tools. Use your moodboard or let AI do everything.
                </p>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div
            onClick={handleProjectClick}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] border ring-1 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80"
              alt="Abstract Art"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="backdrop-blur-xl rounded-xl p-4 ring-1 bg-black/30 ring-white/10">
                <h4 className="font-semibold text-white mb-1">DriQ Health 🔒</h4>
                <p className="text-xs text-white/80">
                  Incontinence Monitoring for Seniors
                </p>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div
            onClick={handleProjectClick}
            className="group overflow-hidden aspect-auto border ring-1 rounded-2xl relative lg:row-span-2 md:row-span-3 xs:row-span-1 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80"
              alt="Surreal Landscape"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="backdrop-blur-xl rounded-xl p-4 ring-1 bg-black/30 ring-white/10">
                <h4 className="font-semibold mb-1 text-white">
                  Sparto
                </h4>
                <p className="text-xs text-white/80">
                  Request based Ecommerce application to sell spare parts.
                </p>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div
            onClick={handleProjectClick}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] border ring-1 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80"
              alt="Futuristic Art"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="backdrop-blur-xl rounded-xl p-4 ring-1 bg-black/30 ring-white/10">
                <h4 className="font-semibold mb-1 text-white">
                  Sparto Admin
                </h4>
                <p className="text-xs text-white/80">
                  Enterprise application for managing Sparto
                </p>
              </div>
            </div>
          </div>

          {/* Project 5 */}
          <div
            onClick={handleProjectClick}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] border ring-1 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80"
              alt="Digital Art"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="backdrop-blur-xl rounded-xl p-4 ring-1 bg-black/30 ring-white/10">
                <h4 className="font-semibold mb-1 text-white">
                  Vibio
                </h4>
                <p className="text-xs text-white/80">
                  Event Platform for Creatives
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button onClick={handleProjectClick} className="group inline-flex transition-all duration-300 card-shine hover-glow hover:bg-white/10 hover:border-white/30 text-base font-medium text-white/80 bg-black/30 border-white/30 border rounded-2xl pt-4 pr-8 pb-4 pl-8 backdrop-blur-xl gap-x-3 gap-y-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <span className="">See All Projects</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;