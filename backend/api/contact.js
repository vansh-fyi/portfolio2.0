// Simple email endpoint for Vercel
// Bypasses tRPC to avoid TypeScript compilation issues

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Get API keys
        const resendApiKey = process.env.RESEND_API_KEY;
        const contactEmail = process.env.CONTACT_EMAIL;

        if (!resendApiKey || !contactEmail) {
            return res.status(500).json({ error: 'Email service not configured' });
        }

        // Send email using Resend
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: contactEmail,
            replyTo: email,
            subject: `New Portfolio Lead: ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ error: error.message || 'Failed to send email' });
        }

        console.log('Email sent successfully:', data?.id);

        // Return in tRPC-compatible format
        res.status(200).json({
            result: {
                data: {
                    success: true,
                    message: 'Email sent successfully'
                }
            }
        });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({
            error: {
                message: error.message || 'Internal server error',
                code: -32603
            }
        });
    }
}
