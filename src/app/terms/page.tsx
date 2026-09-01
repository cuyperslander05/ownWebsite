import type { Metadata } from "next";

import { ContentPage } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, pageOpenGraph } from "@/lib/site";
import { graph, webPageSchema, type Crumb } from "@/lib/structured-data";

const TITLE = "Terms of Use";
const DESCRIPTION =
  "The terms for using this portfolio site: what you may do with the content, what the project showcases represent, and the limits of any warranty.";
const UPDATED = "31 August 2026";

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: TITLE, path: "/terms" },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms/" },
  openGraph: pageOpenGraph({
    path: "/terms",
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
  }),
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/terms",
            name: TITLE,
            description: DESCRIPTION,
            crumbs: CRUMBS,
          })
        )}
      />
      <ContentPage
        crumbs={CRUMBS}
        title={TITLE}
        intro="Plain terms for a personal portfolio: read it, share it, hire me — just don't pass the work off as your own."
      >
        <p className="text-sm">Last updated: {UPDATED}</p>

        <h2>Using this site</h2>
        <p>
          You are welcome to browse these pages, link to them, and quote short
          extracts with attribution. Please do not republish the content as your
          own, or present the case studies here as your work.
        </p>

        <h2>Content and ownership</h2>
        <p>
          The writing, design and code of this site belong to {SITE.name}. Any
          project names, logos and screenshots shown in the projects section
          belong to the products and clients they represent, and appear here
          only to document work that was done on them.
        </p>

        <h2>What the project showcases represent</h2>
        <p>
          The projects, experience and figures on this site describe past and
          ongoing work. They are a portfolio, not an offer, a specification or a
          guarantee of any particular result on future work.
        </p>

        <h2>Availability and accuracy</h2>
        <p>
          This site is provided as is. It may be offline, moved or changed at any
          time, and while the content is kept accurate, no warranty of any kind
          is given about its completeness or fitness for a particular purpose. To
          the extent permitted by law, no liability is accepted for any loss
          arising from its use.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Outbound links — to GitHub, LinkedIn and elsewhere — are provided for
          convenience. Those sites have their own terms, and are not controlled
          from here.
        </p>

        <h2>Getting in touch</h2>
        <p>
          Questions about these terms, or about working together, go to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </ContentPage>
    </>
  );
}
