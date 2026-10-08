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

        // Use a timeout to prevent hanging indefinitely
        const sendPromise = resend.emails.send({
            from: 'Portfolio Lead Gen <design@vansh.fyi>',
            to: [RECIPIENT_EMAIL],
            subject: `New Lead from ${name}`,
            text: emailContent,
        });

        // 10s timeout
        const timeoutPromise = new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Email sending timed out after 10s')), 10000)
        );

        const response = await Promise.race([sendPromise, timeoutPromise]);

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

/**
 * Sends a plain-text operational alert (e.g. Ursa health check) to the site owner.
 */
export async function sendAlertEmail(subject: string, text: string): Promise<EmailResponse> {
    try {
        const response = await Promise.race([
            resend.emails.send({
                from: 'Ursa Monitor <design@vansh.fyi>',
                to: [RECIPIENT_EMAIL],
                subject,
                text,
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Alert email timed out after 10s')), 10000)),
        ]);

        if (response.error) {
            console.error('Resend API error (alert):', response.error);
            return { success: false, error: `Email delivery failed: ${response.error.message}` };
        }
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error sending alert email:', errorMessage);
        return { success: false, error: `Failed to send email: ${errorMessage}` };
    }
}
