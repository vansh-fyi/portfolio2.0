/**
 * Centralized configuration for the server code.
 * All keys come from environment variables.
 *
 * Every value is read lazily, on first access: `next build` imports route modules, so anything that
 * threw while the module loaded would fail builds in environments without secrets. Missing required
 * variables still fail fast, at the point a request (or the health check) actually needs them.
 */

class ConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';
    }
}

/**
 * Validates that a required environment variable exists
 * @param key - The environment variable name
 * @param description - Human-readable description for error messages
 * @returns The environment variable value
 * @throws ConfigurationError if the variable is missing or empty
 */
function requireEnv(key: string, description: string): string {
    const value = process.env[key];
    if (!value || value.trim() === '') {
        throw new ConfigurationError(
            `Missing required environment variable: ${key} (${description})`
        );
    }
    return value;
}

export const config = {
    /** Server port for the local scripts (defaults to 8000 if not specified) */
    get port() {
        return parseInt(process.env.PORT || '8000', 10);
    },

    /** Supabase configuration for the knowledge base and rate limits */
    get supabase() {
        return {
            url: requireEnv('SUPABASE_URL', 'Supabase project URL for vector database access'),
            anonKey: requireEnv('SUPABASE_ANON_KEY', 'Supabase anonymous/public API key'),
            /** Optional service role key for admin operations (bypasses RLS) */
            serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        };
    },

    /** Shared secret for the `embed` Supabase Edge Function (gte-small embeddings). */
    get embedSecret() {
        return process.env.EMBED_SECRET || '';
    },

    /** Free-tier LLM provider keys for Ursa's fallback chain (any subset may be set) */
    get llm() {
        return {
            geminiApiKey: process.env.GEMINI_API_KEY || '',
            groqApiKey: process.env.GROQ_API_KEY || '',
            openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
        };
    },

    /** The single email address allowed into /admin (compared case-insensitively) */
    get adminEmail() {
        return requireEnv('ADMIN_EMAIL', 'The one email address allowed to sign in to /admin');
    },

    /** Resend API key for email sending */
    get resendApiKey() {
        return requireEnv('RESEND_API_KEY', 'Resend API key for email service');
    },

    /** Contact email address for lead notifications */
    get contactEmail() {
        return requireEnv('CONTACT_EMAIL', 'Email address to receive lead notifications');
    },
};
