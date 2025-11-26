import React, { useState } from 'react';
import { useViewStore } from '../../state/overlayStore';
import Header from '../Header';
import OverlaySidebar from './OverlaySidebar';
import { getAllProjects } from '../../config/projects';

const ProjectView: React.FC = () => {
  const { goToMain, goToProjectChat, projectId, selectProject } = useViewStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use projectId from store, default to first project (aether) if undefined
  const currentProjectId = projectId || 'aether';
  const projects = getAllProjects();
  const selectedProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const handleProjectSelect = (id: string) => {
    selectProject(id);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <Header />
      <div className="pt-[84px] px-6 md:px-20 pb-6">
        <div className="z-10 relative">
          <div className="overflow-hidden h-[calc(100vh-84px-24px)] flex flex-col bg-neutral-900/80 ring-white/20 ring-1 bg-black/30 rounded-2xl shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="flex sm:px-6 border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div onClick={goToMain} className="group flex items-center gap-2">
                  <button
                    className="flex h-3.5 w-3.5 rounded-full text-red-500/10 group-hover:text-red-900 bg-red-500/90 group-hover:bg-red-500 active:bg-red-200 cursor-pointer transition-colors items-center justify-center"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                  <button
                    className="flex h-3.5 w-3.5 rounded-full text-amber-400/10 group-hover:text-amber-900 bg-amber-400/90 group-hover:bg-amber-400 active:bg-amber-200 cursor-pointer transition-colors items-center justify-center"
                    aria-label="Minimise"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/90"></span>
                </div>
                <a href="#" className="group flex items-center gap-2 text-white/80 ring-transparent ring-1 rounded-lg pt-1 pr-4 pb-1 pl-4">
                  <div className="flex">
                    <span className="text-sm text-white/80 font-geist">{selectedProject.title}</span>
                    <span className="hidden lg:inline text-sm text-white/50 font-geist">:{selectedProject.subtitle}</span>
                  </div>
                </a>
              </div>
              <div className="flex gap-2 sm:gap-3 gap-x-2 gap-y-2 items-center">
                <button
                  onClick={() => goToProjectChat(currentProjectId)}
                  className="inline-flex items-center gap-2 transition-colors active:scale-95 text-sm font-medium text-white/80 bg-white/5 hover:bg-white/10 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  </svg>
                  Ask Ursa
                </button>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden inline-flex items-center gap-2 transition-colors active:scale-95 text-sm font-medium text-white/80 bg-white/5 hover:bg-white/10 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <div className="hidden md:flex bg-black/30 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 text-white/50">
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                  </svg>
                  <input
                    placeholder="Search projects..."
                    className="w-48 bg-transparent text-sm focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 flex-1 min-h-0">
              <OverlaySidebar
                onProjectSelect={handleProjectSelect}
                selectedProjectId={currentProjectId}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />

              <section className="col-span-12 md:col-span-9 lg:col-span-9 min-h-0 flex flex-col relative">
                <div className="flex flex-col min-h-0 h-full relative">
                  <div className="flex-1 sm:space-y-6">
                    <iframe
                      key={selectedProject.url}
                      src={selectedProject.url}
                      className="w-full h-full border-0"
                      title={`${selectedProject.title} - ${selectedProject.subtitle}`}
                    ></iframe>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectView);