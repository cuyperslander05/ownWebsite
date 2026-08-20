# AboutSection Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/AboutSection.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/02-about-cards-clock.jpg` and `03-about-stats-experience-start.jpg`
- **Interaction model:** scroll-entrance fade/blur-in per card (IntersectionObserver, fires once each) + animated count-up on the stats row. The big watch illustration in the middle is a SEPARATE component `OrbitalClock.tsx` (its own spec) — import it here as `<OrbitalClock />` and place it in its own full-width row between the 3-card row and the CTA row.

## DOM Structure
```
<section id="about" class="py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6">
    <h2>About Me</h2> <!-- with a short pink underline bar beneath, like other section headings -->

    <!-- Row 1: 3 cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-12 gap-6 mt-10">
      <div class="awrs-spotlight-card lg:col-span-4 rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6"> <!-- Profile card -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full border-2 border-[var(--awrs-primary)] flex items-center justify-center text-lg font-bold text-[var(--awrs-primary)]">AW</div>
          <div>
            <h3 class="font-bold text-[var(--awrs-primary)]">Abdulwahed Aldaghir</h3>
            <p class="text-sm text-[var(--awrs-text-secondary)]">Software Engineer & Full-Stack Developer</p>
          </div>
        </div>
        <p class="mt-4 text-[var(--awrs-text-secondary)] leading-relaxed">I'm a Software Engineer with a passion for building beautiful, functional mobile and web applications. I specialize in Flutter development and full-stack solutions, combining technical expertise with creative problem-solving.</p>
      </div>

      <div class="awrs-spotlight-card lg:col-span-4 rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6"> <!-- Timezone/globe card -->
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">Flexible with Timezones</p>
        <h3 class="mt-1 font-bold text-lg">Based in Oman, <span class="text-[var(--awrs-text-secondary)] font-normal">available globally</span></h3>
        <!-- dotted-globe illustration, see Assets -->
      </div>

      <div class="awrs-spotlight-card lg:col-span-4 rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] p-6"> <!-- Education card -->
        <div class="flex items-center gap-2 text-[var(--awrs-primary)]">
          <GraduationCap /> <span class="text-xs font-semibold uppercase tracking-wide">Education</span>
        </div>
        <div class="mt-6 rounded-xl bg-[var(--awrs-bg-secondary)] p-4 flex items-start justify-between">
          <div>
            <p class="font-bold">Sohar University</p>
            <p class="text-sm text-[var(--awrs-text-secondary)]">Bachelor's in Software Engineering</p>
            <p class="text-xs text-[var(--awrs-text-tertiary)] mt-1">2023 – 2026</p>
          </div>
          <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Graduate</span>
        </div>
      </div>
    </div>

    <OrbitalClock /> <!-- own full-width row, negative margins so it overlaps rows above/below slightly, per BEHAVIORS.md -->

    <!-- Row 3: "Available for work" CTA card -->
    <div class="mt-10 rounded-2xl border border-[var(--awrs-border)] bg-emerald-50/40 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div>
        <div class="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wide">
          <span class="w-2 h-2 rounded-full bg-emerald-500" /> Available for Work
        </div>
        <h3 class="mt-3 text-3xl md:text-4xl font-black">
          HAVE A VISION?<br/>
          <span class="text-[var(--awrs-primary)]">LET'S BUILD IT</span><br/>
          <span class="italic font-medium text-2xl md:text-3xl text-[var(--awrs-text-secondary)]">together.</span>
        </h3>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-5 py-2.5 font-medium text-sm">
          <Download size={16} /> Resume
        </a>
      </div>
      <div class="text-right">
        <Quote class="ml-auto text-[var(--awrs-primary)]/30" />
        <p class="italic font-semibold text-lg">Real artists ship.</p>
        <p class="text-xs tracking-wide text-[var(--awrs-text-tertiary)]">STEVE JOBS</p>
      </div>
    </div>

    <!-- Row 4: animated stat counters -->
    <div class="mt-10 rounded-2xl border border-[var(--awrs-border)] p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- one StatCard per stat, see below -->
      </div>
    </div>
  </div>
</section>
```

