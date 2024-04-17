const path = require("path");
const { PrismaPlugin } = require("experimental-prisma-webpack-plugin");

module.exports = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};