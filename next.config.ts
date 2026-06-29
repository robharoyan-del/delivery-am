import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // react-markdown and remark-gfm are ESM-only; Next.js must transpile them
  transpilePackages: ["react-markdown", "remark-gfm", "remark-parse", "unified", "vfile", "unist-util-visit"],
};

export default nextConfig;