### StatCard (repeat ×4)
`div.awrs-spotlight-card` rounded-2xl bg-[var(--awrs-bg-secondary)] p-6 flex flex-col items-center text-center gap-2`:
- big number (`text-3xl font-black`, color per item) with a small dotted-circle decoration behind it (optional, low priority)
- label below in `Folder` (Projects) / `Calendar` (Years of Experience) / `Layers` (Published Platforms) / `Zap` (Technical Skills) icon (lucide-react, small, colored to match the number) + `text-sm text-[var(--awrs-text-secondary)]`

Stats data: `[{label:"Projects", value:20, color:"#d4547e"}, {label:"Years of Experience", value:3, color:"#3b82f6"}, {label:"Published Platforms", value:5, color:"#10b981"}, {label:"Technical Skills", value:15, color:"#f59e0b"}]` — all render as `<value>+`.

## States & Behaviors

### Scroll-entrance fade/blur-in (all cards)
- **Trigger:** `IntersectionObserver` (`threshold: 0.15` or similar), fires once per card, then unobserve.
- **State A (before):** `opacity: 0`, `transform: translateY(16px)`.
- **State B (after):** `opacity: 1`, `transform: translateY(0)`.
- **Transition:** `transition: opacity .6s ease-out, transform .6s ease-out`, stagger ~80-100ms between the 3 row-1 cards.
- Implementation: a small reusable `useInView` hook (or inline `IntersectionObserver` in a `useEffect`) is fine — this same pattern repeats across Experience/Achievements, so consider writing one shared hook `src/components/sites/awrs-me-f38a6f68/shared/useInView.ts` other builders can also use (export `useInView(ref, options)` returning a boolean). If that hook doesn't exist yet when you start, create it; if it already exists (another builder may have added it), reuse it as-is without modification.

### Animated count-up stats
- **Trigger:** IntersectionObserver on the stats row container, fires once.
- Implementation: on trigger, `requestAnimationFrame` loop from 0 to target value over ~1.2s with ease-out easing (e.g. `1 - Math.pow(1-t, 3)`), updating component state per stat, rendering `Math.round(current)` + `"+"`.

### Spotlight hover
- All three row-1 cards and the stat cards use the shared `.awrs-spotlight-card` class (already defined in `globals.css`) — add an `onMouseMove` handler that sets `--spotlight-x`/`--spotlight-y` CSS custom properties on the element to the cursor position relative to the card's bounding box: `e.clientX - rect.left`, `e.clientY - rect.top`.

## Assets
- Globe illustration (timezone card): a rotating dotted world-map sphere. This is a bespoke decorative graphic on the source site (likely canvas/WebGL or a dot-matrix PNG). **Simplification for this clone:** render a static CSS/SVG approximation — a circle with a radial dot-pattern (`background-image: radial-gradient(circle, #00000022 1px, transparent 1px); background-size: 6px 6px;` clipped to a circle via `border-radius: 50%` and a soft box-shadow) is an acceptable stand-in; do not attempt to fabricate a literal continent silhouette. Keep it simple — a plain dotted circle in the card reads fine at a glance and avoids inventing map data that doesn't exist as a real asset.
- Resume link: `href="https://awrs.me/cv.pdf"` (external — link directly to the source site's PDF rather than re-hosting a stranger's personal resume; open in a new tab).

## Text Content (verbatim)
"About Me" / "Abdulwahed Aldaghir" / "Software Engineer & Full-Stack Developer" / "I'm a Software Engineer with a passion for building beautiful, functional mobile and web applications. I specialize in Flutter development and full-stack solutions, combining technical expertise with creative problem-solving." / "FLEXIBLE WITH TIMEZONES" / "Based in Oman, available globally" / "EDUCATION" / "Sohar University" / "Bachelor's in Software Engineering" / "Graduate" / "2023 – 2026" / "AVAILABLE FOR WORK" / "HAVE A VISION?" / "LET'S BUILD IT" / "together." / "Resume" / "Real artists ship." / "STEVE JOBS" / "Projects" / "Years of Experience" / "Published Platforms" / "Technical Skills"

## Responsive Behavior
- **Desktop (1440px):** 3-column row (`lg:grid-cols-12`, each card `col-span-4`); stats 4-column.
- **Tablet (768px):** 2-column row (profile spans full width or wraps); stats 2-column.
- **Mobile (390px):** all cards stack to 1 column; CTA card stacks its two halves vertically; stats 2-column (`grid-cols-2`).
- **Breakpoint:** `md` = 768px, `lg` = 1024px.
