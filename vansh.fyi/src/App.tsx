'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { scrollToElement, useViewStore } from './state/overlayStore';
import { useThemeStore } from './state/themeStore';
import { useUnicornStudio } from './hooks/useUnicornStudio';
import Header from './components/Header';
import ProjectView from './components/overlays/ProjectOverlay';
import { scheduleWarmup } from './utils/warmup';
import { loadChatView, warmChatView } from './utils/chat-view';

// Keep the lightweight project window ready for the first click. Only chat needs the Markdown stack.
const ChatView = dynamic(loadChatView);

function App({ children }: { children: ReactNode }) {
  const { currentView, projectId, pendingSection, clearPendingSection } = useViewStore();
  const { isLightMode } = useThemeStore();
  const [openedProjectId, setOpenedProjectId] = useState<string | null>(null);

  // Remember only the last opened project, including across personal chat routes.
  if (currentView === 'projects' && openedProjectId !== (projectId ?? '')) {
    setOpenedProjectId(projectId ?? '');
  }

  const showBackground = useUnicornStudio(currentView === 'main', isLightMode);

  // Handle body lock for non-main views
  useEffect(() => {
    document.body.classList.toggle('body-lock', currentView !== 'main');
  }, [currentView]);

  // Scroll to the requested section once the main view is visible again.
  useEffect(() => {
    if (currentView !== 'main' || !pendingSection) return;
    scrollToElement(pendingSection, 'instant');
    clearPendingSection();
  }, [currentView, pendingSection, clearPendingSection]);

  // Warm the overlay chunks once the home page has settled
  useEffect(() => {
    if (currentView !== 'main') return;
    return scheduleWarmup(warmChatView);
  }, [currentView]);

  // Handle theme changes
  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  // Hiding retains image elements and the iframe's loaded document across window switches.
  return (
    <>
      <div hidden={currentView !== 'main'} inert={currentView !== 'main'} className="min-h-screen text-white" style={{ background: 'transparent' }}>
        <div className="aura-background-component bg-black md:bg-transparent fixed -z-10 w-full h-screen top-0">
          {/* Only render the active background - improves performance by stopping animations for hidden background */}
          {!isLightMode && (
            <div id="darkBackground" data-us-project="krvLrHX3sj3cg8BHywDj" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
          )}
          {isLightMode && (
            <div id="lightBackground" data-us-project="yACzULFKkgXAmEcep6hu" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
          )}
        </div>
        <Header />

        {children}
      </div>
      {openedProjectId !== null && (
        <div hidden={currentView !== 'projects'} inert={currentView !== 'projects'}>
          <ProjectView projectId={openedProjectId} active={currentView === 'projects'} />
        </div>
      )}
      {currentView === 'chat' && <ChatView />}
    </>
  )
}

export default App
