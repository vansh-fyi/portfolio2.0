'use client';

import React from 'react';
import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// The router lives in this same app, so its types are an ordinary import
import type { AppRouter } from '../../server/api';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

// Same origin as the site; NEXT_PUBLIC_API_URL only exists to point a local frontend at another server
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/trpc';

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
