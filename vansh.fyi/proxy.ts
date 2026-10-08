import { NextResponse, type NextRequest } from 'next/server';

/**
 * The Vite site used /?view=projects|chat&project=<id> URLs. They may be shared or indexed, so they
 * redirect permanently to the real routes. Keep this forever. (A next.config redirect cannot do it:
 * it keeps the old query string on the destination, which would loop for /?view=projects.)
 */
export function proxy(request: NextRequest) {
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

export const config = { matcher: '/' };
