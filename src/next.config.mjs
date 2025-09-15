/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next 15 exige objeto (não boolean):
    serverActions: {}
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  output: 'standalone'
}

export default nextConfig
