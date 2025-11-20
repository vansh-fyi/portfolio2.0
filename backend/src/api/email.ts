import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { sendLeadEmail } from '../services/email';

/**
 * tRPC Email Router
 * Handles email sending endpoints for lead generation
 */

// Initialize tRPC
const t = initTRPC.create();

// Input validation schema for lead email
const sendLeadSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email format'),
    message: z.string().min(1, 'Message is required').max(1000),
});

/**
 * Email router with procedures
 */
export const emailRouter = t.router({
    /**
     * Sends a lead generation email
     * @param input - Lead form data (name, email, message)
     * @returns Success/error response
     */
    sendLead: t.procedure
        .input(sendLeadSchema)
        .mutation(async ({ input }) => {
            try {
                // Call email service
                const result = await sendLeadEmail(input);

                // Return standard success/error response
                if (result.success) {
                    return {
                        success: true,
                        message: 'Email sent successfully',
                    };
                } else {
                    throw new Error(result.error || 'Email sending failed');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`Failed to send lead email: ${errorMessage}`);
            }
        }),
});

// Export type for frontend
export type EmailRouter = typeof emailRouter;
