import goldenCases from '../../../evals/golden.json';
import { callProvider, getProviderChain, LlmProvider } from '../llm/chain';
import { evaluateAnswer, GoldenCase } from './evaluate';

/**
 * Daily health checks for Ursa. Free tiers change without notice (models get retired, quotas shrink,
 * projects pause), so this probes the real paths and reports before visitors notice:
 *
 *   providers  – tiny live completion against every configured LLM in the chain
 *   billing    – OpenRouter models in the chain must still be priced $0
 *   embeddings – the embed edge function returns a 384-dim vector
 *   database   – kb_chunks is populated; extra tables (e.g. blogs) get a keep-alive query
 *   blog-index – Ursa knows every published post and NOTHING from drafts or deleted posts
 *   answers    – the "smoke" golden questions still produce correct answers end to end
 */

export type Severity = 'ok' | 'degraded' | 'critical';

export interface CheckResult {
    name: string;
    status: Severity;
    detail: string;
}

export interface HealthReport {
    status: Severity;
    checkedAt: string;
    checks: CheckResult[];
}

const RANK: Record<Severity, number> = { ok: 0, degraded: 1, critical: 2 };
export const worst = (statuses: Severity[]): Severity =>
    statuses.reduce<Severity>((acc, s) => (RANK[s] > RANK[acc] ? s : acc), 'ok');

const MIN_KB_CHUNKS = 100;
const PROBE_TIMEOUT_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 200);

// ---------------------------------------------------------------- providers

export interface ProviderProbe {
    id: string;
    ok: boolean;
    reason?: string;
}

/** Pure: turns raw probe results (in chain order) into a status. */
export function judgeProviders(probes: ProviderProbe[]): CheckResult {
    const healthy = probes.filter((p) => p.ok);
    const failed = probes.filter((p) => !p.ok);
    const failedText = failed.map((p) => `${p.id}: ${p.reason}`).join(' | ');

    if (probes.length === 0) {
        return { name: 'providers', status: 'critical', detail: 'No LLM API keys configured' };
    }
    if (healthy.length === 0) {
        return { name: 'providers', status: 'critical', detail: `Every LLM provider failed — Ursa cannot answer. ${failedText}` };
    }
    if (!probes[0].ok) {
        return {
            name: 'providers',
            status: 'degraded',
            detail: `Preferred provider ${probes[0].id} is failing (${probes[0].reason}); answers are coming from ${healthy[0].id}. ${failedText}`,
        };
    }
    if (healthy.length < 2) {
        return { name: 'providers', status: 'degraded', detail: `Only one provider works (${healthy[0].id}); no fallback left. ${failedText}` };
    }
    return {
        name: 'providers',
        status: 'ok',
        detail: `${healthy.length}/${probes.length} healthy${failed.length ? ` (non-critical failures: ${failedText})` : ''}`,
    };
}

/** One live probe; retried once after a short pause so a single transient blip (empty 200, brief 503) doesn't page you. */
export async function probeProvider(
    provider: LlmProvider,
    call: (p: LlmProvider) => Promise<unknown>,
    retryDelayMs = 1_500
): Promise<ProviderProbe> {
    try {
        await call(provider);
        return { id: provider.id, ok: true };
    } catch {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        try {
            await call(provider);
            return { id: provider.id, ok: true };
        } catch (error) {
            return { id: provider.id, ok: false, reason: errMsg(error) };
        }
    }
}

async function checkProviders(providers: LlmProvider[]): Promise<CheckResult> {
    const probes = await Promise.all(
        providers.map((p) =>
            probeProvider(p, (provider) =>
                callProvider(provider, 'You are a health check.', 'Reply with the single word: OK', 256, PROBE_TIMEOUT_MS)
            )
        )
    );
    return judgeProviders(probes);
}

// ------------------------------------------------------------------ billing

/** OpenRouter ":free" models must still cost nothing; if one gets a price, calling it would spend credits. */
async function checkOpenRouterPricing(providers: LlmProvider[]): Promise<CheckResult> {
    const models = providers.filter((p) => p.baseUrl.includes('openrouter.ai')).map((p) => p.model);
    if (models.length === 0) return { name: 'billing', status: 'ok', detail: 'No OpenRouter models in use' };

    try {
        const res = await withTimeout(fetch('https://openrouter.ai/api/v1/models'), PROBE_TIMEOUT_MS, 'OpenRouter model list');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data } = (await res.json()) as { data: { id: string; pricing?: { prompt?: string; completion?: string } }[] };
        const byId = new Map(data.map((m) => [m.id, m]));

        const priced = models.filter((id) => {
            const p = byId.get(id)?.pricing;
            return byId.has(id) && (Number(p?.prompt ?? 0) > 0 || Number(p?.completion ?? 0) > 0);
        });
        if (priced.length > 0) {
            return { name: 'billing', status: 'critical', detail: `OpenRouter model(s) no longer free — REMOVE from the chain: ${priced.join(', ')}` };
        }
        const gone = models.filter((id) => !byId.has(id));
        if (gone.length > 0) {
            return { name: 'billing', status: 'degraded', detail: `OpenRouter model(s) no longer listed: ${gone.join(', ')}` };
        }
        return { name: 'billing', status: 'ok', detail: `${models.length} OpenRouter model(s) still $0` };
    } catch (error) {
        return { name: 'billing', status: 'degraded', detail: `Could not verify OpenRouter pricing: ${errMsg(error)}` };
    }
}

