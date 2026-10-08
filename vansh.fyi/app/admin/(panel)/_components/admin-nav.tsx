import Link from 'next/link';
import { logoutAction } from '../../actions';

const link = 'rounded-full px-3.5 py-2 text-sm font-medium font-geist text-white/80 ring-1 ring-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95';

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/admin" className="mr-2 text-lg font-light tracking-tighter font-geist text-white">
            Admin
          </Link>
          <Link href="/admin" className={link}>
            Posts
          </Link>
          <Link href="/admin/posts/new" className={link}>
            New post
          </Link>
          <Link href="/blog" className={link} target="_blank">
            View blog ↗
          </Link>
        </nav>
        <form action={logoutAction} className="flex items-center gap-3">
          <span className="hidden text-xs text-white/50 sm:inline">{email}</span>
          <button type="submit" className={link}>
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
