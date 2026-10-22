'use client';

import ThemeSync from './theme-sync';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
      {children}
    </>
  );
}
