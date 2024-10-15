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



// const nextConfig = {};

// export default nextConfig;
// /** @type {import('next').NextConfig} */
