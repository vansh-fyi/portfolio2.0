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
import { MarkdownSource } from '../services/ingestion/markdown-source';
import { chunkMarkdown, embeddingInput, KbChunk } from '../services/kb/chunker';
import { buildPortfolioMap } from '../services/kb/portfolio-map';

const DRY_RUN = process.argv.includes('--dry-run');
const INSERT_BATCH = 50;

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
    const contentDir = path.resolve(__dirname, '../../../_content');
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
    const mapPath = path.resolve(__dirname, '../services/kb/portfolio-map.generated.json');
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
    const { supabaseAdmin } = await import('../services/supabase');
    const { config } = await import('../services/config');
    const { embedMany } = await import('../services/kb/embed');

    if (!config.supabase.serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required: kb_chunks is write-protected by RLS.');
    }

    const { data: existingRows, error: readError } = await supabaseAdmin
        .from('kb_chunks')
        .select('id, source_file, content_hash');
    if (readError) throw new Error(`Could not read kb_chunks: ${readError.message}`);

    const existingByFile = new Map<string, Map<string, string>>();
    for (const row of existingRows ?? []) {
        if (!existingByFile.has(row.source_file)) existingByFile.set(row.source_file, new Map());
        existingByFile.get(row.source_file)!.set(row.content_hash, row.id);
    }

    let inserted = 0;
    let deleted = 0;
    let kept = 0;

    for (const { doc, sourceFile, chunks } of plan) {
        const existing = existingByFile.get(sourceFile) ?? new Map<string, string>();
        const wanted = new Set(chunks.map((c) => c.contentHash));

        const toInsert: KbChunk[] = chunks.filter((c) => !existing.has(c.contentHash));
        kept += chunks.length - toInsert.length;

        // Embed + insert first, delete stale second: a mid-run failure never loses data
        for (let i = 0; i < toInsert.length; i += INSERT_BATCH) {
            const batch = toInsert.slice(i, i + INSERT_BATCH);
            const embeddings = await embedMany(batch.map(embeddingInput));

            const { error } = await supabaseAdmin.from('kb_chunks').upsert(
                batch.map((chunk, j) => ({
                    source_file: sourceFile,
                    source_type: doc.metadata.source_type,
                    project_id: doc.metadata.projectId ?? null,
                    heading_path: chunk.headingPath,
                    content: chunk.content,
                    content_hash: chunk.contentHash,
                    chunk_index: chunk.chunkIndex,
                    metadata: doc.metadata,
                    embedding: embeddings[j],
                })),
                { onConflict: 'source_file,content_hash' }
            );
            if (error) throw new Error(`Insert failed for ${sourceFile}: ${error.message}`);
            inserted += batch.length;
        }

        const staleIds = [...existing.entries()].filter(([hash]) => !wanted.has(hash)).map(([, id]) => id);
        if (staleIds.length > 0) {
            const { error } = await supabaseAdmin.from('kb_chunks').delete().in('id', staleIds);
            if (error) throw new Error(`Delete failed for ${sourceFile}: ${error.message}`);
            deleted += staleIds.length;
        }
        console.log(`  ${sourceFile}: +${toInsert.length} -${staleIds.length}`);
    }

    // Files that no longer exist in _content
    const currentFiles = new Set(plan.map((p) => p.sourceFile));
    const orphanFiles = [...existingByFile.keys()].filter((f) => !currentFiles.has(f));
    if (orphanFiles.length > 0) {
        const { error } = await supabaseAdmin.from('kb_chunks').delete().in('source_file', orphanFiles);
        if (error) throw new Error(`Orphan cleanup failed: ${error.message}`);
        deleted += orphanFiles.reduce((n, f) => n + existingByFile.get(f)!.size, 0);
        console.log(`🧹 Removed chunks of ${orphanFiles.length} deleted file(s)`);
    }

    console.log(`✅ Done: ${inserted} inserted, ${kept} unchanged, ${deleted} deleted`);
}

main().catch((err) => {
    console.error('❌ Ingestion failed:', err instanceof Error ? err.message : err);
    process.exit(1);
});
