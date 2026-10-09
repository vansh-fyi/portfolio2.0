import type { Metadata, Viewport } from 'next';
import { Geist, Inter } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import { themeInitScript } from '@/lib/theme';
import Analytics from './analytics';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });
const geist = Geist({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-geist', display: 'swap' });

const TITLE = 'Vansh Grover | Product Designer';
const SHORT_DESCRIPTION =
  'Product design, AI systems and modern web applications. Explore projects and ask Ursa, the AI assistant.';
const OG_IMAGE = '/images/aether.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description:
    'Vansh Grover is a Product Designer who simplifies user flows, designs intuitive interfaces and builds modern web applications with AI. Explore projects and ask Ursa, the AI assistant.',
  authors: [{ name: 'Vansh Grover' }],
  alternates: { canonical: '/' },
  icons: { icon: '/images/logo_dark.png' },
  openGraph: {
    type: 'website',
    siteName: 'Vansh Grover',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    url: '/',
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: SHORT_DESCRIPTION, images: [OG_IMAGE] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${geist.variable}`}>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
