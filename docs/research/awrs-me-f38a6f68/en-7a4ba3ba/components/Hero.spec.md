# Hero Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Hero.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/01-hero.jpg`
- **Interaction model:** time-driven (marquee loops forever) + mount entrance animation (char-by-char gradient reveal)

## DOM Structure
```
<section class="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
  <!-- decorative background: faint diagonal line pattern, low opacity, absolutely centered -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
    <!-- a handful of thin diagonal <line>/<path> strokes in a radial-gradient-masked <svg>, color var(--awrs-beams-line) -->
  </div>

  <div class="relative z-10 text-center px-6 max-w-4xl -translate-y-16">
    <span>HI, I'M</span>  <!-- small tracked-out label -->
    <div class="small underline/divider mx-auto mt-2 mb-6 w-10 h-px bg-[var(--awrs-primary)]" />
    <h1 class="hero-name text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-10">
      <!-- "Abdulwahed" split into one <span class="awrs-hero-char"> per character -->
    </h1>
    <p class="hero-tagline text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed text-[var(--awrs-text-secondary)]">
      Software Engineer & Full-Stack Mobile Developer
    </p>
  </div>

  <!-- two rotated full-bleed marquee strips near the bottom of the section -->
  <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
    <div class="absolute left-[-20%] w-[140%] py-3.5 md:py-5 top-[75%] md:top-[85%] rotate-[4deg] bg-gradient-to-r from-pink-800 via-rose-700 to-pink-800 text-white/80 overflow-hidden">
      <div class="flex animate-[awrs-marquee_30s_linear_infinite]"> <!-- reverse direction -->
        <!-- 3x repeated: "Flutter Specialist ◆ Mobile App Architect ◆ AI & ML Integration ◆ Cross-Platform Builder ◆ Performance Optimizer ◆ Full-Stack Developer ◆" uppercase, bold, tracking-wide -->
      </div>
    </div>
    <div class="absolute left-[-20%] w-[140%] py-3.5 md:py-5 top-[78%] md:top-[88%] -rotate-[4deg] bg-[var(--awrs-card)] border-y border-[var(--awrs-border)] text-[var(--awrs-text-secondary)] overflow-hidden">
      <div class="flex animate-[awrs-marquee_30s_linear_infinite_reverse]">
        <!-- 3x repeated: "Problem Solver ◆ More Than an Engineer ◆ UI/UX Enthusiast ◆ Product Builder ◆ SaaS Architect ◆ Creative Developer ◆" -->
      </div>
    </div>
  </div>
</section>
```

## Computed Styles (exact values)
- Section: `min-h-screen flex items-center justify-center overflow-hidden`, `margin-top: -80px` (`-mt-20`), `padding-top: 80px` (`pt-20`) — this offsets for the fixed nav so content is vertically centered in the true viewport.
- Content wrapper: `max-width: 56rem` (`max-w-4xl`), `transform: translateY(-64px)` (`-translate-y-16`) — pulls the block up so the marquee bands have room below.
- "HI, I'M" label: small caps, letter-spaced, `text-sm` (approx), `color: var(--awrs-text-tertiary)` or secondary, with a short horizontal divider line beneath it (`w-10 h-px bg-[var(--awrs-primary)] mx-auto mt-2 mb-6`).
- `h1.hero-name`: `font-size` responsive `48px → 60px → 96px → 128px` (5xl/6xl/8xl/9xl), `font-weight: 900`, `margin-bottom: 40px` (mb-10).
- `p.hero-tagline`: `font-size: 18px` (`20px` at md), `font-weight: 500`, `max-width: 36rem`, `line-height: 1.625`, `color: var(--awrs-text-secondary)`.
- Marquee strip 1 (pink): `background: linear-gradient(to right, #9d174d/#a83252-ish, #be185d-ish, #9d174d)` — Tailwind `from-pink-800 via-rose-700 to-pink-800` is exact, use those literal Tailwind color classes. Text `color: rgba(255,255,255,0.8)`.
- Marquee strip 2 (light): `background: var(--awrs-card)` (white), `border-top/bottom: 1px solid var(--awrs-border)`, text `color: var(--awrs-text-secondary)`.
- Both strips: `width: 140%`, `left: -20%` (so the rotated strip always fully covers the viewport width), `padding-block: 14px` (`36px` md), `transform: rotate(4deg)` / `rotate(-4deg)` respectively.
- Marquee text items: `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.02em`, separated by a small "◆" glyph with reduced opacity, `white-space: nowrap`.

