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

    /** Hugging Face API key for AI model inference */
    huggingFaceApiKey: requireEnv(
        'HUGGINGFACE_API_KEY',
        'Hugging Face API key for AI model inference'
    ),

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
    },

    /** Resend API key for email sending */
    resendApiKey: requireEnv(
        'RESEND_API_KEY',
        'Resend API key for email service'
    ),
} as const;

// Validate configuration at module load time
// This ensures the server fails fast if required keys are missing
console.log('✅ Configuration validated successfully');
console.log(`   - Hugging Face API Key: ${config.huggingFaceApiKey.substring(0, 10)}...`);
console.log(`   - Supabase URL: ${config.supabase.url}`);
console.log(`   - Resend API Key: ${config.resendApiKey.substring(0, 6)}...`);
