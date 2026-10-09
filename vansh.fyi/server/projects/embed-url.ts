/**
 * Validation for the URLs that project pages load in an iframe.
 *
 * https is always required. The host must be on the allow-list (the `embed_hosts` table, edited in
 * the admin), compared exactly: `info.vansh.fyi` does not allow `evil.info.vansh.fyi.example.com`
 * or `vansh.fyi`. Credentials in the URL, non-default ports and control characters are refused.
 */

export class EmbedUrlError extends Error {}

export const MAX_URL_LENGTH = 2048;

/** Lowercases and checks a bare hostname such as `info.vansh.fyi`; returns null when it is not one. */
export function normalizeHost(input: string): string | null {
    const host = input.trim().toLowerCase();
    if (!host || host.length > 253) return null;
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(host)) return null; // needs a dot: no "localhost", no IPs like "1"
    if (/^\d+(\.\d+){3}$/.test(host)) return null; // raw IPv4 addresses
    return host;
}

/** Returns the normalised URL string, or throws EmbedUrlError with a message the admin can show. */
export function validateEmbedUrl(input: string, allowedHosts: readonly string[]): string {
    const raw = input.trim();
    if (!raw) throw new EmbedUrlError('Enter a URL');
    if (raw.length > MAX_URL_LENGTH) throw new EmbedUrlError(`URL is too long (${MAX_URL_LENGTH} max)`);
    if (/[\u0000-\u001f\u007f\s\\]/.test(raw)) throw new EmbedUrlError('URL cannot contain spaces, control characters or backslashes');

    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        throw new EmbedUrlError('Not a valid URL (include https://)');
    }
    if (url.protocol !== 'https:') throw new EmbedUrlError('Only https:// URLs can be embedded');
    if (url.username || url.password) throw new EmbedUrlError('URLs with a username or password are not allowed');
    if (url.port) throw new EmbedUrlError('Custom ports are not allowed');

    const allowed = new Set(allowedHosts.map((h) => h.trim().toLowerCase()));
    if (!allowed.has(url.hostname)) {
        throw new EmbedUrlError(`${url.hostname} is not an allowed embed host. Add it under Allowed embed hosts first.`);
    }
    return url.href;
}
