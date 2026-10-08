import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The legacy Vite code (src/) keeps its own tsconfig until it is ported in A2.
  typescript: { tsconfigPath: './tsconfig.next.json' },
};

export default nextConfig;
