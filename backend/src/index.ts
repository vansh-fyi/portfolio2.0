import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from './services/config';

// Config is loaded and validated at import time
// Server will fail to start if required API keys are missing

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'OK' }, 200);
});

console.log(`Server starting on port ${config.port}...`);

serve({
    fetch: app.fetch,
    port: config.port,
});

console.log(`✅ Server running at http://localhost:${config.port}`);
console.log(`Health check available at http://localhost:${config.port}/health`);
