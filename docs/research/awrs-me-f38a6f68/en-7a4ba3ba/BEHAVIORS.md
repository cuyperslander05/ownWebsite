# Behaviors — awrs.me/en

## Global design tokens (from computed `:root` custom properties)
```
--color-bg: #fff
--color-bg-secondary: #f5f5f7
--color-bg-tertiary: #eeeef2
--color-text: #1a1a2e
--color-text-secondary: #4b5563
--color-text-tertiary: #6b7280
--color-border: #e5e7eb
--color-card: #fff
--color-card-hover: #f9f9fb
--color-navbar: #ffffffd9   (nav pill background, 85% opacity white)
--color-primary: #d4547e
--color-primary-light: #e07a9c
--color-primary-glow: #d4547e40
--beams-line-color: #888
```
Body font: **Inter** (`Inter, system-ui, sans-serif`) — used everywhere, all weights 400/500/600/700/800/900 observed. No other font family is actually rendered anywhere on this page (a Playfair Display `next/font` variable is loaded on `<body>` but not applied to any visible element — skip it).
Card radius: `rounded-2xl` (16px). Card border: `border border-[var(--color-border)]`, ~0.8px. No box-shadow on default cards (flat, border-only style).
`html.lenis` — Lenis smooth-scroll is active site-wide.

## Global reusable CSS pattern: `.spotlight-card`
Mouse-follow radial-gradient spotlight on hover, used on About/Achievements/Skills cards etc.
```css
.spotlight-card {
  --spotlight-x: -100px; --spotlight-y: -100px;
  position: relative; overflow: hidden;
  transition: border-color .3s, box-shadow .3s, transform .3s;
}
.spotlight-card::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0; transition: opacity .4s;
  background: radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color, rgba(212,84,126,.12)), transparent 40%);
}
.spotlight-card:hover::before { opacity: 1; }
.spotlight-card:hover { border-color: var(--color-primary); }
```
JS: on `mousemove` over the card, set `--spotlight-x`/`--spotlight-y` to the cursor position relative to the card (`e.clientX - rect.left`, `e.clientY - rect.top`).

## Nav glow (active nav-item underline glow)
Two stacked absolutely-positioned bars at `-top-[1px]` of the active nav pill:
```css
.nav-glow-beam { background: radial-gradient(50% 100% at 50% 0%, var(--color-primary) 0%, transparent 100%); box-shadow: 0 0 12px 4px var(--color-primary-glow), 0 0 28px 8px var(--color-primary-glow); filter: blur(3px); }
.nav-glow-core { background: linear-gradient(90deg, transparent 0%, var(--color-primary-light) 20%, var(--color-primary) 50%, var(--color-primary-light) 80%, transparent 100%); box-shadow: 0 0 6px 1px var(--color-primary), 0 0 16px 2px var(--color-primary-glow); }
```

