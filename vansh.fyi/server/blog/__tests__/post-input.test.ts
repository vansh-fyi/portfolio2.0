import { normalizeTags, postInputSchema, publishProblems } from '../post-input';

const valid = { title: 'Hello', slug: 'hello', body_md: 'Body text here', tags: [] as string[] };

describe('normalizeTags', () => {
    it('lowercases, hyphenates, de-duplicates and drops junk', () => {
        expect(normalizeTags(' Design , AI Systems,design, ,<b>x</b>')).toEqual(['design', 'ai-systems', 'bxb']);
    });
    it('caps at 8 tags', () => {
        expect(normalizeTags('a,b,c,d,e,f,g,h,i,j')).toHaveLength(8);
    });
});

describe('postInputSchema', () => {
    it('accepts a minimal valid post and fills optional fields with null', () => {
        const parsed = postInputSchema.parse(valid);
        expect(parsed).toMatchObject({ title: 'Hello', slug: 'hello', excerpt: null, seo_title: null, seo_description: null, cover_media_id: null, tags: [] });
    });

    it('turns empty optional strings into null and normalises tags from a comma string', () => {
        const parsed = postInputSchema.parse({ ...valid, excerpt: '   ', tags: 'One, Two' });
        expect(parsed.excerpt).toBeNull();
        expect(parsed.tags).toEqual(['one', 'two']);
    });

    it.each([
        ['empty title', { title: '  ' }],
        ['bad slug', { slug: 'Not A Slug' }],
        ['slug with leading hyphen', { slug: '-nope' }],
        ['slug with double hyphen', { slug: 'a--b' }],
        ['overlong excerpt', { excerpt: 'x'.repeat(301) }],
        ['non-uuid cover', { cover_media_id: 'abc' }],
        ['non-uuid id', { id: 'abc' }],
    ])('rejects %s', (_name, patch) => {
        expect(postInputSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
    });

    it('does not accept a status field from the editor (publishing is a separate action)', () => {
        const parsed = postInputSchema.parse({ ...valid, status: 'published', published_at: '2020-01-01' });
        expect(parsed).not.toHaveProperty('status');
        expect(parsed).not.toHaveProperty('published_at');
    });
});

describe('publishProblems', () => {
    it('is empty for a complete post', () => expect(publishProblems({ title: 'T', slug: 'ok', body_md: 'x'.repeat(30) })).toEqual([]));
    it('lists what is missing', () => expect(publishProblems({ title: ' ', slug: 'Bad Slug', body_md: 'short' })).toHaveLength(3));
});
