/**
 * True only when `email` is the configured admin address (case-insensitive, trimmed).
 * An empty allow-list matches nobody.
 */
export function isAdminEmail(email: string | null | undefined, allowed: string | null | undefined): boolean {
    const a = email?.trim().toLowerCase();
    const b = allowed?.trim().toLowerCase();
    return !!a && !!b && a === b;
}
