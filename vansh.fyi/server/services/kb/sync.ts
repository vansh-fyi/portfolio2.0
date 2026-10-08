import type { SupabaseClient } from '@supabase/supabase-js';
import { embeddingInput, type KbChunk } from './chunker';

/**
 * Brings the chunks of ONE source file in `kb_chunks` in line with `chunks`, incrementally:
 * chunks whose content hash is new are embedded and inserted, chunks that no longer exist are
 * deleted, unchanged chunks are left alone (so they are not re-embedded). Inserts happen before
 * deletes, so a failure half way never loses data.
 *
 * Shared by the `_content/` ingest script and by blog post indexing.
 */

export const KB_INSERT_BATCH = 50;

export interface SyncSource {
    /** e.g. "projects/ai/ursa.md" or "blog/my-post" */
    sourceFile: string;
    sourceType: 'personal' | 'project' | 'blog';
    projectId?: string | null;
    metadata: Record<string, unknown>;
    chunks: KbChunk[];
}

export type Embedder = (inputs: string[]) => Promise<number[][]>;

export interface SyncResult {
    inserted: number;
    kept: number;
    deleted: number;
}

export async function syncSourceFile(db: SupabaseClient, embed: Embedder, source: SyncSource): Promise<SyncResult> {
    const { data: existingRows, error: readError } = await db.from('kb_chunks').select('id, content_hash').eq('source_file', source.sourceFile);
    if (readError) throw new Error(`Could not read kb_chunks for ${source.sourceFile}: ${readError.message}`);

    const existing = new Map<string, string>((existingRows ?? []).map((r: { id: string; content_hash: string }) => [r.content_hash, r.id]));
    const wanted = new Set(source.chunks.map((c) => c.contentHash));
    const toInsert = source.chunks.filter((c) => !existing.has(c.contentHash));

    for (let i = 0; i < toInsert.length; i += KB_INSERT_BATCH) {
        const batch = toInsert.slice(i, i + KB_INSERT_BATCH);
        const embeddings = await embed(batch.map(embeddingInput));
        const { error } = await db.from('kb_chunks').upsert(
            batch.map((chunk, j) => ({
                source_file: source.sourceFile,
                source_type: source.sourceType,
                project_id: source.projectId ?? null,
                heading_path: chunk.headingPath,
                content: chunk.content,
                content_hash: chunk.contentHash,
                chunk_index: chunk.chunkIndex,
                metadata: source.metadata,
                embedding: embeddings[j],
            })),
            { onConflict: 'source_file,content_hash' },
        );
        if (error) throw new Error(`Insert failed for ${source.sourceFile}: ${error.message}`);
    }

    const staleIds = [...existing.entries()].filter(([hash]) => !wanted.has(hash)).map(([, id]) => id);
    if (staleIds.length > 0) {
        const { error } = await db.from('kb_chunks').delete().in('id', staleIds);
        if (error) throw new Error(`Delete failed for ${source.sourceFile}: ${error.message}`);
    }

    return { inserted: toInsert.length, kept: source.chunks.length - toInsert.length, deleted: staleIds.length };
}

/** Removes every chunk of a source file (an unpublished or deleted post, a deleted markdown file). */
export async function removeSourceFile(db: SupabaseClient, sourceFile: string): Promise<number> {
    const { data, error } = await db.from('kb_chunks').delete().eq('source_file', sourceFile).select('id');
    if (error) throw new Error(`Could not remove ${sourceFile} from the index: ${error.message}`);
    return data?.length ?? 0;
}

/** Prefix of every blog post's `source_file`. The `_content/` ingest must never touch these. */
export const BLOG_SOURCE_PREFIX = 'blog/';
export const blogSourceFile = (slug: string) => `${BLOG_SOURCE_PREFIX}${slug}`;
