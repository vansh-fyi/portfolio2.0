'use client';

import { useState } from 'react';
import { writeThemeCookie } from '@/lib/theme';

/** Minimal toggle for the A1 shell; the real header toggle replaces it in A2. */
export default function ThemeToggle() {
  const [light, setLight] = useState(() =>
    typeof document !== 'undefined' ? document.body.classList.contains('light-mode') : false,
  );

  return (
    <button
      type="button"
      className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20"
      onClick={() => {
        const next = !light;
        document.body.classList.toggle('light-mode', next);
        writeThemeCookie(next ? 'light' : 'dark');
        setLight(next);
      }}
    >
      Switch to {light ? 'dark' : 'light'} mode
    </button>
  );
}
