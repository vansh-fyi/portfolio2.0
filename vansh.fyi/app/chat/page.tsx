import type { Metadata } from 'next';
import PortfolioApp from '@/app/_components/portfolio-app';

export const metadata: Metadata = {
  title: 'Chat with Ursa | Vansh Grover',
  description: 'Ask Ursa, the AI assistant, anything about Vansh Grover, his work and his projects.',
  alternates: { canonical: '/chat' },
  robots: { index: false },
};

export const revalidate = 3600;

export default function ChatPage() {
  return <PortfolioApp />;
}
