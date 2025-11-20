import { Agent } from '@mastra/core';
/**
 * Ursa - Conversational RAG Agent
 * Helps users learn about Vansh's work, skills, and projects
 * Uses VectorQueryTool for knowledge retrieval
 */
export declare const ursaAgent: Agent<"ursa", {
    vectorQuery: import("@mastra/core/tools").Tool<import("zod").ZodObject<{
        query: import("zod").ZodString;
        context: import("zod").ZodEnum<{
            personal: "personal";
            project: "project";
        }>;
        limit: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    }, import("zod/v4/core").$strip>, undefined, any, any, import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
        query: import("zod").ZodString;
        context: import("zod").ZodEnum<{
            personal: "personal";
            project: "project";
        }>;
        limit: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    }, import("zod/v4/core").$strip>, any, any>>;
}, Record<string, import("@mastra/core").Metric>>;
