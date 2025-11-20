import { MarkdownSource } from '../markdown-source';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('MarkdownSource', () => {
    const mockContentDir = '/mock/content';
    const source = new MarkdownSource(mockContentDir);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch personal documents', async () => {
        const mockFiles = ['bio.md', 'other.txt'];
        const mockContent = '# Bio\nSome content';

        (fs.readdir as jest.Mock).mockResolvedValueOnce(mockFiles); // personal dir
        (fs.readdir as jest.Mock).mockResolvedValueOnce([]); // projects dir
        (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

        const docs = await source.fetchDocuments();

        expect(fs.readdir).toHaveBeenCalledWith(path.join(mockContentDir, 'personal'));
        expect(docs).toHaveLength(1);
        expect(docs[0]).toEqual({
            content: mockContent,
            metadata: {
                source_file: 'bio.md',
                type: 'personal',
                project_id: null
            }
        });
    });

    it('should fetch project documents', async () => {
        const mockProjects = ['project1'];
        const mockFiles = ['readme.md'];
        const mockContent = '# Project 1';

        (fs.readdir as jest.Mock).mockResolvedValueOnce([]); // personal dir
        (fs.readdir as jest.Mock).mockResolvedValueOnce(mockProjects); // projects dir
        (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });
        (fs.readdir as jest.Mock).mockResolvedValueOnce(mockFiles); // project1 dir
        (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

        const docs = await source.fetchDocuments();

        expect(fs.readdir).toHaveBeenCalledWith(path.join(mockContentDir, 'projects'));
        expect(docs).toHaveLength(1);
        expect(docs[0]).toEqual({
            content: mockContent,
            metadata: {
                source_file: 'readme.md',
                type: 'project',
                project_id: 'project1'
            }
        });
    });
});
