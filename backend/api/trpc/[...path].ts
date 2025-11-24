export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    console.log('[tRPC] Handler invoked:', req.method, req.url);

    try {
        console.log('[tRPC] Importing fetchRequestHandler...');
        const { fetchRequestHandler } = await import('@trpc/server/adapters/fetch');
        console.log('[tRPC] fetchRequestHandler imported');

        console.log('[tRPC] Importing appRouter...');
        const { appRouter } = await import('../../src/api');
        console.log('[tRPC] appRouter imported');

        console.log('[tRPC] Calling fetchRequestHandler...');
        const response = await fetchRequestHandler({
            endpoint: '/api/trpc',
            req,
            router: appRouter,
            createContext: () => ({}),
        });
        console.log('[tRPC] Response generated');
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : '';
        console.error('[tRPC] Handler error:', message);
        console.error('[tRPC] Stack:', stack);

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
