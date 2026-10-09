import { sanitizeSvg, SvgError, MAX_SVG_BYTES } from '../svg';

const wrap = (inner: string, attrs = '') => `<svg viewBox="0 0 24 24" ${attrs}>${inner}</svg>`;
const clean = (input: string) => sanitizeSvg(input);

describe('sanitizeSvg: clean input', () => {
    it('keeps a normal logo and is idempotent', () => {
        const first = clean(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 2L3 4Z" fill-rule="evenodd"/></svg>`);
        expect(first.removed).toEqual([]);
        expect(first.svg).toBe(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 2L3 4Z" fill-rule="evenodd"></path></svg>`);
        expect(clean(first.svg).svg).toBe(first.svg);
    });

    it('keeps gradients that reference an id in the same document', () => {
        const out = clean(wrap(`<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/></linearGradient></defs><rect width="5" height="5" fill="url(#g)"/>`));
        expect(out.removed).toEqual([]);
        expect(out.svg).toContain('fill="url(#g)"');
        expect(out.svg).toContain('<rect width="5" height="5"');
    });

    it('accepts single-quoted attributes and rewrites them double-quoted', () => {
        expect(clean(`<svg viewBox='0 0 1 1'><path d='M0 0'/></svg>`).svg).toBe(`<svg viewBox="0 0 1 1"><path d="M0 0"></path></svg>`);
    });
});

describe('sanitizeSvg: dangerous elements are dropped with their children', () => {
    it.each([
        ['script', `<script>alert(1)</script>`],
        ['SCRIPT in capitals', `<SCRIPT>alert(1)</SCRIPT>`],
        ['foreignObject', `<foreignObject><iframe src="https://evil.test"></iframe></foreignObject>`],
        ['style', `<style>*{background:url(https://evil.test)}</style>`],
        ['use', `<use href="https://evil.test/x.svg#a"/>`],
        ['image', `<image href="https://evil.test/a.png"/>`],
        ['anchor', `<a href="javascript:alert(1)"><path d="M0 0"/></a>`],
        ['animate', `<animate attributeName="href" values="javascript:alert(1)"/>`],
        ['set', `<set attributeName="onmouseover" to="alert(1)"/>`],
        ['nested svg', `<svg><script>1</script></svg>`],
        ['html iframe', `<iframe src="https://evil.test"></iframe>`],
    ])('%s', (_name, bad) => {
        const out = clean(wrap(`<path d="M0 0"/>${bad}`));
        expect(out.svg).toBe(`<svg viewBox="0 0 24 24"><path d="M0 0"></path></svg>`);
        expect(out.removed.length).toBeGreaterThan(0);
    });
});

describe('sanitizeSvg: dangerous attributes are dropped', () => {
    it.each([
        ['onload', `onload="alert(1)"`],
        ['onclick', `onclick="alert(1)"`],
        ['ONMOUSEOVER', `ONMOUSEOVER="alert(1)"`],
        ['href', `href="javascript:alert(1)"`],
        ['xlink:href', `xlink:href="javascript:alert(1)"`],
        ['style', `style="background:url(https://evil.test)"`],
        ['class', `class="x"`],
        ['unknown', `data-x="1"`],
        ['src', `src="https://evil.test"`],
    ])('%s on a shape', (_name, attr) => {
        const out = clean(wrap(`<path d="M0 0" ${attr}/>`));
        expect(out.svg).toBe(`<svg viewBox="0 0 24 24"><path d="M0 0"></path></svg>`);
        expect(out.removed.length).toBeGreaterThan(0);
    });

    it.each([
        ['javascript url', `fill="javascript:alert(1)"`],
        ['data url', `fill="data:text/html,x"`],
        ['external url()', `fill="url(https://evil.test/x)"`],
        ['url with data', `fill="url(data:image/svg+xml,x)"`],
        ['css expression', `fill="expression(alert(1))"`],
        ['entity', `fill="&#106;avascript:alert(1)"`],
        ['angle bracket', `fill="<script>"`],
        ['backslash escape', `fill="\\6a avascript:1"`],
        ['control char', `fill="java\tscript:1"`],
    ])('unsafe value: %s', (_name, attr) => {
        const out = clean(wrap(`<path d="M0 0" ${attr}/>`));
        expect(out.svg).toBe(`<svg viewBox="0 0 24 24"><path d="M0 0"></path></svg>`);
        expect(out.removed.join()).toContain('fill');
    });

    it('drops xmlns when it is not the SVG namespace, and viewBox/xmlns on inner elements', () => {
        expect(clean(`<svg viewBox="0 0 1 1" xmlns="http://evil.test"><g viewBox="0 0 1 1"/></svg>`).svg).toBe(`<svg viewBox="0 0 1 1"><g></g></svg>`);
    });

    it('keeps long path data but limits ordinary values and odd ids', () => {
        const longPath = `M0 0${' L1 1'.repeat(3000)}Z`;
        expect(clean(wrap(`<path d="${longPath}"/>`)).svg).toContain(longPath);
        expect(clean(wrap(`<path d="M0 0" fill="${'a'.repeat(1001)}"/>`)).removed.join()).toContain('fill');
        expect(clean(wrap(`<path d="M0 0" id="location"/>`)).removed).toEqual([]);
        expect(clean(wrap(`<path d="M0 0" id="1 bad"/>`)).removed.join()).toContain('id');
    });

    it('drops text content entirely', () => {
        expect(clean(wrap(`<g>hello <b>x</b></g>`)).svg).toBe(`<svg viewBox="0 0 24 24"><g></g></svg>`);
    });

    it('the output never contains anything executable', () => {
        const nasty = wrap(`<g onload="x()"><script>1</script><path d="M0 0" onclick="x()" style="x" fill="url(javascript:1)"/></g>`, `onload="x()" xmlns:xlink="http://www.w3.org/1999/xlink"`);
        const { svg } = clean(nasty);
        expect(svg).not.toMatch(/script|onload|onclick|javascript|style|xlink|href/i);
    });
});

describe('sanitizeSvg: rejected outright', () => {
    it.each([
        ['empty', ''],
        ['not svg', '<div>hi</div>'],
        ['two roots', '<svg viewBox="0 0 1 1"></svg><svg viewBox="0 0 1 1"></svg>'],
        ['plain text', 'hello'],
        ['comment', wrap('<!-- x -->')],
        ['conditional comment', wrap('<!--[if IE]><script>1</script><![endif]-->')],
        ['cdata', wrap('<![CDATA[<script>1</script>]]>')],
        ['doctype', `<!DOCTYPE svg [<!ENTITY x "y">]>${wrap('')}`],
        ['xml declaration', `<?xml version="1.0"?>${wrap('')}`],
        ['unquoted attribute', '<svg viewBox=0><path d=M0/></svg>'],
        ['attribute without value', '<svg viewBox="0 0 1 1"><path d="M0" fill-rule/></svg>'],
        ['unclosed tag', '<svg viewBox="0 0 1 1"><g>'],
        ['mismatched tags', '<svg viewBox="0 0 1 1"><g></path></svg>'],
        ['unterminated attribute', '<svg viewBox="0 0 1 1'],
        ['missing viewBox', '<svg><path d="M0 0"/></svg>'],
        ['broken by raw < in script text', wrap('<script>if(a<b){}</script>')],
    ])('%s', (_name, bad) => {
        expect(() => clean(bad)).toThrow(SvgError);
    });

    it('rejects input over the size limit', () => {
        expect(() => clean(wrap(`<path d="${'M0 0 '.repeat(MAX_SVG_BYTES)}"/>`))).toThrow(/too large/);
    });

    it('rejects too many elements and too much nesting', () => {
        expect(() => clean(wrap('<g/>'.repeat(700)))).toThrow(/Too many elements/);
        expect(() => clean(wrap('<g>'.repeat(20) + '</g>'.repeat(20)))).toThrow(/deeply/);
    });

    it('throws for non-strings', () => {
        expect(() => sanitizeSvg(undefined as unknown as string)).toThrow(SvgError);
    });
});
