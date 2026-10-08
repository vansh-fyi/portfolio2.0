import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center text-white">
      <p className="text-sm font-medium tracking-widest text-white/50">404</p>
      <h1 className="font-geist text-4xl font-light tracking-tighter sm:text-5xl">This page doesn&apos;t exist</h1>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
