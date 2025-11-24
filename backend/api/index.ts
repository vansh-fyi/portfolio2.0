import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const config = {
    runtime: 'nodejs',
};

const app = new Hono();

app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check - no dependencies, always works
app.get('/api/health', (c) => {
    return c.json({ status: 'OK', path: '/api/health', environment: 'vercel-node' }, 200);
});

app.get('/health', (c) => {
    return c.json({ status: 'OK', path: '/health', environment: 'vercel-node' }, 200);
});

// tRPC routes - lazy load to avoid config validation on health checks
app.all('/api/trpc/*', async (c) => {
    try {
        const { trpcServer } = await import('@hono/trpc-server');
        const { appRouter } = await import('../src/api');

        const middleware = trpcServer({
            router: appRouter,
        });

        return middleware(c, async () => {});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('tRPC initialization error:', message);
        return c.json({
            error: 'Service configuration error',
            details: message
        }, 500);
    }
});

export default handle(app);