## Gradient character-reveal text (hero name "Abdulwahed" + contact "FROM IDEA TO IMPACT")
Each character is wrapped in its own `<span class="hero-char inline-block bg-clip-text">`. ALL spans share the exact same oversized linear-gradient background (`linear-gradient(to right, #a83d62, #d4547e, #e07a9c, #f5b8cc)`, sized to the full rendered text width e.g. `background-size: 767px 100%`), with `background-clip: text; -webkit-text-fill-color: transparent`. Each span's `background-position-x` is set to `-<that char's cumulative left offset>px` so the single gradient reads continuously across all characters (not per-character).
Entrance animation (GSAP, staggered per character, left→right):
- **Before:** `opacity: 0`, `filter: blur(<Npx>)`, `transform: translateY(<small px>)`
- **After:** `opacity: 1`, `filter: blur(0px)`, `transform: translate(0,0)`
- Stagger ~30-50ms per character, duration ~0.6-0.8s, easing ease-out.
Implementation approach: CSS + a small JS mount-effect (measure text width, assign `background-position` per char index, then run a staggered CSS transition/`framer-motion`/manual timeout stagger — GSAP not required, `transition-delay` per span index works fine).

## Hero marquee ribbons (2 diagonal bands)
Two full-bleed bands rotated a few degrees (one rotated positive, one negative, forming an X crossing behind the hero name), each containing a duplicated (2x, for seamless loop) row of pill-tag words separated by "•", scrolling horizontally forever.
- Band 1 (darker, `--color-primary` bg, white text) tags: FULL-STACK DEVELOPER · FLUTTER SPECIALIST · MOBILE APP ARCHITECT · AI & ML INTEGRATION · CROSS-PLATFORM BUILDER · PERFORMANCE OPTIMIZER (loops)
- Band 2 (light bg, dark text) tags: PROBLEM SOLVER · MORE THAN AN ENGINEER · UI/UX ENTHUSIAST · PRODUCT BUILDER · SAAS ARCHITECT · CREATIVE DEVELOPER (loops)
- INTERACTION MODEL: time-driven, CSS `@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }` on a flex row containing the tag-list duplicated twice, `animation: marquee 30s linear infinite`. Bands scroll in **opposite directions** from each other (confirm by re-watching: dark band moves one way, light band the other — implement with `animation-direction: reverse` on the second band).

## Greeting pill (nav, collapsed state)
Text is time-of-day based: "Good Morning" / "Good Afternoon" / "Good Evening" / "Good Night", with a matching emoji (🌙 seen for evening). Compute from local `Date().getHours()` client-side.

## FloatingNav hover-expand (desktop only)
- **Trigger:** `mouseenter` on the nav pill.
- **State A (collapsed):** shows only the greeting pill (`display:flex`), width ≈185px.
- **State B (expanded):** greeting pill → `display:none`; the links row (`Home/Projects/Blog/The Wall/Contact`) fades/grows in, width animates to ≈456px (fits content), a rounded pill slides behind the active link ("Home" on this page — pink text `var(--color-primary)`, pale pink bg).
- **Transition:** width + opacity animate together (~0.3-0.4s ease). Collapses back on `mouseleave` (small delay).
- Implementation approach: CSS `width` transition on the `<nav>` (from fit-content of collapsed child to fit-content of expanded child) + opacity crossfade between the two inner divs, driven by a `:hover`/JS-hover state (Framer Motion `layout` animation is a good fit, or plain CSS with grid-template-columns trick).

## Cmd-K / Command Palette
- **Trigger:** click the fixed Cmd-K button (desktop) or the "☰ Tap to Explore" pill (mobile, replaces the whole nav+logo+cmdk trio below `md`).
- **Desktop:** centered modal, backdrop `rgba(0,0,0,.4)`-ish + blur, white rounded-2xl panel, fades/scales in.
- **Mobile:** same content rendered as a bottom sheet — full-width, rounded top corners only, slides up from bottom, drag-handle bar at top center.
- Content: search input "Jump to a project...", "Reach out" button, globe icon (locale switcher, inert in this clone), moon icon (dark/light toggle), then grouped rows: **PAGES** (Home[active]/Projects/Blog/The Wall/Contact — icon + label pill buttons), **CONNECT** (GitHub/LinkedIn/X (Twitter)/Reddit — external link pills), **LEGAL** (Privacy Policy/Terms of Use).
- Close on: click outside / Escape (standard dialog pattern — implement with a basic controlled modal, no need for cmdk fuzzy-search library since scope is just the visual).

## Scroll progress indicator
Thin vertical pink bar, fixed to the right edge of the viewport, height/position tracks scroll progress (0% at top → grows or moves down as user scrolls to 100% at bottom). Simple: `height = (scrollY / (scrollHeight - innerHeight)) * trackHeight`.

## About section — orbital clock illustration
Large custom SVG watch/dial illustration (`svg.clock-face`, ~360px, IDs seen: `lumeGlow`, `handGlow`, `metalBezel`, `innerBezel`, `dialFace`) sits in its own full-width grid row (`.about-row2.orbital-clock-cell`) and **intentionally overflows** above/below that row via `overflow: visible` on ancestors (not a scroll-pin, just deliberate oversized decorative illustration bleeding into neighboring rows). It displays a small live readout: city name (geolocation/timezone-derived, e.g. "BRUSSELS"), day-of-month ("19"), weekday abbreviation ("WED"), and "MOON" (moon-phase label) — this is a **visitor-local-time widget**, not the site owner's static city. Treat as: on mount, use `Intl.DateTimeFormat().resolvedOptions().timeZone` (or a reverse-geocode by city if you want to go further) + `new Date()` to populate city/day/weekday text; moon phase can be a simple static/computed label. This is a nice-to-have — a simplified static SVG watch face with placeholder readout is an acceptable fallback if the live logic is too costly for the budget.

## About section — animated count-up stats
Stats row (Projects / Years of Experience / Published Platforms / Technical Skills) renders "0" initially and counts up to the target (20+, 3+, 5+, 15+) once scrolled into view.
- **Trigger:** IntersectionObserver on the stats row, fires once.
- Implementation: simple `requestAnimationFrame` counter from 0 → target over ~1-1.5s, ease-out, append "+" suffix.

## Projects — horizontal scroll-driven carousel (INTERACTION MODEL: scroll-driven, NOT click tabs)
Do not build this as click-through tabs. Confirmed by scrolling: the section pins (`position` effectively fixed within a tall spacer, ~2700px of extra scroll height) while an inner flex track (`.work-flex`-equivalent) translates horizontally via `transform: translateX(...)` tied to scroll progress (GSAP ScrollTrigger `pin:true, scrub:true` pattern). Track contains 6 boxes @ ~350px each + gaps: 5 ProjectCards (Huda, Manara, Navix, Healog, Sire) + 1 "View All Projects" end card. Each ProjectCard shows: index "01".."05", category pill (top-right date + top-center category label e.g. "MOBILE APP"), small app-icon logo, title, description, **3 layered/overlapping phone-mockup screenshots** (not one flat image — see spec), tag pills (tech stack), a rotating circular "OPEN TO EXPLORE" badge (continuously spinning text-on-circle, time-driven CSS animation) in the bottom-left corner overlapping the image, and a small external-link-arrow button top-right that appears (or is always present, low-opacity) — links to `/en/projects/<slug>` (inert in this clone; keep as visual only or link to `#`).
Implementation approach: build with GSAP ScrollTrigger (already idiomatic for this effect) OR approximate with a `position: sticky` container + scroll-linked `useTransform`-style JS (framer-motion `useScroll`/`useTransform` is a clean React fit) mapping vertical scroll progress within the pinned range to horizontal `translateX`.

