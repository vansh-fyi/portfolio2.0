import { pipeline } from '@huggingface/transformers';

// Lazy-load the embedding pipeline
let embeddingPipeline: any = null;

async function getEmbeddingPipeline() {
    if (!embeddingPipeline) {
        console.log('Loading local embedding model (bge-small-en-v1.5)...');
        embeddingPipeline = await pipeline(
            'feature-extraction',
            'Xenova/bge-small-en-v1.5'
        );
        console.log('✅ Embedding model loaded successfully');
    }
    return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const extractor = await getEmbeddingPipeline();

        // Generate embedding
        const output = await extractor(text, { pooling: 'mean', normalize: true });

        // Convert to plain array
        return Array.from(output.data);
    } catch (error: any) {
        throw new Error(`Failed to generate embedding: ${error.message}`);
    }
}

export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    // Simple splitting by paragraphs first
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
