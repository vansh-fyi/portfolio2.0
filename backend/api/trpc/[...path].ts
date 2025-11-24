import type { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log('[tRPC] Handler invoked:', req.method, req.url);

    // Set CORS headers on all responses
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        // Import dynamically
        const { fetchRequestHandler } = await import('@trpc/server/adapters/fetch');
        const { appRouter } = await import('../../src/api');

        // Convert Vercel req/res to fetch Request/Response
        const url = `https://${req.headers.host}${req.url}`;
        const fetchReq = new Request(url, {
            method: req.method,
            headers: req.headers as any,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        const response = await fetchRequestHandler({
            endpoint: '/api/trpc',
            req: fetchReq,
            router: appRouter,
            createContext: () => ({}),
        });

        // Convert Response to Vercel res
        const responseBody = await response.text();
        res.status(response.status);
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        res.send(responseBody);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : '';
        console.error('[tRPC] Handler error:', message);
        console.error('[tRPC] Stack:', stack);

        res.status(500).json({
            error: 'Backend initialization failed',
            details: message,
            stack: stack?.split('\n').slice(0, 5).join('\n'),
            hint: 'Check environment variables in Vercel Dashboard'
        });
    }
}
