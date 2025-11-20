import fs from 'fs/promises';
import path from 'path';
import { IngestionSource, Document } from './types';

export class MarkdownSource implements IngestionSource {
    name = 'markdown-content';
    private contentDir: string;

    constructor(contentDir: string) {
        this.contentDir = contentDir;
    }

    async fetchDocuments(): Promise<Document[]> {
        const documents: Document[] = [];

        // Process personal content
        const personalDir = path.join(this.contentDir, 'personal');
        try {
            const personalFiles = await fs.readdir(personalDir);
            for (const file of personalFiles) {
                if (file.endsWith('.md')) {
                    const content = await fs.readFile(path.join(personalDir, file), 'utf-8');
                    documents.push({
                        content,
                        metadata: {
                            source_file: file,
                            type: 'personal',
                            project_id: null
                        }
                    });
                }
            }
        } catch (error) {
            console.warn(`Could not read personal content directory: ${personalDir}`, error);
        }

        // Process project content
        const projectsDir = path.join(this.contentDir, 'projects');
        try {
            const projectDirs = await fs.readdir(projectsDir);
            for (const project of projectDirs) {
                const projectPath = path.join(projectsDir, project);
                const stat = await fs.stat(projectPath);

                if (stat.isDirectory()) {
                    const projectFiles = await fs.readdir(projectPath);
                    for (const file of projectFiles) {
                        if (file.endsWith('.md')) {
                            const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
                            documents.push({
                                content,
                                metadata: {
                                    source_file: file,
                                    type: 'project',
                                    project_id: project
                                }
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Could not read projects content directory: ${projectsDir}`, error);
        }

        return documents;
    }
}
