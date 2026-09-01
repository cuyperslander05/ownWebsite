import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  agentRules: false,

  // Never ship browser source maps to production: they roughly double the
  // static payload and hand out the unminified source.
  productionBrowserSourceMaps: false,

  // Don't advertise the framework in response headers.
  poweredByHeader: false,

  experimental: {
    // Rewrites barrel imports (`react-icons/si`, `lucide-react`) into direct
    // per-icon imports, so a handful of icons no longer drags in the whole set.
    optimizePackageImports: ["react-icons", "react-icons/si", "lucide-react"],
  },
};

export default nextConfig;
