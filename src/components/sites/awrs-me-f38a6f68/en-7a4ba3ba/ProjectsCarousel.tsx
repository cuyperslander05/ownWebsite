"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Eye, LayoutGrid } from "lucide-react";

interface Project {
  title: string;
  category: string;
  date: string;
  description: string;
  logo: string;
  shots: [string, string, string];
  tags: string[];
  cardBg: string;
}

const projects: Project[] = [
  {
    title: "Huda",
    category: "MULTIPLATFORM APP",
    date: "Q1 2025",
    description:
      "A comprehensive Islamic companion app for daily worship and spiritual growth",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/logo_huda.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/1.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/2.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/3.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Islamic", "Mobile"],
    cardBg: "linear-gradient(135deg, #0f4d47, #1a6b5f)",
  },
  {
    title: "Manara",
    category: "MOBILE APP",
    date: "Q2 2026",
    description:
      "A comprehensive safety app for pilgrims and mass gatherings with real-time group tracking, emergency reporting, and AR-powered smart navigation",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/icon.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/1.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/2.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/3.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Safety", "AR"],
    cardBg: "linear-gradient(135deg, #0d3b45, #145566)",
  },
  {
    title: "Navix",
    category: "MOBILE APP",
    date: "Q2 2026",
    description:
      "An AI-powered project management platform that turns your skills and goals into complete projects — idea generation, PRDs, roadmaps, and risk analysis — powered by Navi, a custom in-house fine-tuned LLM",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/logo.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "AI", "LLM"],
    cardBg: "linear-gradient(135deg, #5c1a2e, #7a2440)",
  },
  {
    title: "Healog",
    category: "MOBILE APP",
    date: "Q2 2026",
    description:
      "A smart health record digitizer that extracts medical metrics from lab reports using AI, tracks health trends with charts, and manages medication reminders",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/logo.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Gemini AI", "Health"],
    cardBg: "linear-gradient(135deg, #6b1a4a, #8a2560)",
  },
  {
    title: "Sire",
    category: "MULTIPLATFORM APP",
    date: "Q2 2025",
    description:
      "A modern, full-stack, multi-role e-commerce platform built with Flutter and PHP",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/logo_sire.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "PHP", "MySQL", "Firebase"],
    cardBg: "linear-gradient(135deg, #7a2a4a, #9c3860)",
  },
];

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
    <div className="w-[350px] shrink-0 rounded-2xl overflow-hidden border border-[var(--awrs-border)] bg-[var(--awrs-card)]">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} className="w-8 h-8 rounded-lg object-cover" alt="" />
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
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[0]}
            className="absolute w-[38%] rotate-[-8deg] -translate-x-[70%] z-0 rounded-xl shadow-xl"
            alt=""
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[2]}
            className="absolute w-[38%] rotate-[8deg] translate-x-[70%] z-0 rounded-xl shadow-xl"
            alt=""
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[1]}
            className="absolute w-[42%] z-10 rounded-xl shadow-2xl"
            alt={`${title} app screenshot`}
          />
        </div>

        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-black/80 backdrop-blur flex items-center justify-center z-20">
          <div
            className="absolute inset-1 rounded-full border border-dashed border-white/30 animate-spin"
            style={{ animationDuration: "8s" }}
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
    <div className="w-[350px] shrink-0 rounded-2xl border border-[var(--awrs-border)] flex flex-col items-center justify-center text-center gap-4 p-8">
      <div className="w-16 h-16 rounded-2xl bg-[var(--awrs-primary)]/10 flex items-center justify-center">
        <LayoutGrid className="text-[var(--awrs-primary)]" size={28} />
      </div>
      <div>
        <h3 className="text-xl font-bold">View All Projects</h3>
        <p className="mt-1 text-sm text-[var(--awrs-text-secondary)]">
          See the full collection
        </p>
      </div>
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--awrs-border)] px-5 py-2.5 font-medium text-sm"
      >
        Explore <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export function ProjectsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(2200);

  useEffect(() => {
    function measure() {
      if (trackWrapRef.current) {
        const overflow = trackWrapRef.current.scrollWidth - window.innerWidth;
        setMaxTranslate(Math.max(overflow, 0));
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);

  return (
    <div
      id="projects"
      ref={containerRef}
      className="relative"
      style={{ height: "calc(100vh + 2400px)" }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <h2 className="px-6 md:px-12 text-4xl md:text-5xl font-black">
          Featured <span style={{ color: "var(--awrs-primary)" }}>Projects</span>
        </h2>
        <div ref={trackWrapRef} className="w-max">
          <motion.div style={{ x }} className="mt-10 flex gap-6 px-6 md:px-12 w-max">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                {...project}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
            <ViewAllCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
