"use client";

import { useEffect, useRef } from "react";

/**
 * Thin bar across the top of the viewport showing how far down the page you
 * are.
 *
 * Written straight to the element's transform inside one rAF rather than
 * through React state: this updates on every scroll frame, and re-rendering the
 * tree that often would be wasteful. Scaling a fixed element is compositor-only
 * work, so it does not cost a layout.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
      bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="awrs-scroll-progress h-full w-full scale-x-0 bg-gradient-to-r from-[var(--awrs-primary-dark)] via-[var(--awrs-primary)] to-[var(--awrs-primary-light)]"
      />
    </div>
  );
}