## Achievements — stagger fade-in
2-column grid, 5 cards (last one alone on its row, centered-ish). Each: icon badge (colored, per-card accent color), title, org · date (accent-colored org name), description. **State A:** opacity 0, translateY ~20px. **State B:** opacity 1, translateY 0. IntersectionObserver-triggered, staggered ~100ms per card.

## GitHub section
Left: `react-activity-calendar`-style contribution graph (pink color scale, "Less…More" legend, month labels, "@abdulwahed-s · Contribution activity on GitHub", "<N> contributions in the last year"). Right: 3 stat cards (Followers / Repositories / GitHub Stars), each renders "0" then updates — **this is a live client-side fetch** against GitHub's public REST API (`api.github.com/users/abdulwahed-s`, `.../events` or similar for the contribution graph) at runtime. For the clone: hardcode the visually-observed values (3470 contributions, 3 Followers, 17 Repositories, 5 GitHub Stars) as static content — do not wire a live third-party API call (out of scope / avoids rate-limit dependency for visitors of the clone).

## Misc / "The Wall" teaser
Static scattered sticker collage on a very light dotted-grid background (`background-image: radial-gradient(circle, #ccc 1px, transparent 1px)`-style, small tile size ~24px). ~13 PNG stickers (anime/pop-culture characters + a small Japanese quote card) placed with fixed/randomish absolute offsets and slight rotations + drop-shadow, no evident interaction beyond a CTA link below ("wanna leave your mark? / pin something on the visitor wall" → `/en/wall`, out of scope, keep as inert link).

## Contact CTA
Same char-reveal gradient treatment as hero name applied to "FROM IDEA TO IMPACT" (with "IMPACT" in the lighter gradient tail). "Get in Touch" button links to `/en/contact` (out of scope, keep as inert link or mailto fallback). Availability line + description line below.

## Responsive (breakpoints observed via Tailwind classes: default / `md:` / `lg:`)
- **Desktop ≥1440:** as described above; nav/logo/cmdk trio visible (`hidden md:flex`/`md:block`), About grid 3-col (`lg:col-span-4` × 3), Achievements 2-col.
- **Mobile 390:** logo/floating-nav/cmdk-button are replaced entirely by a single centered "☰ Tap to Explore" pill that opens the same CommandPalette as a bottom sheet. About cards stack to 1 column. Experience timeline collapses to single-column (icon+content stacked, no alternating left/right). Skills/Achievements grids reduce column count. Projects horizontal-scroll carousel likely still works via touch-scroll (same pin mechanism) — verify during QA; if GSAP pin proves unreliable on mobile touch, a simple horizontal `overflow-x:auto` snap-scroll is an acceptable equivalent.
- Breakpoint switches align with Tailwind defaults: `md` = 768px, `lg` = 1024px.
