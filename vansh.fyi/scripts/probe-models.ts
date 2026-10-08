// Calls each candidate model once with a tiny grounded question; prints status + latency.
// Run: npx ts-node src/scripts/probe-models.ts

const SYSTEM = 'Answer using ONLY the context. Context: Vansh Grover is a product designer and AI engineer based in India.';
const QUESTION = 'What does Vansh do? Answer in one sentence.';

type Candidate = { label: string; call: () => Promise<Response> };
const openai = (url: string, key: string | undefined, model: string, extra: object = {}) => () =>
    fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 200, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: QUESTION }], ...extra }),
    });
const gemini = (model: string) => () =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: [{ role: 'user', parts: [{ text: QUESTION }] }],
            generationConfig: { maxOutputTokens: 200 },
        }),
    });

const candidates: Candidate[] = [
    ...['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'].map((m) => ({ label: `gemini/${m}`, call: gemini(m) })),
    ...['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'].map((m) => ({
        label: `groq/${m}`, call: openai('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY, m),
    })),
    ...['google/gemma-4-31b-it:free', 'nvidia/nemotron-3-super-120b-a12b:free'].map((m) => ({
        label: `openrouter/${m}`, call: openai('https://openrouter.ai/api/v1/chat/completions', process.env.OPENROUTER_API_KEY, m),
    })),
];

(async () => {
    for (const c of candidates) {
        const t = Date.now();
        try {
            const res = await c.call();
            const body: any = await res.json().catch(() => ({}));
            const text = body.choices?.[0]?.message?.content ?? body.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
            const err = body.error?.message ?? body.error?.status ?? '';
            console.log(`${String(res.status).padEnd(4)} ${String(Date.now() - t).padStart(5)}ms  ${c.label.padEnd(48)} ${(text || String(err)).replace(/\s+/g, ' ').slice(0, 110)}`);
        } catch (e) {
            console.log(`ERR   ${c.label}  ${(e as Error).message}`);
        }
    }
})();
