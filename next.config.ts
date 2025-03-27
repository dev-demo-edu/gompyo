import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "www.ag-grid.com",
      },
    ],
  },
};
export default nextConfig;
