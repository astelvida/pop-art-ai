import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io' },
      { hostname: 'idvk613jhus86wua.public.blob.vercel-storage.com', protocol: 'https' },
      { hostname: 'replicate.delivery', protocol: 'https' }, //pathname: '/pbxt/**',
      { hostname: 'replicate.com', protocol: 'https' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  experimental: {
    inlineCss: true,
    // ppr: 'incremental',
    reactCompiler: true,
    // staleTimes: {
    //   dynamic: 30,
    // },
  },
}

export default nextConfig;