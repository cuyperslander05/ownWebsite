# Animation Audit — live awrs.me/en vs local clone (2026-08-20)

The live site currently has ~30 custom `@keyframes` / 111 actively-animating elements that
BEHAVIORS.md never captured (site has evolved since original research pass). This doc records
exact values extracted via chrome-devtools MCP `getComputedStyle` / stylesheet introspection,
grouped by section, to drive a second animation-fidelity pass. Design tokens referenced below
already exist in `src/app/globals.css` under `--awrs-*` (see BEHAVIORS.md).

## 1. Hero (`Hero.tsx`)

**Floating particles** — 8x small dots, currently MISSING locally.
```css
@keyframes float-slow {
  0%, 100% { transform: translate(0px) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}
```
- `.hero-particle`: `absolute w-1 h-1 rounded-full bg-[var(--awrs-primary)]/20`, `animation: float-slow 8s ease-in-out infinite`
- 8 particles scattered around the hero (randomize position within the hero bounds; live doesn't reveal exact coordinates via computed style — use a spread across the visible hero area, varying delay per particle so they don't move in lockstep).

**Marquee speed mismatch** — local has both bands at 30s; live measured:
- Dark/primary band (`hero-marquee-track-reverse`, the one with `reverse` direction) → **35s**
- Light/secondary band (`hero-marquee-track`, `normal` direction) → **40s**
Update the two `animation: awrs-marquee ...` inline styles in `Hero.tsx` accordingly (30s → 35s for the reverse/dark band, 30s → 40s for the normal/light band). Keep `linear infinite`.

**Not pursued (inactive/unlocated on live site during this audit, low confidence):** `hero-gradient-shift`, nav `greeting-glow-rotate`/`shimmer`. Skip.

## 2. About — avatar ring, available card, clock glow (`AboutSection.tsx` rows 1, `OrbitalClock.tsx`)

**Avatar ring** (wraps the "AW" initials avatar in the intro card) — rotating conic-gradient border, local currently has a plain static ring.
```css
@keyframes gradient-rotate { 0% { --gradient-angle: 0deg; } 100% { --gradient-angle: 360deg; } }
```
`animation: gradient-rotate 4s linear infinite` on the ring wrapper; ring itself painted with a `conic-gradient(from var(--gradient-angle), ...)` using primary/primary-light/primary-dark tokens, `padding: 3px` so the rotating ring shows as a border around the inner avatar circle.

**"Available for Work" card** (About row 2, left card) — local has a static green dot + plain card; live has:
```css
@keyframes available-gradient-rotate { 0% { --available-angle: 0deg; } 100% { --available-angle: 360deg; } }
@keyframes available-bg-shift { 0%, 100% { opacity: 0.03; background-position: 0% center; } 50% { opacity: 0.06; background-position: 100% center; } }
@keyframes available-ping { 75%, 100% { opacity: 0; transform: scale(2); } }
```
- `.available-bg-gradient` (absolute inset-0, behind content): subtle animated gradient wash, `animation: available-bg-shift 4s ease-in-out infinite`
- `.available-border-ring` (absolute inset-0): rotating conic-gradient border ring, `animation: available-gradient-rotate 3s linear infinite`, emerald-tinted (card's accent is emerald/green, not pink)
- Ping dot: exactly Tailwind's built-in `animate-ping` (`available-ping` keyframe is byte-identical to Tailwind's `ping`) — the existing static `<span className="h-2 w-2 rounded-full bg-emerald-500" />` needs a sibling `<span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />` behind it (standard "pulsing status dot" pattern).

