# Achievements Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Achievements.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/11-achievements.jpg`
- **Interaction model:** scroll-entrance stagger fade-in (IntersectionObserver, once) + spotlight hover (reuse `.awrs-spotlight-card` global class).

## DOM Structure
```
<section id="achievements" class="py-20 md:py-28">
  <div class="max-w-5xl mx-auto px-6">
    <h2>Achievements</h2> <!-- pink underline bar -->
    <div class="grid md:grid-cols-2 gap-5 mt-10">
      <!-- 4 cards in the grid, 5th card below spanning centered -->
    </div>
  </div>
</section>
```

### AchievementCard (repeat, last one wrapped in a centered `md:max-w-[calc(50%-0.625rem)] md:mx-auto` div outside the grid, or simplest: render all 5 inside the 2-col grid and let the 5th naturally wrap to its own row spanning col 1 — visually matches the screenshot closely enough; use `md:col-span-2 md:max-w-md md:mx-auto` on the 5th card only)
```
<div class="awrs-spotlight-card relative rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6">
  <div class="flex items-start gap-4">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background: <accent>1a"> <!-- ~10% tint of accent color -->
      <IconComponent style="color: <accent>" size={22} />
    </div>
    <div>
      <h3 class="font-bold leading-snug">1st Place — Intelligent Planet Hackathon</h3>
      <p class="text-sm font-medium mt-0.5" style="color: <accent>">KFUPM & Google Cloud · Feb 2026</p>
      <p class="mt-2 text-sm text-[var(--awrs-text-secondary)] leading-relaxed">Achieved 1st place among 500+ teams from 60+ countries. Built Manara — a personal guardian app with AR navigation and real-time risk alerts.</p>
    </div>
  </div>
</div>
```

## Data (all 5 entries, verbatim, top to bottom, left-to-right)
```ts
const achievements = [
  {
    title: "1st Place — Intelligent Planet Hackathon",
    org: "KFUPM & Google Cloud",
    date: "Feb 2026",
    description: "Achieved 1st place among 500+ teams from 60+ countries. Built Manara — a personal guardian app with AR navigation and real-time risk alerts.",
    icon: "Trophy",
    color: "#f59e0b", // amber
  },
  {
    title: "Best AI Solution — Innovation Hackathon",
    org: "Middle East College & KEF",
    date: "Apr 2026",
    description: "Awarded for developing an outstanding AI-driven innovation at the KEF Innovation Hackathon 2026.",
    icon: "Lightbulb",
    color: "#3b82f6", // blue
  },
  {
    title: "Best Team — NASA Space Apps Hackathon",
    org: "NASA · Art & Technology",
    date: "Oct 2025",
    description: "Awarded Best Team in the Art & Technology category. Recognized by Sohar University, NASA, and UTAS.",
    icon: "Rocket",
    color: "#10b981", // green
  },
  {
    title: "2nd Place — ICPC Oman (OCPC)",
    org: "ICPC",
    date: "Apr 2026",
    description: "Secured second place in the Oman Collegiate Programming Contest 2025.",
    icon: "Medal",
    color: "#8b5cf6", // purple
  },
  {
    title: "Vice Chancellor's Award for Outstanding Achievement",
    org: "Sohar University",
    date: "2025/2026",
    description: "Recognized by Sohar University for international achievements and outstanding contributions to student activities.",
    icon: "Award",
    color: "#d4547e", // pink (site primary)
  },
];
```
Render the `org · date` line as `{org} · {date}` in a single styled line matching the accent color.

## Assets
- Icons: `Trophy, Lightbulb, Rocket, Medal, Award` from `lucide-react`.

## States & Behaviors
### Scroll-entrance stagger fade-in
- **Trigger:** IntersectionObserver, once, per card.
- **State A:** `opacity:0, translateY(20px)`. **State B:** `opacity:1, translateY(0)`.
- **Transition:** `.5s ease-out`, stagger `~100ms` per card index.

### Spotlight hover
- Apply `.awrs-spotlight-card` (global class) with the same `onMouseMove` handler pattern as `AboutSection.spec.md`.

## Text Content
See data table — verbatim.

## Responsive Behavior
- **Desktop (≥768px):** 2-column grid, 5th card centered on its own row.
- **Mobile (<768px):** single column, all 5 stacked.
- **Breakpoint:** `md` = 768px.
