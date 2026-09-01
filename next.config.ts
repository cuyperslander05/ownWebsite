import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: GitHub Pages serves plain files, it cannot run a Node
  // server. Every route in this site is prerendered anyway, so nothing is
  // lost — but note that adding an API route or server-side rendering later
  // means moving to a host that runs Node (Vercel and friends).
  output: "export",
  agentRules: false,

  // Emits privacy/index.html instead of privacy.html. Without this the export
  // also leaves a privacy/ directory holding the client-navigation payloads,
  // and which of the two a static host serves for /privacy is host-specific.
  // A directory with an index.html is unambiguous everywhere.
  trailingSlash: true,

  images: {
    // There is no image optimisation server on a static host, so next/image
    // has to serve the files as they are.
    unoptimized: true,
  },

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
