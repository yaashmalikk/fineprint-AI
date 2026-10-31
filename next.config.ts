import type { NextConfig } from "next";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" ? "/fineprint-AI" : "");

const nextConfig: NextConfig = {
  // Removed `output: "export"` to enable API routes (/api/verify)
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
