import { chunkMarkdown, embeddingInput, hashChunk } from '../chunker';

describe('chunkMarkdown', () => {
    it('prefixes every chunk with the document title and heading path', () => {
        const md = [
            '# Ursa AI',
            '',
            'x'.repeat(400),
            '',
            '## Architecture',
            '',
            '### Retrieval',
            '',
            'y'.repeat(400),
        ].join('\n');

        const chunks = chunkMarkdown(md, { title: 'Ursa AI' });
        const paths = chunks.map((c) => c.headingPath);

        expect(paths).toContain('Ursa AI');
        expect(paths).toContain('Ursa AI > Architecture > Retrieval');
    });

    it('does not repeat the title when the first heading equals it', () => {
        const chunks = chunkMarkdown(`# Ursa AI\n\n${'a'.repeat(400)}`, { title: 'Ursa AI' });
        expect(chunks[0].headingPath).toBe('Ursa AI');
    });

    it('ignores # lines inside code fences', () => {
        const md = ['## Setup', '', '```bash', '# not a heading', 'npm i', '```', '', 'z'.repeat(400)].join('\n');
        const chunks = chunkMarkdown(md, { title: 'Doc' });
        expect(chunks.map((c) => c.headingPath)).toEqual(['Doc > Setup']);
        expect(chunks[0].content).toContain('# not a heading');
    });

    it('splits oversized sections and keeps every piece under maxChars', () => {
        const paragraph = 'Sentence one is here. Sentence two is here. ';
        const md = `## Big\n\n${Array.from({ length: 80 }, () => paragraph).join('\n\n')}`;
        const chunks = chunkMarkdown(md, { title: 'Doc', maxChars: 500 });

        expect(chunks.length).toBeGreaterThan(1);
        for (const c of chunks) expect(c.content.length).toBeLessThanOrEqual(500);
    });

    it('hard-wraps a single paragraph that exceeds maxChars', () => {
        const md = `## Wall\n\n${'Word. '.repeat(300)}`;
        const chunks = chunkMarkdown(md, { title: 'Doc', maxChars: 400 });
        expect(chunks.length).toBeGreaterThan(1);
        for (const c of chunks) expect(c.content.length).toBeLessThanOrEqual(400);
    });

    it('merges tiny sections instead of emitting one-line chunks', () => {
        const md = ['## A', 'short', '## B', 'also short', '## C', 'c'.repeat(400)].join('\n');
        const chunks = chunkMarkdown(md, { title: 'Doc', minChars: 300 });
        expect(chunks).toHaveLength(1);
        expect(chunks[0].content).toContain('short');
        expect(chunks[0].content).toContain('B');
    });

    it('produces stable hashes and sequential indexes', () => {
        const md = `## A\n\n${'a'.repeat(400)}\n\n## B\n\n${'b'.repeat(400)}`;
        const first = chunkMarkdown(md, { title: 'Doc' });
        const second = chunkMarkdown(md, { title: 'Doc' });

        expect(first.map((c) => c.contentHash)).toEqual(second.map((c) => c.contentHash));
        expect(first.map((c) => c.chunkIndex)).toEqual([0, 1]);
        expect(first[0].contentHash).toBe(hashChunk(first[0].headingPath, first[0].content));
    });

    it('returns no chunks for empty or heading-only input', () => {
        expect(chunkMarkdown('', { title: 'Doc' })).toEqual([]);
        expect(chunkMarkdown('# Only a heading', { title: 'Doc' })).toEqual([]);
    });

    it('embeddingInput puts the heading path before the body', () => {
        expect(embeddingInput({ headingPath: 'Doc > A', content: 'body' })).toBe('Doc > A\n\nbody');
    });
});
