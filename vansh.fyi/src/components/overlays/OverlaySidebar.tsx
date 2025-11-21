import React, { useState } from 'react';
import { projects, projectCategories } from '../../config/projects';

interface OverlaySidebarProps {
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

const OverlaySidebar: React.FC<OverlaySidebarProps> = ({
  onProjectSelect,
  selectedProjectId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Product Design');

  const getProjectsByCategory = (category: string) => {
    return projects.filter(p => p.category === category);
  };

  const handleProjectClick = (projectId: string) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
  };

  return (
    <aside className="hidden md:block md:col-span-3 lg:col-span-3 min-h-0 h-full border-white/5 border-r">
      <div className="flex flex-col h-[81%] pt-6 pr-3 pb-8 pl-4 space-y-6">
        <div>
          <h1 className="text-l font-semibold text-white tracking-tight">
            <div className="relative inline-block">
              <details className="relative">
                <summary
                  className="inline-flex hover:bg-white/10 hover:ring-white/20 cursor-pointer select-none active:scale-95 bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
                  style={{ listStyle: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard flex-shrink-0">
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                  </svg>
                  <span className="text-xs lg:text-sm text-white">{selectedCategory}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-[16px] h-[16px]">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </summary>
                <ul className="absolute left-0 mt-2 min-w-[14rem] rounded-xl bg-black/80 ring-1 ring-white/10 backdrop-blur-md p-1 shadow-xl z-50">
                  {projectCategories.map((category) => (
                    <li key={category}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(category);
                        }}
                        className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 text-sm text-white/80 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard flex-shrink-0">
                          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                        </svg>
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </h1>
        </div>
        <nav className="overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="pr-1 pl-2 space-y-5">
              {projectCategories.map((category) => {
                const categoryProjects = getProjectsByCategory(category);
                if (categoryProjects.length === 0) return null;

                return (
                  <ul key={category} className="space-y-1">
                    <p className="uppercase text-xs text-white/50 tracking-wider mb-2">
                      {category}
                    </p>
                    {categoryProjects.map((project) => (
                      <li key={project.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProjectClick(project.id);
                          }}
                          className={`group flex items-top gap-2 active:scale-95 text-sm text-white/80 ring-transparent ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 relative ${selectedProjectId === project.id
                              ? 'bg-white/10 ring-white/10'
                              : 'hover:bg-white/10 hover:ring-white/5'
                            }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[24px] flex-shrink-0" strokeWidth="2">
                            <path d="M10.2241 11.9917H13.7759L13.7593 6.66943C10.9046 6.66943 10.2241 8.79171 10.2241 10.6819V11.9917ZM11.1535 4H20V20H13.7759V14.6611H10.2241V20H4V11.4446C4 6.13886 7.56846 4 11.1535 4Z"></path>
                          </svg>
                          <div className="flex flex-col">
                            <span className="lg:text-base text-sm text-white">{project.title}</span>
                            <span className="lg:text-sm text-xs text-white/50">{project.subtitle}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
      <div className="sm:p-6 border-white/10 border-t pt-4 pr-4 pb-4 pl-4">
        <div className="flex items-center gap-3 rounded-xl bg-black/80 p-3 ring-1 ring-white/10">
          <div className="inline-flex transition active:scale-95 text-white/80 bg-white/10 w-8 h-8 rounded-full ring-white/10 ring-1 items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copyright lucide-train-front lucide-circle-user lucide-user w-[20px] h-[20px] text-white/80 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M14.83 14.83a4 4 0 1 1 0-5.66"></path>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs lg:text-sm font-medium text-white">Vansh Grover, 2025</p>
            <p className="hidden lg:inline text-xs text-white/50">Created by Vansh Grover (and team)</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OverlaySidebar;
