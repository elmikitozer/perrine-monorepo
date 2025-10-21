/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@perrine/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

module.exports = nextConfig;

