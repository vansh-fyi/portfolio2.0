import React from 'react';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Using placeholder AppRouter type from ../types/trpc.ts
// This will be replaced with the actual router type from the backend project
// once Epic 4 (Backend & Data Infrastructure) is implemented:
// import type { AppRouter } from '../../../backend/src/api/index';

// Type assertion needed because AppRouter is a placeholder until backend exists
// @ts-ignore - Temporary until real backend router is available (Epic 4, Story 4.5)
export const trpc = createTRPCReact();

// Get API URL from environment
const API_URL = typeof window !== 'undefined' && (window as any).ENV_VITE_API_URL
  ? (window as any).ENV_VITE_API_URL
  : 'http://localhost:3000/trpc';

// @ts-ignore - Temporary until real backend router is available
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
});

export const queryClient = new QueryClient();

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Type assertion needed because trpc doesn't have proper types until backend exists
  const TrpcProvider = (trpc as any).Provider;

  return (
    <TrpcProvider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TrpcProvider>
  );
};
