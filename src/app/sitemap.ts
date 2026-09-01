import type { MetadataRoute } from "next";

import { ROUTES, absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml. Only indexable routes belong here — the 404 is
 * deliberately absent, and so are the on-page section anchors, which are not
 * separate URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
