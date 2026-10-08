/**
 * Smoke-tests a running deployment end to end: pages, 404s, legacy redirects, SEO files, the API
 * and the cron guard, and (unless --no-ai) a real Ursa answer.
 *
 *   npm run verify-deploy -- https://my-preview.vercel.app
 *   npm run verify-deploy -- http://localhost:3000 --no-ai
 *
 * Exit code 1 if any check fails, so it can gate a cutover.
 */

export {}; // make this file a module so its helper names stay local

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3000').replace(/\/$/, '');
const skipAi = args.includes('--no-ai');

type Result = { name: string; ok: boolean; detail: string };
const results: Result[] = [];

async function check(name: string, run: () => Promise<string | true>) {
    try {
        const out = await run();
        results.push({ name, ok: true, detail: out === true ? '' : out });
    } catch (error) {
        results.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) });
    }
}

function expect(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

const get = (path: string, init?: RequestInit) => fetch(`${base}${path}`, { redirect: 'manual', ...init });
const title = (html: string) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';

async function main() {
    console.log(`Verifying ${base}${skipAi ? ' (skipping the Ursa call)' : ''}\n`);

    await check('home page renders', async () => {
        const res = await get('/');
        const html = await res.text();
        expect(res.status === 200, `status ${res.status}`);
        expect(html.includes('rel="canonical"'), 'no canonical link');
        expect(/Creating/.test(html), 'hero text missing from server HTML');
        return title(html);
    });

    for (const path of ['/projects/aether', '/projects/aether/chat', '/chat']) {
        await check(`page ${path}`, async () => {
            const res = await get(path);
            expect(res.status === 200, `status ${res.status}`);
            return title(await res.text());
        });
    }

    await check('unknown project is a real 404', async () => {
        const res = await get('/projects/does-not-exist');
        expect(res.status === 404, `status ${res.status}`);
        return true;
    });

    const legacy: [string, string][] = [
        ['/?view=projects&project=aether', '/projects/aether'],
        ['/?view=chat&project=aether', '/projects/aether/chat'],
        ['/?view=chat', '/chat'],
        ['/?view=projects', '/#projects'],
    ];
    for (const [from, to] of legacy) {
        await check(`legacy ${from}`, async () => {
            const res = await get(from);
            const location = res.headers.get('location') ?? '';
            expect(res.status === 308, `status ${res.status}, expected a permanent redirect`);
            expect(location.endsWith(to), `redirects to ${location}, expected …${to}`);
            return `-> ${to}`;
        });
    }

    await check('sitemap.xml lists the pages', async () => {
        const res = await get('/sitemap.xml');
        const xml = await res.text();
        const count = (xml.match(/<loc>/g) ?? []).length;
        expect(res.status === 200 && count >= 21, `status ${res.status}, ${count} urls`);
        return `${count} urls, first: ${xml.match(/<loc>([^<]*)/)?.[1]}`;
    });

    await check('robots.txt points at the sitemap', async () => {
        const res = await get('/robots.txt');
        const text = await res.text();
        expect(res.status === 200 && /Sitemap: \S+\/sitemap\.xml/.test(text), 'no Sitemap line');
        return text.match(/Sitemap: (\S+)/)![1];
    });

    await check('/api/health', async () => {
        const res = await get('/api/health');
        expect(res.status === 200 && (await res.json()).status === 'OK', `status ${res.status}`);
        return true;
    });

    await check('cron endpoint rejects anonymous calls', async () => {
        const res = await get('/api/cron/health');
        // 401 when CRON_SECRET is set (production), 500 "not configured" locally; both mean it is not open
        expect(res.status === 401 || res.status === 500, `status ${res.status}: the cron endpoint is open!`);
        return `status ${res.status}`;
    });

    if (!skipAi) {
        await check('Ursa answers (rag.query)', async () => {
            const input = encodeURIComponent(JSON.stringify({ query: 'What does Vansh do?', context: 'personal' }));
            const started = Date.now();
            const res = await get(`/api/trpc/rag.query?input=${input}`);
            const body = await res.json();
            const data = body?.result?.data;
            expect(res.status === 200 && data?.success && data.response?.length > 40, `status ${res.status}: ${JSON.stringify(body).slice(0, 160)}`);
            return `${Math.round((Date.now() - started) / 100) / 10}s, ${data.sources?.length ?? 0} sources`;
        });
    }

    const width = Math.max(...results.map((r) => r.name.length));
    for (const r of results) console.log(`${r.ok ? '✅' : '❌'} ${r.name.padEnd(width)}  ${r.detail}`);
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${failed ? `❌ ${failed} of ${results.length} checks failed` : `✅ all ${results.length} checks passed`}`);
    process.exit(failed ? 1 : 0);
}

main();
