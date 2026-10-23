import type { Metadata } from 'next';
import SkillsPreview from './skills-preview';

export const metadata: Metadata = {
  title: 'Skills playground | Vansh Grover',
  robots: { index: false, follow: false },
  alternates: { canonical: '/test' },
};

export default function TestPage() {
  return (
    <main className="min-h-screen text-white">
      <SkillsPreview />
    </main>
  );
}
