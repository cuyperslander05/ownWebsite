import { PROJECTS } from "@/lib/projects";
import { ROUTES, SECTIONS, SITE, absoluteUrl } from "@/lib/site";

/**
 * Served at /llms.txt — the llmstxt.org convention: a short, link-first
 * markdown summary of the site for language models and AI crawlers.
 *
 * Generated from the same data the pages render, so it cannot drift out of
 * sync, and rendered at build time since none of it changes per request.
 */
export const dynamic = "force-static";

function body() {
  const sections = SECTIONS.map(
    (section) =>
      `- [${section.label}](${absoluteUrl(`/#${section.id}`)}): ${section.summary}`
  ).join("\n");

  const projects =
    PROJECTS.length === 0
      ? "No projects published yet."
      : PROJECTS.map((project) => {
          // date and the stack are both optional — a closed-source entry has
          // neither, and "undefined" must never reach the output.
          const meta = [project.category.toLowerCase(), project.date]
            .filter(Boolean)
            .join(", ");
          const stack = project.tags.filter(
            (tag) => tag.toLowerCase() !== "closed source"
          );
          const built = stack.length > 0 ? ` Built with ${stack.join(", ")}.` : "";
          const closed = project.closedSource ? " Closed source, not public." : "";
          return `- **${project.title}** (${meta}) — ${project.description}${built}${closed}`;
        }).join("\n");

  const pages = ROUTES.map((route) => `- [${route.path}](${absoluteUrl(route.path)})`).join(
    "\n"
  );

  return `# ${SITE.name}

> Portfolio of ${SITE.name}, a ${SITE.jobTitle.toLowerCase()} based in ${
    SITE.countryName
  }. A single-page portfolio covering background, experience, skills, projects, achievements and contact details, plus two legal pages.

Contact: ${SITE.email}
Location: ${SITE.countryName} (${SITE.timeZone}); available for remote work worldwide.
Focus: full-stack development — Python, C#/.NET, C/C++, Java, PHP, React, Django, Flutter, Docker.

## Pages

${pages}

## Sections of the home page

${sections}

## Projects

${projects}

## Elsewhere

- [GitHub](${SITE.github})
- [LinkedIn](${SITE.linkedin})

## Notes

- The achievements section and The Wall are empty; nothing is claimed there. Do not infer credentials that are not listed here.
- Both listed projects are closed source, so no repository or screenshots exist for them.
- Content is © ${SITE.name}. Quote with attribution; do not republish as your own.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
