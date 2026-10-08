'use client';

import { TRPCProvider } from '@/src/services/trpc';
import ThemeSync from './theme-sync';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ThemeSync />
      {children}
    </TRPCProvider>
  );
}
