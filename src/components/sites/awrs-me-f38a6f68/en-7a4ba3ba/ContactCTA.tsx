"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const IMPACT_CHARS = "IMPACT".split("");

export function ContactCTA() {
  const impactRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the reveal once the heading scrolls into view.
  useEffect(() => {
    const node = impactRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Make the shared gradient read continuously across the whole word
  // rather than repeating per letter.
  useEffect(() => {
    const container = impactRef.current;
    if (!container) return;

    const totalWidth = container.offsetWidth;
    for (const span of charRefs.current) {
      if (!span) continue;
      span.style.backgroundSize = `${totalWidth}px 100%`;
      span.style.backgroundPositionX = `-${span.offsetLeft}px`;
    }
  }, []);

  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Ready to Connect?</h2>
        <p className="mt-2 text-lg text-[var(--awrs-text-secondary)]">
          {"Let's turn your next idea into something real"}
        </p>
        <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4" />

        <div className="mt-10 rounded-2xl border border-[var(--awrs-border)] bg-gradient-to-b from-[var(--awrs-primary)]/5 to-transparent p-8 md:p-16 text-center">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            <span className="text-[var(--awrs-text)]">FROM IDEA TO </span>
            <span ref={impactRef}>
              {IMPACT_CHARS.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  ref={(node) => {
                    charRefs.current[index] = node;
                  }}
                  className="awrs-hero-char inline-block"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    filter: isVisible ? "blur(0px)" : "blur(8px)",
                    transform: isVisible ? "translateY(0)" : "translateY(8px)",
                    transitionProperty: "opacity, filter, transform",
                    transitionDuration: "0.6s",
                    transitionTimingFunction: "ease-out",
                    transitionDelay: `${index * 40}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h3>
          <p className="mt-2 text-lg md:text-xl font-bold tracking-wide text-[var(--awrs-text-secondary)]">
            {"LET'S BUILD SOMETHING REAL."}
          </p>
          <a
            href="mailto:abdulwahedaldaghir0@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--awrs-text)] px-6 py-3 font-semibold hover:bg-[var(--awrs-text)] hover:text-white transition-colors"
          >
            Get in Touch <ArrowRight size={18} />
          </a>
          <p className="mt-6 text-sm text-[var(--awrs-text-tertiary)]">
            Open to full-time roles & freelance projects
          </p>
          <p className="mt-2 text-sm text-[var(--awrs-text-secondary)] max-w-md mx-auto">
            I build high-performance applications that turn complex ideas into
            seamless user experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
