/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

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
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/profile/blog/new',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
