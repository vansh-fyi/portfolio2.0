import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { MarkdownSource } from '../markdown-source';

describe('MarkdownSource', () => {
    let dir: string;

    const write = async (rel: string, content: string) => {
        const full = path.join(dir, rel);
        await fs.mkdir(path.dirname(full), { recursive: true });
        await fs.writeFile(full, content);
    };

    beforeEach(async () => {
        dir = await fs.mkdtemp(path.join(os.tmpdir(), 'md-source-'));
    });

    afterEach(async () => {
        await fs.rm(dir, { recursive: true, force: true });
    });

    it('reads personal markdown as source_type "personal" with no projectId', async () => {
        await write('personal/bio.md', '# Bio\nSome content');
        await write('personal/notes.txt', 'ignored');

        const docs = await new MarkdownSource(dir).fetchDocuments();

        expect(docs).toHaveLength(1);
        expect(docs[0].content).toContain('Some content');
        expect(docs[0].metadata).toMatchObject({ source_file: 'personal/bio.md', source_type: 'personal' });
        expect(docs[0].metadata.projectId).toBeUndefined();
    });

    it('prefers projectId from frontmatter and spreads other frontmatter into metadata', async () => {
        await write('projects/ai/project_ursa_ai.md', '---\nprojectId: ursa-ai\nrole: Engineer\n---\n# Ursa');

        const [doc] = await new MarkdownSource(dir).fetchDocuments();

        expect(doc.metadata).toMatchObject({
            source_file: 'projects/ai/project_ursa_ai.md',
            source_type: 'project',
            projectId: 'ursa-ai',
            role: 'Engineer',
        });
        expect(doc.content).not.toContain('projectId');
    });

    it('falls back to a projectId derived from a project_<name>.md filename', async () => {
        await write('projects/misc/project_my_thing.md', '# No frontmatter');

        const [doc] = await new MarkdownSource(dir).fetchDocuments();

        expect(doc.metadata.projectId).toBe('my-thing');
    });

    it('recurses into nested folders and skips README.md', async () => {
        await write('projects/a/b/project_deep.md', '# deep');
        await write('projects/README.md', '# readme');

        const docs = await new MarkdownSource(dir).fetchDocuments();

        expect(docs.map((d) => d.metadata.source_file)).toEqual(['projects/a/b/project_deep.md']);
    });

    it('returns an empty list when the content folders do not exist', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        expect(await new MarkdownSource(path.join(dir, 'missing')).fetchDocuments()).toEqual([]);
        jest.restoreAllMocks();
    });
});
