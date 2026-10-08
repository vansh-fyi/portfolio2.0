import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, jsonLd } from '@/lib/format';
import { SITE_URL } from '@/lib/site';
import { excerptFrom, extractHeadings, extractMediaIds } from '@/server/blog/markdown';
import { bestUrl, srcSet } from '@/server/blog/media-url';
import { getMediaByIds, getPublishedPost, listPublishedSlugs } from '@/server/blog/queries';
import BlogShell from '../_components/blog-shell';
import PostMarkdown from '../_components/markdown';
import Toc from '../_components/toc';

// Static per post, refreshed hourly and immediately on publish/edit. New slugs render on first request.
export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await listPublishedSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return {};
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || excerptFrom(post.body_md);
  const url = `/blog/${post.slug}`;
  return {
    title: `${title} | Vansh Grover`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: ['Vansh Grover'],
      tags: post.tags,
      // With no cover image, Next falls back to the generated opengraph-image for this route
      ...(post.cover ? { images: [{ url: bestUrl(post.cover, 1200), width: post.cover.width, height: post.cover.height, alt: post.cover.alt }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(post.cover ? { images: [bestUrl(post.cover, 1200)] } : {}) },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();

  const media = await getMediaByIds(extractMediaIds(post.body_md));
  const headings = extractHeadings(post.body_md);
  const description = post.seo_description || post.excerpt || excerptFrom(post.body_md);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: 'Vansh Grover', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(', ') || undefined,
    image: post.cover ? bestUrl(post.cover, 1200) : `${SITE_URL}/blog/${post.slug}/opengraph-image`,
  };

  return (
    <BlogShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <article>
        <Link href="/blog" className="mb-8 inline-block text-sm text-white/50 transition hover:text-white">
          ← All posts
        </Link>

        <header className="mb-8">
          <p className="mb-3 text-sm font-medium font-geist text-white/50">
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
            {post.reading_minutes ? ` · ${post.reading_minutes} min read` : ''}
          </p>
          <h1 className="text-3xl font-light tracking-tighter font-geist text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-white/80">{post.excerpt}</p>}
          {post.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/blog/tag/${encodeURIComponent(tag)}`} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10 transition hover:bg-white/15">
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.cover && (
          <div className="mb-10 overflow-hidden rounded-2xl ring-1 ring-white/10" style={post.cover.blur_data_url ? { backgroundImage: `url(${post.cover.blur_data_url})`, backgroundSize: 'cover' } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated variants from Supabase Storage */}
            <img src={bestUrl(post.cover, 1280)} srcSet={srcSet(post.cover)} sizes="(min-width: 768px) 720px, 100vw" alt={post.cover.alt} width={post.cover.width} height={post.cover.height} decoding="async" fetchPriority="high" className="h-auto w-full" />
          </div>
        )}

        <Toc headings={headings} />
        <PostMarkdown markdown={post.body_md} media={media} />
      </article>
    </BlogShell>
  );
}
