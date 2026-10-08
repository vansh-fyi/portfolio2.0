import { supabase } from '../supabase';
import { embedQuery } from './embed';

export interface KbHit {
    id: string;
    content: string;
    headingPath: string;
    sourceFile: string;
    projectId: string | null;
    similarity: number;
    score: number;
}

export interface KbSearchOptions {
    /** Restrict to one project's chunks */
    projectId?: string;
    /** Restrict to personal or project content */
    sourceType?: 'personal' | 'project';
    limit?: number;
}

/**
 * Hybrid (pgvector + full-text, RRF-merged) search over kb_chunks.
 * Filters are applied inside SQL, so they can't starve the result set.
 */
export async function searchKb(query: string, options: KbSearchOptions = {}): Promise<KbHit[]> {
    const { projectId, sourceType, limit = 8 } = options;
    const embedding = await embedQuery(query);

    const { data, error } = await supabase.rpc('kb_hybrid_search', {
        query_text: query,
        query_embedding: embedding,
        match_count: limit,
        filter_source_type: sourceType ?? null,
        filter_project_id: projectId ?? null,
    });

    if (error) throw new Error(`kb_hybrid_search failed: ${error.message}`);

    return (data ?? []).map((row: any) => ({
        id: row.id,
        content: row.content,
        headingPath: row.heading_path,
        sourceFile: row.source_file,
        projectId: row.project_id,
        similarity: row.similarity,
        score: row.score,
    }));
}
