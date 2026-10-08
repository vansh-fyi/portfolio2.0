import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Centralized configuration for backend services
 * All API keys are loaded from environment variables for security
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

/**
 * Application configuration object
 * Validates all required API keys at startup
 */
export const config = {
    /** Server port (defaults to 8000 if not specified) */
    port: parseInt(process.env.PORT || '8000', 10),

    /** Supabase configuration for vector database */
    supabase: {
        url: requireEnv(
            'SUPABASE_URL',
            'Supabase project URL for vector database access'
        ),
        anonKey: requireEnv(
            'SUPABASE_ANON_KEY',
            'Supabase anonymous/public API key'
        ),
        /** Optional service role key for admin operations (bypasses RLS) */
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    },

    /**
     * Shared secret for the `embed` Supabase Edge Function (gte-small embeddings).
     * Optional until the knowledge base is cut over from the legacy HF pipeline.
     */
    embedSecret: process.env.EMBED_SECRET || '',

    /** Free-tier LLM provider keys for Ursa's fallback chain (any subset may be set) */
    llm: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        groqApiKey: process.env.GROQ_API_KEY || '',
        openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    },

    /** Resend API key for email sending */
    resendApiKey: requireEnv(
        'RESEND_API_KEY',
        'Resend API key for email service'
    ),

    /** Contact email address for lead notifications */
    contactEmail: requireEnv(
        'CONTACT_EMAIL',
        'Email address to receive lead notifications'
    ),
} as const;

// Validate configuration at module load time
// This ensures the server fails fast if required keys are missing.
// Log only which optional services are configured, never any part of a secret.
const llmConfigured = Object.entries({
    gemini: config.llm.geminiApiKey,
    groq: config.llm.groqApiKey,
    openrouter: config.llm.openRouterApiKey,
})
    .filter(([, key]) => key)
    .map(([name]) => name);

console.log('✅ Configuration validated successfully');
console.log(`   - Supabase URL: ${config.supabase.url}`);
console.log(`   - LLM providers: ${llmConfigured.join(', ') || 'none configured'}`);
console.log(`   - Embeddings: ${config.embedSecret ? 'edge function secret set' : 'EMBED_SECRET missing'}`);
