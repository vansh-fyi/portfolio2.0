import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';

/** Page chrome shared by every blog page: the site header and footer around a centred column. */
export default function BlogShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen text-white">
      <Header />
      <main className={`mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>{children}</main>
      <Footer />
    </div>
  );
}
