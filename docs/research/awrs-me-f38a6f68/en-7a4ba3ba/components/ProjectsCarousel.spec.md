# ProjectsCarousel Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ProjectsCarousel.tsx` (contains both the section wrapper AND the `ProjectCard` sub-component in the same file — they're tightly coupled and the card has no independent use elsewhere)
- **Screenshots:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/06-projects-huda-manara.jpg`, `07-projects-manara-navix.jpg`, `08-projects-navix-healog.jpg`, `09-projects-healog-sire.jpg`, `10-projects-sire-viewall.jpg` (these 5 shots show the 6 cards scrolling past in sequence — Huda→Manara→Navix→Healog→Sire→"View All Projects")
- **Interaction model: SCROLL-DRIVEN horizontal carousel. This is NOT a click-tab interface.** As the user scrolls down through this section, the whole section stays pinned (sticky) near the top of the viewport while an inner row of 6 cards translates horizontally from right to left. Confirmed by scrolling the live site slowly — nothing responds to clicks/taps to switch cards; only vertical scroll position drives horizontal movement.

## Structure
```
<div id="projects" class="relative">  <!-- NOT a <section>, matches source -->
  <div class="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
    <h2 class="px-6 md:px-12 text-4xl md:text-5xl font-black">
      Featured <span class="text-[var(--awrs-primary)]">Projects</span>
    </h2>
    <div class="mt-10 flex gap-6 px-6 md:px-12" ref={trackRef} style={{ transform: `translateX(${offsetPx}px)` }}>
      <ProjectCard {...huda} index="01" />
      <ProjectCard {...manara} index="02" />
      <ProjectCard {...navix} index="03" />
      <ProjectCard {...healog} index="04" />
      <ProjectCard {...sire} index="05" />
      <ViewAllCard />
    </div>
  </div>
</div>
```
The **outer wrapping element must be tall** (this is what creates the scrollable "pin" range) — give the outer `#projects` div an explicit height sized so that scrolling through it takes roughly the width of all 6 cards' combined horizontal travel, e.g. `height: calc(100vh + 6 * 400px)` (~2900-3400px total, matching the ~2700px pin range observed on the source). The inner content is `sticky top-0 h-screen` so it stays fixed in the viewport while that scroll range passes.

## Recommended implementation: framer-motion `useScroll` + `useTransform` (framer-motion is already a project dependency — this is the idiomatic React way to do this, no GSAP needed)
```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ProjectsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // total scrollable width of the track beyond one viewport = (6 cards * (cardWidth+gap)) - viewportWidth, approximate with a fixed px value tuned per breakpoint or measured via a ref + useState/ResizeObserver
  const x = useTransform(scrollYProgress, [0, 1], ["0px", "-2200px"]); // tune -2200px to match actual track overflow; prefer measuring track scrollWidth - viewport width in a useEffect + ResizeObserver and feeding that into useTransform's output range via state, rather than a hardcoded guess, for correctness at any viewport width

  return (
    <div ref={containerRef} className="relative" style={{ height: "calc(100vh + 2400px)" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <h2 className="px-6 md:px-12 text-4xl md:text-5xl font-black">
          Featured <span style={{ color: "var(--awrs-primary)" }}>Projects</span>
        </h2>
        <motion.div style={{ x }} className="mt-10 flex gap-6 px-6 md:px-12 w-max">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} {...p} index={String(i + 1).padStart(2, "0")} />
          ))}
          <ViewAllCard />
        </motion.div>
      </div>
    </div>
  );
}
```
Measuring the real track overflow: in a `useEffect`, after mount, read `trackRef.current.scrollWidth - window.innerWidth` and store it in state, then use that (negated) as the `useTransform` output range end instead of a hardcoded value — this keeps the animation correct at any viewport width instead of over/under-scrolling. Use a ref on the motion div (framer-motion supports forwarding a ref) or an inner plain wrapper div you measure instead.

## ProjectCard sub-component
Each card is `w-[350px] shrink-0 rounded-2xl overflow-hidden border border-[var(--awrs-border)] bg-[var(--awrs-card)]` containing:
```
<div class="p-5 pb-0">
  <div class="flex items-center justify-between text-xs">
    <span class="w-6 h-6 rounded-md bg-[var(--awrs-bg-secondary)] flex items-center justify-center font-bold text-[10px]">{index}</span>
    <span class="uppercase tracking-wide text-[var(--awrs-text-tertiary)]">{category}</span>
    <span class="text-[var(--awrs-text-tertiary)]">{date}</span>
  </div>
  <div class="mt-3 flex items-center gap-2">
    <img src={logo} class="w-8 h-8 rounded-lg object-cover" alt="" />
    <h3 class="font-bold text-lg">{title}</h3>
  </div>
  <p class="mt-2 text-sm text-[var(--awrs-text-secondary)] leading-snug line-clamp-2">{description}</p>
</div>
<div class="relative mt-4 aspect-[4/3] overflow-hidden" style="background: <cardBg>">
  <!-- 3 layered phone-mockup screenshots, see below -->
  <!-- rotating "OPEN TO EXPLORE" circular badge, bottom-left, overlapping the image -->
  <!-- small external-link arrow button, top-right of the image or of the whole card header -->
</div>
<div class="p-5 pt-4 flex flex-wrap gap-2">
  <!-- tag pills -->
</div>
```

