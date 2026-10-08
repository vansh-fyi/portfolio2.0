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
  return {
    title: `Ask about ${project.name} | Vansh Grover`,
    description: `Ask Ursa, the AI assistant, about ${project.name}.`,
    alternates: { canonical: `/projects/${project.id}` },
    robots: { index: false },
  };
}

export default async function ProjectChatPage({ params }: { params: Promise<Params> }) {
  if (!findProject((await params).id)) notFound();
  return <App />;
}
