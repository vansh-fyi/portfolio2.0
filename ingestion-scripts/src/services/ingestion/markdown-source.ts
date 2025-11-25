import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
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
                    const fileContent = await fs.readFile(path.join(personalDir, file), 'utf-8');
                    const { data: frontmatter, content } = matter(fileContent);

                    documents.push({
                        content,
                        metadata: {
                            source_file: `personal/${file}`,
                            source_type: 'personal',
                            projectId: undefined,
                            ...frontmatter // Spread frontmatter into metadata
                        }
                    });
                }
            }
        } catch (error) {
            console.warn(`Could not read personal content directory: ${personalDir}`, error);
        }

        // Process project content recursively
        const projectsDir = path.join(this.contentDir, 'projects');
        await this.processProjectsRecursively(projectsDir, documents);

        return documents;
    }

    private async processProjectsRecursively(dir: string, documents: Document[], relativePath: string = 'projects'): Promise<void> {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativeFilePath = `${relativePath}/${entry.name}`;

                if (entry.isDirectory()) {
                    // Recurse into subdirectories
                    await this.processProjectsRecursively(fullPath, documents, relativeFilePath);
                } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
                    // Read markdown files (skip README)
                    const fileContent = await fs.readFile(fullPath, 'utf-8');
                    const { data: frontmatter, content } = matter(fileContent);

                    // Extract projectId from the filename as fallback (e.g., project_aether.md -> aether)
                    const projectIdMatch = entry.name.match(/^project[_-](.+)\.md$/);
                    const filenameProjectId = projectIdMatch ? projectIdMatch[1].replace(/_/g, '-') : undefined;

                    documents.push({
                        content,
                        metadata: {
                            source_file: relativeFilePath,
                            source_type: 'project',
                            projectId: filenameProjectId, // Fallback from filename
                            ...frontmatter, // Spread frontmatter (will override projectId if present in frontmatter)
                        }
                    });
                }
            }
        } catch (error) {
            console.warn(`Could not read directory: ${dir}`, error);
        }
    }
}
