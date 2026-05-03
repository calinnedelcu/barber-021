import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repo>/ — set NEXT_PUBLIC_BASE_PATH
// in the deploy workflow to "/barber-021" so all asset/link paths get
// prefixed automatically. Locally we run without basePath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages is fully static — Next/Image's optimizer can't run there.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default config;
