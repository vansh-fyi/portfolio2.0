import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface Document {
    content: string;
    metadata: Record<string, any>;
}

async function getFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

/**
 * Load markdown files from content directories
 */
export async function loadMarkdownContent(contentDir: string): Promise<Document[]> {
    const documents: Document[] = [];

    try {
        const files = await getFiles(contentDir);

        for (const filePath of files) {
            if (!filePath.endsWith('.md')) continue;

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            // Get relative path for source_type/file
            const relativePath = path.relative(contentDir, filePath);
            const pathParts = relativePath.split(path.sep);
            const sourceType = pathParts[0]; // e.g., 'projects' or 'personal'

            documents.push({
                content,
                metadata: {
                    source_type: sourceType,
                    source_file: path.basename(filePath),
                    file_path: filePath,
                    ...data // Spread frontmatter into metadata
                }
            });
        }
    } catch (error) {
        console.warn(`Error loading content from ${contentDir}:`, error);
    }

    return documents;
}
