/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Dynamically import the package.json
const PackageJson = require('./package.json');

const withNextIntl = createNextIntlPlugin('./i18n.ts');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  env: {
    NEXT_PUBLIC_PNM_VERSION: PackageJson.version,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proxy.myru.online',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/profile/blog/new',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
      };
    }
    return config;
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
