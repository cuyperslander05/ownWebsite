"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiFlutter,
  SiDart,
  SiKotlin,
  SiSwift,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiPython,
  SiPhp,
  SiGithub,
  SiGitlab,
  SiDocker,
  SiOllama,
  SiFigma,
  SiFirebase,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { Database } from "lucide-react";

interface Skill {
  name: string;
  Icon: IconType | typeof Database;
  color: string;
}

const skills: Skill[] = [
  { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
  { name: "Dart", Icon: SiDart, color: "#0175C2" },
  { name: "Kotlin", Icon: SiKotlin, color: "#7F52FF" },
  { name: "Java", Icon: FaJava, color: "#ED8B00" },
  { name: "Swift", Icon: SiSwift, color: "#F05138" },
  { name: "SwiftUI", Icon: SiSwift, color: "#F05138" },
  { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", Icon: SiCss, color: "#1572B6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "SQL", Icon: Database, color: "#4479A1" },
  { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "GitLab", Icon: SiGitlab, color: "#FC6D26" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Ollama", Icon: SiOllama, color: "#000000" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
];

interface SkillItemProps {
  skill: Skill;
  index: number;
  visible: boolean;
}

function SkillItem({ skill, index, visible }: SkillItemProps) {
  const { Icon, name, color } = skill;

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-2xl bg-[var(--awrs-card)] border border-[var(--awrs-border)] cursor-default transition hover:border-[var(--awrs-primary)]/40 hover:-translate-y-0.5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "0.4s",
        transitionTimingFunction: "ease-out",
        transitionDelay: `${Math.min(index * 30, 600)}ms`,
      }}
    >
      <Icon size={28} style={{ color }} />
      <span className="text-xs font-semibold text-[var(--awrs-text-secondary)] tracking-wide">
        {name}
      </span>
    </div>
  );
}

export function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Skills</h2>
        <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
        >
          {skills.map((skill, index) => (
            <SkillItem key={skill.name + index} skill={skill} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
