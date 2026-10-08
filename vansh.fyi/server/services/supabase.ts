import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Lazily created clients. They are only built on first use, so importing this module (for example
 * while `next build` collects route modules) never needs the Supabase environment variables.
 */
function lazyClient(create: () => SupabaseClient): SupabaseClient {
    let instance: SupabaseClient | undefined;
    return new Proxy({} as SupabaseClient, {
        get(_target, prop) {
            instance ??= create();
            const value = Reflect.get(instance, prop, instance);
            return typeof value === 'function' ? value.bind(instance) : value;
        },
    });
}

// Regular client for normal operations (subject to RLS)
export const supabase = lazyClient(() => createClient(config.supabase.url, config.supabase.anonKey));

// Admin client for ingestion and admin operations (bypasses RLS)
// Uses service role key if available, falls back to anon key
export const supabaseAdmin = lazyClient(() =>
    createClient(config.supabase.url, config.supabase.serviceRoleKey || config.supabase.anonKey)
);

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