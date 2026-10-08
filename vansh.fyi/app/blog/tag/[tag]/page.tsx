import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listPublishedPosts, listTags } from '@/server/blog/queries';
import BlogShell from '../../_components/blog-shell';
import PostCard from '../../_components/post-card';
import TagFilter from '../../_components/tag-filter';

export const revalidate = 3600;

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await listTags()).map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);
  return {
    title: `${tag} | Writing | Vansh Grover`,
    description: `Posts tagged "${tag}" by Vansh Grover.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const tag = decodeURIComponent((await params).tag);
  const [posts, tags] = await Promise.all([listPublishedPosts({ tag }), listTags()]);
  if (posts.length === 0) notFound(); // unknown or emptied tags are real 404s, not thin pages

  return (
    <BlogShell>
      <header className="mb-10">
        <Link href="/blog" className="mb-6 inline-block text-sm text-white/50 transition hover:text-white">
          ← All posts
        </Link>
        <h1 className="text-3xl font-light tracking-tighter font-geist text-white sm:text-4xl lg:text-5xl">
          Tagged <span className="bg-gradient-to-l from-purple-500 to-orange-300 bg-clip-text text-transparent">{tag}</span>
        </h1>
      </header>

      <TagFilter tags={tags} active={tag} />

      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </BlogShell>
  );
}
