export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    // Minimal handler - no imports
    return new Response(
        JSON.stringify({
            status: 'debug',
            message: 'Handler is working',
            env: {
                hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY,
                hasSupabaseUrl: !!process.env.SUPABASE_URL,
                hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
                hasResend: !!process.env.RESEND_API_KEY,
                hasContact: !!process.env.CONTACT_EMAIL,
            }
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}
