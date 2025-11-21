import { ragRouter } from '../rag';

// Mock the RAG service
jest.mock('../../services/rag', () => ({
    generateRagResponse: jest.fn()
}));

import { generateRagResponse } from '../../services/rag';

describe('RAG API Router', () => {
    const mockGenerateRagResponse = generateRagResponse as jest.MockedFunction<typeof generateRagResponse>;

    beforeEach(() => {
        jest.clearAllMocks();
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
                'personal'
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
                'project'
            );
        });

        it('should handle errors gracefully', async () => {
            mockGenerateRagResponse.mockRejectedValueOnce(new Error('API error'));

            const caller = ragRouter.createCaller({});

            await expect(caller.query({
                query: 'Test query',
                context: 'personal'
            })).rejects.toThrow('RAG query failed');
        });

        it('should validate input schema - reject empty query', async () => {
            const caller = ragRouter.createCaller({});

            await expect(caller.query({
                query: '',
                context: 'personal'
            })).rejects.toThrow();
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
