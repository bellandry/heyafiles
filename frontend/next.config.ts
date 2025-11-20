import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "2pck7pm45e.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
