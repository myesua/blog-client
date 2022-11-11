/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  env: {
    API_URI: 'http://localhost:8080/api',
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.pixabay.com'],
  },
  experimental: {
    images: { allowFutureImage: true },
    largePageDataBytes: 128 * 100000,
  },
};

module.exports = nextConfig;
