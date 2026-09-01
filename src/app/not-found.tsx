import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContentPage } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContentPage";
import { SECTIONS, SITE } from "@/lib/site";
import type { Crumb } from "@/lib/structured-data";

const CRUMBS: Crumb[] = [{ name: "Home", path: "/" }, { name: "Page not found" }];

export const metadata: Metadata = {
  title: "Page not found (404)",
  description:
    "That page does not exist. Jump back to the portfolio: projects, experience, skills or contact.",
  // A 404 must never be indexed, and there is no canonical URL for a page that
  // does not exist — so neither is declared here.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ContentPage
      crumbs={CRUMBS}
      title="This page doesn't exist"
      intro="The link may be out of date, or the address slightly off. Nothing is broken on your end — here is the way back."
    >
      <p>
        Pick a section below, or head straight to the{" "}
        <Link href="/">home page</Link>.
      </p>

      <ul className="mt-8 grid list-none gap-3 pl-0 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <li key={section.id} className="mt-0">
            <Link
              href={`/#${section.id}`}
              className="group flex h-full flex-col rounded-xl border border-[var(--awrs-border)] p-4 text-[var(--awrs-text)] no-underline transition-colors hover:border-[var(--awrs-primary)]"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                {section.label}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
              <span className="mt-1 text-sm text-[var(--awrs-text-secondary)]">
                {section.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>Still stuck?</h2>
      <p>
        If a link on this site sent you here, tell me where it was and I will fix
        it: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
