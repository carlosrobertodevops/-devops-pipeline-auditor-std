/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Em Next 15, precisa ser OBJETO (não boolean):
    serverActions: {}
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone'
}

export default nextConfig
