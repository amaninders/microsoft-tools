import type { NextConfig } from 'next';

const isLocal = process.env.NODE_ENV === 'development'; // Check if running locally

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: './', // Add this line
  basePath: isLocal ? '' : '/microsoft-tools', // Set basePath only for local development
  trailingSlash: true, // Add this line
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;