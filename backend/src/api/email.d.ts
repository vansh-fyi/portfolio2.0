/**
 * Email router with procedures
 */
export declare const emailRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Sends a lead generation email
     * @param input - Lead form data (name, email, message)
     * @returns Success/error response
     */
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
export type EmailRouter = typeof emailRouter;