## States & Behaviors

### Hero name gradient char-reveal (mount animation)
- **Trigger:** on component mount (client-side, run once).
- Split "Abdulwahed" into one `<span class="awrs-hero-char inline-block">` per character (the `.awrs-hero-char` class — already defined in `globals.css` — applies the shared oversized `linear-gradient(to right, var(--awrs-primary-dark), var(--awrs-primary), var(--awrs-primary-light), #f5b8cc)` with `background-clip:text; -webkit-text-fill-color:transparent`).
- After mounting, measure the rendered `h1`'s total width, then set each span's inline `backgroundSize` to `${totalWidth}px 100%` and `backgroundPositionX` to `-${cumulativeLeftOffsetOfThatChar}px` (use `span.offsetLeft` relative to the `h1`) so the single gradient reads continuously across all letters.
- **State A (before):** `opacity: 0`, `filter: blur(8px)`, `transform: translateY(8px)`.
- **State B (after):** `opacity: 1`, `filter: blur(0px)`, `transform: translateY(0)`.
- **Transition:** stagger ~40ms per character index, `transition: opacity .6s ease-out, filter .6s ease-out, transform .6s ease-out`, using `transitionDelay: ${index * 40}ms` per span, applied via a `useEffect` that toggles a `mounted` class/state shortly after mount (e.g. `requestAnimationFrame` or a `setTimeout(0)`).
- Implementation approach: plain React + CSS transitions (no GSAP/framer-motion required, though framer-motion's `staggerChildren` on a `motion.span` list is also a clean fit if preferred — framer-motion is already a project dependency).
- Space character: render a plain non-breaking space span without the gradient class (skip animation on whitespace).

### Marquee scroll (infinite, time-driven)
- **Trigger:** none — runs continuously from mount.
- CSS: the `awrs-marquee` keyframe is already defined in `globals.css` (`translateX(0) → translateX(-50%)`). Duplicate the tag list array twice when rendering (not three times — two is enough for a seamless `-50%` loop) inside a flex row, apply `animation: awrs-marquee 30s linear infinite` to strip 1's track and `animation: awrs-marquee 30s linear infinite reverse` to strip 2's track (or just render strip 2's list in reverse order with the same non-reversed animation — either reads correctly; using the `reverse` animation-direction keyword is simplest).

### Greeting pill
- Not part of this component — lives in `Nav.tsx`.

## Assets
- No images. Pure CSS/SVG decoration (background beam lines can be a simple inline `<svg>` with 3-4 faint diagonal `<line>` elements at low opacity, or omitted if time-constrained — it's a very subtle background texture, low priority).

## Text Content (verbatim)
- "HI, I'M"
- "Abdulwahed"
- "Software Engineer & Full-Stack Mobile Developer"
- Marquee band 1: Flutter Specialist, Mobile App Architect, AI & ML Integration, Cross-Platform Builder, Performance Optimizer, Full-Stack Developer
- Marquee band 2: Problem Solver, More Than an Engineer, UI/UX Enthusiast, Product Builder, SaaS Architect, Creative Developer

## Responsive Behavior
- **Desktop (1440px):** name at `text-9xl` (128px), tagline `text-xl`.
- **Tablet (768px):** name at `text-8xl` (96px), marquee strips at `top-[85%]/top-[88%]`.
- **Mobile (390px):** name at `text-5xl/6xl` (48-60px), tagline `text-lg`, marquee `py-3.5`, strips at `top-[75%]/top-[78%]`.
- **Breakpoints:** Tailwind default `sm`/`md`/`lg`.
