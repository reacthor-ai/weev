import path from 'path'
import type { NextConfig } from 'next'

// @ts-ignore
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  webpack: (config, { isServer }: any) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  }
}

export default nextConfig
