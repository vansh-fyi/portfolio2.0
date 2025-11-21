/**
 * Generate RAG response using Vercel AI SDK with HuggingFace models
 */
export declare function generateRagResponse(query: string, context: 'personal' | 'project', projectId?: string): Promise<{
    text: string;
    sources: Array<{
        content: string;
        source: string;
        similarity: number;
    }>;
}>;
