import path from 'path'

import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  }
}