import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioApp from '@/app/_components/portfolio-app';
import { findProject, projectIds } from '@/lib/projects';

type Params = { id: string };

// New projects work without a deploy: unknown ids are rendered on demand, then cached
export const revalidate = 3600;

export async function generateStaticParams(): Promise<Params[]> {
  return (await projectIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = await findProject((await params).id);
  if (!project) return {};
  const title = `${project.name} | Vansh Grover`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: { title, description: project.description, url: `/projects/${project.id}` },
    twitter: { title, description: project.description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  if (!(await findProject((await params).id))) notFound();
  return <PortfolioApp />;
}
