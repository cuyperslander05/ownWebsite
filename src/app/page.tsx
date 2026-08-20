import { Nav } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Nav";
import { Hero } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Hero";
import { AboutSection } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/AboutSection";
import { Experience } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Experience";
import { Skills } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Skills";
import { ProjectsCarousel } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ProjectsCarousel";
import { Achievements } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Achievements";
import { GithubSection } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/GithubSection";
import { MiscWall } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/MiscWall";
import { ContactCTA } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContactCTA";
import { Footer } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-20">
        <Hero />
        <AboutSection />
        <Experience />
        <Skills />
        <ProjectsCarousel />
        <Achievements />
        <GithubSection />
        <MiscWall />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
