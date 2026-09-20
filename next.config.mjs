/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.komiku.to',
      },
      {
        protocol: 'https',
        hostname: '**.komiku.org',
      },
      {
        protocol: 'https',
        hostname: 'puruboy-api.vercel.app',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
