/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://go.paxintrade.com/api/:path*", // Proxy to Backend
      },
    ]
  },
}

export default nextConfig