// --------------------------------------------------------------- embeddings

async function checkEmbeddings(): Promise<CheckResult> {
    try {
        const { embedQuery } = await import('../kb/embed');
        const vector = await withTimeout(embedQuery('health check'), PROBE_TIMEOUT_MS * 2, 'embed function');
        return vector.length === 384
            ? { name: 'embeddings', status: 'ok', detail: 'embed edge function returned a 384-dim vector' }
            : { name: 'embeddings', status: 'critical', detail: `embed function returned ${vector.length} dims, expected 384` };
    } catch (error) {
        return { name: 'embeddings', status: 'critical', detail: `embed edge function failing — Ursa cannot search: ${errMsg(error)}` };
    }
}

// ----------------------------------------------------------------- database

async function checkDatabase(): Promise<CheckResult> {
    try {
        const { supabase } = await import('../supabase');

        const { count, error } = await withTimeout(
            Promise.resolve(supabase.from('kb_chunks').select('id', { count: 'exact', head: true })),
            PROBE_TIMEOUT_MS,
            'kb_chunks query'
        );
        if (error) throw new Error(error.message);
        if ((count ?? 0) < MIN_KB_CHUNKS) {
            return { name: 'database', status: 'critical', detail: `kb_chunks has ${count ?? 0} rows (expected ≥ ${MIN_KB_CHUNKS}); re-run ingest-kb` };
        }

        // Real queries against other tables (e.g. blogs) double as Supabase keep-alive
        const extra = (process.env.KEEPALIVE_TABLES ?? '').split(',').map((t) => t.trim()).filter(Boolean);
        const failures: string[] = [];
        for (const table of extra) {
            const { error: tableError } = await withTimeout(
                Promise.resolve(supabase.from(table).select('*', { count: 'exact', head: true })),
                PROBE_TIMEOUT_MS,
                `${table} query`
            );
            if (tableError) failures.push(`${table}: ${tableError.message}`);
        }
        if (failures.length > 0) {
            return { name: 'database', status: 'degraded', detail: `Keep-alive query failed — ${failures.join('; ')}` };
        }
        return { name: 'database', status: 'ok', detail: `kb_chunks has ${count} rows${extra.length ? `; pinged ${extra.join(', ')}` : ''}` };
    } catch (error) {
        return { name: 'database', status: 'critical', detail: `Supabase unreachable or paused: ${errMsg(error)}` };
    }
}

// --------------------------------------------------------------- blog index

/**
 * Pure: compares the published posts with the blog files present in kb_chunks.
 * Chunks of a post that is not published would mean Ursa could repeat unpublished writing, so that is critical.
 */
export function judgeBlogIndex(publishedSlugs: string[], indexedFiles: string[]): CheckResult {
    const published = new Set(publishedSlugs);
    const indexed = new Set(indexedFiles.filter((f) => f.startsWith('blog/')).map((f) => f.slice('blog/'.length)));

    const leaked = [...indexed].filter((slug) => !published.has(slug));
    if (leaked.length > 0) {
        return { name: 'blog-index', status: 'critical', detail: `Ursa has indexed text from ${leaked.length} post(s) that are not published (${leaked.slice(0, 3).join(', ')}); run \`npm run reindex-blog\`` };
    }
    const missing = [...published].filter((slug) => !indexed.has(slug));
    if (missing.length > 0) {
        return { name: 'blog-index', status: 'degraded', detail: `${missing.length} published post(s) are not indexed, so Ursa cannot answer from them (${missing.slice(0, 3).join(', ')}); open the post in /admin and press Re-index, or run \`npm run reindex-blog\`` };
    }
    return { name: 'blog-index', status: 'ok', detail: `${published.size} published post(s), all indexed; no unpublished text in the index` };
}

