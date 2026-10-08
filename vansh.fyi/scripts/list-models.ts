// Lists models each configured LLM provider currently exposes, to pick/verify allowlist IDs.
// Run: npx tsx --env-file-if-exists=.env.local scripts/list-models.ts

async function get(url: string, headers: Record<string, string> = {}) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.json() as Promise<any>;
}

(async () => {
    try {
        const g = await get(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${process.env.GEMINI_API_KEY}`);
        const names = g.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => m.name.replace('models/', ''))
            .filter((n: string) => /flash|lite/i.test(n));
        console.log('GEMINI:', names.join(', '));
    } catch (e) { console.log('GEMINI error:', (e as Error).message); }

    try {
        const r = await get('https://api.groq.com/openai/v1/models', { Authorization: `Bearer ${process.env.GROQ_API_KEY}` });
        console.log('GROQ:', r.data.map((m: any) => m.id).sort().join(', '));
    } catch (e) { console.log('GROQ error:', (e as Error).message); }

    try {
        const r = await get('https://openrouter.ai/api/v1/models');
        const free = r.data.filter((m: any) => m.id.endsWith(':free')).map((m: any) => `${m.id} (${Math.round(m.context_length / 1000)}k)`);
        console.log('OPENROUTER free:', free.join(', '));
    } catch (e) { console.log('OPENROUTER error:', (e as Error).message); }
})();

export {}; // keep this file a module so its top-level names stay local
