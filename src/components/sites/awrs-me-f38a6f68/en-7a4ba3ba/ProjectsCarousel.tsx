"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Eye, LayoutGrid, Lock } from "lucide-react";

import { PROJECTS, type Project } from "@/lib/projects";
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionEmpty } from "./SectionEmpty";

interface ProjectCardProps extends Project {
  index: string;
}

function ProjectCard({
  title,
  category,
  date,
  description,
  logo,
  shots,
  tags,
  cardBg,
  index,
}: ProjectCardProps) {
  return (
    <div className="group relative w-[350px] shrink-0 rounded-2xl overflow-hidden border border-[var(--awrs-border)] bg-[var(--awrs-card)]">
      <div
        className="awrs-rotate-border-ring pointer-events-none absolute inset-0 z-30 rounded-2xl p-px opacity-0 transition-opacity duration-500 [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)] group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between text-xs">
          <span className="w-6 h-6 rounded-md bg-[var(--awrs-bg-secondary)] flex items-center justify-center font-bold text-[10px]">
            {index}
          </span>
          <span className="uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
            {category}
          </span>
          <span className="text-[var(--awrs-text-tertiary)]">{date}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logo}
              className="w-8 h-8 rounded-lg object-cover"
              alt={`${title} app icon`}
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--awrs-bg-secondary)] text-xs font-bold text-[var(--awrs-text-tertiary)]"
              aria-hidden="true"
            >
              {title.charAt(0)}
            </span>
          )}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-[var(--awrs-text-secondary)] leading-snug line-clamp-2">
          {description}
        </p>
      </div>

      <div
        className="relative mt-4 aspect-[4/3] overflow-hidden"
        style={{ background: cardBg }}
      >
        <div className="pointer-events-none absolute inset-0 bg-white/5" aria-hidden="true" />
        <div className="awrs-image-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />
        {shots ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shots[0]}
              className="absolute w-[38%] rotate-[-8deg] -translate-x-[70%] z-0 rounded-xl shadow-xl"
              alt={`${title} app screen 1 of 3`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shots[2]}
              className="absolute w-[38%] rotate-[8deg] translate-x-[70%] z-0 rounded-xl shadow-xl"
              alt={`${title} app screen 3 of 3`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shots[1]}
              className="absolute w-[42%] z-10 rounded-xl shadow-2xl"
              alt={`${title} app screen 2 of 3`}
            />
          </div>
        ) : (
          /* Closed-source work: say so plainly rather than inventing a mockup. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white/85">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Lock size={22} aria-hidden="true" />
            </span>
            <p className="px-8 text-sm font-medium">
              Closed source — screenshots can&apos;t be shared
            </p>
          </div>
        )}

        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-black/80 backdrop-blur flex items-center justify-center z-20">
          <div
            className="absolute inset-1 rounded-full border border-dashed border-white/30 animate-spin"
            style={{ animationDuration: "10s" }}
            aria-hidden="true"
          />
          <Eye className="text-white" size={20} />
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--awrs-card)] border border-[var(--awrs-border)] flex items-center justify-center z-20">
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="p-5 pt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--awrs-bg-secondary)] text-[var(--awrs-text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ViewAllCard() {
  return (
    <div className="group/cta relative w-[350px] shrink-0 overflow-hidden rounded-2xl border border-[var(--awrs-border)] flex flex-col items-center justify-center text-center gap-4 p-8">
      <div
        className="awrs-cta-aurora pointer-events-none absolute -top-1/2 -left-1/4 h-full w-3/4 rounded-full bg-[var(--awrs-primary)] opacity-[0.04] blur-3xl transition-opacity duration-1000 group-hover/cta:opacity-[0.08]"
        style={{ animationDuration: "12s" }}
        aria-hidden="true"
      />
      <div
        className="awrs-cta-aurora-alt pointer-events-none absolute -bottom-1/3 -right-1/4 h-3/4 w-2/3 rounded-full bg-[var(--awrs-primary)] opacity-[0.03] blur-3xl transition-opacity duration-1000 group-hover/cta:opacity-[0.06]"
        style={{ animationDuration: "15s" }}
        aria-hidden="true"
      />
      <div
        className="awrs-rotate-border-ring pointer-events-none absolute -inset-3.5 rounded-[1.75rem] p-px opacity-0 transition-opacity duration-500 [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)] group-hover/cta:opacity-100"
        aria-hidden="true"
      />
      <div
        className="awrs-cta-shimmer-layer pointer-events-none absolute inset-0 opacity-0 group-hover/cta:opacity-100"
        aria-hidden="true"
      />
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--awrs-primary)]/10 flex items-center justify-center">
        <LayoutGrid className="text-[var(--awrs-primary)]" size={28} />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold">View All Projects</h3>
        <p className="mt-1 text-sm text-[var(--awrs-text-secondary)]">
          The full collection lives on GitHub
        </p>
      </div>
      <a
        href={SITE.github}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[var(--awrs-border)] px-5 py-2.5 font-medium text-sm"
      >
        Explore on GitHub <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export function ProjectsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /** How far the row of cards extends past the viewport. 0 means it all fits. */
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const wrap = trackWrapRef.current;
    if (!wrap) return;

    // The track is always laid out at its intrinsic width (w-max), in both
    // modes, so this measurement stays valid whichever branch is rendered.
    const measure = () =>
      setOverflow(Math.max(wrap.scrollWidth - window.innerWidth, 0));

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /**
   * The cards only take over the scroll when there are more of them than fit on
   * screen. With a couple of projects on a wide display everything is already
   * visible, so pinning the section and demanding 2400px of scrolling would be
   * a toll booth for nothing.
   */
  const isPinned = overflow > 0;

  /**
   * Drives the horizontal track from vertical scroll: progress runs 0 → 1
   * between the container's top meeting the top of the viewport and its bottom
   * meeting the bottom, and the track translates by that fraction of its
   * overflow. Reads and writes happen inside one rAF, so scrolling never
   * interleaves layout reads with style writes.
   */
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    if (!isPinned) {
      track.style.transform = "";
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range <= 0 ? 0 : Math.min(Math.max(-rect.top / range, 0), 1);
      track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isPinned, overflow]);

  if (PROJECTS.length === 0) {
    return (
      <section id="projects" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black">
              Featured <span style={{ color: "var(--awrs-primary)" }}>Projects</span>
            </h2>
            <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
          </Reveal>
          <SectionEmpty>
            No projects published yet — the code lives on{" "}
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--awrs-primary)] underline underline-offset-2"
            >
              GitHub
            </a>{" "}
            in the meantime.
          </SectionEmpty>
        </div>
      </section>
    );
  }

  const cards = (
    <div ref={trackWrapRef} className="w-max">
      <div
        ref={trackRef}
        className="mt-10 flex gap-6 px-6 md:px-12 w-max will-change-transform"
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.title}
            {...project}
            index={String(i + 1).padStart(2, "0")}
          />
        ))}
        <ViewAllCard />
      </div>
    </div>
  );

  const heading = (
    <Reveal className="px-6 md:px-12">
      <h2 className="text-4xl md:text-5xl font-black">
        Featured <span style={{ color: "var(--awrs-primary)" }}>Projects</span>
      </h2>
    </Reveal>
  );

  if (!isPinned) {
    // Everything fits: an ordinary section, no pinning and no extra scroll
    // distance. overflow-x-auto is only a safety net for a viewport that
    // changes between the measurement and the paint.
    return (
      <section id="projects" className="py-20 md:py-28">
        {heading}
        <div className="flex justify-center overflow-x-auto">{cards}</div>
      </section>
    );
  }

  return (
    <div
      id="projects"
      ref={containerRef}
      className="relative"
      // The scroll distance matches the horizontal distance, so the cards move
      // at roughly the speed of the page instead of at a fixed 2400px rate.
      style={{ height: `calc(100vh + ${overflow}px)` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {heading}
        {cards}
      </div>
    </div>
  );
}
