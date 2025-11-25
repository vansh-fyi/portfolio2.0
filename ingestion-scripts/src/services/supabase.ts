import { createClient } from '@supabase/supabase-js';
import { config } from './config';

if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Supabase URL and Anon Key are required');
}

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

/**
 * Document type definition for documents table
 * Represents a document chunk with its vector embedding and metadata
 */
export interface Document {
    id: string; // UUID
    content: string;
    embedding: number[];
    metadata: {
        source_type: 'personal' | 'project';
        source_file: string;
        projectId?: string;
        chunk_index: number;
        total_chunks?: number;
        [key: string]: any;
    };
    created_at: string;
}

/**
 * Match result type from match_documents RPC function
 */
export interface MatchDocumentResult {
    id: string; // UUID
    content: string;
    metadata: Document['metadata'];
    similarity: number;
}