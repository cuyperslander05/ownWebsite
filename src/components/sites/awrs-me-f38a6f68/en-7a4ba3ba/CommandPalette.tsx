"use client";

import { useEffect, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Home,
  Folder,
  MessageCircle,
  ArrowUpRight,
  Shield,
  FileText,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../shared/brand-icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PageEntry {
  label: string;
  href: string;
  icon: LucideIcon;
}

const PAGES: PageEntry[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/#projects", icon: Folder },
  { label: "Contact", href: "/#contact", icon: MessageCircle },
];

interface ConnectEntry {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

// Only profiles that actually exist — the cloned design also listed X and
// Reddit, but there are no accounts to point them at.
const CONNECT: ConnectEntry[] = [
  { label: "GitHub", href: SITE.github, icon: GithubIcon },
  { label: "LinkedIn", href: SITE.linkedin, icon: LinkedinIcon },
];

const LEGAL: PageEntry[] = [
  { label: "Privacy Policy", href: "/privacy", icon: Shield },
  { label: "Terms of Use", href: "/terms", icon: FileText },
];

const pillClasses =
  "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--awrs-border)] text-sm font-medium text-[var(--awrs-text)] hover:bg-[var(--awrs-card-hover)] transition-colors";

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end justify-center bg-black/40 transition-opacity duration-200 md:items-center",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={() => onOpenChange(false)}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "w-full mx-0 rounded-t-2xl rounded-b-none bg-[var(--awrs-card)] shadow-xl transition-all duration-250 ease-out",
          "md:mx-4 md:w-full md:max-w-2xl md:rounded-2xl",
          open
            ? "translate-y-0 opacity-100 md:scale-100"
            : "translate-y-full opacity-0 md:translate-y-0 md:scale-95"
        )}
      >
        {/* mobile drag handle */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-[var(--awrs-border)]" />
        </div>

        {/* header row */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--awrs-text-tertiary)]" />
            <input
              type="text"
              placeholder="Jump to a project..."
              className="h-11 w-full rounded-xl bg-[var(--awrs-bg-secondary)] pl-10 pr-4 text-sm text-[var(--awrs-text)] placeholder:text-[var(--awrs-text-tertiary)] focus:outline-none"
            />
          </div>
          <a
            href={`mailto:${SITE.email}`}
            className="flex h-11 items-center whitespace-nowrap rounded-xl bg-[var(--awrs-bg-secondary)] px-5 text-sm font-medium text-[var(--awrs-text)] transition-colors hover:bg-[var(--awrs-card-hover)]"
          >
            Reach out
          </a>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--awrs-bg-secondary)] transition-colors hover:bg-[var(--awrs-card-hover)]"
          >
            <Moon className="h-4 w-4 text-[var(--awrs-text)]" />
          </button>
        </div>

        <div className="border-t border-[var(--awrs-border)]" />

        {/* PAGES */}
        <div className="px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
          PAGES
        </div>
        <div className="grid grid-cols-2 gap-2 px-6">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const isCurrent = page.href === pathname;
            return (
              <Link
                key={page.label}
                href={page.href}
                onClick={() => onOpenChange(false)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  pillClasses,
                  isCurrent &&
                    "border-[var(--awrs-primary)] text-[var(--awrs-primary)] bg-[var(--awrs-primary)]/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {page.label}
              </Link>
            );
          })}
        </div>

        {/* CONNECT */}
        <div className="px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
          CONNECT
        </div>
        <div className="flex flex-wrap gap-2 px-6">
          {CONNECT.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(pillClasses, "relative pr-8")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                <ArrowUpRight className="absolute right-2 top-2 h-3 w-3 text-[var(--awrs-text-tertiary)]" />
              </a>
            );
          })}
        </div>

        {/* LEGAL */}
        <div className="px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
          LEGAL
        </div>
        <div className="flex flex-wrap gap-2 px-6 pb-6">
          {LEGAL.map((item) => {
            const Icon = item.icon;
            const isCurrent = item.href === pathname;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onOpenChange(false)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  pillClasses,
                  isCurrent &&
                    "border-[var(--awrs-primary)] text-[var(--awrs-primary)] bg-[var(--awrs-primary)]/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
