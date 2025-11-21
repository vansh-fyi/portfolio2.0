import { pipeline } from '@huggingface/transformers';

let embeddingPipeline: any = null;

/**
 * Generate embedding using local HuggingFace model
 * Uses BAAI/bge-small-en-v1.5 (384 dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Lazy load the pipeline
        if (!embeddingPipeline) {
            console.log('Loading embedding model (first time only)...');
            embeddingPipeline = await pipeline(
                'feature-extraction',
                'Xenova/bge-small-en-v1.5', // Xenova is ONNX-optimized version
                { dtype: 'q8' } // Use 8-bit quantization if supported, or remove options object if causing issues
            );
            console.log('✅ Model loaded');
        }

        // Generate embedding
        const output = await embeddingPipeline(text, {
            pooling: 'mean',
            normalize: true
        });

        // Convert to array
        const embedding = Array.from(output.data) as number[];

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
