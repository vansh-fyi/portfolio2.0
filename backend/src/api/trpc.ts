import { initTRPC } from '@trpc/server';

/**
 * Shared tRPC instance and request context.
 * Every router must be built from this `t` so context types line up when they are merged.
 */

export interface Context {
    /** Best-effort client IP, used for rate limiting */
    ip?: string;
}

export const t = initTRPC.context<Context>().create();

/** Vercel (and most proxies) put the real client first in x-forwarded-for. */
export function ipFromHeaders(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    return forwarded || headers.get('x-real-ip') || 'unknown';
}

export const createContext = ({ req }: { req: Request }): Context => ({
    ip: ipFromHeaders(req.headers),
});
