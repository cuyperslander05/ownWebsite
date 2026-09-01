import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * The static export has no server to generate this per request, so it is
 * rendered to a file at build time.
 */
export const dynamic = "force-static";

/**
 * Served at /robots.txt. Everything is crawlable, including /_next assets —
 * blocking scripts or styles would stop Google from rendering the page — and
 * the sitemap is advertised so crawlers do not have to guess its location.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
