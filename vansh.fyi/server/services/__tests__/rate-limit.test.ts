const rpc = jest.fn();
jest.mock('../supabase', () => ({ supabaseAdmin: { rpc: (...args: unknown[]) => rpc(...args) } }));

import { checkRateLimit, ragRules, emailRules, RAG_LIMITS } from '../rate-limit';

describe('checkRateLimit', () => {
    beforeEach(() => {
        rpc.mockReset();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it('allows a request when every rule is within its limit', async () => {
        rpc.mockResolvedValue({ data: true, error: null });
        const result = await checkRateLimit(ragRules('1.2.3.4'));
        expect(result).toEqual({ allowed: true });
        expect(rpc).toHaveBeenCalledTimes(3);
    });

    it('blocks at the first exceeded rule and does not count later ones', async () => {
        rpc.mockResolvedValueOnce({ data: true, error: null }).mockResolvedValueOnce({ data: false, error: null });
        const result = await checkRateLimit(ragRules('1.2.3.4'));
        expect(result).toEqual({ allowed: false, blockedBy: 'rag:ip:1.2.3.4:day' });
        expect(rpc).toHaveBeenCalledTimes(2);
    });

    it('fails open when the limiter errors', async () => {
        rpc.mockResolvedValue({ data: null, error: { message: 'function not found' } });
        expect(await checkRateLimit(ragRules('1.2.3.4'))).toEqual({ allowed: true });
    });

    it('fails open when the call throws', async () => {
        rpc.mockRejectedValue(new Error('network down'));
        expect(await checkRateLimit(emailRules('1.2.3.4'))).toEqual({ allowed: true });
    });

    it('passes the key, window and max to the RPC', async () => {
        rpc.mockResolvedValue({ data: true, error: null });
        await checkRateLimit([{ key: 'k', windowSeconds: 60, max: 5 }]);
        expect(rpc).toHaveBeenCalledWith('rate_limit_hit', { p_key: 'k', p_window_seconds: 60, p_max: 5 });
    });
});

describe('rule sets', () => {
    it('scopes per-IP counters to the IP and keeps one shared global counter', () => {
        const a = ragRules('1.1.1.1').map((r) => r.key);
        const b = ragRules('2.2.2.2').map((r) => r.key);
        expect(a.filter((k) => k.includes('1.1.1.1'))).toHaveLength(2);
        expect(a.find((k) => k.includes('global'))).toBe(b.find((k) => k.includes('global')));
    });

    it('keeps the global daily cap below Gemini free-tier daily requests', () => {
        expect(RAG_LIMITS.globalPerDay).toBeLessThan(1000);
    });
});
