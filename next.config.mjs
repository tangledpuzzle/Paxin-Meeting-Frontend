/** @type {import('next').NextConfig} */
import pkg from './next-i18next.config.js';

const { i18n } = pkg;
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proxy.paxintrade.com',
      },
    ],
  },
  i18n,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
