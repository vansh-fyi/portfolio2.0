import { vectorQueryTool } from '../vector-query';
import { supabase } from '../../services/supabase';
import { generateEmbedding } from '../../services/embeddings';

// Mock dependencies
jest.mock('@mastra/core', () => ({
    createTool: jest.fn((config) => ({
        ...config,
        execute: config.execute
    }))
}));

jest.mock('../../services/supabase', () => ({
    supabase: {
        rpc: jest.fn()
    }
}));

jest.mock('../../services/embeddings', () => ({
    generateEmbedding: jest.fn()
}));

describe('VectorQueryTool', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should execute query successfully', async () => {
        const mockEmbedding = [0.1, 0.2, 0.3];
        const mockData = [
            { content: 'Test content', metadata: { source_file: 'test.md' } }
        ];

        (generateEmbedding as jest.Mock).mockResolvedValue(mockEmbedding);
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockData, error: null });

        const result = await vectorQueryTool.execute!({
            context: {
                query: 'test query',
                context: 'personal',
                limit: 2
            },
            runtimeContext: {} as any
        });

        expect(generateEmbedding).toHaveBeenCalledWith('test query');
        expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
            query_embedding: mockEmbedding,
            match_threshold: 0.7,
            match_count: 2,
            filter: { type: 'personal' }
        });
        expect(result).toContain('Content: Test content');
        expect(result).toContain('Source: test.md');
    });

    it('should handle no results', async () => {
        (generateEmbedding as jest.Mock).mockResolvedValue([0.1]);
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: [], error: null });

        const result = await vectorQueryTool.execute!({
            context: {
                query: 'unknown',
                context: 'project',
                limit: 5
            },
            runtimeContext: {} as any
        });

        expect(result).toBe('No relevant information found.');
    });

    it('should handle errors', async () => {
        (generateEmbedding as jest.Mock).mockRejectedValue(new Error('API Error'));

        const result = await vectorQueryTool.execute!({
            context: {
                query: 'error',
                context: 'personal',
                limit: 5
            },
            runtimeContext: {} as any
        });

        expect(result).toBe('An unexpected error occurred while searching.');
    });
});
