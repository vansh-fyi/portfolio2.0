import type { SupabaseClient } from '@supabase/supabase-js';
import type { KbChunk } from '../chunker';
import { blogSourceFile, removeSourceFile, syncSourceFile } from '../sync';

interface Row { id: string; source_file: string; content_hash: string; content: string; source_type: string; project_id: string | null; embedding: number[] }

/** Just enough of the Supabase query builder for kb_chunks, backed by an array. */
function fakeDb(initial: Row[] = []) {
    const rows = [...initial];
    let nextId = 1000;
    const db = {
        rows,
        from(table: string) {
            if (table !== 'kb_chunks') throw new Error(`unexpected table ${table}`);
            return {
                select: () => ({ eq: async (_col: string, value: string) => ({ data: rows.filter((r) => r.source_file === value).map(({ id, content_hash }) => ({ id, content_hash })), error: null }) }),
                upsert: async (batch: Omit<Row, 'id'>[]) => {
                    for (const b of batch) {
                        const i = rows.findIndex((r) => r.source_file === b.source_file && r.content_hash === b.content_hash);
                        if (i >= 0) rows[i] = { ...rows[i], ...b };
                        else rows.push({ id: `id-${nextId++}`, ...b });
                    }
                    return { error: null };
                },
                delete: () => ({
                    in: async (_col: string, ids: string[]) => {
                        for (const id of ids) rows.splice(rows.findIndex((r) => r.id === id), 1);
                        return { error: null };
                    },
                    eq: (_col: string, value: string) => ({
                        select: async () => {
                            const gone = rows.filter((r) => r.source_file === value);
                            for (const g of gone) rows.splice(rows.indexOf(g), 1);
                            return { data: gone.map((g) => ({ id: g.id })), error: null };
                        },
                    }),
                }),
            };
        },
    };
    return db as unknown as SupabaseClient & { rows: Row[] };
}

const chunk = (hash: string, content = `content ${hash}`): KbChunk => ({ headingPath: `Post > ${hash}`, content, contentHash: hash, chunkIndex: 0 });
const embedder = () => {
    const calls: string[][] = [];
    return { calls, embed: async (inputs: string[]) => (calls.push(inputs), inputs.map(() => [0.1, 0.2])) };
};
const source = (file: string, chunks: KbChunk[]) => ({ sourceFile: file, sourceType: 'blog' as const, metadata: { slug: 'x' }, chunks });
const row = (file: string, hash: string): Row => ({ id: `${file}:${hash}`, source_file: file, content_hash: hash, content: 'c', source_type: 'blog', project_id: null, embedding: [0] });

describe('syncSourceFile', () => {
    it('inserts everything for a new file, tagged with its type and metadata', async () => {
        const db = fakeDb();
        const { embed } = embedder();
        const result = await syncSourceFile(db, embed, source('blog/a', [chunk('h1'), chunk('h2')]));
        expect(result).toEqual({ inserted: 2, kept: 0, deleted: 0 });
        expect(db.rows).toHaveLength(2);
        expect(db.rows[0]).toMatchObject({ source_file: 'blog/a', source_type: 'blog', project_id: null });
    });

    it('only embeds chunks it has not seen (unchanged content is free)', async () => {
        const db = fakeDb([row('blog/a', 'h1')]);
        const { embed, calls } = embedder();
        const result = await syncSourceFile(db, embed, source('blog/a', [chunk('h1'), chunk('h2')]));
        expect(result).toEqual({ inserted: 1, kept: 1, deleted: 0 });
        expect(calls).toHaveLength(1);
        expect(calls[0]).toHaveLength(1);
    });

    it('deletes chunks that no longer exist after an edit', async () => {
        const db = fakeDb([row('blog/a', 'old1'), row('blog/a', 'old2')]);
        const { embed } = embedder();
        const result = await syncSourceFile(db, embed, source('blog/a', [chunk('new1')]));
        expect(result).toEqual({ inserted: 1, kept: 0, deleted: 2 });
        expect(db.rows.map((r) => r.content_hash)).toEqual(['new1']);
    });

    it('never touches another file’s chunks', async () => {
        const db = fakeDb([row('blog/other', 'keep'), row('projects/x.md', 'keep')]);
        const { embed } = embedder();
        await syncSourceFile(db, embed, source('blog/a', [chunk('h1')]));
        expect(db.rows.filter((r) => r.source_file !== 'blog/a').map((r) => r.id)).toEqual(['blog/other:keep', 'projects/x.md:keep']);
    });

    it('keeps old chunks when embedding fails (nothing is deleted before the new ones are stored)', async () => {
        const db = fakeDb([row('blog/a', 'old')]);
        const failing = async () => { throw new Error('embed function down'); };
        await expect(syncSourceFile(db, failing, source('blog/a', [chunk('new')]))).rejects.toThrow('embed function down');
        expect(db.rows.map((r) => r.content_hash)).toEqual(['old']);
    });

    it('is idempotent: running twice changes nothing the second time', async () => {
        const db = fakeDb();
        const { embed } = embedder();
        await syncSourceFile(db, embed, source('blog/a', [chunk('h1')]));
        expect(await syncSourceFile(db, embed, source('blog/a', [chunk('h1')]))).toEqual({ inserted: 0, kept: 1, deleted: 0 });
    });
});

describe('removeSourceFile', () => {
    it('removes only that file and reports how many chunks went', async () => {
        const db = fakeDb([row('blog/a', 'h1'), row('blog/a', 'h2'), row('blog/b', 'h1')]);
        expect(await removeSourceFile(db, blogSourceFile('a'))).toBe(2);
        expect(db.rows.map((r) => r.source_file)).toEqual(['blog/b']);
    });
});
