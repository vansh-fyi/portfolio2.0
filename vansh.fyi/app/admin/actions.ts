'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createAuthClient, isAdminEmail, requireAdmin } from '@/server/auth/admin';
import { AdminError, deletePost, getPostById, savePost, setPublished } from '@/server/blog/admin-queries';
import { postInputSchema, publishProblems } from '@/server/blog/post-input';
import { config } from '@/server/services/config';
import { adminLoginRules, checkRateLimit } from '@/server/services/rate-limit';

// ---------------------------------------------------------------------------------------------
// Sign in / out
// ---------------------------------------------------------------------------------------------

export interface LoginState {
  error?: string;
}

const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) });
const GENERIC_LOGIN_ERROR = 'Invalid email or password.';

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const requestHeaders = await headers();
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || 'unknown';

  // Count every attempt, including ones for the wrong email, before doing anything else
  const limit = await checkRateLimit(adminLoginRules(ip));
  if (!limit.allowed) return { error: 'Too many attempts. Try again in a few minutes.' };

  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: GENERIC_LOGIN_ERROR };

  // Allow-list first: other addresses never reach Supabase Auth, and get the same error as a wrong password
  if (!isAdminEmail(parsed.data.email, config.adminEmail)) return { error: GENERIC_LOGIN_ERROR };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: GENERIC_LOGIN_ERROR };

  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ---------------------------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------------------------

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string; field?: string };

function fail(error: unknown): { ok: false; error: string; field?: string } {
  if (error instanceof AdminError) return { ok: false, error: error.message, field: error.field };
  console.error('[admin] action failed:', error);
  return { ok: false, error: 'Something went wrong. Nothing was lost; try again.' };
}

/** Public pages that depend on the blog's content. Called after every change so the site updates at once. */
function revalidateBlog() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/blog/tag/[tag]', 'page');
  revalidatePath('/blog/rss.xml');
  revalidatePath('/sitemap.xml');
}

export async function savePostAction(raw: unknown): Promise<ActionResult<{ id: string; slug: string; updatedAt: string }>> {
  const admin = await requireAdmin();
  const parsed = postInputSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? '') };
  }
  try {
    const { post } = await savePost(admin, parsed.data);
    if (post.status === 'published') revalidateBlog();
    return { ok: true, id: post.id, slug: post.slug, updatedAt: post.updated_at };
  } catch (error) {
    return fail(error);
  }
}

export async function setPublishedAction(id: string, published: boolean): Promise<ActionResult<{ status: 'draft' | 'published'; publishedAt: string | null }>> {
  const admin = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: 'Invalid post.' };
  try {
    if (published) {
      const post = await getPostById(admin, id);
      if (!post) return { ok: false, error: 'This post no longer exists.' };
      const problems = publishProblems(post);
      if (problems.length) return { ok: false, error: `Cannot publish yet: ${problems.join('; ')}.` };
    }
    const post = await setPublished(admin, id, published);
    revalidateBlog();
    return { ok: true, status: post.status, publishedAt: post.published_at };
  } catch (error) {
    return fail(error);
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: 'Invalid post.' };
  try {
    await deletePost(admin, id);
    revalidateBlog();
  } catch (error) {
    return fail(error);
  }
  redirect('/admin');
}
