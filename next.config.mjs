/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "fmzpxyoqrdbpjmrxhpjr.supabase.co" },
      { hostname: "oaidalleapiprodscus.blob.core.windows.net" },
      { hostname: "replicate.delivery" },
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

// {
//   protocol: "https",
//   hostname: "replicate.com",
// },
// {
//   protocol: "https",
//   hostname: "replicate.delivery",
// },

// // const nextConfig = {};

// export default nextConfig;
// /** @type {import('next').NextConfig} */
