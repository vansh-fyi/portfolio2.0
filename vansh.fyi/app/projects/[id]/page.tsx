import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import App from '@/src/App';
import { findProject, projectIds } from '@/lib/projects';

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projectIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = findProject((await params).id);
  if (!project) return {};
  const title = `${project.name} | Vansh Grover`;
  return {
    title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: { title, description: project.shortDescription, url: `/projects/${project.id}` },
    twitter: { title, description: project.shortDescription },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  if (!findProject((await params).id)) notFound();
  return <App />;
}
