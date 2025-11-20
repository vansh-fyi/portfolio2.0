import { ragRouter } from '../rag';

// Mock the ursa agent
jest.mock('../../agents/ursa-agent', () => ({
    ursaAgent: {
        generate: jest.fn()
    }
}));

import { ursaAgent } from '../../agents/ursa-agent';

describe('RAG API Router', () => {
    const mockGenerate = ursaAgent.generate as jest.MockedFunction<typeof ursaAgent.generate>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('query procedure', () => {
        it('should process personal context RAG query', async () => {
            mockGenerate.mockResolvedValueOnce({
                text: 'Vansh is a software engineer with expertise in TypeScript and React.',
                // Mock other response properties as needed
            } as any);

            const caller = ragRouter.createCaller({});
            const result = await caller.query({
                query: 'Tell me about Vansh',
                context: 'personal'
            });

            expect(result.success).toBe(true);
            expect(result.response).toContain('software engineer');
            expect(mockGenerate).toHaveBeenCalledWith(
                expect.stringContaining('Context: personal')
            );
            expect(mockGenerate).toHaveBeenCalledWith(
                expect.stringContaining('Tell me about Vansh')
            );
        });

        it('should process project context RAG query', async () => {
            mockGenerate.mockResolvedValueOnce({
                text: 'The portfolio project uses React, TypeScript, and Vite.',
            } as any);

            const caller = ragRouter.createCaller({});
            const result = await caller.query({
                query: 'What technologies does the portfolio use?',
                context: 'project'
            });

            expect(result.success).toBe(true);
            expect(result.response).toContain('React');
            expect(mockGenerate).toHaveBeenCalledWith(
                expect.stringContaining('Context: project')
            );
        });

        it('should handle errors gracefully', async () => {
            mockGenerate.mockRejectedValueOnce(new Error('API error'));

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
