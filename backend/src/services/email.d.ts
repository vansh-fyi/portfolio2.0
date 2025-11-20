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
export declare function sendLeadEmail(data: LeadEmailData): Promise<EmailResponse>;
