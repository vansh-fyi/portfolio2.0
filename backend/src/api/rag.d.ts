/**
 * RAG router with procedures
 */
export declare const ragRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Query the RAG agent
     * @param input - Query text and context type
     * @returns AI response with optional sources
     */
    query: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            query: string;
            context: "personal" | "project";
            projectId?: string | undefined;
        };
        output: {
            success: boolean;
            response: string;
            sources: {
                content: string;
                source: string;
                similarity: number;
            }[];
        };
        meta: object;
    }>;
}>>;
export type RagRouter = typeof ragRouter;
