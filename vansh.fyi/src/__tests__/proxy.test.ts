/** @jest-environment node */
import { NextRequest } from 'next/server';
import { proxy } from '../../proxy';

const run = (search: string) => proxy(new NextRequest(`http://localhost:3000/${search}`));
const locationOf = (res: Response) => res.headers.get('location');

describe('legacy ?view= redirects', () => {
  it.each([
    ['?view=projects&project=aether', 'http://localhost:3000/projects/aether'],
    ['?view=chat&project=aether', 'http://localhost:3000/projects/aether/chat'],
    ['?view=chat', 'http://localhost:3000/chat'],
    ['?view=projects', 'http://localhost:3000/#projects'],
  ])('%s -> %s (permanent, query dropped)', (search, expected) => {
    const res = run(search);
    expect(res.status).toBe(308);
    expect(locationOf(res)).toBe(expected);
  });

  it.each(['', '?view=bogus', '?utm_source=x'])('leaves %p alone', (search) => {
    const res = run(search);
    expect(res.status).toBe(200);
    expect(locationOf(res)).toBeNull();
  });
});
