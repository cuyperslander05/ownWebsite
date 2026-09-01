/**
 * Project data for the Projects carousel.
 *
 * Kept in a plain data module rather than inside the (client) carousel so the
 * server components can read it too — the home page emits it as ItemList
 * structured data, and it feeds the image alt text.
 *
 * `logo`, `shots` and `date` are optional: closed-source work that cannot be
 * shown still belongs in the list, and the card renders a locked panel instead
 * of screenshots. To add an open project, drop its images under
 * `public/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/<slug>/` and set
 * `logo` and `shots`.
 */

export interface Project {
  title: string;
  category: string;
  /** Omit when the timeframe is not being published. */
  date?: string;
  description: string;
  /** Omit for closed-source work with nothing to show. */
  logo?: string;
  shots?: [string, string, string];
  tags: string[];
  cardBg: string;
  /** Renders the locked panel and a "Closed source" note instead of screenshots. */
  closedSource?: boolean;
}

export const IMG = "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects";

export const PROJECTS: Project[] = [
  {
    title: "School Monitoring Tool",
    category: "INTERNAL TOOL",
    description:
      "A monitoring tool built for a school, keeping track of the systems it runs on.",
    tags: ["Closed source"],
    cardBg: "linear-gradient(135deg, #0d3b45, #145566)",
    closedSource: true,
  },
  {
    title: "imec Check-in & Reservation Tool",
    category: "INTERNAL TOOL",
    description:
      "A checking and reservation tool built for imec, used internally rather than published.",
    tags: ["Closed source"],
    cardBg: "linear-gradient(135deg, #5c1a2e, #7a2440)",
    closedSource: true,
  },
];
