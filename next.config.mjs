import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static site export

  images: {
    unoptimized: true,
  },

  reactStrictMode: false,
  swcMinify: true,

  eslint: {
    dirs: ['src'],
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      'mainnet.json': path.resolve('./node_modules/@ethereumjs/common/dist.browser/genesisStates/mainnet.json'),
    }

    return config
  },
}

export default nextConfig