### Layered screenshots (IMPORTANT — 3 real separate images per project, not one flat picture)
Each project shows 3 phone-mockup PNGs fanned out and overlapping (left phone rotated slightly left and pushed back/scaled down, center phone largest/frontmost, right phone rotated slightly right and pushed back). Implement as 3 absolutely-positioned `<img>` elements inside the `aspect-[4/3]` container:
```tsx
<div className="absolute inset-0 flex items-center justify-center">
  <img src={shots[0]} className="absolute w-[38%] rotate-[-8deg] -translate-x-[70%] z-0 rounded-xl shadow-xl" alt="" />
  <img src={shots[2]} className="absolute w-[38%] rotate-[8deg] translate-x-[70%] z-0 rounded-xl shadow-xl" alt="" />
  <img src={shots[1]} className="absolute w-[42%] z-10 rounded-xl shadow-2xl" alt="" />
</div>
```
(Tune the exact percentages/rotation to taste against the screenshots — the key requirement is: 3 real images, layered/fanned, not 1 image or a mockup you drew yourself.)

### "OPEN TO EXPLORE" rotating badge
A small (~80-90px) dark circle in the bottom-left corner of the image area, overlapping it by about half (`className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-black/80 backdrop-blur flex items-center justify-center"`), containing:
- Curved repeating text "OPEN TO EXPLORE • OPEN TO EXPLORE •" around the circle's circumference (use an SVG `<text>` on a `<path>` (`<textPath>`), or simplify to a plain centered small icon (`Eye` from lucide-react, white) if implementing curved text is too time-costly — a static circular badge with just an eye/arrow icon inside is an acceptable simplification).
- **Time-driven behavior:** the badge (or its text ring) rotates continuously, `animation: spin 8s linear infinite` (`@keyframes spin { to { transform: rotate(360deg) } }` — Tailwind's built-in `animate-spin` utility works directly here, just apply it to the ring/text element, not the whole badge if it contains a non-rotating icon in the center).

### External link button
Small `w-8 h-8 rounded-full bg-[var(--awrs-card)] border border-[var(--awrs-border)] flex items-center justify-center` with an `ArrowUpRight` icon (`lucide-react`), positioned top-right, `href` to the project's detail route (inert in this clone — no `/projects/*` pages exist; render as a plain `<span>` or a `<button>` with no real navigation, or link to `#`).

## Data (5 projects + tags, verbatim, in order — image paths already downloaded)
```ts
const projects = [
  {
    title: "Huda", category: "MULTIPLATFORM APP", date: "Q1 2025",
    description: "A comprehensive Islamic companion app for daily worship and spiritual growth",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/logo_huda.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/1.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/2.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/huda/3.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Islamic", "Mobile"],
    cardBg: "linear-gradient(135deg, #0f4d47, #1a6b5f)",
  },
  {
    title: "Manara", category: "MOBILE APP", date: "Q2 2026",
    description: "A comprehensive safety app for pilgrims and mass gatherings with real-time group tracking, emergency reporting, and AR-powered smart navigation",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/icon.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/1.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/2.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/manara/3.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Safety", "AR"],
    cardBg: "linear-gradient(135deg, #0d3b45, #145566)",
  },
  {
    title: "Navix", category: "MOBILE APP", date: "Q2 2026",
    description: "An AI-powered project management platform that turns your skills and goals into complete projects — idea generation, PRDs, roadmaps, and risk analysis — powered by Navi, a custom in-house fine-tuned LLM",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/logo.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/navix/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "AI", "LLM"],
    cardBg: "linear-gradient(135deg, #5c1a2e, #7a2440)",
  },
  {
    title: "Healog", category: "MOBILE APP", date: "Q2 2026",
    description: "A smart health record digitizer that extracts medical metrics from lab reports using AI, tracks health trends with charts, and manages medication reminders",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/logo.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/healog/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "Firebase", "Gemini AI", "Health"],
    cardBg: "linear-gradient(135deg, #6b1a4a, #8a2560)",
  },
  {
    title: "Sire", category: "MULTIPLATFORM APP", date: "Q2 2025",
    description: "A modern, full-stack, multi-role e-commerce platform built with Flutter and PHP",
    logo: "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/logo_sire.png",
    shots: [
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_01.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_02.png",
      "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/projects/sire/screenshots/user/flutter_03.png",
    ],
    tags: ["Flutter", "Dart", "PHP", "MySQL", "Firebase"],
    cardBg: "linear-gradient(135deg, #7a2a4a, #9c3860)",
  },
];
```
`cardBg` gradients are approximated from the screenshots (exact per-project background photo colors) — close enough is fine, these are secondary to the real screenshot content layered on top.

### ViewAllCard (6th item in the track)
`w-[350px] shrink-0 rounded-2xl border border-[var(--awrs-border)] flex flex-col items-center justify-center text-center gap-4 p-8` containing a `LayoutGrid` icon (lucide-react) in a pale-pink rounded square, heading "View All Projects", subtext "See the full collection", and a pill button "Explore →" (inert `href="#"`, no `/projects` route exists in this clone).

## Tag pills
`<span class="text-xs font-medium px-3 py-1 rounded-full bg-[var(--awrs-bg-secondary)] text-[var(--awrs-text-secondary)]">{tag}</span>`

## Text Content
Section heading: "Featured Projects" (with "Projects" in primary pink). All project data verbatim above. "View All Projects", "See the full collection", "Explore".

## Responsive Behavior
- **Desktop (1440px):** 2 cards roughly visible per viewport as the track scrolls, 350px card width.
- **Mobile (<768px):** the pin/scroll-scrub mechanism should still work via touch scroll with framer-motion's `useScroll` (it's touch-compatible by default) — verify during QA. If it feels janky on touch, an acceptable fallback is swapping to a plain `overflow-x-auto snap-x` horizontal scroller on mobile only (native touch scroll, cards `snap-start`) while keeping the scroll-driven pin behavior on `md:` and up. Use your judgement based on how it behaves when tested.
- **Breakpoint:** `md` = 768px.
