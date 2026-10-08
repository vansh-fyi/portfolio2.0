jest.mock('../../llm/chain', () => ({ callProvider: jest.fn(), getProviderChain: jest.fn(() => []) }));

import { judgeProviders, probeProvider, worst, formatAlert, HealthReport } from '../checks';
import { evaluateAnswer } from '../evaluate';

const ok = (id: string) => ({ id, ok: true });
const bad = (id: string, reason = 'HTTP 429') => ({ id, ok: false, reason });

describe('judgeProviders', () => {
    it('is critical with no keys configured', () => {
        expect(judgeProviders([]).status).toBe('critical');
    });

    it('is critical when every provider fails', () => {
        const r = judgeProviders([bad('gemini/a'), bad('groq/b')]);
        expect(r.status).toBe('critical');
        expect(r.detail).toContain('gemini/a');
    });

    it('is degraded when the preferred provider is down but a fallback works', () => {
        const r = judgeProviders([bad('gemini/a', 'HTTP 404 retired'), ok('groq/b'), ok('or/c')]);
        expect(r.status).toBe('degraded');
        expect(r.detail).toContain('Preferred provider gemini/a');
        expect(r.detail).toContain('groq/b');
    });

    it('is degraded when only one provider is left', () => {
        expect(judgeProviders([ok('gemini/a'), bad('groq/b'), bad('or/c')]).status).toBe('degraded');
    });

    it('stays ok when only a non-preferred provider fails and two still work', () => {
        const r = judgeProviders([ok('gemini/a'), ok('groq/b'), bad('or/c')]);
        expect(r.status).toBe('ok');
        expect(r.detail).toContain('or/c');
    });
});

describe('probeProvider', () => {
    const provider = { id: 'gemini/a', baseUrl: '', apiKey: 'k', model: 'm' };

    it('passes when the first attempt succeeds, with a single call', async () => {
        const call = jest.fn().mockResolvedValue('OK');
        expect(await probeProvider(provider, call, 0)).toEqual({ id: 'gemini/a', ok: true });
        expect(call).toHaveBeenCalledTimes(1);
    });

    it('forgives a single transient failure', async () => {
        const call = jest.fn().mockRejectedValueOnce(new Error('empty response')).mockResolvedValueOnce('OK');
        expect(await probeProvider(provider, call, 0)).toEqual({ id: 'gemini/a', ok: true });
        expect(call).toHaveBeenCalledTimes(2);
    });

    it('reports failure with the reason when both attempts fail', async () => {
        const call = jest.fn().mockRejectedValue(new Error('HTTP 404 model retired'));
        expect(await probeProvider(provider, call, 0)).toEqual({ id: 'gemini/a', ok: false, reason: 'HTTP 404 model retired' });
        expect(call).toHaveBeenCalledTimes(2);
    });
});

describe('worst', () => {
    it('returns the most severe status', () => {
        expect(worst(['ok', 'degraded', 'ok'])).toBe('degraded');
        expect(worst(['ok', 'critical', 'degraded'])).toBe('critical');
        expect(worst([])).toBe('ok');
    });
});

describe('formatAlert', () => {
    const report: HealthReport = {
        status: 'degraded',
        checkedAt: '2026-10-09T06:00:00.000Z',
        checks: [
            { name: 'providers', status: 'degraded', detail: 'Preferred provider gemini/a is failing (HTTP 404)' },
            { name: 'database', status: 'ok', detail: 'kb_chunks has 196 rows' },
        ],
    };

    it('puts the first problem in the subject and lists every check in the body', () => {
        const { subject, text } = formatAlert(report);
        expect(subject).toMatch(/^\[Ursa\] DEGRADED — providers: Preferred provider gemini\/a/);
        expect(text).toContain('✅ database');
        expect(text).toContain('⚠️ providers');
    });
});

describe('evaluateAnswer', () => {
    it('passes when any expected phrase appears, case-insensitively', () => {
        expect(evaluateAnswer({ q: 'x', any: ['Supabase'] }, 'It uses SUPABASE.')).toEqual([]);
    });

    it('reports missing, forbidden and fabricated-answer problems', () => {
        expect(evaluateAnswer({ q: 'x', any: ['foo'] }, 'bar')).toHaveLength(1);
        expect(evaluateAnswer({ q: 'x', forbid: ['RULES'] }, 'my rules are...')).toHaveLength(1);
        expect(evaluateAnswer({ q: 'x', expectUnknown: true }, 'It is Arsenal.')).toHaveLength(1);
        expect(evaluateAnswer({ q: 'x', expectUnknown: true }, "I don't have that information.")).toEqual([]);
    });
});
