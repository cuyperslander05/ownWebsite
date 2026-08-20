# OrbitalClock Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/OrbitalClock.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/02-about-cards-clock.jpg` and `03-about-stats-experience-start.jpg` (shows it mid-scroll, dark circular watch face with moon-phase dial)
- **Interaction model:** static decorative illustration with a small live text readout (client-computed on mount, no further interaction).

## Overview of the effect
A large (~300-360px diameter) dark circular "wristwatch face" SVG/CSS illustration, centered in its own full-width row between the About 3-card row and the "Available for Work" CTA row. It **intentionally overflows** above and below its row by roughly 60px on each side (the source achieves this via a taller `<svg>` than its grid cell with `overflow: visible` on ancestors) — implement this simply as a component with negative vertical margins, e.g. `<div className="relative -my-16 flex justify-center">`, so it visually pokes into the rows above/below without needing a real overflow trick.

**This is a nice-to-have decorative element. Given its complexity relative to the rest of the page, prioritize getting a visually close circular watch illustration over pixel-perfect SVG fidelity.** A simplified version that reads correctly from a normal viewing distance is the goal.

## Visual structure (build with SVG + a bit of CSS, no external asset)
- Outer ring: dark metallic bezel, `radial-gradient`/`conic-gradient` dark gray→black, circular, ~340px diameter, with a thin lighter rim highlight (a `linear-gradient` stroke or a lighter `stroke` on an outer `<circle>`).
- Inner face: near-black circle, with small white tick marks around the full circumference (like a watch dial — 60 small radial tick lines, every 5th one slightly longer/brighter). Use a loop generating `<line>` elements via `Array.from({length: 60})` with `transform="rotate(...)"`.
- A moon-phase indicator: a smaller circle (~70px) inset in the upper-left area of the face showing a half-lit moon (two overlapping circles, one white one dark, or a simple `clip-path` half circle) — approximate, doesn't need real-time lunar accuracy.
- A small watch "hand" — a thin line from the center pointing to roughly the 5 o'clock position (decorative, static is fine, or optionally rotate it to the current minute if trivial).
- A tiny rounded-rect readout tag near the center showing the day-of-month number (e.g. "19"), white text on dark background, small border.
- A thin center dot/pivot.
- Soft outer glow: `filter: drop-shadow(0 0 40px rgba(212,84,126,0.15))` using the primary color for a subtle pink halo behind the dark watch, matching the site's overall pink accent.

## Live readout (optional small text near the dial, client-computed)
On mount, compute and display (small caps, dim text, positioned near the top of the dial or just below it — exact placement is flexible):
- Day-of-month: `new Date().getDate()`
- Weekday abbreviation: `new Intl.DateTimeFormat('en-US', {weekday:'short'}).format(new Date())` uppercased (e.g. "WED")
- Visitor's IANA timezone city guess: `Intl.DateTimeFormat().resolvedOptions().timeZone` — this returns something like `"Europe/Brussels"`; take the part after the last `/` and replace underscores with spaces, uppercase it (e.g. "BRUSSELS"). This is the real mechanism the source site uses (a visitor-local-time widget, not the site owner's static city) — implement exactly this, it's cheap and correct.
- A "MOON" label (static text, purely decorative — no real moon-phase calculation needed).

This must be a **client component** (`"use client"`) since it reads `Date`/`Intl` at runtime — wrap the readout computation in a `useEffect` + `useState` so it doesn't cause an SSR/client hydration mismatch (render `null`/placeholder for the readout text until mounted, then fill it in).

## Text Content (verbatim / computed)
- Day number: computed (e.g. "19")
- Weekday: computed 3-letter abbreviation (e.g. "WED")
- City: computed from `Intl` timezone (e.g. "BRUSSELS")
- "MOON" (static label)

## Responsive Behavior
- **Desktop (1440px):** ~340-360px diameter, centered.
- **Mobile (390px):** scale down to ~220-260px diameter (`w-[220px] md:w-[340px]` pattern), still centered, negative margin overlap can be reduced (`-my-8` on mobile) so it doesn't awkwardly clip content on short viewports.
- **Breakpoint:** `md` = 768px.
