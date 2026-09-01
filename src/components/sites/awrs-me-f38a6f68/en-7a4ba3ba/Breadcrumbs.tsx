import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { Crumb } from "@/lib/structured-data";

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page through `webPageSchema({ crumbs })`, so the markup and the
 * structured data always describe the same trail from one source.
 *
 * The last crumb is the current page: it carries no link and is marked
 * aria-current, per the WAI-ARIA breadcrumb pattern.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--awrs-text-tertiary)]">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.name} className="flex items-center gap-1">
              {crumb.path && !isLast ? (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-[var(--awrs-primary)]"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-[var(--awrs-text-secondary)]">
                  {crumb.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight size={14} aria-hidden="true" className="opacity-60" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
