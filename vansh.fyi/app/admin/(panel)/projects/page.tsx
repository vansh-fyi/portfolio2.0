import Link from 'next/link';
import { requireAdmin } from '@/server/auth/admin';
import { listEmbedHosts, loadBoard } from '@/server/projects/admin-queries';
import EmbedHosts from '../_components/embed-hosts';
import ProjectsBoard from '../_components/projects-board';
import { primary } from '../_components/ui';

export default async function ProjectsPage() {
  const admin = await requireAdmin();
  const [data, hosts] = await Promise.all([loadBoard(admin), listEmbedHosts(admin)]);
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-light tracking-tighter font-geist text-white">Projects</h1>
        <Link href="/admin/projects/new" className={primary}>
          New project
        </Link>
      </div>
      <ProjectsBoard data={data} />
      <div className="mt-8">
        <EmbedHosts hosts={hosts} />
      </div>
    </>
  );
}
