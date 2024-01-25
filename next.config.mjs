/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proxy.paxintrade.com'
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://go.paxintrade.com/api/:path*', // Proxy to Backend
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
