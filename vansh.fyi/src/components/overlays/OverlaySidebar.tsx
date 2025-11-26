import React, { useState, useEffect } from 'react';
import { projectCategories, ProjectCategory } from '../../config/projects';

interface OverlaySidebarProps {
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const OverlaySidebar: React.FC<OverlaySidebarProps> = ({
  onProjectSelect,
  selectedProjectId,
  isOpen = false,
  onClose,
  searchQuery = '',
  onClearSearch
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>(projectCategories[0]);

  // Auto-select the category that contains the selected project
  useEffect(() => {
    if (selectedProjectId && !searchQuery) {
      for (const cat of projectCategories) {
        for (const section of cat.sections) {
          if (section.projects.some(p => p.id === selectedProjectId)) {
            setSelectedCategory(cat);
            return;
          }
        }
      }
    }
  }, [selectedProjectId, searchQuery]);

  const handleProjectClick = (projectId: string) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
    if (onClose) {
      onClose();
    }
  };

  // Filter projects based on search query
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const results: { project: any; categoryName: string }[] = [];

    for (const cat of projectCategories) {
      for (const section of cat.sections) {
        for (const project of section.projects) {
          if (
            project.title.toLowerCase().includes(query) ||
            project.subtitle.toLowerCase().includes(query) ||
            project.id.toLowerCase().includes(query) ||
            cat.name.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query)
          ) {
            results.push({ project, categoryName: cat.name });
          }
        }
      }
    }
    return results;
  }, [searchQuery]);

  return (
    <aside className={`${isOpen ? 'absolute inset-0 z-50 bg-black' : 'hidden'} md:block md:static md:col-span-3 lg:col-span-3 min-h-0 h-full border-white/5 border-r`}>
      <div className="flex flex-col h-[81%] pt-6 pr-3 pb-8 pl-4 space-y-6">
        <div>
          <h1 className="text-l font-semibold text-white tracking-tight">
            <div className="relative inline-block">
              {searchQuery ? (
                <button
                  onClick={onClearSearch}
                  className="inline-flex hover:bg-white/10 hover:ring-white/20 cursor-pointer select-none active:scale-95 bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="text-xs lg:text-sm text-white">Clear Search</span>
                </button>
              ) : (
                <details className="relative">
                  <summary
                    className="inline-flex hover:bg-white/10 hover:ring-white/20 cursor-pointer select-none active:scale-95 bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
                    style={{ listStyle: 'none' }}
                  >
                    {selectedCategory.icon}
                    <span className="text-xs lg:text-sm text-white">{selectedCategory.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-[16px] h-[16px]">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </summary>
                  <ul className="absolute left-0 mt-2 min-w-[14rem] backdrop-blur-md rounded-xl bg-black/80 ring-1 ring-white/10 p-1 shadow-xl z-50">
                    {projectCategories.map((category) => (
                      <li key={category.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory(category);
                            // Close details element
                            const details = e.currentTarget.closest('details');
                            if (details) details.removeAttribute('open');
                          }}
                          className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5 text-sm text-white/80 hover:text-white active:scale-95">
                          {category.icon}
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </h1>
        </div>
        <nav className="overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="pr-1 pl-2 space-y-5">
              {searchQuery ? (
                filteredProjects.length > 0 ? (
                  <ul className="space-y-1">
                    <p className="uppercase text-xs text-white/50 tracking-wider mb-2">
                      Search Results
                    </p>
                    {filteredProjects.map(({ project }) => (
                      <li key={project.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProjectClick(project.id);
                          }}
                          className={`group flex items-top gap-2 active:scale-95 text-sm text-white/80 ring-transparent ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 relative ${selectedProjectId === project.id
                            ? 'bg-white/10 ring-white/10'
                            : 'hover:bg-white/5 hover:ring-white/5'
                            }`}
                        >
                          {project.logo}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="lg:text-base text-sm text-white">{project.title}</span>
                              {project.isNDA && (
                                <span title="NDA Protected">🔒</span>
                              )}
                            </div>
                            <span className="lg:text-sm text-xs text-white/50">{project.subtitle}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-white/50 text-center py-4">
                    No results found
                  </div>
                )
              ) : (
                selectedCategory.sections.map((section) => (
                  <ul key={section.title} className="space-y-1">
                    <p className="uppercase text-xs text-white/50 tracking-wider mb-2">
                      {section.title}
                    </p>
                    {section.projects.map((project) => (
                      <li key={project.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProjectClick(project.id);
                          }}
                          className={`group flex items-top gap-2 active:scale-95 text-sm text-white/80 ring-transparent ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 relative ${selectedProjectId === project.id
                            ? 'bg-white/10 ring-white/10'
                            : 'hover:bg-white/5 hover:ring-white/5'
                            }`}
                        >
                          {project.logo}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="lg:text-base text-sm text-white">{project.title}</span>
                              {project.isNDA && (
                                <span title="NDA Protected">🔒</span>
                              )}
                            </div>
                            <span className="lg:text-sm text-xs text-white/50">{project.subtitle}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ))
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="border-white/10 border-t pt-3 pr-2 pl-2">
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
