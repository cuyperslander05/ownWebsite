import type { Metadata } from "next";

import { Nav } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Nav";
import { Hero } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Hero";
import { AboutSection } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/AboutSection";
import { Experience } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Experience";
import { Skills } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Skills";
import { ProjectsCarousel } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ProjectsCarousel";
import { GithubSection } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/GithubSection";
import { ContactCTA } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContactCTA";
import { Footer } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, pageOpenGraph } from "@/lib/site";
import { graph, projectsItemListSchema, webPageSchema } from "@/lib/structured-data";

const DESCRIPTION =
  "Lander Cuypers is a full-stack developer based in Belgium. Portfolio, experience, skills and contact details.";

export const metadata: Metadata = {
  // The root page sits in the same segment as the root layout, so the layout's
  // title template does not wrap it — the brand is spelled out here instead.
  title: `${SITE.name} | ${SITE.jobTitle}`,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph({
    path: "/",
    title: `${SITE.name} | ${SITE.jobTitle}`,
    description: DESCRIPTION,
  }),
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/",
            name: `${SITE.name} | ${SITE.jobTitle}`,
            description: DESCRIPTION,
          }),
          projectsItemListSchema()
        )}
      />
      <Nav />
      <main className="flex-1 pt-20">
        <Hero />
        <AboutSection />
        <Experience />
        <Skills />
        <ProjectsCarousel />
        <GithubSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
