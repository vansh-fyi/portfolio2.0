export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    try {
        // Lazy import everything to catch initialization errors
        const { fetchRequestHandler } = await import('@trpc/server/adapters/fetch');
        const { appRouter } = await import('../../src/api');

        return fetchRequestHandler({
            endpoint: '/api/trpc',
            req,
            router: appRouter,
            createContext: () => ({}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : '';
        console.error('tRPC handler error:', message, stack);

        return new Response(
            JSON.stringify({
                error: 'Backend initialization failed',
                details: message,
                stack: stack?.split('\n').slice(0, 5).join('\n'),
                hint: 'Check environment variables in Vercel Dashboard'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
