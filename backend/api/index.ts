import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../src/api';

export const config = {
    runtime: 'nodejs',
};

const app = new Hono().basePath('/api');

app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/health', (c) => {
    return c.json({ status: 'OK', environment: 'vercel-edge' }, 200);
});

app.use(
    '/trpc/*',
    trpcServer({
        router: appRouter,
    })
);

export default handle(app);
