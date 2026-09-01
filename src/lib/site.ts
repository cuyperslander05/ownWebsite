/**
 * Single source of truth for everything the SEO layer needs: canonical URLs,
 * metadata defaults, share images and structured data.
 *
 * Every value here is a fact the site owner has confirmed. Nothing is inferred
 * or invented — structured data that contradicts the page, or claims something
 * that is not true, is worse than no structured data at all.
 */

/**
 * Canonical origin, no trailing slash. Override per deploy with
 * NEXT_PUBLIC_SITE_URL (preview deploys, staging) — the fallback is the
 * production domain, so a missing env var still emits correct canonicals.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://landercodes.dev"
).replace(/\/$/, "");

export const SITE = {
  name: "Lander Cuypers",
  /** Used for the title template and og:site_name. */
  shortName: "Lander Cuypers",
  /** Shown in the hero; the rest is the surname, added for screen readers. */
  firstName: "Lander",
  initials: "LC",
  jobTitle: "Full-Stack Developer",
  email: "landercuypersdev@gmail.com",
  /** No city on purpose — only the country has been confirmed. */
  country: "BE",
  countryName: "Belgium",
  /** IANA zone for the region the site says it works from. */
  timeZone: "Europe/Brussels",
  github: "https://github.com/cuyperslander05",
  linkedin: "https://www.linkedin.com/in/lander-cuypers-094123351",
  githubHandle: "cuyperslander05",
} as const;

/** 1200x630 share card, served from the site's own asset folder. */
export const OG_IMAGE = {
  url: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/og-image.png",
  width: 1200,
  height: 630,
  alt: "Lander Cuypers — Full-Stack Developer",
} as const;

/**
 * Absolute URL for a site-relative path. Structured data must not use relative
 * URLs.
 *
 * Page paths get a trailing slash to match `trailingSlash: true`, so canonical
 * tags, the sitemap and the structured data all name the exact URL the host
 * serves. Files keep their extension untouched (/sitemap.xml, not
 * /sitemap.xml/), and a fragment stays attached to the end.
 */
export function absoluteUrl(path = "/") {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const [pathname, fragment] = withLeadingSlash.split("#");
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const normalized =
    isFile || pathname.endsWith("/") ? pathname : `${pathname}/`;

  return `${SITE_URL}${normalized}${fragment ? `#${fragment}` : ""}`;
}

/**
 * Complete openGraph block for a page.
 *
 * Next.js overwrites — rather than deep-merges — the `openGraph` object when a
 * page declares one, so every page has to restate type, siteName, locale and
 * the share image. Building it here keeps that from being forgotten.
 */
export function pageOpenGraph({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    type: "website" as const,
    siteName: SITE.name,
    locale: "en_US",
    url: path,
    title,
    description,
    images: [{ ...OG_IMAGE }],
  };
}

/** Every indexable route, in sitemap order. Keep in sync with the app router. */
export const ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** The on-page sections, used for the 404's links and llms.txt. */
export const SECTIONS = [
  { id: "about", label: "About", summary: "Background, timezone and education." },
  { id: "experience", label: "Experience", summary: "Roles and what was shipped in each." },
  { id: "skills", label: "Skills", summary: "Languages, frameworks and tooling." },
  { id: "projects", label: "Projects", summary: "Selected work." },
  { id: "achievements", label: "Achievements", summary: "Awards, certifications and milestones." },
  { id: "github", label: "Code & Contributions", summary: "Open-source activity." },
  { id: "misc", label: "The Wall", summary: "Personal picks outside of work." },
  { id: "contact", label: "Contact", summary: "How to get in touch." },
] as const;
