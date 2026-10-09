'use client';

import { useViewStore } from '../state/overlayStore';
import { usePortfolio } from '../state/portfolio';
import { FEATURED_CARD_CLASS, firstPlacementId } from '../../lib/portfolio';

const Projects = () => {
  const { selectProject } = useViewStore();
  const portfolio = usePortfolio();
  const featuredProjects = portfolio.featured;

  const handleProjectClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    selectProject(id);
  };

  return (
    <section
      className="scroll-animate lg:py-24 in-view pt-20 pb-20 relative"
      id="projects"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-geist font-light text-white tracking-tighter pointer-events-none">
            Where creativity meets
            <span className="block bg-gradient-to-r bg-clip-text text-transparent font-geist font-light tracking-tighter bg-gradient-to-l from-purple-500 to-orange-300 pointer-events-none">
              Precision
            </span>
          </h2>
          <p className="leading-relaxed text-lg text-white/80 max-w-2xl mr-auto ml-auto pointer-events-none">
            Discover my explorations and creations from my personal and professional blend of mixing data, insights and curiosity.
          </p>
        </div>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 gap-x-6 gap-y-6">
          {featuredProjects.map((project) => (
            <a
              key={project.projectId}
              href={`/projects/${project.placementId}`}
              onClick={handleProjectClick(project.placementId)}
              className={`group block relative overflow-hidden rounded-2xl border ring-1 card-shine hover-glow active:scale-95 border-white/10 ring-white/5 cursor-pointer ${FEATURED_CARD_CLASS[project.layout]}`}>
              <img
                src={project.image}
                alt={project.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300 bg-gradient-to-t via-transparent to-transparent lg:opacity-0 opacity-0 absolute top-0 right-0 bottom-0 left-0 from-black/60 pointer-events-none"></div>
              <div className={`absolute bottom-4 left-4 right-4 ${(project.layout === 'hero') ? 'lg:left-6 lg:right-6 lg:bottom-6 ' : ''}lg:transform lg:translate-y-4 lg:group-hover:translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all duration-300 pointer-events-none`}>
                <div className={`backdrop-blur-xl rounded-xl ring-1 bg-black/30 ring-white/10 ${(project.layout === 'hero') ? 'p-6' : 'p-4'}`}>
                  <h3 className={`text-sm md:text-lg font-semibold text-white pointer-events-none ${(project.layout === 'hero') ? 'mb-2' : 'mb-1'}`}>{project.title}</h3>
                  <p className="text-xs md:text-sm max-w-md text-white/80 pointer-events-none">
                    {project.blurb}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center">
          <button onClick={handleProjectClick(firstPlacementId(portfolio) ?? '')} className="group inline-flex transition-all duration-300 card-shine hover-glow hover:bg-white/10 hover:border-white/30 text-base font-medium text-white/80 bg-black/30 border-white/30 border rounded-2xl pt-4 pr-8 pb-4 pl-8 backdrop-blur-xl gap-x-3 gap-y-3 items-center">
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