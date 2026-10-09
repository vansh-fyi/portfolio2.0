import type { MetadataRoute } from 'next';
import { projectIds } from '@/lib/projects';
import { SITE_URL } from '@/lib/site';
import { listPublishedSlugs } from '@/server/blog/queries';

// Refreshed hourly and when a post is published. Chat pages are noindex and left out on purpose.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedSlugs();
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8, lastModified: posts[0]?.updated_at },
    ...(await projectIds()).map((id) => ({ url: `${SITE_URL}/projects/${id}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updated_at, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
