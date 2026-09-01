"use client";

import type { ReactNode } from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

/**
 * Wrapper that fades its children in the first time they scroll into view.
 *
 * The animation is defined by `[data-reveal]` in globals.css — this only
 * flips `data-visible`. Use `delay` to stagger a row of siblings.
 *
 * `from="fade"` skips the upward drift, for elements where movement would
 * fight with a transform they already carry.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds. */
  delay?: number;
  from?: "up" | "fade";
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal={from}
      data-visible={visible ? "true" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
