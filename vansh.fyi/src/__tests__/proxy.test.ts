/** @jest-environment node */
import { NextRequest } from 'next/server';
import { proxy } from '../../proxy';

// The legacy-redirect path never touches Supabase; the admin guard has its own tests.
jest.mock('@supabase/ssr', () => ({ createServerClient: jest.fn() }));

const run = (search: string) => proxy(new NextRequest(`http://localhost:3000/${search}`));
const locationOf = (res: Response) => res.headers.get('location');

describe('legacy ?view= redirects', () => {
  it.each([
    ['?view=projects&project=aether', 'http://localhost:3000/projects/aether'],
    ['?view=chat&project=aether', 'http://localhost:3000/projects/aether/chat'],
    ['?view=chat', 'http://localhost:3000/chat'],
    ['?view=projects', 'http://localhost:3000/#projects'],
  ])('%s -> %s (permanent, query dropped)', async (search, expected) => {
    const res = await run(search);
    expect(res.status).toBe(308);
    expect(locationOf(res)).toBe(expected);
  });

  it.each(['', '?view=bogus', '?utm_source=x'])('leaves %p alone', async (search) => {
    const res = await run(search);
    expect(res.status).toBe(200);
    expect(locationOf(res)).toBeNull();
  });
});
