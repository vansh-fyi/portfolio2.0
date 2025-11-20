/**
 * Application configuration object
 * Validates all required API keys at startup
 */
export declare const config: {
    /** Server port (defaults to 8000 if not specified) */
    readonly port: number;
    /** Hugging Face API key for AI model inference */
    readonly huggingFaceApiKey: string;
    /** Supabase configuration for vector database */
    readonly supabase: {
        readonly url: string;
        readonly anonKey: string;
    };
    /** Resend API key for email sending */
    readonly resendApiKey: string;
};
