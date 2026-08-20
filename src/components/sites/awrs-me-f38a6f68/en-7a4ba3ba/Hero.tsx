"use client";

import { useEffect, useRef, useState } from "react";

const NAME = "Abdulwahed";

const MARQUEE_ITEMS_PRIMARY = [
  "Flutter Specialist",
  "Mobile App Architect",
  "AI & ML Integration",
  "Cross-Platform Builder",
  "Performance Optimizer",
  "Full-Stack Developer",
];

const MARQUEE_ITEMS_SECONDARY = [
  "Problem Solver",
  "More Than an Engineer",
  "UI/UX Enthusiast",
  "Product Builder",
  "SaaS Architect",
  "Creative Developer",
];

function MarqueeCopy({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center whitespace-nowrap font-bold uppercase tracking-wide">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="px-3 md:px-4">{item}</span>
          <span className="opacity-40" aria-hidden="true">
            &#9670;
          </span>
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;
    const totalWidth = h1.offsetWidth;
    charRefs.current.forEach((span) => {
      if (!span) return;
      span.style.backgroundSize = `${totalWidth}px 100%`;
      span.style.backgroundPositionX = `-${span.offsetLeft}px`;
    });
  }, []);

  return (
    <section className="relative -mt-20 flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* decorative background: faint diagonal lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="8%" y1="-5%" x2="28%" y2="105%" stroke="var(--awrs-beams-line)" strokeWidth="1" />
        <line x1="42%" y1="-5%" x2="62%" y2="105%" stroke="var(--awrs-beams-line)" strokeWidth="1" />
        <line x1="68%" y1="-5%" x2="88%" y2="105%" stroke="var(--awrs-beams-line)" strokeWidth="1" />
        <line x1="90%" y1="10%" x2="60%" y2="95%" stroke="var(--awrs-beams-line)" strokeWidth="1" />
      </svg>

      <div className="relative z-10 max-w-4xl -translate-y-16 px-6 text-center">
        <span className="text-sm uppercase tracking-[0.25em] text-[var(--awrs-text-tertiary)]">
          {"Hi, I'm"}
        </span>
        <div className="mx-auto mb-6 mt-2 h-px w-10 bg-[var(--awrs-primary)]" />
        <h1
          ref={h1Ref}
          className="relative mb-10 text-5xl font-black sm:text-6xl md:text-8xl lg:text-9xl"
        >
          {NAME.split("").map((char, index) => {
            const isSpace = char === " ";
            return (
              <span
                key={index}
                ref={(el) => {
                  charRefs.current[index] = el;
                }}
                className={isSpace ? "inline-block" : "awrs-hero-char inline-block"}
                style={{
                  opacity: mounted ? 1 : 0,
                  filter: mounted ? "blur(0px)" : "blur(8px)",
                  transform: mounted ? "translateY(0)" : "translateY(8px)",
                  transitionProperty: "opacity, filter, transform",
                  transitionDuration: "0.6s",
                  transitionTimingFunction: "ease-out",
                  transitionDelay: `${index * 40}ms`,
                }}
              >
                {isSpace ? " " : char}
              </span>
            );
          })}
        </h1>
        <p className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-[var(--awrs-text-secondary)] md:text-xl">
          Software Engineer &amp; Full-Stack Mobile Developer
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute left-[-20%] top-[75%] w-[140%] overflow-hidden rotate-[4deg] bg-gradient-to-r from-pink-800 via-rose-700 to-pink-800 py-3.5 text-white/80 md:top-[85%] md:py-5">
          <div className="flex w-max" style={{ animation: "awrs-marquee 30s linear infinite reverse" }}>
            <MarqueeCopy items={MARQUEE_ITEMS_PRIMARY} />
            <MarqueeCopy items={MARQUEE_ITEMS_PRIMARY} />
          </div>
        </div>
        <div className="absolute left-[-20%] top-[78%] w-[140%] overflow-hidden -rotate-[4deg] border-y border-[var(--awrs-border)] bg-[var(--awrs-card)] py-3.5 text-[var(--awrs-text-secondary)] md:top-[88%] md:py-5">
          <div className="flex w-max" style={{ animation: "awrs-marquee 30s linear infinite" }}>
            <MarqueeCopy items={MARQUEE_ITEMS_SECONDARY} />
            <MarqueeCopy items={MARQUEE_ITEMS_SECONDARY} />
          </div>
        </div>
      </div>
    </section>
  );
}
