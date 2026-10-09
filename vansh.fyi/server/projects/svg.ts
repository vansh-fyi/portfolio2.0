/**
 * Strict SVG sanitiser for project and category logos.
 *
 * Logos are stored as markup and rendered with dangerouslySetInnerHTML on every page, so this is a
 * security boundary. It does NOT try to clean the input string. It parses it into a small tree and
 * REBUILDS fresh markup from an allow-list of elements and attributes, so anything it does not
 * understand cannot reach the output.
 *
 *  - Input that cannot be parsed strictly (comments, CDATA, doctype, processing instructions,
 *    unquoted attributes, mismatched or unclosed tags, too big, too deep) is rejected.
 *  - Elements outside the allow-list (script, style, foreignObject, use, image, a, animate, ...) are
 *    dropped together with their children; attributes outside the allow-list are dropped.
 *    Both are reported in `removed` so the admin can show what changed.
 *  - Text nodes are always dropped: a logo is shapes only.
 *  - Attribute values must be plain: no entities, no markup, no backslashes, no url() except
 *    url(#local-id), no javascript:/data: and no CSS expressions. A bad value drops the attribute.
 */

export const MAX_SVG_BYTES = 65_536;
const MAX_ELEMENTS = 600;
const MAX_DEPTH = 12;
const MAX_VALUE_LENGTH = 1_000;
const LONG_VALUE_ATTRS = new Set(['d', 'points']); // path data can be long: bounded by the whole-logo size limit instead

export class SvgError extends Error {}

export interface SvgResult {
    svg: string;
    /** Human-readable list of what was dropped, empty when the input was already clean */
    removed: string[];
}

const ELEMENTS = new Set([
    'svg', 'g', 'defs', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'clipPath', 'mask', 'linearGradient', 'radialGradient', 'stop',
]);

