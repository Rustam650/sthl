/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'images.unsplash.com', 'source.unsplash.com', 's3.twcstorage.ru', 'storage.timeweb.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  output: 'export',
  distDir: '.next',
}

module.exports = nextConfig
