import { config } from '../config';

/**
 * Embeddings via the `embed` Supabase Edge Function (built-in gte-small, 384-dim).
 * Used for both ingestion and query-time embedding so vectors always match.
 */

const BATCH_SIZE = 8;
const EMBEDDING_DIMENSIONS = 384;

async function callEmbed(inputs: string[]): Promise<number[][]> {
    if (!config.embedSecret) {
        throw new Error('EMBED_SECRET is not set (needed to call the embed edge function)');
    }

    const res = await fetch(`${config.supabase.url}/functions/v1/embed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.supabase.anonKey}`,
            'x-embed-secret': config.embedSecret,
        },
        body: JSON.stringify({ inputs }),
    });

    if (!res.ok) {
        throw new Error(`embed function failed: ${res.status} ${await res.text()}`);
    }

    const { embeddings } = (await res.json()) as { embeddings: number[][] };
    if (
        !Array.isArray(embeddings) ||
        embeddings.length !== inputs.length ||
        embeddings.some((e) => e.length !== EMBEDDING_DIMENSIONS)
    ) {
        throw new Error(`embed function returned unexpected shape (expected ${EMBEDDING_DIMENSIONS}-dim vectors)`);
    }
    return embeddings;
}

export async function embedQuery(text: string): Promise<number[]> {
    const [embedding] = await callEmbed([text]);
    return embedding;
}

export async function embedMany(texts: string[]): Promise<number[][]> {
    const out: number[][] = [];
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        out.push(...(await callEmbed(texts.slice(i, i + BATCH_SIZE))));
    }
    return out;
}