**Orbital clock glow** (`OrbitalClock.tsx`):
```css
@keyframes clock-halo-pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.05); } }
@keyframes lume-pulse { 0%, 100% { opacity: 0.72; } 50% { opacity: 1; } }
```
- `.clock-halo`: sits behind the watch SVG, `width: 360px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(0,0,0,.06) 0%, rgba(0,0,0,.03) 35%, rgba(0,0,0,.01) 55%, transparent 80%); animation: clock-halo-pulse 5s ease-in-out infinite;` (position it centered behind the clock face, `position: absolute`).
- Live has 10 individually glowing "lume dot" markers around the bezel (`fill:#1a1a1a`, SVG `filter: url(#lumeGlow)`, `animation: lume-pulse 4s ease-in-out infinite`, opacity 0.72→1). Local's clock face uses simple `<line>` tick marks, not individual dots — full replication requires redesigning the tick marks as dots + an SVG glow filter. Given `OrbitalClock.tsx` is explicitly documented as "not a pixel-perfect asset recreation," treat this as **optional/lower priority**: a reasonable approximation is adding the pulse glow (`lume-pulse` keyframe) to just the 4 major tick marks (12/3/6/9 o'clock) rather than replicating all 10 dots exactly.

## 3. About — "Impact" stat cards orbital widget (`AboutSection.tsx` stats row — REPLACES the current plain 4-card grid)

Local currently renders the 4 stats (Projects/Years/Platforms/Skills) as plain count-up cards. Live renders each as a decorated widget: gentle float + radial glow-pulse + a rotating conic-gradient border ring + an orbiting dashed ring with two small satellite dots (one spinning each direction). Each card uses **its own stat's accent color** (matches the existing local `STATS` array: `#d4547e` / `#3b82f6` / `#10b981` / `#f59e0b`).

```css
@keyframes impact-float { 0%, 100% { translate: 0px; } 50% { translate: 0px -6px; } }
@keyframes stat-border-rotate { 100% { --stat-border-angle: 360deg; } }
@keyframes impact-glow-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes impact-orbit-spin { 100% { transform: rotate(360deg); } }
@keyframes impact-orbit-spin-reverse { 100% { transform: rotate(-360deg); } }
```

Per-card measured values (card index 0..3, matching STATS array order):
- `.impact-stat-float` wrapper: `animation: impact-float 5s ease-in-out infinite` (same 5s for all 4 cards)
- `.impact-stat-border`: `border-radius: 16px; background: conic-gradient(from <angle>deg, transparent 0%, transparent 65%, <stat-color> 78%, transparent 100%); animation: stat-border-rotate 3.5s linear infinite` (same 3.5s for all 4 cards; drive the conic-gradient angle via a CSS custom property `--stat-border-angle` animated 0→360deg, referenced in the `conic-gradient(from var(--stat-border-angle), ...)`)
- `.impact-stat-glow`: `position:absolute; inset:-15%; border-radius:9999px; background: radial-gradient(circle, <stat-color>15 0%, transparent 70%); animation: impact-glow-pulse 3s ease-in-out infinite` (~125px square, scales with card)
- `.impact-orbit` (outer dashed ring, SVG `viewBox="0 0 120 120"`, rendered ~96x96px): `<circle cx="60" cy="60" r="50" fill="none" stroke-width="1" stroke-dasharray="4 8" stroke="<stat-color>" opacity="0.25" />`, animate the whole `<svg>` with `animation: impact-orbit-spin <dur>s linear infinite` where duration is **10s / 12s / 14s / 16s** for cards 0/1/2/3 respectively (2s increment per card).
- `.impact-orbit-dot` (small satellite, same SVG viewBox): `<circle cx="60" cy="10" r="2.5" fill="<stat-color>" opacity="0.6" />`, `animation: impact-orbit-spin <dur>s linear infinite` where duration is **3s / 3.5s / 4s / 4.5s** for cards 0/1/2/3 (0.5s increment).
- `.impact-orbit-dot-reverse` (second satellite): `<circle cx="110" cy="60" r="2" fill="<stat-color>" opacity="0.4" />`, `animation: impact-orbit-spin-reverse <dur>s linear infinite` where duration is **5s / 5.7s / 6.4s / 7.1s** for cards 0/1/2/3 (~0.7s increment).

