import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/server/auth/admin';
import { getPostById } from '@/server/blog/admin-queries';
import { listMedia } from '@/server/media/admin';
import PostEditor, { type EditablePost } from '../../_components/post-editor';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const post = await getPostById(admin, id);
  if (!post) notFound();

  const initial: EditablePost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    body_md: post.body_md,
    tags: post.tags.join(', '),
    seo_title: post.seo_title ?? '',
    seo_description: post.seo_description ?? '',
    cover_media_id: post.cover_media_id,
    status: post.status,
    published_at: post.published_at,
    updated_at: post.updated_at,
  };
  return <PostEditor initial={initial} media={await listMedia(admin)} />;
}
