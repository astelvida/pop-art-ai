/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "oaidalleapiprodscus.blob.core.windows.net" },
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
