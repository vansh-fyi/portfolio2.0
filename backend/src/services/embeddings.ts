import { huggingface } from '@ai-sdk/huggingface';
import { embed } from 'ai';

/**
 * Generate embedding using HuggingFace's sentence-transformers/all-MiniLM-L6-v2 model
 * Returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const { embedding } = await embed({
            model: huggingface.textEmbeddingModel('sentence-transformers/all-MiniLM-L6-v2'),
            value: text,
        });

        return embedding;
    } catch (error) {
        throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Chunk text into smaller pieces for embedding
 */
export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    const paragraphs = text.split('\n\n');

    for (const paragraph of paragraphs) {
        if ((currentChunk + paragraph).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}
