/** @type {import('next').NextConfig} */
import pkg from './next-i18next.config.js';

const { i18n } = pkg;
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['proxy.paxintrade.com'],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://go.paxintrade.com/api/:path*', // Proxy to Backend
  //     },
  //   ];
  // },
  i18n,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
