'use client';

import { useLayoutEffect } from 'react';
import { useThemeStore } from '@/src/state/themeStore';
import { writeThemeCookie } from '@/lib/theme';

/**
 * The inline script in layout.tsx puts `light-mode` on <body> before first paint. This adopts that
 * into the store before the browser paints (so React never removes the class) and persists later toggles.
 */
export default function ThemeSync() {
  useLayoutEffect(() => {
    if (document.body.classList.contains('light-mode')) {
      useThemeStore.setState({ isLightMode: true });
    }
    return useThemeStore.subscribe((state, prev) => {
      if (state.isLightMode !== prev.isLightMode) writeThemeCookie(state.isLightMode ? 'light' : 'dark');
    });
  }, []);

  return null;
}
