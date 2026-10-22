jest.mock('../../services/supabase', () => ({ supabase: { from: jest.fn() } }));
import { supabase } from '../../services/supabase';
import { getChatProjectLinks, linkProjectMention } from '../chat-links';

describe('project mentions', () => {
    const links = [{ projectId: 'aether', title: 'Aether', url: 'https://www.vansh.fyi/projects/aether-ai' }];
    it('links the first known project mention once without altering the answer', () => {
        expect(linkProjectMention('Aether creates tokens. Aether exports components.', links))
            .toBe('[Aether](https://www.vansh.fyi/projects/aether-ai) creates tokens. Aether exports components.');
    });
    it('preserves existing links, code and unrelated words', () => {
        for (const text of ['[Aether](https://www.vansh.fyi/projects/aether-ai)', '[Aether](https://example.com)', '`Aether`', 'Aetherial designs', 'https://example.com/Aether']) {
            expect(linkProjectMention(text, links)).toBe(text);
        }
    });
});

describe('published chat project links', () => {
    const signal = new AbortController().signal;
    function query(result: unknown) {
        const q = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), order: jest.fn().mockReturnThis(), abortSignal: jest.fn().mockResolvedValue(result) };
        (supabase.from as jest.Mock).mockReturnValue(q);
        return q;
    }

    it('links placement IDs, deduplicates projects and only requests published rows', async () => {
        const q = query({ data: [
            { id: 'design-aether', project_id: 'aether', projects: { title: 'Aether' } },
            { id: 'ai-aether', project_id: 'aether', projects: { title: 'Aether' } },
            { id: 'ai-ursa', project_id: 'ursa', projects: { title: 'Ursa' } },
        ] });
        expect(await getChatProjectLinks(signal)).toEqual([
            { projectId: 'aether', title: 'Aether', url: 'https://www.vansh.fyi/projects/design-aether' },
            { projectId: 'ursa', title: 'Ursa', url: 'https://www.vansh.fyi/projects/ai-ursa' },
        ]);
        expect(q.eq).toHaveBeenCalledWith('projects.status', 'published');
        expect(q.abortSignal).toHaveBeenCalledWith(signal);
    });

    it('omits optional links on a database error and still honors cancellation', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        query({ data: null, error: { message: 'unavailable' } });
        expect(await getChatProjectLinks(signal)).toEqual([]);
        const controller = new AbortController();
        controller.abort();
        await expect(getChatProjectLinks(controller.signal)).rejects.toThrow();
        warn.mockRestore();
    });
});
