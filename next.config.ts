import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     dangerouslyAllowSVG: true,
    qualities: [25, 50, 70, 75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com", 
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
