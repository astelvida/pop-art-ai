/** @type {import('next').NextConfig} */


const nextConfig = {
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
  // experimental: {    
  //   ppr: true,
  // },
}

// const configSentry = process.env.NODE_ENV === 'development' 
//   ? nextConfig 
//   : withSentryConfig(nextConfig, {
//       org: 'sevdaaa', 
//       project: 'pop-art-ai',
//       silent: !process.env.CI,
//       widenClientFileUpload: true,
//       reactComponentAnnotation: {
//         enabled: true,
//       },
//       hideSourceMaps: true,
//       disableLogger: false,
//       automaticVercelMonitors: true,
//     })

export default nextConfig 