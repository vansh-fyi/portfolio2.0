import type { Metadata } from 'next';
import App from '@/src/App';

export const metadata: Metadata = {
  title: 'Chat with Ursa | Vansh Grover',
  description: 'Ask Ursa, the AI assistant, anything about Vansh Grover, his work and his projects.',
  alternates: { canonical: '/chat' },
  robots: { index: false },
};

export default function ChatPage() {
  return <App />;
}
