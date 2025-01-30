import type { NextConfig } from 'next';

const isLocal = process.env.NODE_ENV === 'development'; // Check if running locally

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isLocal ? '' : undefined, // Set basePath only for local development
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;