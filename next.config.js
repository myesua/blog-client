/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  env: {
    API_URI: 'https://bg-api.onrender.com/api',
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.pixabay.com'],
  },
  experimental: {
    images: { allowFutureImage: true },
    largePageDataBytes: 128 * 100000,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "https://bg-api.onrender.com/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

module.exports = nextConfig;
