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
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true // We must enable this option, otherwise TypeScript will error on OpenAPI client
  }
};

module.exports = nextConfig;
