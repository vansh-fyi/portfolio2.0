import { ragRouter } from './rag';
import { emailRouter } from './email';
import { t } from './trpc';

export const appRouter = t.router({
    rag: ragRouter,
    email: emailRouter,
});

export type AppRouter = typeof appRouter;
