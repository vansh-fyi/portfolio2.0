/**
 * Generate embedding using HuggingFace's sentence-transformers/all-MiniLM-L6-v2 model
 * Returns 384-dimensional vector
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * Chunk text into smaller pieces for embedding
 */
export declare function chunkText(text: string, maxChunkSize?: number): string[];
