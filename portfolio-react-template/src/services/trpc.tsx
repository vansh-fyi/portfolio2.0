import React from 'react';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../types/trpc';

// Using placeholder AppRouter type from ../types/trpc.ts
// This will be replaced with the actual router type from the backend project
// once Epic 4 (Backend & Data Infrastructure) is implemented:
// import type { AppRouter } from '../../../backend/src/api/index';

export const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
    }),
  ],
});

export const queryClient = new QueryClient();

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
