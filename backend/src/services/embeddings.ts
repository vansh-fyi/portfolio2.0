import { HfInference } from '@huggingface/inference';
import { config } from './config';

// Initialize HuggingFace Inference client
const hf = new HfInference(config.huggingFaceApiKey);

/**
 * Generate embedding using HuggingFace Inference SDK
 * Uses sentence-transformers/all-MiniLM-L6-v2 model
 * Returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    console.log('📤 Embedding request:', { text: text.substring(0, 50) });

    try {
        const result = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
        });

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
