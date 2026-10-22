import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { tsconfigPath: './tsconfig.next.json' },
  async headers() {
    return [{
      source: '/images/optimized/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    }];
  },
};

export default nextConfig;
