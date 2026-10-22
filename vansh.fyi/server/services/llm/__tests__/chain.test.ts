jest.mock('../../config', () => ({
    config: { llm: { geminiApiKey: 'g', groqApiKey: 'q', openRouterApiKey: 'o' } },
}));

import { callProvider, describeHttpError, generateWithFallback, getProviderChain, looksTruncated, resetProviderCooldowns } from '../chain';
import { config } from '../../config';

describe('describeHttpError', () => {
    it('extracts OpenRouter upstream text and drops the retry hint', () => {
        const body = JSON.stringify({
            error: {
                message: 'Provider returned error',
                code: 429,
                metadata: { raw: 'google/gemma-4-31b-it:free is temporarily rate-limited upstream. Please retry shortly, or add your own key' },
            },
        });
        expect(describeHttpError(429, body)).toBe('HTTP 429 google/gemma-4-31b-it:free is temporarily rate-limited upstream.');
    });

    it("handles Gemini's array-wrapped error bodies", () => {
        const body = JSON.stringify([{ error: { code: 503, message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.' } }]);
        expect(describeHttpError(503, body)).toBe('HTTP 503 This model is currently experiencing high demand. Spikes in demand are usually temporary.');
    });

    it('falls back to the raw text for non-JSON bodies and truncates long messages', () => {
        expect(describeHttpError(502, 'Bad Gateway')).toBe('HTTP 502 Bad Gateway');
        expect(describeHttpError(500, 'x '.repeat(200)).length).toBeLessThan(130);
    });

    it('returns just the status when there is no message', () => {
        expect(describeHttpError(404, '')).toBe('HTTP 404');
    });
});

describe('looksTruncated', () => {
    it('flags answers cut off mid-sentence', () => {
        expect(looksTruncated('Vansh built the product end-to-end. His work includes')).toBe(true);
        expect(looksTruncated('His work includes:')).toBe(true);
        expect(looksTruncated('He worked on A, B,')).toBe(true);
    });

    it('flags any answer that hit the token limit', () => {
        expect(looksTruncated('A perfectly punctuated sentence.', 'length')).toBe(true);
    });

    it('accepts complete sentences, bullet lists and closing formatting', () => {
        expect(looksTruncated('Vansh is a designer.')).toBe(false);
        expect(looksTruncated('Is that right?')).toBe(false);
        expect(looksTruncated('He built:\n* alignmentzones.com\n* perfectlyseated.com')).toBe(false);
        expect(looksTruncated('Steps:\n1. First\n2. Second')).toBe(false);
        expect(looksTruncated('He uses **React**.')).toBe(false);
        expect(looksTruncated('Done (mostly).')).toBe(false);
    });
});

describe('generateWithFallback', () => {
    const ok = (text: string, finish_reason: string | null = 'stop') => ({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: text }, finish_reason }] }),
    });
    const fail = (status: number, body = '') => ({ ok: false, status, text: async () => body });

    beforeEach(() => {
        resetProviderCooldowns();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it('falls through to the next provider on failure and records why', async () => {
        const fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(fail(429, '{"error":{"message":"quota"}}') as any)
            .mockResolvedValueOnce(ok('Hello there.') as any);

        const result = await generateWithFallback({ system: 's', prompt: 'p' });

        expect(result.text).toBe('Hello there.');
        expect(result.provider).toBe(getProviderChain()[1].id);
        expect(result.failures).toEqual([{ provider: getProviderChain()[0].id, reason: 'HTTP 429 quota' }]);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('treats an empty reply as a failure', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(ok('') as any).mockResolvedValueOnce(ok('A real answer.') as any);
        const result = await generateWithFallback({ system: 's', prompt: 'p' });
        expect(result.text).toBe('A real answer.');
        expect(result.failures[0].reason).toBe('empty response');
    });

    it('throws AllProvidersFailedError listing every failure', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(fail(500, 'boom') as any);
        await expect(generateWithFallback({ system: 's', prompt: 'p' })).rejects.toMatchObject({ name: 'AllProvidersFailedError' });
    });

    it('skips a provider that is cooling down after a 404', async () => {
        const fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(fail(404, '{"error":{"message":"retired"}}') as any)
            .mockResolvedValue(ok('First answer.') as any);

        await generateWithFallback({ system: 's', prompt: 'p' });
        fetchMock.mockClear();
        await generateWithFallback({ system: 's', prompt: 'p' });

        // Second request goes straight to the second provider: exactly one call, not two
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const sentModel = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)).model;
        expect(sentModel).toBe(getProviderChain()[1].model);
        expect(sentModel).not.toBe(getProviderChain()[0].model);
    });

    it('falls back when an answer stops mid-sentence, without cooling the provider down', async () => {
        const fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(ok('Vansh built the whole product. His work includes') as any)
            .mockResolvedValueOnce(ok('Vansh built the whole product, from the quiz to payments.') as any);

        const result = await generateWithFallback({ system: 's', prompt: 'p' });

        expect(result.text).toBe('Vansh built the whole product, from the quiz to payments.');
        expect(result.failures).toEqual([{ provider: getProviderChain()[0].id, reason: 'truncated response' }]);

        // A one-off glitch must not make the lead provider skip its next turn
        fetchMock.mockClear().mockResolvedValue(ok('Complete answer.') as any);
        const next = await generateWithFallback({ system: 's', prompt: 'p' });
        expect(next.provider).toBe(getProviderChain()[0].id);
    });

    it('treats finish_reason "length" as truncated even when the text looks fine', async () => {
        jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(ok('This sentence is complete but the model ran out of tokens.', 'length') as any)
            .mockResolvedValueOnce(ok('The next provider finished properly.') as any);

        const result = await generateWithFallback({ system: 's', prompt: 'p' });
        expect(result.text).toBe('The next provider finished properly.');
    });

    it('returns the first truncated answer if no provider gives a complete one', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(ok('Only a partial answer that ends on', 'stop') as any);

        const result = await generateWithFallback({ system: 's', prompt: 'p' });

        expect(result.text).toBe('Only a partial answer that ends on');
        expect(result.provider).toBe(getProviderChain()[0].id);
    });

    it('sends only allowlisted model IDs', () => {
        for (const p of getProviderChain()) {
            if (p.baseUrl.includes('openrouter.ai')) expect(p.model.endsWith(':free')).toBe(true);
        }
    });
});


