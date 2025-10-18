//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // TODO(arthur): temp dev build, need to delete this later
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${
          process.env.API_ENDPOINT || 'http://localhost:3001'
        }/api/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
