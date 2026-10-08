import type { MetadataRoute } from 'next';
import { projectIds } from '@/lib/projects';
import { SITE_URL } from '@/lib/site';

// Chat pages are noindex and left out on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...projectIds().map((id) => ({ url: `${SITE_URL}/projects/${id}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
