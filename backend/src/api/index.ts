import { initTRPC } from '@trpc/server';
import { ragRouter } from './rag';
import { emailRouter } from './email';

const t = initTRPC.create();

export const appRouter = t.router({
    rag: ragRouter,
    email: emailRouter,
});

export type AppRouter = typeof appRouter;
