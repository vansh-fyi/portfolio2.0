'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/server/auth/admin';
import {
  addEmbedHost, AdminError, deleteCategory, deletePlacement, deleteProject, deleteSection, removeEmbedHost,
  saveCategory, saveOrder, savePlacement, saveProject, saveSection, setProjectStatus,
} from '@/server/projects/admin-queries';
import { categoryInputSchema, ID_PATTERN, placementInputSchema, projectInputSchema, sectionInputSchema } from '@/server/projects/project-input';
import type { ActionResult } from './actions';

function fail(error: unknown): { ok: false; error: string; field?: string } {
  if (error instanceof AdminError) return { ok: false, error: error.message, field: error.field };
  console.error('[admin] project action failed:', error);
  return { ok: false, error: 'Something went wrong. Nothing was lost; try again.' };
}

function invalid(error: z.ZodError): { ok: false; error: string; field: string } {
  const issue = error.issues[0];
  return { ok: false, error: issue.message, field: String(issue.path[0] ?? '') };
}

/** Public pages that show projects. Called after every change so the site updates at once. */
function revalidateProjects() {
  revalidatePath('/');
  revalidatePath('/chat');
  revalidatePath('/projects/[id]', 'page');
  revalidatePath('/projects/[id]/chat', 'page');
  revalidatePath('/sitemap.xml');
}

const idSchema = z.string().regex(ID_PATTERN).max(60);

// ---------------------------------------------------------------------------------- projects

export async function saveProjectAction(raw: unknown, isNew: boolean): Promise<ActionResult<{ id: string; updatedAt: string }>> {
  const admin = await requireAdmin();
  const parsed = projectInputSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const project = await saveProject(admin, parsed.data, isNew);
    revalidateProjects();
    return { ok: true, id: project.id, updatedAt: project.updated_at };
  } catch (error) {
    return fail(error);
  }
}

export async function setProjectStatusAction(id: string, published: boolean): Promise<ActionResult<{ status: 'draft' | 'published' }>> {
  const admin = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Invalid project.' };
  try {
    const project = await setProjectStatus(admin, id, published ? 'published' : 'draft');
    revalidateProjects();
    return { ok: true, status: project.status };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Invalid project.' };
  try {
    await deleteProject(admin, id);
    revalidateProjects();
  } catch (error) {
    return fail(error);
  }
  redirect('/admin/projects');
}

// ------------------------------------------------------------------------------- listings

export async function savePlacementAction(raw: unknown, isNew: boolean): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = placementInputSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await savePlacement(admin, parsed.data, isNew);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deletePlacementAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Invalid listing.' };
  try {
    await deletePlacement(admin, id);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

// ------------------------------------------------------------------ categories & sections

export async function saveCategoryAction(raw: unknown, isNew: boolean): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = categoryInputSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await saveCategory(admin, parsed.data, isNew);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Invalid category.' };
  try {
    await deleteCategory(admin, id);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const sectionSchema = sectionInputSchema.extend({ id: z.string().uuid().optional() });

export async function saveSectionAction(raw: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = sectionSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await saveSection(admin, parsed.data);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteSectionAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: 'Invalid section.' };
  try {
    await deleteSection(admin, id);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

// ------------------------------------------------------------------------ hosts & ordering

export async function addEmbedHostAction(host: string): Promise<ActionResult<{ host: string }>> {
  const admin = await requireAdmin();
  if (typeof host !== 'string') return { ok: false, error: 'Enter a host name.' };
  try {
    return { ok: true, host: await addEmbedHost(admin, host) };
  } catch (error) {
    return fail(error);
  }
}

export async function removeEmbedHostAction(host: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (typeof host !== 'string') return { ok: false, error: 'Invalid host.' };
  try {
    await removeEmbedHost(admin, host);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const orderSchema = z.object({
  categories: z.array(idSchema).max(100),
  sections: z.array(z.object({ id: z.string().uuid(), categoryId: idSchema })).max(500),
  placements: z.array(z.object({ id: idSchema, sectionId: z.string().uuid() })).max(1000),
  featured: z.array(idSchema).max(100),
});

export async function saveOrderAction(raw: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'The order could not be read. Reload the page and try again.' };
  try {
    await saveOrder(admin, parsed.data);
    revalidateProjects();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
