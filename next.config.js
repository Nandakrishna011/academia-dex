/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  turbopack: {
    // Ensure Turbopack root is the repository folder where package.json lives.
    root: path.resolve(__dirname),
  },
  // Work around root inference issue by explicitly setting project root.
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;
