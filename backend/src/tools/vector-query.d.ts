import { z } from 'zod';
export declare const vectorQueryTool: import("@mastra/core/tools").Tool<z.ZodObject<{
    query: z.ZodString;
    context: z.ZodEnum<{
        personal: "personal";
        project: "project";
    }>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>, undefined, any, any, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
    query: z.ZodString;
    context: z.ZodEnum<{
        personal: "personal";
        project: "project";
    }>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>, any, any>>;
