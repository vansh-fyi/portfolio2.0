import { useEffect } from 'react';
import { searchToState, stateToSearch, useViewStore } from './overlayStore';

/**
 * Keeps the browser URL and history in sync with the view store so that
 * Back/Forward close overlays, refresh restores the view, and views are linkable.
 */
export const useUrlSync = () => {
  const currentView = useViewStore((s) => s.currentView);
  const chatContext = useViewStore((s) => s.chatContext);
  const projectId = useViewStore((s) => s.projectId);

  // State -> URL
  useEffect(() => {
    const search = stateToSearch({ currentView, chatContext, projectId });
    if (search !== window.location.search) {
      window.history.pushState(null, '', `${window.location.pathname}${search}`);
    }
  }, [currentView, chatContext, projectId]);

  // URL -> state (Back/Forward)
  useEffect(() => {
    const onPopState = () => {
      useViewStore.setState({
        ...searchToState(window.location.search),
        initialChatQuery: '',
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
};
