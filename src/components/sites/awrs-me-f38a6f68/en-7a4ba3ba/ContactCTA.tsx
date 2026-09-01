"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

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
    <section id="contact" className="relative overflow-hidden py-20 md:py-28">
      <div
        className="awrs-cta-aurora pointer-events-none absolute -top-1/3 -left-1/4 h-2/3 w-3/4 rounded-full bg-[var(--awrs-primary)] opacity-[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="awrs-cta-aurora-alt pointer-events-none absolute -bottom-1/4 -right-1/4 h-1/2 w-2/3 rounded-full bg-[var(--awrs-primary)] opacity-[0.04] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative max-w-4xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black">Ready to Connect?</h2>
          <p className="mt-2 text-lg text-[var(--awrs-text-secondary)]">
            {"Let's turn your next idea into something real"}
          </p>
          <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4" />
        </Reveal>

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
          <span className="group/btn relative mt-8 inline-block">
            <span
              className="awrs-rotate-border-ring pointer-events-none absolute inset-0 rounded-full p-px opacity-0 transition-opacity duration-700 [mask:linear-gradient(#000,#000)_content-box_exclude,_linear-gradient(#000,#000)] group-hover/btn:opacity-100"
              style={{ animationDuration: "4s" }}
              aria-hidden="true"
            />
            <a
              href={`mailto:${SITE.email}`}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--awrs-text)] px-6 py-3 font-semibold transition-colors hover:bg-[var(--awrs-text)] hover:text-white"
            >
              <span
                className="awrs-cta-shimmer-layer pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100"
                aria-hidden="true"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                Get in Touch <ArrowRight size={18} />
              </span>
            </a>
          </span>
          <p className="mt-6 text-sm text-[var(--awrs-text-tertiary)]">
            Open to full-time roles & freelance projects
          </p>
          <p className="mt-2 text-sm text-[var(--awrs-text-secondary)] max-w-md mx-auto">
            Full-stack web work — front end, back end, and the bits in between.
            Say hello and tell me what you are building.
          </p>
        </div>
      </div>
    </section>
  );
}
