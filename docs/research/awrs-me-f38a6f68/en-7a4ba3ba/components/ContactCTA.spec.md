# ContactCTA Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ContactCTA.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/14-contact-cta.jpg`
- **Interaction model:** scroll-entrance mount animation (same char-by-char gradient reveal technique as `Hero.tsx`'s name — reuse the identical approach, just triggered by IntersectionObserver instead of on-mount since this section is further down the page).

## DOM Structure
```
<section class="relative py-20 md:py-28">
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-4xl md:text-5xl font-black">Ready to Connect?</h2>
    <p class="mt-2 text-lg text-[var(--awrs-text-secondary)]">Let's turn your next idea into something real</p>
    <div class="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4" />

    <div class="mt-10 rounded-2xl border border-[var(--awrs-border)] bg-gradient-to-b from-[var(--awrs-primary)]/5 to-transparent p-10 md:p-16 text-center">
      <h3 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
        <!-- "FROM IDEA TO " in solid dark text, "IMPACT" with the awrs-hero-char gradient-reveal treatment -->
        FROM IDEA TO <span><!-- IMPACT, char-split, gradient --></span>
      </h3>
      <p class="mt-2 text-lg md:text-xl font-bold tracking-wide text-[var(--awrs-text-secondary)]">LET'S BUILD SOMETHING REAL.</p>
      <a href="mailto:abdulwahedaldaghir0@gmail.com" class="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--awrs-text)] px-6 py-3 font-semibold hover:bg-[var(--awrs-text)] hover:text-white transition-colors">
        Get in Touch <ArrowRight size={18} />
      </a>
      <p class="mt-6 text-sm text-[var(--awrs-text-tertiary)]">Open to full-time roles & freelance projects</p>
      <p class="mt-2 text-sm text-[var(--awrs-text-secondary)] max-w-md mx-auto">I build high-performance applications that turn complex ideas into seamless user experiences.</p>
    </div>
  </div>
</section>
```

## Gradient text-reveal on "IMPACT"
Only the word "IMPACT" gets the animated per-character gradient treatment (the rest of the heading, "FROM IDEA TO ", stays plain dark solid text `text-[var(--awrs-text)]`). Reuse the exact same mechanism documented in `Hero.spec.md`'s "Hero name gradient char-reveal" section:
- Split "IMPACT" into `<span class="awrs-hero-char inline-block">` per character.
- Measure width, set `backgroundSize`/`backgroundPositionX` per span the same way.
- **Trigger:** IntersectionObserver on this heading (fires once when scrolled into view — NOT on mount, since this section loads off-screen initially), then run the same opacity/blur/translateY stagger transition.
- If you already wrote a shared helper for this in `Hero.tsx` (e.g. a `GradientRevealText` component), consider extracting it to `../shared/GradientRevealText.tsx` and importing it here instead of duplicating the logic — check if `Hero.tsx` already exports/shares one before writing a second copy. If it doesn't exist yet or you're building this before Hero is merged, it's fine to implement the logic locally in this file; duplication here is acceptable if reuse isn't practical given build order.

## Assets
- Icon: `ArrowRight` from `lucide-react`.

## Text Content (verbatim)
"Ready to Connect?", "Let's turn your next idea into something real", "FROM IDEA TO IMPACT" (IMPACT gradient), "LET'S BUILD SOMETHING REAL.", "Get in Touch" (mailto link), "Open to full-time roles & freelance projects", "I build high-performance applications that turn complex ideas into seamless user experiences."

## Responsive Behavior
- **Desktop (1440px):** heading `text-6xl`.
- **Mobile (390px):** heading `text-4xl`/`text-5xl`, card padding reduces (`p-8` instead of `p-16`).
- **Breakpoint:** `sm`/`md` Tailwind defaults.
