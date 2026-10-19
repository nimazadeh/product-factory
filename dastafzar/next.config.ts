import type { NextConfig } from "next";

// Browser never talks to the API port directly: /api-backend/* is proxied to NestJS.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [{ source: "/api-backend/:path*", destination: `${process.env.API_INTERNAL ?? "http://localhost:4000"}/api/:path*` }];
  },
};
export default nextConfig;
