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

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.optimization.runtimeChunk = 'single';
      config.optimization.concatenateModules = true;

      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };

      if (process.env.ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    }

    // if (!dev) {
    //   config.plugins.push(new CleanWebpackPlugin());
    // }

    config.module.rules.push({
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
            disable: true,
          },
        },
      ],
    });

    return config;
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
