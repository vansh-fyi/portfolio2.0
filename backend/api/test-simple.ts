export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    try {
        // Simple test without any imports from src
        return new Response(
            JSON.stringify({
                status: 'OK',
                message: 'Simple test endpoint works',
                method: req.method,
                url: req.url,
                timestamp: new Date().toISOString(),
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