it('keeps all three provider tiers in the cost-saving preference order', () => {
    expect(getProviderChain().map((p) => p.id)).toEqual([
        'gemini/gemini-3.5-flash-lite',
        'gemini/gemini-3.1-flash-lite',
        'groq/gpt-oss-120b',
        'openrouter/nemotron-3.5-lightning:free',
        'openrouter/dots-3-note-preview:free',
    ]);
    expect(getProviderChain().filter((p) => p.baseUrl.includes('openrouter.ai')).every((p) => p.model.endsWith(':free'))).toBe(true);
});

it('rejects a billable override before making any network call', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    await expect(generateWithFallback({ system: 's', prompt: 'p', providers: [{ ...getProviderChain()[0], model: 'paid-model' }] })).rejects.toThrow('billable');
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
});

it.each([
    { baseUrl: 'https://api.groq.com/openai/v1', model: 'unapproved-model' },
    { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'unapproved-model' },
    { baseUrl: 'https://openrouter.ai/api/v1', model: 'google/gemma-4-31b-it' },
    { baseUrl: 'https://untrusted.example/openai/v1', model: 'gemini-3.5-flash-lite' },
])('rejects unapproved endpoint/model pairs before sending credentials: %j', async (override) => {
    const fetchMock = jest.spyOn(global, 'fetch');
    try {
        await expect(callProvider({ ...getProviderChain()[0], ...override }, 's', 'p', 100, 1000)).rejects.toThrow('unapproved');
        expect(fetchMock).not.toHaveBeenCalled();
    } finally { fetchMock.mockRestore(); }
});

it('skips tiers with missing keys without changing the order of the remaining tiers', () => {
    const gemini = jest.replaceProperty(config.llm, 'geminiApiKey', '');
    const groq = jest.replaceProperty(config.llm, 'groqApiKey', '');
    try {
        expect(getProviderChain().map((p) => p.id)).toEqual([
            'openrouter/nemotron-3.5-lightning:free', 'openrouter/dots-3-note-preview:free',
        ]);
    } finally { gemini.restore(); groq.restore(); }
});

