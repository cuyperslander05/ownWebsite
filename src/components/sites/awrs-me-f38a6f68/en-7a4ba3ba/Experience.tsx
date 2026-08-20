"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Code2, Globe, Smartphone, type LucideIcon } from "lucide-react";

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
    period: "FEB 2025 – OCT 2025",
    role: "Software Engineering Intern",
    org: "Code Buddy Oman",
    description:
      "Led Back-End and Mobile App teams. Built Manssat Sanad, a bilingual business management platform with PHP & MySQL.",
    tags: "PHP · MySQL · Flutter · Leadership",
    icon: Code2,
    color: "#d4547e",
  },
  {
    period: "JAN 2025 – APR 2026",
    role: "Peer Tutor",
    org: "Sohar University",
    description:
      "Tutored Operating Systems, Algorithms & Data Structures, OOP, and Web Information Systems.",
    tags: "Algorithms · Data Structures · OOP",
    icon: BookOpen,
    color: "#3b82f6",
  },
  {
    period: "AUG 2024 – SEP 2024",
    role: "Mobile Application Developer",
    org: "Code Buddy Oman",
    description:
      "Contributed to front-end development of a mobile ERP application using Flutter & Dart. Built fully responsive UI components for Android and iOS.",
    tags: "Flutter · Dart · Android · iOS",
    icon: Smartphone,
    color: "#10b981",
  },
  {
    period: "APR 2024 – JUN 2024",
    role: "Web Development Intern",
    org: "INTAJ SUHAR",
    description:
      "Designed and developed a responsive website. Collaborated with the team on requirements, navigation, and layout optimization.",
    tags: "Web Development · Responsive Design · UI Design · Project Management",
    icon: Globe,
    color: "#f59e0b",
  },
];

/** Fires once when the element enters the viewport, then disconnects. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const observerEntry of entries) {
          if (observerEntry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

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
  const { ref, isVisible } = useInView<HTMLDivElement>();
  const isEven = index % 2 === 0;
  const Icon = entry.icon;

  return (
    <div
      ref={ref}
      className="relative border-s-[3px] md:border-s-0 ps-5 md:ps-0 border-[var(--awrs-border)] transition-all duration-[600ms] ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="flex items-center gap-3 md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:flex-col">
        <div
          className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 text-white"
          style={{ background: entry.color }}
        >
          <Icon size={16} className="md:hidden" />
          <Icon size={22} className="hidden md:block" />
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
        <h2 className="text-4xl md:text-5xl font-black">Experience</h2>
        <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-16" />
        <div className="relative">
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[var(--awrs-border)]" />
          <div className="flex flex-col gap-10 md:gap-20">
            {experience.map((entry, index) => (
              <ExperienceEntry key={entry.role} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
