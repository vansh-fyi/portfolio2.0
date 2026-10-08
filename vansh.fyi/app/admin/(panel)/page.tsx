import Link from 'next/link';
import { requireAdmin } from '@/server/auth/admin';
import { listAllPosts } from '@/server/blog/admin-queries';
import { formatDate } from '@/lib/format';

type Filter = 'all' | 'draft' | 'published';

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await requireAdmin();
  const raw = (await searchParams).status;
  const filter: Filter = raw === 'draft' || raw === 'published' ? raw : 'all';
  const posts = await listAllPosts(admin, filter === 'all' ? undefined : filter);

  const tab = (value: Filter, label: string) => (
    <Link
      href={value === 'all' ? '/admin' : `/admin?status=${value}`}
      className={`rounded-full px-3.5 py-2 text-sm font-medium font-geist ring-1 transition ${filter === value ? 'bg-white/15 text-white ring-white/20' : 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/10'}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-light tracking-tighter font-geist text-white">Posts</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-white/80 active:scale-95">
          New post
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {tab('all', 'All')}
        {tab('draft', 'Drafts')}
        {tab('published', 'Published')}
      </div>

      {posts.length === 0 ? (
        <p className="rounded-2xl bg-black/30 p-8 text-center text-white/50 ring-1 ring-white/10">
          {filter === 'all' ? 'No posts yet. Write the first one.' : `No ${filter} posts.`}
        </p>
      ) : (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 backdrop-blur-lg">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/admin/posts/${post.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{post.title}</p>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    /blog/{post.slug}
                    {post.tags.length > 0 ? ` · ${post.tags.join(', ')}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span>{post.status === 'published' ? `Published ${formatDate(post.published_at)}` : `Edited ${formatDate(post.updated_at)}`}</span>
                  <span className={`rounded-full px-2.5 py-1 font-medium ring-1 ${post.status === 'published' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' : 'bg-white/10 text-white/80 ring-white/10'}`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
