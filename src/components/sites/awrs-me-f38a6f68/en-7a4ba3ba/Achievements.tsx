"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  Lightbulb,
  Medal,
  Rocket,
  Trophy,
  type LucideIcon,
} from "lucide-react";

interface Achievement {
  title: string;
  org: string;
  date: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const achievements: Achievement[] = [
  {
    title: "1st Place — Intelligent Planet Hackathon",
    org: "KFUPM & Google Cloud",
    date: "Feb 2026",
    description:
      "Achieved 1st place among 500+ teams from 60+ countries. Built Manara — a personal guardian app with AR navigation and real-time risk alerts.",
    icon: Trophy,
    color: "#f59e0b",
  },
  {
    title: "Best AI Solution — Innovation Hackathon",
    org: "Middle East College & KEF",
    date: "Apr 2026",
    description:
      "Awarded for developing an outstanding AI-driven innovation at the KEF Innovation Hackathon 2026.",
    icon: Lightbulb,
    color: "#3b82f6",
  },
  {
    title: "Best Team — NASA Space Apps Hackathon",
    org: "NASA · Art & Technology",
    date: "Oct 2025",
    description:
      "Awarded Best Team in the Art & Technology category. Recognized by Sohar University, NASA, and UTAS.",
    icon: Rocket,
    color: "#10b981",
  },
  {
    title: "2nd Place — ICPC Oman (OCPC)",
    org: "ICPC",
    date: "Apr 2026",
    description:
      "Secured second place in the Oman Collegiate Programming Contest 2025.",
    icon: Medal,
    color: "#8b5cf6",
  },
  {
    title: "Vice Chancellor's Award for Outstanding Achievement",
    org: "Sohar University",
    date: "2025/2026",
    description:
      "Recognized by Sohar University for international achievements and outstanding contributions to student activities.",
    icon: Award,
    color: "#d4547e",
  },
];

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  isLast: boolean;
}

function AchievementCard({ achievement, index, isLast }: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = achievement.icon;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`awrs-spotlight-card relative rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6${
        isLast ? " md:col-span-2 md:max-w-md md:mx-auto" : ""
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .5s ease-out, transform .5s ease-out",
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--spotlight-y", `${e.clientY - r.top}px`);
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${achievement.color}1a` }}
        >
          <Icon style={{ color: achievement.color }} size={22} />
        </div>
        <div>
          <h3 className="font-bold leading-snug">{achievement.title}</h3>
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
        <h2 className="text-4xl md:text-5xl font-black">Achievements</h2>
        <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
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
      </div>
    </section>
  );
}
