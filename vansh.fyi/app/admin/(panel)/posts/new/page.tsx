import { requireAdmin } from '@/server/auth/admin';
import { listMedia } from '@/server/media/admin';
import PostEditor from '../../_components/post-editor';

export default async function NewPostPage() {
  const admin = await requireAdmin();
  return <PostEditor initial={null} media={await listMedia(admin)} />;
}
