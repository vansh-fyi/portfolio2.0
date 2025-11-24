/**
 * Entrypoint for Vercel
 * This file is created to satisfy Vercel's search for src/index.ts
 * and its expectation of a Hono app (due to Project Settings).
 */
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { appRouter } from './api';

const app = new Hono();

app.get('/', (c) => c.text('Backend is running (Hono entrypoint)'));

export default handle(app);
export { appRouter };
