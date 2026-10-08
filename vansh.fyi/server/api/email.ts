import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sendLeadEmail } from '../services/email';
import { checkRateLimit, emailRules } from '../services/rate-limit';
import { t } from './trpc';

/**
 * tRPC Email Router
 * Handles email sending endpoints for lead generation
 */

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
        .mutation(async ({ input, ctx }) => {
            const limit = await checkRateLimit(emailRules(ctx.ip ?? 'unknown'));
            if (!limit.allowed) {
                console.warn(`🚦 Rate limited: ${limit.blockedBy}`);
                throw new TRPCError({
                    code: 'TOO_MANY_REQUESTS',
                    message: 'Too many messages sent. Please try again later.',
                });
            }

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
