import { ragRouter } from '../rag';

// Mock the RAG service
jest.mock('../../services/rag', () => ({
    generateRagResponse: jest.fn()
}));

// Never hit the real rate-limit RPC from tests
jest.mock('../../services/rate-limit', () => ({
    ...jest.requireActual('../../services/rate-limit'),
    checkRateLimit: jest.fn().mockResolvedValue({ allowed: true }),
}));

import { generateRagResponse } from '../../services/rag';
import { checkRateLimit } from '../../services/rate-limit';

describe('RAG API Router', () => {
    const mockGenerateRagResponse = generateRagResponse as jest.MockedFunction<typeof generateRagResponse>;

    beforeEach(() => {
        jest.clearAllMocks();
        (checkRateLimit as jest.Mock).mockResolvedValue({ allowed: true });
    });

    describe('query procedure', () => {
        it('should process personal context RAG query', async () => {
            mockGenerateRagResponse.mockResolvedValueOnce({
                text: 'Vansh is a software engineer with expertise in TypeScript and React.',
                sources: []
            });

            const caller = ragRouter.createCaller({});
            const result = await caller.query({
                query: 'Tell me about Vansh',
                context: 'personal'
            });

            expect(result.success).toBe(true);
            expect(result.response).toContain('software engineer');
            expect(mockGenerateRagResponse).toHaveBeenCalledWith(
                'Tell me about Vansh',
                'personal',
                undefined
            );
        });

        it('should process project context RAG query', async () => {
            mockGenerateRagResponse.mockResolvedValueOnce({
                text: 'The portfolio project uses React, TypeScript, and Vite.',
                sources: []
            });

            const caller = ragRouter.createCaller({});
            const result = await caller.query({
                query: 'What technologies does the portfolio use?',
                context: 'project'
            });

            expect(result.success).toBe(true);
            expect(result.response).toContain('React');
            expect(mockGenerateRagResponse).toHaveBeenCalledWith(
                'What technologies does the portfolio use?',
                'project',
                undefined
            );
        });

        it('should handle errors gracefully', async () => {
            mockGenerateRagResponse.mockRejectedValueOnce(new Error('API error'));

            const caller = ragRouter.createCaller({});

            await expect(caller.query({
                query: 'Test query',
                context: 'personal'
            })).rejects.toThrow('Ursa is unavailable');
        });

        it('should not leak internal error details to the client', async () => {
            mockGenerateRagResponse.mockRejectedValueOnce(new Error('HTTP 429 from gemini/gemini-3.5-flash-lite'));
            const caller = ragRouter.createCaller({});

            await expect(caller.query({ query: 'Test query', context: 'personal' })).rejects.not.toThrow(/gemini|429/);
        });

        it('should reject with TOO_MANY_REQUESTS when rate limited, without calling the LLM', async () => {
            (checkRateLimit as jest.Mock).mockResolvedValueOnce({ allowed: false, blockedBy: 'rag:ip:1.2.3.4:min' });
            const caller = ragRouter.createCaller({ ip: '1.2.3.4' });

            await expect(caller.query({ query: 'Test query', context: 'personal' })).rejects.toMatchObject({
                code: 'TOO_MANY_REQUESTS',
            });
            expect(mockGenerateRagResponse).not.toHaveBeenCalled();
        });

        it('should key the rate limit on the caller IP', async () => {
            mockGenerateRagResponse.mockResolvedValueOnce({ text: 'ok', sources: [] });
            const caller = ragRouter.createCaller({ ip: '9.9.9.9' });

            await caller.query({ query: 'Hello', context: 'personal' });

            const rules = (checkRateLimit as jest.Mock).mock.calls[0][0] as { key: string }[];
            expect(rules.some((r) => r.key.includes('9.9.9.9'))).toBe(true);
        });

        it('should return a null response for an empty query without searching or rate limiting', async () => {
            const caller = ragRouter.createCaller({});

            const result = await caller.query({ query: '', context: 'personal' });

            expect(result).toEqual({ success: true, response: null, sources: [] });
            expect(mockGenerateRagResponse).not.toHaveBeenCalled();
            expect(checkRateLimit).not.toHaveBeenCalled();
        });

        it('should reject queries over 500 characters', async () => {
            const caller = ragRouter.createCaller({});

            await expect(caller.query({ query: 'x'.repeat(501), context: 'personal' })).rejects.toThrow();
        });

        it('should validate input schema - reject invalid context', async () => {
            const caller = ragRouter.createCaller({});

            await expect(caller.query({
                query: 'Test query',
                context: 'invalid' as any
            })).rejects.toThrow();
        });
    });
});
