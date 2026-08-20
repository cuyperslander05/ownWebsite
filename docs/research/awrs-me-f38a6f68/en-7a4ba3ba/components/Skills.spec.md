# Skills Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Skills.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/05-skills-grid.jpg`
- **Interaction model:** scroll-entrance stagger fade-in (static content otherwise, `cursor-default`, no click behavior).

## DOM Structure
```
<section id="skills" class="py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6">
    <h2>Skills</h2> <!-- pink underline bar -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-10">
      <!-- one SkillItem per skill -->
    </div>
  </div>
</section>
```

### SkillItem (repeat ×18)
```
<div class="skill-item flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-2xl bg-[var(--awrs-card)] border border-[var(--awrs-border)] cursor-default">
  <IconComponent size={28} /> <!-- real brand color, see icon list -->
  <span class="text-xs font-semibold text-[var(--awrs-text-secondary)] tracking-wide">Flutter</span>
</div>
```

## Icon list — use `react-icons` (already installed as a dependency), which contains these exact brand marks
```tsx
import { SiFlutter, SiDart, SiKotlin, SiSwift, SiHtml5, SiCss, SiJavascript, SiPython, SiPhp, SiGithub, SiGitlab, SiDocker, SiOllama, SiFigma, SiFirebase } from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { Database } from "lucide-react"; // generic icon for "SQL" — no single-vendor brand mark applies
```
Data array (name → icon component → brand color, all verbatim from the source, in this exact order):
```ts
const skills = [
  { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
  { name: "Dart", Icon: SiDart, color: "#0175C2" },
  { name: "Kotlin", Icon: SiKotlin, color: "#7F52FF" },
  { name: "Java", Icon: FaJava, color: "#ED8B00" },
  { name: "Swift", Icon: SiSwift, color: "#F05138" },
  { name: "SwiftUI", Icon: SiSwift, color: "#F05138" }, // no distinct SwiftUI mark exists in react-icons; reuse Swift's — do not invent a new icon
  { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", Icon: SiCss, color: "#1572B6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "SQL", Icon: Database, color: "#4479A1" },
  { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "GitLab", Icon: SiGitlab, color: "#FC6D26" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Ollama", Icon: SiOllama, color: "#000000" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
];
```
Render each icon with `style={{ color: skill.color }}` (all these `Si*`/`Fa*` icons default to `fill="currentColor"`, so setting `color` via style/className works directly — no need for per-icon fill props).

## Computed Styles
- Grid: `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4`
- Item: `py-6 px-3 rounded-2xl bg-[var(--awrs-card)] border border-[var(--awrs-border)]`, icon `28px`, label `text-xs font-semibold text-[var(--awrs-text-secondary)] tracking-wide` centered below with `gap-3`.

## States & Behaviors
### Scroll-entrance stagger fade-in
- **Trigger:** IntersectionObserver on the grid container (or per-item), fires once.
- **State A:** `opacity: 0`, `transform: translateY(12px)`.
- **State B:** `opacity: 1`, `transform: translateY(0)`.
- **Transition:** `.4s ease-out`, stagger ~30ms per item index (`transitionDelay: ${index * 30}ms`), capped so the whole grid finishes within ~1s (e.g. `Math.min(index * 30, 600)`).

No hover-specific behavior beyond the default border color (optional: a subtle `hover:border-[var(--awrs-primary)]/40 hover:-translate-y-0.5 transition` touch is a reasonable enhancement matching the site's general polish, but not required).

## Text Content
Skill names exactly as listed in the data array above (verbatim, in that order).

## Responsive Behavior
- **Desktop (1440px):** 6 columns (`lg:grid-cols-6`).
- **Tablet (768px):** 5 columns (`md:grid-cols-5`).
- **Mobile (390px):** 3 columns (`grid-cols-3`), sm breakpoint bumps to 4.
- **Breakpoints:** `sm`=640, `md`=768, `lg`=1024.
