"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Calendar, Download, Folder, GraduationCap, Layers, Quote, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrbitalClock } from "./OrbitalClock";

interface Stat {
  label: string;
  value: number;
  color: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { label: "Projects", value: 20, color: "#d4547e", icon: Folder },
  { label: "Years of Experience", value: 3, color: "#3b82f6", icon: Calendar },
  { label: "Published Platforms", value: 5, color: "#10b981", icon: Layers },
  { label: "Technical Skills", value: 15, color: "#f59e0b", icon: Zap },
];

// Stable module-level reference so the count-up effect's dependency array
// never sees a "new" array across renders.
const STAT_TARGETS = STATS.map((stat) => stat.value);

const REVEAL_HIDDEN = "opacity-0 translate-y-4";
const REVEAL_VISIBLE = "opacity-100 translate-y-0";

/** Attaches the mouse-follow spotlight coordinates used by .awrs-spotlight-card. */
function handleSpotlightMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
}

/** Fires once when the element enters the viewport; used for the fade/blur-in cards. */
function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/** Animated 0 -> target count-up for the stats row, triggered once on scroll into view. */
function useCountUp(targets: number[], durationMs = 1200) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const [counts, setCounts] = useState<number[]>(() => targets.map(() => 0));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return;
          startedRef.current = true;

          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            setCounts(targets.map((target) => target * eased));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targets, durationMs]);

  return { containerRef, counts };
}

const CARD_BASE =
  "awrs-spotlight-card rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6 transition-all duration-[600ms] ease-out";

export function AboutSection() {
  const { ref: profileRef, visible: profileVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: timezoneRef, visible: timezoneVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: educationRef, visible: educationVisible } = useRevealOnScroll<HTMLDivElement>();
  const { containerRef: statsRef, counts } = useCountUp(STAT_TARGETS);

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-4xl font-black md:text-5xl">About Me</h2>
        <div className="mb-10 mt-4 h-1 w-10 rounded-full bg-[var(--awrs-primary)]" />

        {/* Row 1: profile / timezone / education */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            ref={profileRef}
            onMouseMove={handleSpotlightMove}
            className={cn(
              CARD_BASE,
              "delay-[0ms]",
              profileVisible ? REVEAL_VISIBLE : REVEAL_HIDDEN
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--awrs-primary)] text-lg font-bold text-[var(--awrs-primary)]">
                AW
              </div>
              <div>
                <h3 className="font-bold text-[var(--awrs-primary)]">
                  Abdulwahed Aldaghir
                </h3>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  Software Engineer &amp; Full-Stack Developer
                </p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-[var(--awrs-text-secondary)]">
              {
                "I'm a Software Engineer with a passion for building beautiful, functional mobile and web applications. I specialize in Flutter development and full-stack solutions, combining technical expertise with creative problem-solving."
              }
            </p>
          </div>

          <div
            ref={timezoneRef}
            onMouseMove={handleSpotlightMove}
            className={cn(
              CARD_BASE,
              "delay-[90ms]",
              timezoneVisible ? REVEAL_VISIBLE : REVEAL_HIDDEN
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
              Flexible with Timezones
            </p>
            <h3 className="mt-1 text-lg font-bold">
              Based in Oman,{" "}
              <span className="font-normal text-[var(--awrs-text-secondary)]">
                available globally
              </span>
            </h3>
            <div
              className="mx-auto mt-6 h-40 w-40 rounded-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
                backgroundSize: "6px 6px",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div
            ref={educationRef}
            onMouseMove={handleSpotlightMove}
            className={cn(
              CARD_BASE,
              "delay-[180ms]",
              educationVisible ? REVEAL_VISIBLE : REVEAL_HIDDEN
            )}
          >
            <div className="flex items-center gap-2 text-[var(--awrs-primary)]">
              <GraduationCap size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Education
              </span>
            </div>
            <div className="mt-6 flex items-start justify-between rounded-xl bg-[var(--awrs-bg-secondary)] p-4">
              <div>
                <p className="font-bold">Sohar University</p>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  {"Bachelor's in Software Engineering"}
                </p>
                <p className="mt-1 text-xs text-[var(--awrs-text-tertiary)]">
                  2023 – 2026
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Graduate
              </span>
            </div>
          </div>
        </div>

        <OrbitalClock />

        {/* Row 3: available-for-work CTA */}
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-[var(--awrs-border)] bg-emerald-50/40 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available for Work
            </div>
            <h3 className="mt-3 text-3xl font-black md:text-4xl">
              HAVE A VISION?
              <br />
              <span className="text-[var(--awrs-primary)]">
                {"LET'S BUILD IT"}
              </span>
              <br />
              <span className="text-2xl font-medium italic text-[var(--awrs-text-secondary)] md:text-3xl">
                together.
              </span>
            </h3>
            <a
              href="https://awrs.me/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2.5 text-sm font-medium text-emerald-700"
            >
              <Download size={16} />
              Resume
            </a>
          </div>
          <div className="text-right">
            <Quote className="ml-auto text-[var(--awrs-primary)]/30" />
            <p className="text-lg font-semibold italic">Real artists ship.</p>
            <p className="text-xs tracking-wide text-[var(--awrs-text-tertiary)]">
              STEVE JOBS
            </p>
          </div>
        </div>

        {/* Row 4: animated stat counters */}
        <div
          ref={statsRef}
          className="mt-10 rounded-2xl border border-[var(--awrs-border)] p-6"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onMouseMove={handleSpotlightMove}
                  className="awrs-spotlight-card flex flex-col items-center gap-2 rounded-2xl bg-[var(--awrs-bg-secondary)] p-6 text-center"
                >
                  <p className="text-3xl font-black" style={{ color: stat.color }}>
                    {Math.round(counts[i])}+
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--awrs-text-secondary)]">
                    <Icon size={14} />
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
