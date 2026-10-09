import { notFound } from 'next/navigation';
import { requireAdmin } from '@/server/auth/admin';
import { listMedia } from '@/server/media/admin';
import { getProjectForEdit, listEmbedHosts, loadBoard } from '@/server/projects/admin-queries';
import { sectionOptions } from '@/server/projects/board';
import { ID_PATTERN } from '@/server/projects/project-input';
import ProjectEditor, { type EditableProject } from '../../_components/project-editor';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!ID_PATTERN.test(id)) notFound();
  const found = await getProjectForEdit(admin, id);
  if (!found) notFound();
  const [{ board }, hosts, media] = await Promise.all([loadBoard(admin), listEmbedHosts(admin), listMedia(admin)]);

  const p = found.project;
  const initial: EditableProject = {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    short_description: p.short_description,
    is_nda: p.is_nda,
    technologies: p.technologies.join(', '),
    logo_svg: p.logo_svg ?? '',
    featured: p.featured,
    featured_layout: p.featured_layout ?? '',
    featured_media_id: p.featured_media_id,
    featured_image: p.featured_image,
    featured_alt: p.featured_alt ?? '',
    featured_title: p.featured_title ?? '',
    featured_blurb: p.featured_blurb ?? '',
    status: p.status,
  };
  return (
    <ProjectEditor
      key={p.id}
      initial={initial}
      placements={found.placements.map(({ id, section_id, url }) => ({ id, section_id, url }))}
      sections={sectionOptions(board)}
      hosts={hosts}
      media={media}
    />
  );
}
