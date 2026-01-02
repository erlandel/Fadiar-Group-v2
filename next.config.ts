import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//  output: 'export',
  // trailingSlash: true,
  images: {
    // unoptimized: true, //  CRÍTICO para export estático
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.fadiar.com",
        port: "444",
        pathname: "/prueba/api/_images/**",
      },
    ],
  },
};

export default nextConfig;