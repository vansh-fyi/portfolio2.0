import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../../_content/projects');

async function getFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

function toTitleCase(str: string) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function addFrontmatter() {
    console.log(`Scanning ${CONTENT_DIR}...`);
    try {
        const files = await getFiles(CONTENT_DIR);

        for (const file of files) {
            if (!file.endsWith('.md')) continue;

            const content = await fs.readFile(file, 'utf-8');
            if (content.startsWith('---')) {
                console.log(`Skipping ${path.basename(file)} (already has frontmatter)`);
                continue;
            }

            const filename = path.basename(file, '.md');
            // Extract projectId: remove 'project_' prefix if present
            const projectId = filename.replace(/^project_/, '');

            // Determine category from parent directory
            const parentDir = path.basename(path.dirname(file));
            let category = 'General';
            if (parentDir === 'branding') category = 'Branding';
            else if (parentDir === 'product_design') category = 'Product Design';
            else if (parentDir === 'industry') category = 'Industry'; // Handle nested industry folder if it exists
            else if (parentDir === 'personal') category = 'Personal';
            else if (parentDir === 'portfolio-website') category = 'Portfolio';

            // Extract title from first H1
            const h1Match = content.match(/^#\s+(.+)$/m);
            let title = h1Match ? h1Match[1].trim() : toTitleCase(projectId);

            // Special case for known projects if needed, or just rely on H1

            const frontmatter = `---
projectId: "${projectId}"
title: "${title}"
category: "${category}"
---

`;

            await fs.writeFile(file, frontmatter + content);
            console.log(`✅ Updated ${filename} (Category: ${category}, ID: ${projectId})`);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

addFrontmatter();
