/**
 * RAG Context Filtering Helper
 * Maps context types to metadata filters for vector search
 */
export type ContextType = 'personal' | 'project';
/**
 * Build metadata filter for vector search based on context type
 * @param context - Type of context ('personal' or 'project')
 * @returns Metadata filter for Supabase vector search
 */
export declare function buildContextFilter(context: ContextType): {
    type: string;
};
/**
 * Get context-specific search parameters
 * @param context - Type of context
 * @returns Configuration for context-aware search
 */
export declare function getContextSearchConfig(context: ContextType): {
    filter: {
        type: string;
    };
};
