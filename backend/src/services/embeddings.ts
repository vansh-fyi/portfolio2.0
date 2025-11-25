import { HfInference } from '@huggingface/inference';
import { config } from './config';

// Initialize HuggingFace Inference client
const hf = new HfInference(config.huggingFaceApiKey);

/**
 * Generate embedding using HuggingFace Inference API
 * Uses sentence-transformers/all-MiniLM-L6-v2
 * Returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Use feature extraction task for embeddings
        const output = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
        });

        // Output can be (number | number[] | number[][])[]
        // For a single string input, it should be number[] (the embedding)
        // or number[][] if it returns [embedding]

        if (Array.isArray(output)) {
            // Check if it's a flat array or nested
            if (output.length > 0 && Array.isArray(output[0])) {
                return output[0] as number[];
            }
            return output as number[];
        }

        throw new Error('Unexpected output format from HuggingFace API');
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

    // Remove YAML frontmatter (--- ... ---)
    const cleanText = text.replace(/^---\n[\s\S]*?\n---\n/, '');

    let currentChunk = '';

    const paragraphs = cleanText.split('\n\n');

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