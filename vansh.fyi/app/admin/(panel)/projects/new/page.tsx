import { requireAdmin } from '@/server/auth/admin';
import { listMedia } from '@/server/media/admin';
import { listEmbedHosts, loadBoard } from '@/server/projects/admin-queries';
import { sectionOptions } from '@/server/projects/board';
import ProjectEditor from '../../_components/project-editor';

export default async function NewProjectPage() {
  const admin = await requireAdmin();
  const [{ board }, hosts, media] = await Promise.all([loadBoard(admin), listEmbedHosts(admin), listMedia(admin)]);
  return <ProjectEditor initial={null} placements={[]} sections={sectionOptions(board)} hosts={hosts} media={media} />;
}
