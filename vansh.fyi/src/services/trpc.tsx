import React from 'react';
import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import AppRouter type from backend
import type { AppRouter } from '../../../backend/src/api/index';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

// Get API URL from environment
// Temporary fix: Hardcoded to avoid TS1343 in tests (import.meta issue)
const API_URL = 'http://localhost:3000/api/trpc';

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
      staleTime: 0, // Mark stale immediately
      refetchOnWindowFocus: false, // Don't auto-refetch on window focus
      retry: 1, // Only retry once on failure (reduce memory from retry queue)
    },
  },
});

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const TrpcProvider = trpc.Provider;

  return (
    <TrpcProvider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TrpcProvider>
  );
};
