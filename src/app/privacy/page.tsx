import type { Metadata } from "next";

import { ContentPage } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, pageOpenGraph } from "@/lib/site";
import { graph, webPageSchema, type Crumb } from "@/lib/structured-data";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "What this site does and does not collect: no analytics, no advertising, no cookies, and a single theme preference kept in your own browser.";
const UPDATED = "31 August 2026";

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: TITLE, path: "/privacy" },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph({
    path: "/privacy",
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
  }),
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/privacy",
            name: TITLE,
            description: DESCRIPTION,
            crumbs: CRUMBS,
          })
        )}
      />
      <ContentPage
        crumbs={CRUMBS}
        title={TITLE}
        intro="This is a personal portfolio. It has no accounts, no sign-up and no tracking — the short version is that it collects nothing about you."
      >
        <p className="text-sm">Last updated: {UPDATED}</p>

        <h2>What this site collects</h2>
        <p>
          Nothing. There is no analytics script, no advertising network, no
          embedded social widget and no third-party tag of any kind on these
          pages. No cookies are set, and there is no contact form — the only way
          to reach out is the email link, which opens your own mail client.
        </p>

        <h2>What is stored in your browser</h2>
        <p>
          One thing: if you use the theme toggle in the command palette, your
          choice is saved in your browser&apos;s local storage under the key{" "}
          <code>theme</code>, so the site remembers it on your next visit. It
          stays on your device, is never transmitted anywhere, and clearing your
          browser data removes it.
        </p>

        <h2>Fonts and images</h2>
        <p>
          The Inter typeface is self-hosted and served from this domain, so
          loading a page makes no request to Google Fonts or any other outside
          host. All images are served from this site.
        </p>

        <h2>Server logs</h2>
        <p>
          The hosting provider that serves these pages may keep standard access
          logs — such as the requested URL, timestamp, user agent and IP address
          — for security and troubleshooting. That is ordinary infrastructure
          logging, it is not used to profile visitors, and it is not combined
          with anything else.
        </p>

        <h2>Email</h2>
        <p>
          If you email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, that message and your
          address are held in the mailbox for as long as needed to reply and keep
          a record of the conversation. They are not added to a mailing list and
          not shared with anyone.
        </p>

        <h2>External links</h2>
        <p>
          Links to GitHub, LinkedIn and other sites are governed by those
          services&apos; own privacy policies, not this one.
        </p>

        <h2>Your rights and contact</h2>
        <p>
          Because no personal data is collected here, there is nothing to
          request, correct or delete — apart from any email you have sent. For
          anything about this policy, write to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, the &quot;last updated&quot; date above changes
          with it.
        </p>
      </ContentPage>
    </>
  );
}
