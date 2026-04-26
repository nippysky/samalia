import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     dangerouslyAllowSVG: true,
    qualities: [25, 50, 70, 75, 90, 92, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com", 
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
