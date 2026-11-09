import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://3.15.160.249:3000/:path*",
      },
    ];
  },
};

export default nextConfig;
