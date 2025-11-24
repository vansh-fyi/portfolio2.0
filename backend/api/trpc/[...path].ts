import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../src/api';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => ({}),
    });
}
