import { chunkMarkdown } from '../../services/kb/chunker';
import { buildPostDocument, describeIndexError } from '../index-post';

const post = {
    title: 'How I design with AI',
    slug: 'how-i-design-with-ai',
    excerpt: 'A short note on pairing with models.',
    tags: ['design', 'ai'],
    published_at: '2026-10-08T12:00:00Z',
    body_md: '## Why\n\nBecause it is faster.\n\n![Diagram of the loop](media:11111111-1111-4111-8111-111111111111)\n\n## How\n\nStart small.',
};

describe('buildPostDocument', () => {
    const doc = buildPostDocument(post);

    it('opens with a lead naming the date and topics, then the excerpt, then the body', () => {
        expect(doc.markdown.startsWith('Blog post by Vansh Grover published in October 2026. Topics: design, ai.')).toBe(true);
        expect(doc.markdown).toContain('A short note on pairing with models.');
        expect(doc.markdown.indexOf('Topics')).toBeLessThan(doc.markdown.indexOf('## Why'));
    });

    it('turns image tokens into readable text and never leaks media ids', () => {
        expect(doc.markdown).toContain('(Image: Diagram of the loop)');
        expect(doc.markdown).not.toContain('media:');
    });

    it('records where the post lives', () => {
        expect(doc.metadata).toMatchObject({ source_type: 'blog', source_file: 'blog/how-i-design-with-ai', slug: 'how-i-design-with-ai', tags: ['design', 'ai'] });
        expect(doc.title).toBe('Blog post: How I design with AI');
    });

    it('produces heading-aware chunks that name the post', () => {
        // Short sections are merged by the chunker on purpose, so use sections of realistic length
        const long = (word: string) => `${word} `.repeat(120).trim();
        const chunks = chunkMarkdown(buildPostDocument({ ...post, body_md: `## Why\n\n${long('because')}\n\n## How\n\n${long('slowly')}` }).markdown, { title: doc.title });
        expect(chunks.length).toBeGreaterThan(0);
        expect(chunks.every((c) => c.headingPath.startsWith('Blog post: How I design with AI'))).toBe(true);
        expect(chunks.some((c) => c.headingPath.endsWith('> How'))).toBe(true); // later sections keep their own heading
        expect(chunks[0].content).toContain('Blog post by Vansh Grover'); // the lead travels with the first chunk
    });

    it('copes with a post that has no excerpt, tags or date', () => {
        const bare = buildPostDocument({ ...post, excerpt: null, tags: [], published_at: null });
        expect(bare.markdown.startsWith('Blog post by Vansh Grover.')).toBe(true);
    });
});

describe('describeIndexError', () => {
    it.each([
        ['embed function failed: 500 {"secret":"x"}', /embedding service/i],
        ['Insert failed for blog/x: permission denied for table kb_chunks', /database rejected/i],
        ['socket hang up', /see the server logs/i],
    ])('turns %j into a short public-safe message', (raw, expected) => {
        const message = describeIndexError(new Error(raw));
        expect(message).toMatch(expected);
        expect(message).not.toMatch(/secret|permission denied|kb_chunks/);
    });
});
