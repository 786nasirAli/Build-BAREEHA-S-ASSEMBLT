/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.builder.io"],
    // Allow local images from /public directory
    unoptimized: false,
  },
};

module.exports = nextConfig;