async function checkBlogIndex(): Promise<CheckResult> {
    try {
        const { supabase } = await import('../supabase');
        const [posts, chunks] = await withTimeout(
            Promise.all([
                Promise.resolve(supabase.from('posts').select('slug').eq('status', 'published')),
                Promise.resolve(supabase.from('kb_chunks').select('source_file').like('source_file', 'blog/%').limit(5000)),
            ]),
            PROBE_TIMEOUT_MS,
            'blog index query',
        );
        if (posts.error) throw new Error(posts.error.message);
        if (chunks.error) throw new Error(chunks.error.message);
        return judgeBlogIndex(
            (posts.data ?? []).map((p: { slug: string }) => p.slug),
            (chunks.data ?? []).map((c: { source_file: string }) => c.source_file),
        );
    } catch (error) {
        return { name: 'blog-index', status: 'degraded', detail: `Could not compare the blog with the index: ${errMsg(error)}` };
    }
}

// ------------------------------------------------------------------ answers

async function checkAnswers(): Promise<CheckResult> {
    const smoke = (goldenCases as GoldenCase[]).filter((c) => c.smoke);
    if (smoke.length === 0) return { name: 'answers', status: 'ok', detail: 'No smoke questions defined' };

    const { generateRagResponse } = await import('../rag');
    const ask = async (c: GoldenCase) => {
        try {
            const { text } = await withTimeout(generateRagResponse(c.q, 'personal'), 15_000, 'answer');
            return { q: c.q, problems: evaluateAnswer(c, text), error: undefined as string | undefined };
        } catch (error) {
            return { q: c.q, problems: [] as string[], error: errMsg(error) };
        }
    };

    // Two at a time: keeps the whole run inside the function's time limit without hammering one provider
    const outcomes: Awaited<ReturnType<typeof ask>>[] = [];
    for (let i = 0; i < smoke.length; i += 2) {
        outcomes.push(...(await Promise.all(smoke.slice(i, i + 2).map(ask))));
    }

    const errored = outcomes.filter((o) => o.error);
    const wrong = outcomes.filter((o) => o.problems.length > 0);

    if (errored.length === outcomes.length) {
        return { name: 'answers', status: 'critical', detail: `Every smoke question errored: ${errored[0].error}` };
    }
    if (errored.length > 0 || wrong.length > 0) {
        const parts = [
            ...errored.map((o) => `"${o.q}" errored: ${o.error}`),
            ...wrong.map((o) => `"${o.q}" → ${o.problems.join('; ')}`),
        ];
        return { name: 'answers', status: 'degraded', detail: `${parts.length}/${outcomes.length} smoke questions failed. ${parts.join(' | ')}` };
    }
    return { name: 'answers', status: 'ok', detail: `${outcomes.length}/${outcomes.length} smoke questions correct` };
}

// ------------------------------------------------------------------- runner

export async function runHealthChecks(): Promise<HealthReport> {
    const providers = getProviderChain();

    // Cheap independent probes first, then the end-to-end answers, so the probes don't compete with them for provider quota
    const [providerCheck, billing, embeddings, database, blogIndex] = await Promise.all([
        checkProviders(providers),
        checkOpenRouterPricing(providers),
        checkEmbeddings(),
        checkDatabase(),
        checkBlogIndex(),
    ]);
    const answers = await checkAnswers();
    const checks = [providerCheck, billing, embeddings, database, blogIndex, answers];

    return { status: worst(checks.map((c) => c.status)), checkedAt: new Date().toISOString(), checks };
}

// -------------------------------------------------------------------- alert

export function formatAlert(report: HealthReport): { subject: string; text: string } {
    const problems = report.checks.filter((c) => c.status !== 'ok');
    const headline = problems[0] ? `${problems[0].name}: ${problems[0].detail}`.slice(0, 90) : report.status;

    const lines = [
        `Ursa health check — ${report.status.toUpperCase()} at ${report.checkedAt}`,
        '',
        ...report.checks.map((c) => `${c.status === 'ok' ? '✅' : c.status === 'degraded' ? '⚠️' : '🚨'} ${c.name}: ${c.detail}`),
        '',
        'What to do:',
        '- providers: from vansh.fyi/ run `npx tsx --env-file-if-exists=.env.local scripts/probe-models.ts` and `scripts/list-models.ts`, then update PROVIDER_CHAIN in server/services/llm/chain.ts.',
        '- billing: remove the named OpenRouter model from PROVIDER_CHAIN immediately.',
        '- embeddings/database: check the Supabase dashboard (project paused? edge function deployed?).',
        '- blog-index: from vansh.fyi/ run `npm run reindex-blog` (or press Re-index on the post in /admin).',
        '- answers: from vansh.fyi/ run `npm run eval-ursa` to see which questions regressed.',
        '',
        'Next check runs tomorrow; this email repeats daily until the problem is fixed.',
    ];

    return { subject: `[Ursa] ${report.status.toUpperCase()} — ${headline}`, text: lines.join('\n') };
}
