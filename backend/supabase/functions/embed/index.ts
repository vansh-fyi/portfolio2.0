// Supabase Edge Function: text -> 384-dim gte-small embeddings.
// Uses the model built into the Edge runtime, so no third-party API is involved.
//
// Deploy:  supabase functions deploy embed --project-ref <ref>
// Secret:  supabase secrets set EMBED_SECRET=<random string> --project-ref <ref>
//
// Request:  POST { "inputs": ["text", ...] }   (max 16, each truncated by the model at 512 tokens)
// Response: { "embeddings": number[][] }
//
// Auth: the platform's JWT check (anon key) plus a shared secret header, so the
// public anon key alone can't be used to burn this function's compute.

declare const Deno: any;
declare const Supabase: any;

const MAX_INPUTS = 16;
const MAX_CHARS = 4000;

const model = new Supabase.ai.Session('gte-small');

Deno.serve(async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const secret = Deno.env.get('EMBED_SECRET');
    if (!secret || req.headers.get('x-embed-secret') !== secret) {
        return new Response('Unauthorized', { status: 401 });
    }

    let inputs: unknown;
    try {
        ({ inputs } = await req.json());
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    if (
        !Array.isArray(inputs) ||
        inputs.length === 0 ||
        inputs.length > MAX_INPUTS ||
        !inputs.every((s) => typeof s === 'string' && s.length > 0 && s.length <= MAX_CHARS)
    ) {
        return new Response(
            `inputs must be 1-${MAX_INPUTS} non-empty strings of at most ${MAX_CHARS} chars`,
            { status: 400 }
        );
    }

    const embeddings: number[][] = [];
    for (const input of inputs as string[]) {
        const out = await model.run(input, { mean_pool: true, normalize: true });
        embeddings.push(Array.from(out as ArrayLike<number>));
    }

    return Response.json({ embeddings });
});
