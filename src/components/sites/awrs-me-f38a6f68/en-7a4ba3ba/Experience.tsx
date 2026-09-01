"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Code2,
  FlaskConical,
  Microscope,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionEmpty } from "./SectionEmpty";

interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  description: string;
  tags: string;
  icon: LucideIcon;
  color: string;
}

const experience: ExperienceItem[] = [
  {
    period: "AUG 2026 – PRESENT",
    role: "Full-Stack Developer",
    org: "Spot Group",
    description:
      "Building and maintaining software across the front end and the back end.",
    tags: "Front-end · Back-end",
    icon: Code2,
    color: "#d4547e",
  },
  {
    period: "NOV 2025 · JAN – MAY 2026",
    role: "Software Intern",
    org: "imec",
    description:
      "Software data analysis: built a tool that collects and processes data from measurement instruments.",
    tags: "Data analysis · Software development",
    icon: FlaskConical,
    color: "#3b82f6",
  },
  {
    period: "JUL – DEC 2025",
    role: "Student Worker",
    org: "imec",
    description: "Software work alongside my studies at UCLL.",
    tags: "Software development",
    icon: Microscope,
    color: "#10b981",
  },
  {
    period: "SEP 2023 – JAN 2025",
    role: "Retail Assistant",
    org: "Colruyt Group — OKay Rotselaar",
    description:
      "Store work alongside my studies: customer service and day-to-day shop floor operations.",
    tags: "Customer service · Teamwork",
    icon: ShoppingCart,
    color: "#f59e0b",
  },
  {
    period: "JUL 2020 – JUL 2025",
    role: "Playground Leader",
    org: "Stad Leuven — Wilsele",
    description:
      "Ran activities for groups of children over five summers, as part of the city's playground team.",
    tags: "Teamwork · Communication",
    icon: Users,
    color: "#8b5cf6",
  },
];

/** Fires once when the element enters the viewport, then disconnects. */
function ExperienceEntryText({ entry }: { entry: ExperienceItem }) {
  return (
    <>
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: entry.color }}
      >
        {entry.period}
      </p>
      <h3 className="mt-1 text-xl font-bold">{entry.role}</h3>
      <p className="text-sm font-medium" style={{ color: entry.color }}>
        {entry.org}
      </p>
      <p className="mt-2 text-[var(--awrs-text-secondary)] leading-relaxed">
        {entry.description}
      </p>
      <p className="mt-2 text-xs text-[var(--awrs-text-tertiary)]">{entry.tags}</p>
    </>
  );
}

function ExperienceEntry({ entry, index }: { entry: ExperienceItem; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const isEven = index % 2 === 0;
  const Icon = entry.icon;

  return (
    <div
      ref={ref}
      data-reveal="up"
      data-visible={visible ? "true" : undefined}
      className="relative border-s-[3px] md:border-s-0 ps-5 md:ps-0 border-[var(--awrs-border)]"
    >
      <div className="flex items-center gap-3 md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:flex-col">
        <div className="relative flex items-center justify-center">
          <div
            className="awrs-marker-ring pointer-events-none absolute h-11 w-11 rounded-full border-2"
            style={{ borderColor: `${entry.color}40` }}
            aria-hidden="true"
          />
          <div
            className="awrs-timeline-dot relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 text-white"
            style={{ background: entry.color }}
          >
            <Icon size={16} className="md:hidden" />
            <Icon size={22} className="hidden md:block" />
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-16">
        <div className={isEven ? "md:col-start-1 md:text-right md:pr-20" : "md:col-start-1"}>
          {isEven && <ExperienceEntryText entry={entry} />}
        </div>
        <div className={!isEven ? "md:col-start-2 md:pl-20" : "md:col-start-2"}>
          {!isEven && <ExperienceEntryText entry={entry} />}
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black">Experience</h2>
          <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-16" />
        </Reveal>
        {experience.length === 0 ? (
          <SectionEmpty>No roles listed yet.</SectionEmpty>
        ) : (
          <div className="relative">
            <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[var(--awrs-border)]" />
            <div className="flex flex-col gap-10 md:gap-20">
              {experience.map((entry, index) => (
                <ExperienceEntry key={entry.role} entry={entry} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