it('falls through all three tiers and preserves each provider reasoning configuration', async () => {
    resetProviderCooldowns();
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'quota' } as Response)
        .mockResolvedValueOnce({ ok: false, status: 503, text: async () => 'busy' } as Response)
        .mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'quota' } as Response)
        .mockResolvedValueOnce({ ok: false, status: 404, text: async () => 'unavailable' } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ message: { content: 'A complete answer.' }, finish_reason: 'stop' }] }) } as Response);
    const timeouts = jest.spyOn(AbortSignal, 'timeout');
    try {
        const history = [{ role: 'user' as const, content: 'Earlier question' }, { role: 'assistant' as const, content: 'Earlier answer.' }];
        const result = await generateWithFallback({ system: 'rules', prompt: 'Follow-up', history });
        const chain = getProviderChain();
        expect(result.provider).toBe(chain[4].id);
        expect(result.failures).toHaveLength(4);
        expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(chain.map((p) => `${p.baseUrl}/chat/completions`));
        const bodies = fetchMock.mock.calls.map(([, options]) => JSON.parse(String(options?.body)));
        expect(bodies.map((b) => b.reasoning_effort)).toEqual(['minimal', 'minimal', 'low', undefined, undefined]);
        expect(bodies.map((b) => b.reasoning)).toEqual([undefined, undefined, undefined, { enabled: false }, { enabled: false }]);
        expect(bodies.every((b) => b.max_tokens === 500 && b.messages[1].content === 'Earlier question')).toBe(true);
        expect(timeouts.mock.calls[0][0]).toBeLessThanOrEqual(4000);
        expect(timeouts.mock.calls[0][0]).toBeGreaterThan(3000);
    } finally { fetchMock.mockRestore(); warning.mockRestore(); timeouts.mockRestore(); }
});

it('sends ordered conversational roles with a capped output allowance', async () => {
    resetProviderCooldowns();
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Complete answer.' } }] }) } as Response);
    const history = [{ role: 'user' as const, content: 'Question' }, { role: 'assistant' as const, content: 'Answer' }];
    await generateWithFallback({ system: 'rules', prompt: 'Follow-up', history });
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.messages).toEqual([{ role: 'system', content: 'rules' }, ...history, { role: 'user', content: 'Follow-up' }]);
    expect(body.max_tokens).toBe(500);
    fetchMock.mockRestore();
});

it('does not start another provider after cancellation', async () => {
    resetProviderCooldowns();
    const controller = new AbortController();
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async () => { controller.abort(); throw new DOMException('Aborted', 'AbortError'); });
    await expect(generateWithFallback({ system: 's', prompt: 'p', signal: controller.signal })).rejects.toThrow('Aborted');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockRestore();
});

it('does not retry exhausted free providers during their cooldown', async () => {
    resetProviderCooldowns();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 429, text: async () => 'Quota exhausted' } as Response);
    await expect(generateWithFallback({ system: 's', prompt: 'p' })).rejects.toThrow();
    const calls = fetchMock.mock.calls.length;
    await expect(generateWithFallback({ system: 's', prompt: 'p' })).rejects.toThrow('cooling down');
    expect(fetchMock).toHaveBeenCalledTimes(calls);
    fetchMock.mockRestore();
    warn.mockRestore();
});

it.each(['120', 'Thu, 22 Oct 2026 10:02:00 GMT'])('honors Retry-After %s before retrying a rate-limited endpoint', async (retryAfter) => {
    resetProviderCooldowns();
    const start = Date.parse('2026-10-22T10:00:00Z');
    let now = start;
    const clock = jest.spyOn(Date, 'now').mockImplementation(() => now);
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const providers = getProviderChain().filter((p) => p.baseUrl.includes('openrouter.ai'));
    const fetchMock = jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({ ok: false, status: 429, headers: new Headers({ 'Retry-After': retryAfter }), text: async () => 'Busy' } as Response)
        .mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'A complete answer.' } }] }) } as Response);
    try {
        expect((await generateWithFallback({ system: 's', prompt: 'p', providers })).provider).toBe(providers[1].id);
        now = start + 61_000;
        fetchMock.mockClear();
        expect((await generateWithFallback({ system: 's', prompt: 'p', providers })).provider).toBe(providers[1].id);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        now = start + 121_000;
        expect((await generateWithFallback({ system: 's', prompt: 'p', providers })).provider).toBe(providers[0].id);
    } finally { fetchMock.mockRestore(); warning.mockRestore(); clock.mockRestore(); }
});

it('detects truncation even with an action marker', () => {
    expect(looksTruncated('His work includes\n<action>view_projects</action>')).toBe(true);
    expect(looksTruncated('Explore his work.\n<action>view_projects</action>')).toBe(false);
});
