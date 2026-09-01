"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiFlutter,
  SiHtml5,
  SiOllama,
  SiPhp,
  SiPython,
  SiReact,
  SiSharp,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";

import { Reveal } from "./Reveal";
import { SectionEmpty } from "./SectionEmpty";

interface Skill {
  name: string;
  Icon: IconType;
  color: string;
}

const skills: Skill[] = [
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "C", Icon: SiC, color: "#5C6BC0" },
  { name: "C++", Icon: SiCplusplus, color: "#00599C" },
  { name: "C#", Icon: SiSharp, color: "#68217A" },
  { name: "Java", Icon: FaJava, color: "#ED8B00" },
  { name: ".NET", Icon: SiDotnet, color: "#512BD4" },
  { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", Icon: SiCss, color: "#1572B6" },
  { name: "React", Icon: SiReact, color: "#149ECA" },
  { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
  { name: "Django", Icon: SiDjango, color: "#092E20" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Ollama", Icon: SiOllama, color: "#1a1a1a" },
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
      data-reveal="up"
      data-visible={visible ? "true" : undefined}
      className="flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-2xl bg-[var(--awrs-card)] border border-[var(--awrs-border)] cursor-default transition-colors hover:border-[var(--awrs-primary)]/40"
      style={{ transitionDelay: `${Math.min(index * 35, 700)}ms` }}
    >
      <Icon size={28} style={{ color }} />
      <span className="text-xs font-semibold text-[var(--awrs-text-secondary)] tracking-wide">
        {name}
      </span>
    </div>
  );
}

export function Skills() {
  // One observer for the whole grid: the tiles stagger off a single trigger
  // rather than each firing on its own.
  const { ref: gridRef, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black">Skills</h2>
          <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
        </Reveal>
        {skills.length === 0 ? (
          <SectionEmpty>No skills listed yet.</SectionEmpty>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            {skills.map((skill, index) => (
              <SkillItem key={skill.name + index} skill={skill} index={index} visible={visible} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
