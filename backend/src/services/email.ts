import { Resend } from 'resend';
import { config } from './config';

/**
 * Email service for sending lead generation emails using Resend API
 */

// Initialize Resend client with API key from config
const resend = new Resend(config.resendApiKey);

// Recipient email address (Vansh's email)
const RECIPIENT_EMAIL = config.contactEmail;

export interface LeadEmailData {
    name: string;
    email: string;
    message: string;
}

export interface EmailResponse {
    success: boolean;
    error?: string;
}

/**
 * Sends a lead generation email with the provided form data
 * @param data - Lead information (name, email, message)
 * @returns Success/error response
 */
export async function sendLeadEmail(data: LeadEmailData): Promise<EmailResponse> {
    try {
        const { name, email, message } = data;

        // Format email content with lead details
        const emailContent = `
New Lead Submission
==================

Name: ${name}
Email: ${email}

Message:
--------
${message}

---
Sent via Portfolio Lead Generation Form
    `.trim();

        // Send email using Resend API
        const response = await resend.emails.send({
            from: 'Portfolio Lead Gen <design@vansh.fyi>', // Verified domain
            to: [RECIPIENT_EMAIL],
            subject: `New Lead from ${name}`,
            text: emailContent,
        });

        // Check for successful send
        if (response.error) {
            console.error('Resend API error:', response.error);
            return {
                success: false,
                error: `Email delivery failed: ${response.error.message}`,
            };
        }

        console.log(`✅ Lead email sent successfully. ID: ${response.data?.id}`);
        return { success: true };

    } catch (error) {
        // Handle unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error sending lead email:', errorMessage);

        return {
            success: false,
            error: `Failed to send email: ${errorMessage}`,
        };
    }
}
