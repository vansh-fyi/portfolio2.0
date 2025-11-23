import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../src/api';

export const config = {
    runtime: 'nodejs',
};

const app = new Hono();

app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Debug: catch both /api/health and /health to see what Vercel passes
app.get('/api/health', (c) => {
    return c.json({ status: 'OK', path: '/api/health', environment: 'vercel-node' }, 200);
});

app.get('/health', (c) => {
    return c.json({ status: 'OK', path: '/health', environment: 'vercel-node' }, 200);
});

app.use(
    '/api/trpc/*',
    trpcServer({
        router: appRouter,
    })
);

export default handle(app);
