import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { config } from './services/config';
import { appRouter } from './api';

// Config is loaded and validated at import time
// Server will fail to start if required API keys are missing

// Initialize Hono app
const app = new Hono();

// Enable CORS
app.use('/*', cors({
    origin: '*', // Allow all origins for now (or configure specific domains)
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'OK' }, 200);
});

// Mount TRPC router
app.use(
    '/trpc/*',
    trpcServer({
        router: appRouter,
    })
);

console.log(`Server starting on port ${config.port}...`);

serve({
    fetch: app.fetch,
    port: config.port,
});

console.log(`✅ Server running at http://localhost:${config.port}`);
console.log(`Health check available at http://localhost:${config.port}/health`);
console.log(`TRPC endpoint available at http://localhost:${config.port}/trpc`);
