import type { Metadata } from 'next';
import { listPublishedPosts, listTags } from '@/server/blog/queries';
import BlogShell from './_components/blog-shell';
import PostCard from './_components/post-card';
import TagFilter from './_components/tag-filter';

// Static, refreshed hourly and immediately when a post is published or edited (revalidatePath).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Writing | Vansh Grover',
  description: 'Notes on product design, AI systems and building modern web applications.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: { title: 'Writing | Vansh Grover', description: 'Notes on product design, AI systems and building modern web applications.', url: '/blog', type: 'website' },
};

export default async function BlogIndex() {
  const [posts, tags] = await Promise.all([listPublishedPosts(), listTags()]);

  return (
    <BlogShell>
      <header className="mb-10">
        <h1 className="mb-4 text-3xl font-light tracking-tighter font-geist text-white sm:text-4xl lg:text-5xl">
          Writing
          <span className="block bg-gradient-to-l from-purple-500 to-orange-300 bg-clip-text font-light text-transparent">Notes &amp; ideas</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-white/80">Notes on product design, AI systems and building modern web applications.</p>
      </header>

      <TagFilter tags={tags} />

      {posts.length === 0 ? (
        <p className="rounded-2xl bg-black/30 p-8 text-center text-white/50 ring-1 ring-white/10">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </BlogShell>
  );
}
