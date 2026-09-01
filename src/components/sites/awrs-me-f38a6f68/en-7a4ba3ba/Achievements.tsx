"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { type LucideIcon } from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionEmpty } from "./SectionEmpty";

interface Achievement {
  title: string;
  org: string;
  date: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

/**
 * Empty until real achievements are added. Shape of an entry:
 *
 * ```ts
 * {
 *   title: "What you won or earned",
 *   org: "Who awarded it",
 *   date: "2026",
 *   description: "One sentence of context.",
 *   icon: Trophy,
 *   color: "#d4547e",
 * }
 * ```
 */
const achievements: Achievement[] = [];

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  isLast: boolean;
}

const PARTICLES = [
  { size: 4, top: "12%", inset: "15%", duration: "6s", delay: "0s" },
  { size: 3, top: "25%", inset: "8%", duration: "7s", delay: "1.5s" },
  { size: 5, top: "60%", inset: "12%", duration: "5.5s", delay: "3s" },
  { size: 3, top: "75%", inset: "22%", duration: "6.5s", delay: "2s" },
];

function AchievementCard({ achievement, index, isLast }: AchievementCardProps) {
  const { ref: cardRef, visible } = useScrollReveal<HTMLDivElement>();
  const Icon = achievement.icon;

  return (
    <div
      ref={cardRef}
      data-reveal="up"
      data-visible={visible ? "true" : undefined}
      className={`awrs-spotlight-card relative overflow-hidden rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6${
        isLast ? " md:col-span-2 md:max-w-md md:mx-auto" : ""
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--spotlight-y", `${e.clientY - r.top}px`);
      }}
    >
      <div
        className="awrs-achievement-border-sweep pointer-events-none absolute inset-0 rounded-2xl p-px [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)]"
        style={{
          background: `conic-gradient(from var(--awrs-border-angle), transparent 60%, ${achievement.color} 78%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
      {PARTICLES.map((particle, i) => (
        <div
          key={i}
          className="awrs-achievement-particle pointer-events-none absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            insetInlineEnd: particle.inset,
            backgroundColor: achievement.color,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
          aria-hidden="true"
        />
      ))}
      <div className="relative z-10 flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${achievement.color}1a` }}
        >
          <Icon style={{ color: achievement.color }} size={22} />
        </div>
        <div>
          <h3 className="awrs-shimmer-title font-bold leading-snug">{achievement.title}</h3>
          <p
            className="text-sm font-medium mt-0.5"
            style={{ color: achievement.color }}
          >
            {achievement.org} · {achievement.date}
          </p>
          <p className="mt-2 text-sm text-[var(--awrs-text-secondary)] leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black">Achievements</h2>
          <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
        </Reveal>
        {achievements.length === 0 ? (
          <SectionEmpty>No achievements listed yet.</SectionEmpty>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.title}
                achievement={achievement}
                index={index}
                isLast={index === achievements.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
