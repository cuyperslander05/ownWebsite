"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element first scrolls into view.
 *
 * One shared implementation for the whole site: before this, four components
 * each had their own IntersectionObserver with slightly different thresholds
 * and none of them honoured prefers-reduced-motion.
 *
 * The hidden state itself lives in CSS (`[data-reveal]` in globals.css) rather
 * than in Tailwind classes. That buys two things this hook does not have to
 * handle: a prefers-reduced-motion media query that shows every revealed
 * element immediately with no transition, and a <noscript> override in the root
 * layout so visitors without JavaScript still see the whole page.
 */
export function useScrollReveal<T extends HTMLElement>({
  // Threshold 0 on purpose: a fraction-based threshold can be missed entirely
  // when the page is scrolled fast (End key, a flung trackpad), which would
  // leave the element stuck at opacity 0. The negative bottom margin is what
  // holds the reveal back until the element is properly on screen.
  threshold = 0,
  rootMargin = "0px 0px -60px 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // `boundingClientRect.top < 0` catches the case where the element
          // travelled from below the fold to above it between two frames: the
          // browser then reports a single non-intersecting entry, and without
          // this the element would never be revealed.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
