/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "idvk613jhus86wua.public.blob.vercel-storage.com", protocol: "https" },
      { hostname: "replicate.delivery", protocol: "https",  }, //pathname: '/pbxt/**',
      { hostname: "replicate.com", protocol: "https"  },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
