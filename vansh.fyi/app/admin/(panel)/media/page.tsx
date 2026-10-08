import { requireAdmin } from '@/server/auth/admin';
import { listMedia } from '@/server/media/admin';
import MediaLibrary from '../_components/media-library';

export default async function MediaPage() {
  const admin = await requireAdmin();
  const items = await listMedia(admin);
  return (
    <>
      <h1 className="mb-8 text-3xl font-light tracking-tighter font-geist text-white">Media</h1>
      <MediaLibrary initial={items} />
    </>
  );
}
