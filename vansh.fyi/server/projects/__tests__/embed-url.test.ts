import { EmbedUrlError, normalizeHost, validateEmbedUrl } from '../embed-url';

const HOSTS = ['info.vansh.fyi', 'figma.com'];

describe('validateEmbedUrl', () => {
    it('accepts an https URL on an allowed host and returns it normalised', () => {
        expect(validateEmbedUrl('  https://info.vansh.fyi/portfolio/ai/driq-health ', HOSTS)).toBe('https://info.vansh.fyi/portfolio/ai/driq-health');
        expect(validateEmbedUrl('https://INFO.vansh.fyi/x?a=1#h', HOSTS)).toBe('https://info.vansh.fyi/x?a=1#h');
    });

    it('supports several hosts', () => {
        expect(() => validateEmbedUrl('https://figma.com/file/1', HOSTS)).not.toThrow();
    });

    it.each([
        ['http', 'http://info.vansh.fyi/x'],
        ['javascript:', 'javascript:alert(1)'],
        ['data:', 'data:text/html,<script>1</script>'],
        ['file:', 'file:///etc/passwd'],
        ['blob:', 'blob:https://info.vansh.fyi/abc'],
        ['protocol-relative', '//info.vansh.fyi/x'],
        ['relative', '/portfolio/x'],
        ['empty', ''],
        ['spaces', 'https://info.vansh.fyi/a b'],
        ['newline', 'https://info.vansh.fyi/a\nb'],
        ['backslash', 'https://info.vansh.fyi\\@evil.test/'],
        ['credentials', 'https://user:pass@info.vansh.fyi/'],
        ['username only', 'https://info.vansh.fyi@evil.test/'],
        ['port', 'https://info.vansh.fyi:8443/'],
        ['other host', 'https://evil.test/'],
        ['suffix trick', 'https://info.vansh.fyi.evil.test/'],
        ['prefix trick', 'https://evilinfo.vansh.fyi/'],
        ['parent domain', 'https://vansh.fyi/'],
        ['subdomain of allowed', 'https://x.info.vansh.fyi/'],
        ['too long', `https://info.vansh.fyi/${'a'.repeat(2100)}`],
    ])('rejects %s', (_name, url) => {
        expect(() => validateEmbedUrl(url, HOSTS)).toThrow(EmbedUrlError);
    });

    it('says how to fix an unlisted host', () => {
        expect(() => validateEmbedUrl('https://new.example.com/', HOSTS)).toThrow(/Add it under Allowed embed hosts/);
    });

    it('allows nothing when the list is empty', () => {
        expect(() => validateEmbedUrl('https://info.vansh.fyi/', [])).toThrow(EmbedUrlError);
    });
});

describe('normalizeHost', () => {
    it('lowercases and trims', () => expect(normalizeHost('  Info.Vansh.FYI ')).toBe('info.vansh.fyi'));
    it.each(['', 'localhost', 'https://x.com', 'x.com/path', 'a b.com', '127.0.0.1', '-a.com', 'a..com', 'x.com:8080', '*.x.com'])('rejects %j', (host) => {
        expect(normalizeHost(host)).toBeNull();
    });
});
