/**
 * Exports the blog and the projects to plain JSON so the free plan is not your only copy.
 *
 *   npm run backup                 # posts, media and the project tables as JSON -> backups/<timestamp>/
 *   npm run backup -- --originals  # also download the private original images (can be large)
 *
 * Restore: re-insert the rows (media and posts; categories, sections, projects, then placements), then run `npm run reindex-blog` to rebuild
 * Ursa's index. Variants are rebuilt from originals, so keep the originals if you want a full restore.
 * The output folder is gitignored: it contains drafts.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WITH_ORIGINALS = process.argv.includes('--originals');

async function main() {
    const { supabaseAdmin } = await import('../server/services/supabase');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = path.join('backups', stamp);
    await mkdir(dir, { recursive: true });

    for (const table of ['posts', 'media', 'projects', 'project_placements', 'project_sections', 'project_categories', 'embed_hosts'] as const) {
        const { data, error } = await supabaseAdmin.from(table).select('*');
        if (error) throw new Error(`Could not read ${table}: ${error.message}`);
        await writeFile(path.join(dir, `${table}.json`), JSON.stringify(data, null, 2));
        console.log(`✅ ${table}: ${data?.length ?? 0} row(s)`);
    }

    if (WITH_ORIGINALS) {
        const { data: media, error } = await supabaseAdmin.from('media').select('storage_path');
        if (error) throw new Error(`Could not read media: ${error.message}`);
        let saved = 0;
        for (const { storage_path } of media ?? []) {
            const { data: file, error: dlError } = await supabaseAdmin.storage.from('media-originals').download(storage_path);
            if (dlError || !file) {
                console.warn(`⚠️  ${storage_path}: ${dlError?.message ?? 'no data'}`);
                continue;
            }
            const target = path.join(dir, 'originals', storage_path);
            await mkdir(path.dirname(target), { recursive: true });
            await writeFile(target, Buffer.from(await file.arrayBuffer()));
            saved++;
        }
        console.log(`✅ originals: ${saved}/${media?.length ?? 0} file(s)`);
    }

    console.log(`\nBackup written to ${dir}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
