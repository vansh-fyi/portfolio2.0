import ThemeToggle from './theme-toggle';

// A1 placeholder shell. The real sections are ported in A2.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 text-white">
      <h1 className="font-geist text-4xl font-light tracking-tighter">Vansh Grover</h1>
      <p className="text-white/80">Next.js shell: fonts, theme and analytics are wired up.</p>
      <ThemeToggle />
    </main>
  );
}
