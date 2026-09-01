"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Menu } from "lucide-react";
import { LogoMark } from "../shared/icons";
import { CommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Section links are absolute ("/#projects" rather than "#projects") so the nav
 * also works from the legal pages and the 404, where there is no such section
 * on the current document.
 */
const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

interface Greeting {
  text: string;
  emoji: string;
}

const DEFAULT_GREETING: Greeting = { text: "Good Morning", emoji: "☀️" };

function getGreeting(): Greeting {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return { text: "Good Morning", emoji: "☀️" };
  if (hour >= 12 && hour <= 16) return { text: "Good Afternoon", emoji: "☀️" };
  if (hour >= 17 && hour <= 20) return { text: "Good Evening", emoji: "🌙" };
  return { text: "Good Night", emoji: "🌙" };
}

const floatingPillClasses =
  "rounded-full border border-[var(--awrs-border)] bg-[var(--awrs-navbar)] shadow-sm backdrop-blur-md";

export function Nav() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [greeting, setGreeting] = useState<Greeting>(DEFAULT_GREETING);
  const [collapsedWidth, setCollapsedWidth] = useState(185);
  const [expandedWidth, setExpandedWidth] = useState(456);

  const collapsedRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Time-of-day greeting is inherently client-only (server/client clocks
    // differ); computing it after mount avoids an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (collapsedRef.current) setCollapsedWidth(collapsedRef.current.offsetWidth);
    if (expandedRef.current) setExpandedWidth(expandedRef.current.offsetWidth);
  }, []);

  return (
    <>
      <Link
        href="/"
        aria-label="Home"
        className="fixed left-6 top-5 z-50 hidden md:block md:left-8"
      >
        <LogoMark size={32} />
      </Link>

      <nav
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ width: isExpanded ? expandedWidth : collapsedWidth }}
        className={cn(
          floatingPillClasses,
          "fixed top-4 inset-x-0 z-40 mx-auto hidden w-fit overflow-hidden transition-[width] duration-300 ease-out md:block"
        )}
      >
        <span className="awrs-nav-glow-beam pointer-events-none absolute -top-[1px] left-1/2 h-[2px] w-16 -translate-x-1/2" />
        <span className="awrs-nav-glow-core pointer-events-none absolute -top-[1px] left-1/2 h-[2px] w-16 -translate-x-1/2" />

        <div className="relative h-12 w-full">
          {/* Collapsed: time-of-day greeting */}
          <div
            ref={collapsedRef}
            className={cn(
              "absolute left-0 top-0 flex h-12 select-none items-center gap-2.5 whitespace-nowrap px-8 transition-opacity duration-200",
              isExpanded ? "pointer-events-none opacity-0" : "cursor-pointer opacity-100"
            )}
          >
            <span className="text-base">{greeting.emoji}</span>
            <span className="text-sm font-medium text-[var(--awrs-text)]">
              {greeting.text}
            </span>
          </div>

          {/* Expanded: nav links */}
          <div
            ref={expandedRef}
            className={cn(
              "absolute left-0 top-0 flex h-12 items-center whitespace-nowrap px-1.5 transition-opacity duration-200",
              isExpanded ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <div className="flex items-center gap-1 px-1">
              {NAV_LINKS.map((link) => {
                const isCurrent = link.href === "/" && pathname === "/";
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "rounded-full px-5 py-1.5 text-sm font-medium transition-colors",
                      isCurrent
                        ? "bg-[var(--awrs-text)]/[0.08] text-[var(--awrs-primary)]"
                        : "text-[var(--awrs-text-secondary)] hover:text-[var(--awrs-text)]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette"
        className="fixed right-6 top-5 z-50 hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] md:right-8 md:flex"
      >
        <Command size={18} className="text-[var(--awrs-text)]" />
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className={cn(
          floatingPillClasses,
          "awrs-greeting-glow fixed top-4 inset-x-0 z-50 mx-auto flex h-12 w-fit items-center gap-2 px-6 text-sm font-medium text-[var(--awrs-text)] transition-transform active:scale-95 md:hidden"
        )}
      >
        <Menu size={16} />
        Tap to Explore
      </button>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