const PRESENTATION = [
    'fill', 'fill-opacity', 'fill-rule', 'clip-rule', 'stroke', 'stroke-width', 'stroke-opacity',
    'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
    'opacity', 'transform', 'clip-path', 'mask', 'id',
];
const GEOMETRY = ['d', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'points', 'pathLength'];
const GRADIENT = ['offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'fx', 'fy', 'clipPathUnits', 'maskUnits', 'maskContentUnits'];

const COMMON = new Set([...PRESENTATION, ...GEOMETRY, ...GRADIENT]);
const ROOT_ONLY = new Set(['viewBox', 'preserveAspectRatio', 'xmlns']);
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// ------------------------------------------------------------------------------------ parsing

interface Node {
    name: string;
    attrs: [string, string][];
    children: Node[];
}

const NAME = /[A-Za-z_][-A-Za-z0-9_:.]*/y;
const ATTR_NAME = /[A-Za-z_:][-A-Za-z0-9_:.]*/y;

/** Strict tag-level parser. Throws SvgError on anything unusual. */
function parse(input: string): Node {
    let i = 0;
    const root: Node = { name: '#root', attrs: [], children: [] };
    const stack: Node[] = [root];
    let elements = 0;

    const fail = (message: string): never => {
        throw new SvgError(message);
    };

    while (i < input.length) {
        const lt = input.indexOf('<', i);
        if (lt === -1) break; // trailing text is ignored (text is never kept)
        i = lt + 1;

        const next = input[i];
        if (next === '!' || next === '?') fail('Comments, doctypes, CDATA and processing instructions are not allowed in a logo');

        if (next === '/') {
            i++;
            NAME.lastIndex = i;
            const m = NAME.exec(input);
            if (!m) return fail('Malformed closing tag');
            i = NAME.lastIndex;
            while (/\s/.test(input[i] ?? '')) i++;
            if (input[i] !== '>') return fail('Malformed closing tag');
            i++;
            const open = stack.pop();
            if (!open || open === root || open.name !== m[0]) return fail(`Closing </${m[0]}> does not match the open tag`);
            continue;
        }

        NAME.lastIndex = i;
        const nameMatch = NAME.exec(input);
        if (!nameMatch) return fail('Malformed tag');
        const node: Node = { name: nameMatch[0], attrs: [], children: [] };
        i = NAME.lastIndex;

        for (;;) {
            while (/\s/.test(input[i] ?? '')) i++;
            const c = input[i];
            if (c === undefined) return fail('Unterminated tag');
            if (c === '>') {
                i++;
                stack[stack.length - 1].children.push(node);
                stack.push(node);
                break;
            }
            if (c === '/') {
                if (input[i + 1] !== '>') return fail('Malformed self-closing tag');
                i += 2;
                stack[stack.length - 1].children.push(node);
                break;
            }
            ATTR_NAME.lastIndex = i;
            const a = ATTR_NAME.exec(input);
            if (!a) return fail(`Malformed attribute in <${node.name}>`);
            i = ATTR_NAME.lastIndex;
            while (/\s/.test(input[i] ?? '')) i++;
            if (input[i] !== '=') return fail(`Attribute "${a[0]}" has no value`);
            i++;
            while (/\s/.test(input[i] ?? '')) i++;
            const quote = input[i];
            if (quote !== '"' && quote !== "'") return fail(`Attribute "${a[0]}" must be quoted`);
            const end = input.indexOf(quote, i + 1);
            if (end === -1) return fail('Unterminated attribute value');
            node.attrs.push([a[0], input.slice(i + 1, end)]);
            i = end + 1;
        }

        if (++elements > MAX_ELEMENTS) fail(`Too many elements (${MAX_ELEMENTS} max)`);
        if (stack.length - 1 > MAX_DEPTH) fail(`Nested too deeply (${MAX_DEPTH} levels max)`);
    }

    if (stack.length !== 1) fail('Unclosed tag');
    return root;
}

// -------------------------------------------------------------------------------- value checks

/** True when an attribute value is plain enough to be written back out. */
export function isSafeValue(value: string, maxLength = MAX_VALUE_LENGTH): boolean {
    if (value.length > maxLength) return false;
    // no markup, entities, escapes, or control characters
    if (/[<>&\\\u0000-\u001f\u007f]/.test(value)) return false;
    const lower = value.toLowerCase();
    if (/javascript:|data:|vbscript:|expression\s*\(|@import|behavior\s*:/.test(lower)) return false;
    // url() may only point at an id in this same document
    const urls = lower.match(/url\s*\(([^)]*)\)/g) ?? [];
    for (const u of urls) {
        if (!/^url\(\s*['"]?#[a-z0-9_.:-]+['"]?\s*\)$/.test(u.trim())) return false;
    }
    return !/url\s*\((?![^)]*\))/.test(lower); // unterminated url(
}

const escapeAttr = (value: string) => value.replace(/"/g, '&quot;'); // isSafeValue already excluded < > &

// ------------------------------------------------------------------------------------- rebuild

function rebuild(node: Node, isRoot: boolean, removed: string[]): string {
    const attrs: string[] = [];
    const seen = new Set<string>();
    for (const [name, value] of node.attrs) {
        const allowed = COMMON.has(name) || (isRoot && ROOT_ONLY.has(name));
        if (!allowed) {
            removed.push(`attribute ${name} on <${node.name}>`);
            continue;
        }
        if (seen.has(name)) {
            removed.push(`duplicate attribute ${name} on <${node.name}>`);
            continue;
        }
        const badId = name === 'id' && !/^[A-Za-z][A-Za-z0-9_-]{0,40}$/.test(value);
        const maxLength = LONG_VALUE_ATTRS.has(name) ? MAX_SVG_BYTES : MAX_VALUE_LENGTH;
        if (badId || !isSafeValue(value, maxLength) || (name === 'xmlns' && value !== SVG_NAMESPACE)) {
            removed.push(`unsafe value for ${name} on <${node.name}>`);
            continue;
        }
        seen.add(name);
        attrs.push(`${name}="${escapeAttr(value)}"`);
    }

    const children: string[] = [];
    for (const child of node.children) {
        if (!ELEMENTS.has(child.name) || child.name === 'svg') {
            removed.push(`element <${child.name}>`);
            continue;
        }
        children.push(rebuild(child, false, removed));
    }
    return `<${node.name}${attrs.length ? ` ${attrs.join(' ')}` : ''}>${children.join('')}</${node.name}>`;
}

/**
 * Returns safe, canonical SVG markup (or throws SvgError). Idempotent: sanitising the output again
 * changes nothing.
 */
export function sanitizeSvg(input: string): SvgResult {
    if (typeof input !== 'string') throw new SvgError('Logo must be text');
    if (input.length > MAX_SVG_BYTES) throw new SvgError(`Logo is too large (${Math.round(MAX_SVG_BYTES / 1024)} KB max)`);

    const tree = parse(input.trim());
    const roots = tree.children;
    if (roots.length !== 1 || roots[0].name !== 'svg') throw new SvgError('A logo must be a single <svg> element');

    const removed: string[] = [];
    const svg = rebuild(roots[0], true, removed);
    if (svg.length > MAX_SVG_BYTES) throw new SvgError('Logo is too large after cleaning');
    if (!/\sviewBox="/.test(svg.slice(0, svg.indexOf('>')))) throw new SvgError('A logo needs a viewBox so it can be scaled');
    return { svg, removed };
}
