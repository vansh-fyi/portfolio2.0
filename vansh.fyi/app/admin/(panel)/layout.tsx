import { requireAdmin } from '@/server/auth/admin';
import AdminNav from './_components/admin-nav';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
