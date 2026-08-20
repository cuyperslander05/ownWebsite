# Experience Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Experience.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/04-experience-timeline.jpg`
- **Interaction model:** scroll-entrance fade-in per entry (IntersectionObserver, reuse the shared `useInView` hook from `../shared/useInView` if it exists by the time you build this — otherwise write the entry inline, same pattern as documented in AboutSection.spec.md).

## DOM Structure
```
<section id="experience" class="py-20 md:py-28">
  <div class="max-w-4xl mx-auto px-6">
    <h2>Experience</h2> <!-- pink underline bar beneath -->
    <div class="relative mt-16">
      <!-- vertical center line, desktop only -->
      <div class="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[var(--awrs-border)]" />
      <div class="flex flex-col gap-10 md:gap-20">
        <!-- one entry per experience item, alternating sides on desktop -->
      </div>
    </div>
  </div>
</section>
```

### Entry (desktop: alternates left/right; mobile: single column with a left border + icon)
```
<div class="relative md:grid md:grid-cols-2 md:gap-16 border-s-[3px] md:border-s-0 ps-5 md:ps-0 border-[var(--awrs-border)]">
  <!-- On even entries (0,2,...) content goes in the LEFT column and is empty on the right; odd entries mirror. Use `md:col-start-1`/`md:col-start-2` + `md:text-end` on alternating entries to flip which side the text sits on and which edge the connecting dot appears. -->
  <div class="flex items-center gap-3 md:block md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2">
    <div class="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 text-white" style="background: <entry accent color>">
      <!-- lucide icon, see data below -->
    </div>
  </div>
  <div> <!-- the text content column -->
    <p class="text-xs font-semibold uppercase tracking-wide" style="color: <entry accent color>">FEB 2025 – OCT 2025</p>
    <h3 class="mt-1 text-xl font-bold">Software Engineering Intern</h3>
    <p class="text-sm font-medium" style="color: <entry accent color>">Code Buddy Oman</p>
    <p class="mt-2 text-[var(--awrs-text-secondary)] leading-relaxed">Led Back-End and Mobile App teams. Built Manssat Sanad, a bilingual business management platform with PHP & MySQL.</p>
    <p class="mt-2 text-xs text-[var(--awrs-text-tertiary)]">PHP · MySQL · Flutter · Leadership</p>
  </div>
</div>
```
A small dot marker also sits on the center line between consecutive entries (a simple `<div class="hidden md:block absolute ... w-3 h-3 rounded-full bg-[var(--awrs-primary)]">` positioned at the bottom of each entry's icon, or just after — matches the "connecting dot" seen in the screenshot between icons). This is a minor decorative detail; don't over-invest time in exact dot placement.

## Data (all 4 entries, verbatim, top to bottom)
```ts
const experience = [
  {
    period: "FEB 2025 – OCT 2025",
    role: "Software Engineering Intern",
    org: "Code Buddy Oman",
    description: "Led Back-End and Mobile App teams. Built Manssat Sanad, a bilingual business management platform with PHP & MySQL.",
    tags: "PHP · MySQL · Flutter · Leadership",
    icon: "Code2", // lucide-react, pink circle (matches "</>" icon seen in screenshot)
    color: "#d4547e",
  },
  {
    period: "JAN 2025 – APR 2026",
    role: "Peer Tutor",
    org: "Sohar University",
    description: "Tutored Operating Systems, Algorithms & Data Structures, OOP, and Web Information Systems.",
    tags: "Algorithms · Data Structures · OOP",
    icon: "BookOpen", // blue circle
    color: "#3b82f6",
  },
  {
    period: "AUG 2024 – SEP 2024",
    role: "Mobile Application Developer",
    org: "Code Buddy Oman",
    description: "Contributed to front-end development of a mobile ERP application using Flutter & Dart. Built fully responsive UI components for Android and iOS.",
    tags: "Flutter · Dart · Android · iOS",
    icon: "Smartphone", // green circle
    color: "#10b981",
  },
  {
    period: "APR 2024 – JUN 2024",
    role: "Web Development Intern",
    org: "INTAJ SUHAR",
    description: "Designed and developed a responsive website. Collaborated with the team on requirements, navigation, and layout optimization.",
    tags: "Web Development · Responsive Design · UI Design · Project Management",
    icon: "Globe", // amber/orange circle
    color: "#f59e0b",
  },
];
```

## States & Behaviors
### Scroll-entrance fade-in
- **Trigger:** IntersectionObserver per entry, fires once.
- **State A:** `opacity: 0`, `transform: translateY(20px)`.
- **State B:** `opacity: 1`, `transform: translateY(0)`.
- **Transition:** `.6s ease-out`, no stagger needed beyond natural scroll order (each triggers independently as it enters view).

## Assets
- Icons: `Code2, BookOpen, Smartphone, Globe` from `lucide-react` (these are close visual matches to the source icons — exact glyphs weren't extractable pixel-for-pixel but these read correctly for the role type).

## Text Content
See data table above — verbatim.

## Responsive Behavior
- **Desktop (≥768px):** 2-column grid, entries alternate which column holds the text (left/right), icon centered on the vertical line.
- **Mobile (<768px):** single column, left border (`border-s-[3px]`) replaces the center line, icon sits inline at the top-left of each entry instead of centered.
- **Breakpoint:** `md` = 768px.
