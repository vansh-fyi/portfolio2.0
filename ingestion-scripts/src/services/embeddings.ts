import { pipeline, FeatureExtractionPipeline } from '@huggingface/transformers';

// Singleton to hold the pipeline
let embeddingPipeline: FeatureExtractionPipeline | null = null;

/**
 * Get or initialize the embedding pipeline
 */
async function getPipeline() {
    if (!embeddingPipeline) {
        console.log('📥 Loading local embedding model (Xenova/all-MiniLM-L6-v2)...');
        // @ts-ignore - Type definition for pipeline is too complex for TS to resolve
        embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('✅ Model loaded');
    }
    return embeddingPipeline;
}

/**
 * Generate embedding using local HuggingFace Transformers
 * Uses Xenova/all-MiniLM-L6-v2 model (ONNX)
 * Returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    // console.log('📤 Embedding request:', { text: text.substring(0, 50) });

    try {
        const pipe = await getPipeline();

        // Generate embedding
        // pooling: 'mean' is standard for sentence-transformers
        // normalize: true ensures cosine similarity works with dot product logic
        const output = await pipe(text, { pooling: 'mean', normalize: true });

        // Output is a Tensor, we need to convert to plain array
        const embedding = Array.from(output.data);

        // console.log('✅ Embedding success:', { dimensions: embedding.length });
        return embedding as number[];
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