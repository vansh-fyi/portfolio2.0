import * as dotenv from 'dotenv';

// Load environment variables
import path from 'path';

// Load environment variables from root .env.local or .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Try multiple paths for .env
const envPaths = [
    path.resolve(__dirname, '../../../backend/.env'),
    path.resolve(__dirname, '../../../vansh.fyi/.env.local'),
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), '../backend/.env'),
    path.resolve(process.cwd(), '../vansh.fyi/.env.local'),
    path.resolve(process.cwd(), '../.env.local'),
    path.resolve(process.cwd(), '../.env')
];

envPaths.forEach(p => dotenv.config({ path: p }));

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

    /** HuggingFace API key (Optional for local ingestion) */
    huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY || '',

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

    /** Resend API key (Optional for ingestion) */
    resendApiKey: process.env.RESEND_API_KEY || '',

    /** Contact email address (Optional for ingestion) */
    contactEmail: process.env.CONTACT_EMAIL || '',
} as const;

// Validate configuration at module load time
// This ensures the server fails fast if required keys are missing
console.log('✅ Configuration validated successfully');
console.log(`   - HuggingFace API Key: ${config.huggingFaceApiKey.substring(0, 10)}...`);
console.log(`   - Supabase URL: ${config.supabase.url}`);
console.log(`   - Resend API Key: ${config.resendApiKey.substring(0, 6)}...`);
