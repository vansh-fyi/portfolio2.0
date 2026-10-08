/**
 * Makes Ursa's index match the blog exactly: published posts are (re)indexed, and any blog text that
 * belongs to a draft, unpublished or deleted post is removed.
 *
 *   npm run reindex-blog            # repair the index
 *   npm run reindex-blog -- --dry-run   # only report what would change
 *
 * The admin does this per post in the background after every publish/edit; run this after restoring
 * a backup, changing the chunking, or if the daily health check reports "blog-index" problems.
 */
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    const { supabaseAdmin } = await import('../server/services/supabase');
    const { reindexPost } = await import('../server/blog/index-post');
    const { BLOG_SOURCE_PREFIX, removeSourceFile } = await import('../server/services/kb/sync');

    const { data: posts, error } = await supabaseAdmin.from('posts').select('id, slug, status');
    if (error) throw new Error(`Could not read posts: ${error.message}`);
    const { data: chunkRows, error: chunkError } = await supabaseAdmin.from('kb_chunks').select('source_file').like('source_file', `${BLOG_SOURCE_PREFIX}%`).limit(5000);
    if (chunkError) throw new Error(`Could not read kb_chunks: ${chunkError.message}`);

    const indexed = new Set((chunkRows ?? []).map((r: { source_file: string }) => r.source_file.slice(BLOG_SOURCE_PREFIX.length)));
    const known = new Set((posts ?? []).map((p: { slug: string }) => p.slug));
    const published = (posts ?? []).filter((p: { status: string }) => p.status === 'published');

    console.log(`📝 ${posts?.length ?? 0} posts (${published.length} published); ${indexed.size} blog file(s) in the index`);

    // Chunks whose post no longer exists under that slug (deleted, or the slug changed)
    const orphans = [...indexed].filter((slug) => !known.has(slug));
    for (const slug of orphans) {
        console.log(`  🧹 ${slug}: no such post`);
        if (!DRY_RUN) await removeSourceFile(supabaseAdmin, `${BLOG_SOURCE_PREFIX}${slug}`);
    }

    for (const post of posts ?? []) {
        const want = post.status === 'published' ? 'index' : 'remove';
        if (DRY_RUN) {
            console.log(`  ${want === 'index' ? '📥' : '🗑️ '} ${post.slug}: would ${want}`);
            continue;
        }
        const outcome = await reindexPost(post.id);
        console.log(`  ${outcome === 'indexed' ? '✅' : '🗑️ '} ${post.slug}: ${outcome}`);
    }
    console.log(DRY_RUN ? '\n(dry run: nothing changed)' : '\n✅ Index matches the blog');
}

main().catch((error) => {
    console.error('❌ Reindex failed:', error instanceof Error ? error.message : error);
    process.exit(1);
});

export {}; // keep this file a module so its top-level names stay local
