import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from './server/auth/allow-list';
import { config as appConfig } from './server/services/config';

/**
 * 1. The Vite site used /?view=projects|chat&project=<id> URLs. They may be shared or indexed, so they
 *    redirect permanently to the real routes. Keep this forever. (A next.config redirect cannot do it:
 *    it keeps the old query string on the destination, which would loop for /?view=projects.)
 * 2. /admin/**: refresh the Supabase session cookies, send anyone who is not the admin to the login
 *    page, and mark everything noindex. This is a convenience layer: every admin page and server
 *    action re-checks with requireAdmin(), so a gap here cannot expose anything.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) return guardAdmin(request);
  return legacyRedirect(request);
}

function legacyRedirect(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const view = searchParams.get('view');
  const project = searchParams.get('project');
  if (view !== 'projects' && view !== 'chat') return NextResponse.next();

  const target = request.nextUrl.clone();
  target.search = '';
  if (view === 'chat') {
    target.pathname = project ? `/projects/${encodeURIComponent(project)}/chat` : '/chat';
  } else if (project) {
    target.pathname = `/projects/${encodeURIComponent(project)}`;
  } else {
    target.pathname = '/';
    target.hash = 'projects';
  }
  return NextResponse.redirect(target, 308);
}

async function guardAdmin(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(appConfig.supabase.url, appConfig.supabase.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(data.user?.email, appConfig.adminEmail);
  const onLogin = request.nextUrl.pathname === '/admin/login';

  let result = response;
  if (!isAdmin && !onLogin) result = redirectTo(request, '/admin/login', response);
  else if (isAdmin && onLogin) result = redirectTo(request, '/admin', response);

  result.headers.set('X-Robots-Tag', 'noindex, nofollow');
  result.headers.set('Cache-Control', 'private, no-store');
  return result;
}

/** A redirect that keeps any session cookies the refresh just set. */
function redirectTo(request: NextRequest, pathname: string, withCookies: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  const redirect = NextResponse.redirect(url);
  for (const cookie of withCookies.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = { matcher: ['/', '/admin/:path*'] };
