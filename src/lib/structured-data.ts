/**
 * schema.org JSON-LD builders.
 *
 * Everything is wired together with stable @id values so the graph resolves to
 * one Person, one WebSite and one business entity instead of duplicates that
 * search engines have to guess at. Only facts the site actually states are
 * emitted — no invented address, phone number or rating.
 */

import { PROJECTS } from "@/lib/projects";
import { OG_IMAGE, SITE, SITE_URL, absoluteUrl } from "@/lib/site";

export const ID = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  business: `${SITE_URL}/#business`,
} as const;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: SITE.name,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE.url),
    jobTitle: SITE.jobTitle,
    email: `mailto:${SITE.email}`,
    knowsAbout: [
      "Full-stack development",
      "Python",
      "C#",
      ".NET",
      "C++",
      "Java",
      "React",
      "Django",
      "Flutter",
      "PHP",
      "Docker",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Dutch", alternateName: "nl" },
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "French", alternateName: "fr" },
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "UCLL (University College Leuven-Limburg)",
    },
    // Country only: the street address and phone number on the CV are
    // deliberately not published.
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.country,
    },
    sameAs: [SITE.github, SITE.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: `${SITE.name} — Portfolio`,
    description:
      "Portfolio of Lander Cuypers, a full-stack developer based in Belgium.",
    inLanguage: "en",
    publisher: { "@id": ID.person },
  };
}

/**
 * The freelance/contract practice behind the "available for work" offer. It is
 * a service business with no storefront, so it carries an area served and a
 * country but deliberately no street address, locality or telephone.
 */
export function professionalServiceSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": ID.business,
    name: `${SITE.name} — ${SITE.jobTitle}`,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE.url),
    email: `mailto:${SITE.email}`,
    founder: { "@id": ID.person },
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.country,
    },
    areaServed: [
      { "@type": "Country", name: SITE.countryName },
      { "@type": "Place", name: "Worldwide (remote)" },
    ],
    serviceType: ["Full-stack web development"],
    sameAs: [SITE.github, SITE.linkedin],
  };
}

/**
 * ItemList of the projects, or null while there are none — an empty ItemList is
 * worse than no ItemList.
 */
export function projectsItemListSchema() {
  if (PROJECTS.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects`,
    name: "Selected projects",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: PROJECTS.length,
    itemListElement: PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description,
        applicationCategory: "BusinessApplication",
        author: { "@id": ID.person },
        keywords: project.tags.join(", "),
        // Only claim an image when there actually is one.
        ...(project.logo ? { image: absoluteUrl(project.logo) } : {}),
      },
    })),
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path; omitted for the current page. */
  path?: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

export function webPageSchema({
  path,
  name,
  description,
  crumbs,
}: {
  path: string;
  name: string;
  description: string;
  crumbs?: Crumb[];
}) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.person },
    inLanguage: "en",
    ...(crumbs ? { breadcrumb: breadcrumbSchema(crumbs) } : {}),
  };
}

/**
 * Wraps nodes in a single @graph document, which is how they get linked by @id.
 * Nulls are dropped so callers can pass a schema that opted out of rendering.
 */
export function graph(...nodes: (object | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is object => node !== null),
  };
}
