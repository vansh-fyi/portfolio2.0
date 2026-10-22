import { config } from '../config';
import { boundedHistory, parseChatActions, type ChatTurn } from '../../../lib/chat';

/**
 * Free-only LLM fallback chain for Ursa.
 *
 * The providers speak the OpenAI chat-completions protocol, so one small HTTP
 * client covers them (no SDK versions to drift as models churn). Providers are tried
 * in order; any failure (429, 404/410 for retired models, 5xx, timeout, empty reply)
 * moves on to the next.
 *
 * Billing guard: only the exact model IDs listed in PROVIDER_CHAIN are ever called, and
 * OpenRouter models must end in ":free".
 */

export interface LlmProvider {
    /** Stable id used in logs and health checks */
    id: string;
    baseUrl: string;
    apiKey: string;
    model: string;
}

export interface LlmFailure {
    provider: string;
    reason: string;
}

export interface LlmResult {
    text: string;
    provider: string;
    failures: LlmFailure[];
}

export class AllProvidersFailedError extends Error {
    readonly failures: LlmFailure[];

    constructor(failures: LlmFailure[]) {
        super(`All LLM providers failed: ${failures.map((f) => `${f.provider} (${f.reason})`).join('; ')}`);
        this.name = 'AllProvidersFailedError';
        this.failures = failures;
    }
}

type ProviderSpec = Omit<LlmProvider, 'apiKey'> & { keyOf: () => string };

/** Only explicit :free variants: exhausted free capacity must never become a paid fallback. */
const PROVIDER_CHAIN: ProviderSpec[] = [
    {
        id: 'openrouter/nemotron-3-super:free',
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        keyOf: () => config.llm.openRouterApiKey,
    },
    {
        id: 'openrouter/gemma-4-31b:free',
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'google/gemma-4-31b-it:free',
        keyOf: () => config.llm.openRouterApiKey,
    },
];

/** How long a provider is skipped (per warm instance) after a failure, so a dead one doesn't add latency to every request. */
const COOLDOWN_MS = { rateLimited: 60_000, unavailable: 10 * 60_000, transient: 15_000 };
const blockedUntil = new Map<string, number>();

/** Providers that have a key configured. Throws if a spec would break the billing guard. */
export function getProviderChain(): LlmProvider[] {
    return PROVIDER_CHAIN.flatMap((spec) => {
        assertFreeProvider(spec);
        const apiKey = spec.keyOf();
        if (!apiKey) return [];
        return [{ id: spec.id, baseUrl: spec.baseUrl, model: spec.model, apiKey }];
    });
}

function assertFreeProvider(provider: Pick<LlmProvider, 'baseUrl' | 'model'>): void {
    if (provider.baseUrl !== 'https://openrouter.ai/api/v1' || !provider.model.endsWith(':free')) {
        throw new Error('Refusing a potentially billable LLM provider');
    }
}

export function resetProviderCooldowns(): void {
    blockedUntil.clear();
}

/**
 * Boils a provider error body down to something readable in logs and alert emails, e.g.
 * `HTTP 429 google/gemma-4-31b-it:free is temporarily rate-limited upstream`.
 * Handles OpenAI-style `{error:{message}}`, Gemini's `[{error:{message}}]` and OpenRouter's `error.metadata.raw`.
 */
export function describeHttpError(status: number, bodyText: string, maxLength = 110): string {
    let message = '';
    try {
        const parsed = JSON.parse(bodyText);
        const error = (Array.isArray(parsed) ? parsed[0] : parsed)?.error;
        const raw = error?.metadata?.raw;
        message = String(typeof raw === 'string' && raw ? raw : error?.message ?? '');
    } catch {
        message = bodyText;
    }

    message = message.replace(/\s+/g, ' ').replace(/\s*Please (try|retry).*$/i, '').trim();
    if (/^provider returned error$/i.test(message)) message = '';
    if (message.length > maxLength) {
        const cut = message.slice(0, maxLength);
        message = `${cut.slice(0, Math.max(cut.lastIndexOf(' '), maxLength - 20))}…`;
    }
    return `HTTP ${status}${message ? ` ${message}` : ''}`;
}

function stripReasoning(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

async function callProviderRaw(
    provider: LlmProvider,
    system: string,
    prompt: string,
    maxTokens: number,
    timeoutMs: number,
    history: ChatTurn[] = [],
    signal?: AbortSignal
): Promise<{ text: string; finishReason: string | null }> {
    assertFreeProvider(provider);
    let res: Response;
    try {
        res = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: provider.model,
                max_tokens: maxTokens,
                temperature: 0.3,
                messages: [
                    { role: 'system', content: system },
                    ...boundedHistory(history),
                    { role: 'user', content: prompt },
                ],
            }),
            signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs),
        });
    } catch (error) {
        if (signal?.aborted) throw error;
        if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
            throw new Error(`timed out after ${Math.round(timeoutMs / 1000)}s`);
        }
        throw error;
    }

    if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw Object.assign(new Error(describeHttpError(res.status, detail)), { status: res.status });
    }

    const body = (await res.json()) as {
        choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
    };
    const text = stripReasoning(body.choices?.[0]?.message?.content ?? '');
    if (!text) throw new Error('empty response');
    return { text, finishReason: body.choices?.[0]?.finish_reason ?? null };
}