The count-up-from-0 behavior (IntersectionObserver + requestAnimationFrame easing) already implemented locally should be kept as-is — these are purely additive decorative layers around the existing stat card.

## 4. Experience (`Experience.tsx`)

Local currently: "static vertical timeline, alternating left/right" per PAGE_TOPOLOGY — no pulse effects implemented. Live has 2 effects on each timeline marker:
```css
@keyframes timeline-pulse {
  0%, 100% { box-shadow: rgba(224,122,156,.7) 0 0 8px 3px, rgba(224,122,156,.4) 0 0 24px 10px, rgba(224,122,156,.2) 0 0 80px 24px; }
  50% { box-shadow: rgba(224,122,156,.5) 0 0 5px 2px, rgba(224,122,156,.2) 0 0 12px 5px; }
}
@keyframes marker-ring-pulse { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
```
- `.experience-dot` (12x12px filled circle, `background: var(--awrs-primary)`, positioned at the bottom-center of each timeline item connecting to the line): `animation: timeline-pulse 1.5s ease-in-out infinite` — the box-shadow values use `--awrs-primary-light` (#e07a9c) at varying alpha, exactly as shown above.
- `.experience-marker-ring` (44x44px, `border: 2px solid rgba(212,84,126,0.25)` i.e. `var(--awrs-primary)` at ~25% alpha, `border-radius: 9999px`, centered on the same dot): `animation: marker-ring-pulse 2.5s ease-out infinite` — a classic expanding-ring "sonar ping" effect (opacity 0.6→0, scale 1→1.6). One ring per timeline item (4 items per BEHAVIORS.md).

## 5. Achievements (`Achievements.tsx`)

Local: "stagger fade-in" only, no ongoing decorative animation. Live adds 3 effects per card, using **each card's own accent color** (already documented in BEHAVIORS.md as "icon badge (colored, per-card accent color)" — reuse whatever color mapping is already used for the icon badges):
```css
@keyframes achievement-border-rotate { 100% { --achievement-border-angle: 360deg; } }
@keyframes impact-shimmer { /* shares the shimmer sweep pattern used elsewhere: background-position animates across a gradient-text title */ }
@keyframes achievement-particle-float {
  0%, 100% { opacity: 0.5; transform: translate(0px) scale(1); }
  33% { opacity: 0.9; transform: translate(6px, -10px) scale(1.15); }
  66% { opacity: 0.35; transform: translate(-5px, 7px) scale(0.85); }
}
```
- `.achievement-border-sweep`: `border-radius: 16px; background: conic-gradient(transparent 60%, <card-accent-color> 78%, transparent 100%); animation: achievement-border-rotate 3.5s linear infinite` (rotate via a `--achievement-border-angle` custom property, same pattern as the About stat-border).
- Card title (`<h3>`, class `achievement-shimmer-title`): `animation: impact-shimmer 4s linear infinite` — a horizontal shimmer band sweeping across the gradient-clipped title text (background-position driven, matching the `.hero-char`/contact-CTA gradient-text shimmer treatment already used elsewhere on the site).
- `.achievement-particle` (4 per card, `absolute rounded-full pointer-events-none`, card-accent `background-color`): sizes/positions/timing observed on one card:
  | # | size | top | inset-inline-end | duration | delay |
  |---|------|-----|-------------------|----------|-------|
  | 1 | 4px | 12% | 15% | 6s | 0s |
  | 2 | 3px | 25% | 8% | 7s | 1.5s |
  | 3 | 5px | 60% | 12% | 5.5s | 3s |
  | 4 | 3px | 75% | 22% | 6.5s | 2s |
  `animation: achievement-particle-float var(--particle-duration) ease-in-out var(--particle-delay) infinite`. Reasonable to reuse this same size/position/timing table for every achievement card (live didn't reveal per-card randomization beyond this).

## 6. Projects carousel (`ProjectsCarousel.tsx`)

Already documented in BEHAVIORS.md as scroll-driven horizontal pin carousel with a spinning "OPEN TO EXPLORE" badge — that spin duration is now confirmed as `spin-slow` = **10s linear infinite** (SVG `animate-spin-slow`). Additionally, each project card has a hover-triggered border glow, and there's a loading-style pulse+shimmer overlay (likely intended for the phone-mockup screenshot images while they load):
```css
@keyframes shimmer { /* background-position sweep, same family as achievement title shimmer */ }
```
- Card hover ring: `.rounded-2xl` overlay, `opacity-0 group-hover:opacity-100 transition-opacity duration-500`, `animation: rotate-border 3s linear infinite` (conic-gradient rotating ring, only visible on hover via the opacity transition — the animation itself always runs, opacity gates visibility).
- Image placeholder shimmer: stacked `bg-white/5 animate-pulse` (Tailwind's built-in `pulse`, 2s) + a `shimmer` sweep (1.5s ease-in-out) overlay — apply to the phone-mockup screenshot container as a subtle "still loading" polish effect.
- **End card ("View All Projects")** — richer hover treatment:
  - Two aurora blobs: `cta-aurora-drift` 12s ease-in-out (`-top-1/2 -left-1/4 w-3/4 h-full`, `bg-primary blur-3xl`, opacity 0.04→0.08 on hover via `group-hover/cta:opacity-[0.08]`) and `cta-aurora-drift-alt` 15s ease-in-out (`-bottom-1/3 -right-1/4 w-2/3 h-3/4`, opacity 0.03→0.06 on hover)
  - `cta-shimmer` 2s ease-in-out sweep, `opacity-0 group-hover/cta:opacity-100`
  - `rotate-border` 3s linear rotating ring around the card, `-inset-3.5`, `opacity-0 group-hover/cta:opacity-100`
  ```css
  @keyframes cta-aurora-drift { 0%,100% { transform: translate(0) scale(1); } 33% { transform: translate(10%,-5%) scale(1.1); } 66% { transform: translate(-5%,8%) scale(.95); } }
  @keyframes cta-aurora-drift-alt { 0%,100% { transform: translate(0) scale(1); } 33% { transform: translate(-8%,6%) scale(1.05); } 66% { transform: translate(6%,-4%) scale(.9); } }
  @keyframes cta-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes rotate-border { 100% { --border-angle: 360deg; } }
  ```

## 7. Contact CTA (`ContactCTA.tsx`)

Local: char-reveal gradient text only, no background motion or button hover polish. Live adds:
- Two big background aurora blobs behind the whole CTA section (same `bg-primary` blur-3xl treatment as the Projects end-card, bigger/slower): `cta-aurora-drift` **14s** ease-in-out (`-top-1/3 -left-1/4 w-3/4 h-2/3`, `opacity-[0.06] dark:opacity-[0.08]`) and `cta-aurora-drift-alt` **18s** ease-in-out (`-bottom-1/4 -right-1/4 w-2/3 h-1/2`, `opacity-[0.04] dark:opacity-[0.06]`). Both `blur(64px)` (Tailwind `blur-3xl`), `background: var(--awrs-primary)`.
- "Get in Touch" button hover: `rotate-border` **4s** linear rotating ring (`opacity-0 group-hover/btn:opacity-100`, `rounded-full`) + `cta-shimmer` **2s** ease-in-out sweep (`opacity-0 group-hover/btn:opacity-100`, `rounded-full`). Reuse the same `rotate-border`/`cta-shimmer` keyframes as section 6.

## Not pursued this pass

`hero-gradient-shift`, nav `greeting-glow-rotate`/`shimmer`, `glitch-anim-1`/`glitch-anim-2`/`scan-line`/`pulse-ring` — defined in the live bundle's CSS but not found actively applied to any element during this audit (possibly hover/command-palette-state-gated, or dead CSS). Low confidence, deprioritized. `react-activity-calendar--loading-animation` is a third-party library loading-skeleton animation, irrelevant since the GitHub section is intentionally hardcoded static content (BEHAVIORS.md decision, avoids live API dependency).
