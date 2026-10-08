jest.mock('../../config', () => ({
    config: { llm: { geminiApiKey: 'g', groqApiKey: 'q', openRouterApiKey: 'o' } },
}));

import { describeHttpError, generateWithFallback, getProviderChain, resetProviderCooldowns } from '../chain';

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

describe('generateWithFallback', () => {
    const ok = (text: string) => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: text } }] }) });
    const fail = (status: number, body = '') => ({ ok: false, status, text: async () => body });

    beforeEach(() => {
        resetProviderCooldowns();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it('falls through to the next provider on failure and records why', async () => {
        const fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(fail(429, '{"error":{"message":"quota"}}') as any)
            .mockResolvedValueOnce(ok('hello') as any);

        const result = await generateWithFallback({ system: 's', prompt: 'p' });

        expect(result.text).toBe('hello');
        expect(result.provider).toBe(getProviderChain()[1].id);
        expect(result.failures).toEqual([{ provider: getProviderChain()[0].id, reason: 'HTTP 429 quota' }]);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('treats an empty reply as a failure', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(ok('') as any).mockResolvedValueOnce(ok('real answer') as any);
        const result = await generateWithFallback({ system: 's', prompt: 'p' });
        expect(result.text).toBe('real answer');
        expect(result.failures[0].reason).toBe('empty response');
    });

    it('throws AllProvidersFailedError listing every failure', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(fail(500, 'boom') as any);
        await expect(generateWithFallback({ system: 's', prompt: 'p' })).rejects.toMatchObject({ name: 'AllProvidersFailedError' });
    });

    it('skips a provider that is cooling down after a 404', async () => {
        const fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce(fail(404, '{"error":{"message":"retired"}}') as any)
            .mockResolvedValue(ok('first') as any);

        await generateWithFallback({ system: 's', prompt: 'p' });
        fetchMock.mockClear();
        await generateWithFallback({ system: 's', prompt: 'p' });

        // Second request goes straight to the second provider: exactly one call, not two
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const sentModel = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)).model;
        expect(sentModel).toBe(getProviderChain()[1].model);
        expect(sentModel).not.toBe(getProviderChain()[0].model);
    });

    it('sends only allowlisted model IDs', () => {
        for (const p of getProviderChain()) {
            if (p.baseUrl.includes('openrouter.ai')) expect(p.model.endsWith(':free')).toBe(true);
        }
    });
});
