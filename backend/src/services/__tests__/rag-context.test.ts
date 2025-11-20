import { buildContextFilter, getContextSearchConfig, type ContextType } from '../rag-context';

describe('RAG Context Service', () => {
    describe('buildContextFilter', () => {
        it('should build filter for personal context', () => {
            const filter = buildContextFilter('personal');
            expect(filter).toEqual({ type: 'personal' });
        });

        it('should build filter for project context', () => {
            const filter = buildContextFilter('project');
            expect(filter).toEqual({ type: 'project' });
        });
    });

    describe('getContextSearchConfig', () => {
        it('should return search config for personal context', () => {
            const config = getContextSearchConfig('personal');
            expect(config.filter).toEqual({ type: 'personal' });
        });

        it('should return search config for project context', () => {
            const config = getContextSearchConfig('project');
            expect(config.filter).toEqual({ type: 'project' });
        });

        it('should include filter in config', () => {
            const config = getContextSearchConfig('personal');
            expect(config).toHaveProperty('filter');
            expect(config.filter).toBeDefined();
        });
    });
});
