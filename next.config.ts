import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['bun:sqlite', 'better-auth'],
};

export default nextConfig;
