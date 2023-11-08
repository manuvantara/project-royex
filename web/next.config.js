/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/royalty-tokens',
        permanent: true,
      },
      {
        source: '/royalty-tokens/:royaltyId',
        destination: '/royalty-tokens/:royaltyId/initial-royalty-offering',
        permanent: false,
      }
    ];
  },
};

module.exports = nextConfig;
