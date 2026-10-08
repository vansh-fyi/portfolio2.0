import type { Metadata } from 'next';

// Everything under /admin is private: never indexed, never cached by crawlers.
export const metadata: Metadata = {
  title: 'Admin | Vansh Grover',
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <div aria-hidden className="fixed top-0 -z-10 h-screen w-full bg-black" />
      {children}
    </div>
  );
}
