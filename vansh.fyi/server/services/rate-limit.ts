import { supabaseAdmin } from './supabase';

/**
 * Rate limiting backed by Postgres (rate_limit_hit RPC, migration 005), so counters are
 * shared by every serverless instance and survive cold starts.
 *
 * Fails OPEN: if the limiter itself is down (or SUPABASE_SERVICE_ROLE_KEY is missing) the
 * chat keeps working and a warning is logged. Quota protection is not worth an outage.
 */

export interface RateRule {
    /** Counter name, e.g. "rag:ip:1.2.3.4:min" */
    key: string;
    windowSeconds: number;
    max: number;
}

export const RAG_LIMITS = {
    perIpPerMinute: 8,
    perIpPerDay: 60,
    /** Total questions per day across everyone; keep below the lead provider's free daily quota */
    globalPerDay: 600,
};

export const EMAIL_LIMITS = {
    perIpPerHour: 3,
    globalPerDay: 30,
};

export function ragRules(ip: string): RateRule[] {
    return [
        { key: `rag:ip:${ip}:min`, windowSeconds: 60, max: RAG_LIMITS.perIpPerMinute },
        { key: `rag:ip:${ip}:day`, windowSeconds: 86_400, max: RAG_LIMITS.perIpPerDay },
        { key: 'rag:global:day', windowSeconds: 86_400, max: RAG_LIMITS.globalPerDay },
    ];
}

export function emailRules(ip: string): RateRule[] {
    return [
        { key: `email:ip:${ip}:hour`, windowSeconds: 3_600, max: EMAIL_LIMITS.perIpPerHour },
        { key: 'email:global:day', windowSeconds: 86_400, max: EMAIL_LIMITS.globalPerDay },
    ];
}

export interface RateResult {
    allowed: boolean;
    /** The rule that blocked the request */
    blockedBy?: string;
}

/** Checks rules in order and stops at the first one that blocks (later counters aren't incremented). */
export async function checkRateLimit(rules: RateRule[]): Promise<RateResult> {
    for (const rule of rules) {
        try {
            const { data, error } = await supabaseAdmin.rpc('rate_limit_hit', {
                p_key: rule.key,
                p_window_seconds: rule.windowSeconds,
                p_max: rule.max,
            });
            if (error) throw new Error(error.message);
            if (data === false) return { allowed: false, blockedBy: rule.key };
        } catch (error) {
            console.warn(`⚠️ Rate limiter unavailable, failing open: ${error instanceof Error ? error.message : error}`);
            return { allowed: true };
        }
    }
    return { allowed: true };
}
