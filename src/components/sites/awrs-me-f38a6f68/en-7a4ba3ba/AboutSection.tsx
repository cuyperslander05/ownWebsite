"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE } from "@/lib/site";
import { DotGlobe } from "./DotGlobe";
import { Reveal } from "./Reveal";
import { LanguageColumn, LanguageRow } from "./Languages";
import { OrbitalClock } from "./OrbitalClock";

interface Stat {
  label: string;
  value: number;
  color: string;
  icon: LucideIcon;
}

/**
 * Empty until there are real numbers to show. The counter row is hidden while
 * this is empty rather than counting up to figures nobody has verified.
 *
 * ```ts
 * const STATS: Stat[] = [
 *   { label: "Projects", value: 12, color: "#d4547e", icon: Folder },
 * ];
 * ```
 */
const STATS: Stat[] = [];

// Stable module-level reference so the count-up effect's dependency array
// never sees a "new" array across renders.
const STAT_TARGETS = STATS.map((stat) => stat.value);

/** Attaches the mouse-follow spotlight coordinates used by .awrs-spotlight-card. */
function handleSpotlightMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
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
  const { ref: profileRef, visible: profileVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: timezoneRef, visible: timezoneVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: educationRef, visible: educationVisible } = useScrollReveal<HTMLDivElement>();
  const { containerRef: statsRef, counts } = useCountUp(STAT_TARGETS);

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-4xl font-black md:text-5xl">About Me</h2>
          <div className="mb-10 mt-4 h-1 w-10 rounded-full bg-[var(--awrs-primary)]" />
        </Reveal>

        {/* Row 1: profile / timezone / education */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            ref={profileRef}
            onMouseMove={handleSpotlightMove}
            data-reveal="up"
            data-visible={profileVisible ? "true" : undefined}
            style={{ transitionDelay: "0ms" }}
            className={CARD_BASE}
          >
            <div className="flex items-center gap-4">
              <div className="awrs-avatar-ring h-16 w-16 shrink-0 rounded-full p-[3px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--awrs-card)] text-lg font-bold text-[var(--awrs-primary)]">
                  {SITE.initials}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[var(--awrs-primary)]">{SITE.name}</h3>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  {SITE.jobTitle}
                </p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-[var(--awrs-text-secondary)]">
              {
                "I'm a full-stack developer with a real passion for coding, and a creative mind to go with it. I like solving problems, picking up new things quickly, and building software with other people."
              }
            </p>
          </div>

          <div
            ref={timezoneRef}
            onMouseMove={handleSpotlightMove}
            data-reveal="up"
            data-visible={timezoneVisible ? "true" : undefined}
            style={{ transitionDelay: "90ms" }}
            className={CARD_BASE}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
              Flexible with Timezones
            </p>
            <h3 className="mt-1 text-lg font-bold">
              Based in {SITE.countryName},{" "}
              <span className="font-normal text-[var(--awrs-text-secondary)]">
                available globally
              </span>
            </h3>
            <div className="relative mx-auto mt-6 h-40 w-40 md:h-56 md:w-56">
              <div
                className="awrs-clock-halo pointer-events-none absolute inset-[-18%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--awrs-primary-glow) 0%, rgba(212,84,126,0.08) 45%, transparent 72%)",
                }}
                aria-hidden="true"
              />
              <DotGlobe className="relative h-full w-full" />
            </div>
          </div>

          <div
            ref={educationRef}
            onMouseMove={handleSpotlightMove}
            data-reveal="up"
            data-visible={educationVisible ? "true" : undefined}
            style={{ transitionDelay: "180ms" }}
            className={CARD_BASE}
          >
            <div className="flex items-center gap-2 text-[var(--awrs-primary)]">
              <GraduationCap size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Education
              </span>
            </div>
            <div className="mt-6 flex items-start justify-between rounded-xl bg-[var(--awrs-bg-secondary)] p-4">
              <div>
                <p className="font-bold">UCLL Leuven</p>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  Graduate in Programming
                </p>
                <p className="mt-1 text-xs text-[var(--awrs-text-tertiary)]">
                  2024 – 2026
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Graduated
              </span>
            </div>
          </div>
        </div>

        {/* The dial keeps its negative margins here so it still pokes into the
            rows above and below — the notch on the card below is measured
            against exactly this overlap. */}
        <div className="relative -mt-8 md:-my-16">
          <div className="flex items-center justify-center gap-6 lg:gap-12">
            <LanguageColumn side="left" />
            <OrbitalClock />
            <LanguageColumn side="right" />
          </div>
          {/* Only rendered below md, where it also provides the gap to the
              card underneath — the dial's negative bottom margin stops there. */}
          <div className="mt-6 mb-10">
            <LanguageRow />
          </div>
        </div>

        {/* Row 3: available-for-work CTA. The notch keeps it clear of the watch
            face hanging into it from above — see .awrs-cta-notch. */}
        <div className="awrs-cta-notch relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl border border-[var(--awrs-border)] bg-emerald-50/40 p-8 md:flex-row md:items-center md:p-10">
          <div className="awrs-available-bg-gradient pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06]" />
          <div className="awrs-available-border-ring pointer-events-none absolute inset-0 rounded-2xl p-px [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
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
          </div>
          <div className="relative text-right">
            <Quote className="ml-auto text-[var(--awrs-primary)]/30" />
            <p className="text-lg font-semibold italic">Real artists ship.</p>
            <p className="text-xs tracking-wide text-[var(--awrs-text-tertiary)]">
              STEVE JOBS
            </p>
          </div>
        </div>

        {/* Row 4: animated stat counters — hidden until STATS has real figures */}
        <div
          ref={statsRef}
          className="mt-10 rounded-2xl border border-[var(--awrs-border)] p-6"
          hidden={STATS.length === 0}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              const orbitDuration = 10 + i * 2;
              const dotDuration = 3 + i * 0.5;
              const dotReverseDuration = Math.round((5 + i * 0.7) * 10) / 10;
              return (
                <div key={stat.label} className="awrs-impact-float">
                  <div
                    onMouseMove={handleSpotlightMove}
                    className="awrs-spotlight-card relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl bg-[var(--awrs-bg-secondary)] p-6 text-center"
                  >
                    <div
                      className="awrs-stat-border pointer-events-none absolute inset-0 rounded-2xl p-px [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)]"
                      style={{
                        background: `conic-gradient(from var(--awrs-stat-border-angle), transparent 0%, transparent 65%, ${stat.color} 78%, transparent 100%)`,
                      }}
                    />
                    <div
                      className="awrs-impact-glow pointer-events-none absolute rounded-full"
                      style={{
                        inset: "-15%",
                        background: `radial-gradient(circle, ${stat.color}26 0%, transparent 70%)`,
                      }}
                    />
                    <svg
                      className="awrs-orbit-spin pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
                      viewBox="0 0 120 120"
                      style={{ animationDuration: `${orbitDuration}s` }}
                      aria-hidden="true"
                    >
                      <circle cx="60" cy="60" r="50" fill="none" strokeWidth="1" strokeDasharray="4 8" stroke={stat.color} opacity="0.25" />
                    </svg>
                    <svg
                      className="awrs-orbit-spin pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
                      viewBox="0 0 120 120"
                      style={{ animationDuration: `${dotDuration}s` }}
                      aria-hidden="true"
                    >
                      <circle cx="60" cy="10" r="2.5" fill={stat.color} opacity="0.6" />
                    </svg>
                    <svg
                      className="awrs-orbit-spin-reverse pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
                      viewBox="0 0 120 120"
                      style={{ animationDuration: `${dotReverseDuration}s` }}
                      aria-hidden="true"
                    >
                      <circle cx="110" cy="60" r="2" fill={stat.color} opacity="0.4" />
                    </svg>

                    <p className="relative z-10 text-3xl font-black" style={{ color: stat.color }}>
                      {Math.round(counts[i])}+
                    </p>
                    <div className="relative z-10 flex items-center gap-1.5 text-sm text-[var(--awrs-text-secondary)]">
                      <Icon size={14} />
                      {stat.label}
                    </div>
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
