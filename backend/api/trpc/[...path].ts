import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    try {
        // Lazy import to catch initialization errors
        const { appRouter } = await import('../../src/api');

        return fetchRequestHandler({
            endpoint: '/api/trpc',
            req,
            router: appRouter,
            createContext: () => ({}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('tRPC handler error:', message);

        return new Response(
            JSON.stringify({
                error: 'Backend initialization failed',
                details: message,
                hint: 'Check environment variables in Vercel Dashboard'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
