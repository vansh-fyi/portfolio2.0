import React from 'react';
import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import AppRouter type from backend
import type { AppRouter } from '../../../backend/src/api/index';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window as any).ENV_VITE_API_URL) ||
  'http://localhost:8000/trpc';

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
});

export const queryClient = new QueryClient();

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