/** Single call to one provider. Returns the text or throws an Error whose message is the failure reason. */
export async function callProvider(
    provider: LlmProvider,
    system: string,
    prompt: string,
    maxTokens: number,
    timeoutMs: number
): Promise<string> {
    return (await callProviderRaw(provider, system, prompt, maxTokens, timeoutMs)).text;
}

/**
 * Providers occasionally stop mid-sentence while still reporting success (seen with Gemini: "His work includes").
 * An answer is suspect if it hit the token limit, or its last line is prose that ends on a word, comma or colon.
 * List items and sentences ending in punctuation are fine.
 */
export function looksTruncated(text: string, finishReason?: string | null): boolean {
    if (finishReason === 'length') return true;
    const lastLine = parseChatActions(text, 'personal').text.trimEnd().split('\n').pop() ?? '';
    if (/^\s*([-*\u2022]|\d+[.)])\s/.test(lastLine)) return false;
    return /[A-Za-z0-9,;:]$/.test(lastLine.trimEnd());
}

function cooldownFor(error: unknown): number {
    const status = (error as { status?: number }).status;
    if (status === 429) return COOLDOWN_MS.rateLimited;
    if (status === 401 || status === 403 || status === 404 || status === 410) return COOLDOWN_MS.unavailable;
    return COOLDOWN_MS.transient;
}

export interface GenerateOptions {
    system: string;
    prompt: string;
    history?: ChatTurn[];
    signal?: AbortSignal;
    maxTokens?: number;
    /** Total wall-clock budget across all attempts (Vercel functions are capped at 30s) */
    deadlineMs?: number;
    /** Per-attempt cap */
    attemptTimeoutMs?: number;
    /** Override the chain (tests, health checks) */
    providers?: LlmProvider[];
}

export async function generateWithFallback(options: GenerateOptions): Promise<LlmResult> {
    const { system, prompt, history = [], signal, deadlineMs = 20_000, attemptTimeoutMs = 8_000 } = options;
    const maxTokens = Math.min(500, Math.max(1, options.maxTokens ?? 500));
    const providers = options.providers ?? getProviderChain();
    providers.forEach(assertFreeProvider);
    const startedAt = Date.now();
    const failures: LlmFailure[] = [];
    /** First answer that looked cut off; returned only if no provider gives a complete one. */
    let truncated: { text: string; provider: string } | null = null;

    if (providers.length === 0) {
        throw new AllProvidersFailedError([{ provider: 'none', reason: 'no LLM API keys configured' }]);
    }

    // Do not hammer an exhausted free quota while every provider is cooling down.
    const now = Date.now();
    const ready = providers.filter((p) => (blockedUntil.get(p.id) ?? 0) <= now);
    if (!ready.length) throw new AllProvidersFailedError(providers.map((provider) => ({ provider: provider.id, reason: 'cooling down' })));

    for (const provider of ready) {
        signal?.throwIfAborted();
        const remaining = deadlineMs - (Date.now() - startedAt);
        if (remaining < 1_000) {
            failures.push({ provider: provider.id, reason: 'skipped: time budget exhausted' });
            break;
        }
        try {
            const { text, finishReason } = await callProviderRaw(provider, system, prompt, maxTokens, Math.min(attemptTimeoutMs, remaining), history, signal);
            blockedUntil.delete(provider.id);

            if (looksTruncated(text, finishReason)) {
                // A one-off glitch, not an outage: no cooldown, just try the next provider
                truncated ??= { text, provider: provider.id };
                failures.push({ provider: provider.id, reason: 'truncated response' });
                console.warn(`⚠️ LLM answer looked truncated: ${provider.id} (finish=${finishReason}, ${text.length} chars)`);
                continue;
            }
            if (failures.length > 0) {
                console.warn(`⚠️ LLM fallback used: ${provider.id} (after: ${failures.map((f) => `${f.provider}: ${f.reason}`).join('; ')})`);
            }
            return { text, provider: provider.id, failures };
        } catch (error) {
            if (signal?.aborted) throw error;
            const reason = error instanceof Error ? error.message : String(error);
            failures.push({ provider: provider.id, reason });
            blockedUntil.set(provider.id, Date.now() + cooldownFor(error));
            console.warn(`⚠️ LLM provider failed: ${provider.id}: ${reason}`);
        }
    }

    if (truncated) return { ...truncated, failures };
    throw new AllProvidersFailedError(failures);
}
