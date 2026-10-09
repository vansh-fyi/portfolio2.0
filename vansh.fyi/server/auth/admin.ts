import { createServerClient } from '@supabase/ssr';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '../services/config';
import { isAdminEmail } from './allow-list';

export { isAdminEmail };

/** The one signed-in user allowed to use /admin. */
export interface AdminUser {
    id: string;
    email: string;
}

/** Supabase Auth client bound to the request's cookies (session lives in httpOnly cookies, never in browser JS). */
export async function createAuthClient() {
    const cookieStore = await cookies();
    return createServerClient(config.supabase.url, config.supabase.anonKey, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (list) => {
                try {
                    for (const { name, value, options } of list) cookieStore.set(name, value, options);
                } catch {
                    // Server Components cannot set cookies; the proxy refreshes the session instead.
                }
            },
        },
    });
}

/**
 * The signed-in admin, or null. `getUser()` validates the session with Supabase Auth on every call;
 * it never trusts the cookie alone. Wrapped in React's per-request `cache`, so the layout and the page
 * of one request share a single round trip to Supabase Auth instead of making one each.
 */
export const getAdminUser = cache(async function getAdminUser(): Promise<AdminUser | null> {
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    if (!isAdminEmail(data.user.email, config.adminEmail)) return null;
    return { id: data.user.id, email: data.user.email! };
});

/** Use at the top of every admin page and server action: redirects to the login page when not the admin. */
export async function requireAdmin(): Promise<AdminUser> {
    const admin = await getAdminUser();
    if (!admin) redirect('/admin/login');
    return admin;
}
