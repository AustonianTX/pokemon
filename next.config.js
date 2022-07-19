/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    loader: "default",
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
