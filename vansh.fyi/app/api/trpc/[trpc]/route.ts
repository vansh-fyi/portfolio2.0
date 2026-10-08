import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api';
import { createContext } from '@/server/api/trpc';

// Ursa's answer pipeline (embed, search, LLM fallback chain) can take a while on a cold start.
export const maxDuration = 30;

// Same origin as the site, so no CORS is needed.
const handler = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api/trpc', req, router: appRouter, createContext });

export { handler as GET, handler as POST };
