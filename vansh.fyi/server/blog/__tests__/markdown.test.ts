import {
    excerptFrom,
    extractHeadings,
    extractMediaIds,
    mediaIdFromSrc,
    readingMinutes,
    slugify,
    stripMediaTokens,
} from '../markdown';

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';

describe('media tokens', () => {
    const md = `Intro\n\n![First](media:${A})\n\ntext ![](media:${B}) and again ![Dup](media:${A.toUpperCase()}) ![web](https://x.test/a.png)`;

    it('lists unique media ids in order, ignoring ordinary images', () => {
        expect(extractMediaIds(md)).toEqual([A, B]);
    });

    it('replaces tokens with their alt text for indexing', () => {
        const out = stripMediaTokens(md);
        expect(out).toContain('(Image: First)');
        expect(out).not.toContain('media:');
        expect(out).toContain('![web](https://x.test/a.png)');
    });

    it('reads the id from an image src', () => {
        expect(mediaIdFromSrc(`media:${A}`)).toBe(A);
        expect(mediaIdFromSrc('media:not-a-uuid')).toBeNull();
        expect(mediaIdFromSrc('https://x.test/a.png')).toBeNull();
        expect(mediaIdFromSrc(undefined)).toBeNull();
    });
});

describe('readingMinutes', () => {
    it('is at least one minute', () => expect(readingMinutes('short')).toBe(1));
    it('scales with length', () => expect(readingMinutes('word '.repeat(660))).toBe(3));
});

describe('extractHeadings', () => {
    it('returns h2/h3 with github-style ids and de-duplicates', () => {
        const md = '# Title\n\n## Why it works\n\n### Details\n\n## Why it works\n\n#### Too deep';
        expect(extractHeadings(md)).toEqual([
            { depth: 2, text: 'Why it works', id: 'why-it-works' },
            { depth: 3, text: 'Details', id: 'details' },
            { depth: 2, text: 'Why it works', id: 'why-it-works-1' },
        ]);
    });

    it('ignores headings inside code fences and strips inline formatting', () => {
        const md = '## **Bold** and `code` and [link](https://x.test)\n\n```md\n## not a heading\n```\n\n## After';
        const headings = extractHeadings(md);
        expect(headings.map((h) => h.text)).toEqual(['Bold and code and link', 'After']);
        expect(headings[0].id).toBe('bold-and-code-and-link');
    });
});

describe('excerptFrom', () => {
    it('drops headings, code and markup, and truncates on a word boundary', () => {
        const md = `# Title\n\nSome **bold** text with a [link](https://x.test).\n\n\`\`\`js\nconst x = 1;\n\`\`\`\n\n${'word '.repeat(80)}`;
        const out = excerptFrom(md, 60);
        expect(out.startsWith('Some bold text with a link.')).toBe(true);
        expect(out.endsWith('…')).toBe(true);
        expect(out.length).toBeLessThanOrEqual(61);
    });
});

describe('slugify', () => {
    it.each([
        ['Hello, World!', 'hello-world'],
        ['  Café & Crème  ', 'cafe-and-creme'],
        ['--Already--slugged--', 'already-slugged'],
        ['日本語', ''],
    ])('%j -> %j', (input, expected) => expect(slugify(input)).toBe(expected));
});
