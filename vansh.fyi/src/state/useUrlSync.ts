'use client';

import { useEffect, useRef } from 'react';
import { searchToState, stateToSearch, useViewStore } from './overlayStore';

/**
 * Keeps the browser URL and history in sync with the view store so that
 * Back/Forward close overlays, refresh restores the view, and views are linkable.
 */
export const useUrlSync = () => {
  const currentView = useViewStore((s) => s.currentView);
  const chatContext = useViewStore((s) => s.chatContext);
  const projectId = useViewStore((s) => s.projectId);

  // The store starts on "main" (SSR-safe); on first mount the URL wins and is applied to the store.
  const hasReadUrl = useRef(false);

  // State -> URL
  useEffect(() => {
    if (!hasReadUrl.current) {
      hasReadUrl.current = true;
      useViewStore.setState({ ...searchToState(window.location.search), initialChatQuery: '' });
      return;
    }
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
