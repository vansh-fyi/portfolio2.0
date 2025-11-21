export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    rag: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
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
    email: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        sendLead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                email: string;
                message: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
