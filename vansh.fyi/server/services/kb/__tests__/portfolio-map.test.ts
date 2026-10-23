import { buildPortfolioMap, summarize } from '../portfolio-map';
import { MarkdownSource } from '../../ingestion/markdown-source';
import path from 'path';

describe('always-available career context', () => {
    it('includes the corrected career journey even when retrieval misses personal documents', async () => {
        const documents = await new MarkdownSource(path.resolve(process.cwd(), '../_content')).fetchDocuments();
        const map = buildPortfolioMap(documents);
        const background = map.slice(0, map.indexOf('Projects ('));
        expect(background).toContain('Synoriq in 2021');
        expect(background).toContain('Tapforce LLC since December 2025');
        for (const name of ['App Mechanic', 'DIT University', 'DriQ Health', 'Partlink Solutions']) {
            expect(background).toContain(name);
        }
        expect(map).not.toMatch(/(?:3|three) years of cumulative/i);
        expect(map.length).toBeLessThan(16000);
        expect(map).toContain('[projectId: aether]');
    });

    it('retains complete career paragraphs without expanding ordinary project summaries', () => {
        const paragraph = 'A useful description of a career and the work it involved. '.repeat(8);
        expect(summarize(paragraph).length).toBeLessThanOrEqual(221);
        expect(summarize(paragraph, 900)).toBe(paragraph.trim());
    });
});
