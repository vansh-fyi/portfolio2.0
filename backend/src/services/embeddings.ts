import { HfInference } from '@huggingface/inference';
import { config } from './config';

// Initialize HuggingFace client at module level to reduce cold start
const hf = new HfInference(config.huggingFaceApiKey);

/**
 * Generate embedding using HuggingFace Inference SDK
 * Uses sentence-transformers/all-MiniLM-L6-v2 model
 * Returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    console.log('📤 Embedding request:', { text: text.substring(0, 50) });

    try {
        // Add 10s timeout for embedding generation
        const embeddingPromise = hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Embedding generation timed out after 10s')), 10000)
        );

        const result = await Promise.race([embeddingPromise, timeoutPromise]);

        // Result can be number[] or number[][] - ensure we return flat array
        const embedding = Array.isArray(result[0]) ? result[0] as number[] : result as number[];
        console.log('✅ Embedding success:', { dimensions: embedding.length });
        return embedding;
    } catch (error) {
        console.error('❌ Embedding error:', error);
        throw error;
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
