const limit = jest.fn();
jest.mock('../../services/supabase', () => ({
    supabase: { from: () => ({ select: () => ({ eq: () => ({ order: () => ({ limit: (...a: unknown[]) => limit(...a) }) }) }) }) },
}));

import { formatBlogOverview, getBlogOverview, resetBlogOverviewCache, type OverviewPost } from '../overview';

const post = (n: number, extra: Partial<OverviewPost> = {}): OverviewPost => ({ slug: `post-${n}`, title: `Post ${n}`, excerpt: null, tags: [], published_at: '2026-10-08T12:00:00Z', ...extra });

describe('formatBlogOverview', () => {
    it('lists title, month, topics, a short summary and the post URL', () => {
        const text = formatBlogOverview([post(1, { tags: ['design', 'ai'], excerpt: 'A note on pairing with models.' })], 'https://example.com');
        expect(text).toBe('- "Post 1" (October 2026), topics: design, ai — A note on pairing with models. https://example.com/blog/post-1');
    });

    it('is empty with no posts, and capped at 12', () => {
        expect(formatBlogOverview([])).toBe('');
        expect(formatBlogOverview(Array.from({ length: 20 }, (_, i) => post(i))).split('\n')).toHaveLength(12);
    });
});

describe('getBlogOverview', () => {
    beforeEach(() => {
        resetBlogOverviewCache();
        limit.mockReset();
    });

    it('queries once, then serves from the cache for a few seconds', async () => {
        limit.mockResolvedValue({ data: [post(1)], error: null });
        const first = await getBlogOverview(1_000);
        const second = await getBlogOverview(10_000);
        expect(second).toBe(first);
        expect(first).toContain('Post 1');
        expect(limit).toHaveBeenCalledTimes(1);
        await getBlogOverview(20_000);
        expect(limit).toHaveBeenCalledTimes(2);
    });

    it('returns an empty string instead of throwing when the database fails', async () => {
        limit.mockResolvedValue({ data: null, error: { message: 'down' } });
        await expect(getBlogOverview(1_000)).resolves.toBe('');
    });

    it('keeps serving the last good list if a refresh fails', async () => {
        limit.mockResolvedValueOnce({ data: [post(1)], error: null });
        await getBlogOverview(1_000);
        limit.mockResolvedValueOnce({ data: null, error: { message: 'down' } });
        expect(await getBlogOverview(100_000)).toContain('Post 1');
    });
});
