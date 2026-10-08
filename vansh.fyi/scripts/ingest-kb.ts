/**
 * Incremental ingestion into `kb_chunks` (heading-aware chunks + gte-small embeddings).
 *
 *   npm run ingest-kb               # sync _content/ into Supabase
 *   npm run ingest-kb -- --dry-run  # chunk only: print stats, leave Supabase alone, no credentials needed
 *
 * Unlike the legacy ingest-data.ts this never wipes the table. Per source file it
 * inserts chunks whose content hash is new and deletes chunks that no longer exist,
 * so unchanged content is not re-embedded and a failed run leaves old data intact.
 */
import path from 'path';
import fs from 'fs/promises';
import { MarkdownSource } from '../server/services/ingestion/markdown-source';
import { chunkMarkdown } from '../server/services/kb/chunker';
import { buildPortfolioMap } from '../server/services/kb/portfolio-map';
import { BLOG_SOURCE_PREFIX, syncSourceFile } from '../server/services/kb/sync';

const DRY_RUN = process.argv.includes('--dry-run');

const prettify = (s: string) => s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Root of every heading path. Projects use project_name, else a prettified projectId, so
 * chunks always name their project. Files in a multi-file project (overview.md, challenges.md…)
 * add the file name as a section; personal files are prefixed "About Vansh".
 */
function titleFor(metadata: Record<string, any>, sourceFile: string, siblingCount: number): string {
    const stem = prettify(path.basename(sourceFile, '.md').replace(/^project[_-]/, ''));

    if (metadata.source_type === 'personal') return `About Vansh > ${stem}`;

    const project =
        (typeof metadata.project_name === 'string' && metadata.project_name) ||
        (metadata.projectId ? prettify(metadata.projectId) : stem);
    return siblingCount > 1 ? `${project} > ${stem}` : project;
}

async function main() {
    const contentDir = path.resolve(import.meta.dirname, '../../_content');
    const documents = await new MarkdownSource(contentDir).fetchDocuments();

    if (documents.length === 0) {
        throw new Error(`No markdown documents found in ${contentDir}; refusing to continue.`);
    }

    // Files that belong to the same project (e.g. portfolio-website/*.md)
    const filesPerProject = new Map<string, number>();
    for (const doc of documents) {
        const key = doc.metadata.projectId as string | undefined;
        if (key) filesPerProject.set(key, (filesPerProject.get(key) ?? 0) + 1);
    }

    const plan = documents.map((doc) => {
        const sourceFile = doc.metadata.source_file as string;
        const siblings = filesPerProject.get(doc.metadata.projectId) ?? 1;
        const chunks = chunkMarkdown(doc.content, { title: titleFor(doc.metadata, sourceFile, siblings) });
        return { doc, sourceFile, chunks };
    });

    const totalChunks = plan.reduce((n, p) => n + p.chunks.length, 0);
    const totalChars = plan.reduce((n, p) => n + p.chunks.reduce((m, c) => m + c.content.length, 0), 0);
    console.log(`📄 ${documents.length} documents → ${totalChunks} chunks (~${Math.round(totalChars / 4)} tokens)`);

    // Always-in-prompt overview of every project (committed; bundled with the function)
    const mapPath = path.resolve(import.meta.dirname, '../server/services/kb/portfolio-map.generated.json');
    const portfolioMap = buildPortfolioMap(documents);
    await fs.writeFile(mapPath, JSON.stringify({ map: portfolioMap }, null, 2) + '\n');
    console.log(`🗺️  Portfolio map: ${portfolioMap.length} chars (~${Math.round(portfolioMap.length / 4)} tokens) → ${path.relative(process.cwd(), mapPath)}`);

    if (DRY_RUN) {
        for (const p of plan) {
            console.log(`  ${String(p.chunks.length).padStart(3)}  ${p.sourceFile}  →  ${p.chunks[0]?.headingPath}`);
        }
        const longest = Math.max(...plan.flatMap((p) => p.chunks.map((c) => c.content.length)));
        console.log(`Longest chunk body: ${longest} chars`);
        return;
    }

    // Loaded lazily so --dry-run works without any env vars
    const { supabaseAdmin } = await import('../server/services/supabase');
    const { config } = await import('../server/services/config');
    const { embedMany } = await import('../server/services/kb/embed');

    if (!config.supabase.serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required: kb_chunks is write-protected by RLS.');
    }

    // Blog posts are indexed by the admin (server/blog/index-post.ts) and live in the same table under
    // "blog/<slug>". They are not in _content/, so they must be invisible to the orphan cleanup below.
    const { data: existingRows, error: readError } = await supabaseAdmin
        .from('kb_chunks')
        .select('id, source_file')
        .not('source_file', 'like', `${BLOG_SOURCE_PREFIX}%`);
    if (readError) throw new Error(`Could not read kb_chunks: ${readError.message}`);

    const countByFile = new Map<string, number>();
    for (const row of existingRows ?? []) countByFile.set(row.source_file, (countByFile.get(row.source_file) ?? 0) + 1);

    let inserted = 0;
    let deleted = 0;
    let kept = 0;

    for (const { doc, sourceFile, chunks } of plan) {
        const result = await syncSourceFile(supabaseAdmin, embedMany, {
            sourceFile,
            sourceType: doc.metadata.source_type,
            projectId: doc.metadata.projectId ?? null,
            metadata: doc.metadata,
            chunks,
        });
        inserted += result.inserted;
        kept += result.kept;
        deleted += result.deleted;
        console.log(`  ${sourceFile}: +${result.inserted} -${result.deleted}`);
    }

    // Files that no longer exist in _content
    const currentFiles = new Set(plan.map((p) => p.sourceFile));
    const orphanFiles = [...countByFile.keys()].filter((f) => !currentFiles.has(f));
    if (orphanFiles.length > 0) {
        const { error } = await supabaseAdmin.from('kb_chunks').delete().in('source_file', orphanFiles);
        if (error) throw new Error(`Orphan cleanup failed: ${error.message}`);
        deleted += orphanFiles.reduce((n, f) => n + (countByFile.get(f) ?? 0), 0);
        console.log(`🧹 Removed chunks of ${orphanFiles.length} deleted file(s)`);
    }

    console.log(`✅ Done: ${inserted} inserted, ${kept} unchanged, ${deleted} deleted`);
}

main().catch((err) => {
    console.error('❌ Ingestion failed:', err instanceof Error ? err.message : err);
    process.exit(1);
});
