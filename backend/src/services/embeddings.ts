import { config } from './config';

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
            {
                headers: {
                    Authorization: `Bearer ${config.huggingFaceApiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: text,
                    options: {
                        wait_for_model: true
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // The API returns either a list of floats (for single input) or list of list of floats
        // We are sending single input
        if (Array.isArray(result) && result.length > 0) {
             // Check if it's a nested array (some models return [embedding])
             if (Array.isArray(result[0])) {
                 return result[0];
             }
             return result as number[];
        }
        
        throw new Error('Invalid response format from Hugging Face API');

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
