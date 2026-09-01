import type { ReactNode } from "react";

import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";
import type { Crumb } from "@/lib/structured-data";

/**
 * Shell for the text pages (privacy, terms) and the 404: same nav and footer as
 * the home page, a breadcrumb trail, and exactly one h1.
 */
export function ContentPage({
  crumbs,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl px-6 pb-24">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="mt-6 text-4xl font-black md:text-5xl">{title}</h1>
          <div className="mt-4 h-1 w-10 rounded-full bg-[var(--awrs-primary)]" />
          {intro && (
            <p className="mt-6 text-lg leading-relaxed text-[var(--awrs-text-secondary)]">
              {intro}
            </p>
          )}
          <div className="awrs-prose mt-10">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
