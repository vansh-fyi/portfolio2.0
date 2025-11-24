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

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'OK' }, 200);
});

// tRPC routes
app.use(
    '/trpc/*',
    trpcServer({
        router: appRouter,
    })
);

export default handle(app);
