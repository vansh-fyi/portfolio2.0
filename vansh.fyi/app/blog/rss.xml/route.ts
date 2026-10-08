import { xmlEscape } from '@/lib/format';
import { SITE_URL } from '@/lib/site';
import { excerptFrom } from '@/server/blog/markdown';
import { listPublishedPosts } from '@/server/blog/queries';

// The feed is part of the contract with readers: keep it working. Refreshed hourly and on publish.
export const revalidate = 3600;

export async function GET() {
  const posts = await listPublishedPosts({ limit: 50 });
  const updated = posts[0]?.updated_at ?? new Date(0).toISOString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const description = post.excerpt || excerptFrom(post.body_md);
      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.published_at ?? post.created_at).toUTCString()}</pubDate>
      <description>${xmlEscape(description)}</description>
${post.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vansh Grover — Writing</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on product design, AI systems and building modern web applications.</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
