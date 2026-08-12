import type { NextConfig } from "next";

const templateGlobs = [
  // Non-dot template tree (skills/rules live under dot-cursor / dot-agents — NFT-safe)
  "./templates/deck-machine/**/*",
];

const nextConfig: NextConfig = {
  // Ensure Studio zip generation can read the full Mustache template tree on Vercel.
  // Without this, Node file tracing only picks up a subset and omits Cursor primitives.
  outputFileTracingIncludes: {
    "/api/generate": templateGlobs,
    "/api/generate/preview": templateGlobs,
  },
};

export default nextConfig;
