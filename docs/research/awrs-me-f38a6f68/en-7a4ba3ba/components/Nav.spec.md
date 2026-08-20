# Nav Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Nav.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/01-hero.jpg` (shows the collapsed state top bar)
- **Interaction model:** hover-driven (desktop nav expand/collapse) + click-driven (opens CommandPalette, which is a SEPARATE component `CommandPalette.tsx` already being built — import it as `<CommandPalette open={open} onOpenChange={setOpen} />` from `./CommandPalette`, don't rebuild its contents here)

## DOM Structure
Three independent `fixed` elements at the top of the viewport, desktop only (`hidden md:flex` / `md:block`), PLUS one mobile-only trigger:

1. **Logo link** — `<a href="/">` fixed `top-5 left-[18%]` (use `left-6` or similar fixed offset is fine — the source uses a percentage offset from center, but a simple `left-6 md:left-8` fixed pixel offset reads the same visually at typical viewport widths; use judgement), 32×32px. Renders the real logo asset via `<Image src="/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/logo.svg" width={32} height={32} alt="Abdulwahed Aldaghir" />` — or better, import and use the already-built `LogoMark` component from `../shared/icons` (`import { LogoMark } from "../shared/icons"`).
2. **FloatingNav** — `<nav>` fixed `top-4`, horizontally centered (`inset-x-0 mx-auto w-fit`), `z-40`, `rounded-full`, `bg-[var(--awrs-navbar)]` + `backdrop-blur-md`, subtle border. Contains:
   - Two decorative absolutely-positioned glow bars at `-top-[1px]` using the global `.awrs-nav-glow-beam` / `.awrs-nav-glow-core` classes (already defined in `globals.css`) — width should match roughly the active nav item's width and be centered under it (fine to just center them under the whole pill for simplicity).
   - **Collapsed content** (`div`, `flex items-center gap-2.5 h-12 px-8 cursor-pointer select-none`): time-of-day greeting emoji + text — see Behavior below.
   - **Expanded content** (`div`, `flex items-center h-12 px-1.5`, hidden until hover): nav links row — `Home` (active), `Projects`, `Blog`, `The Wall`, `Contact`. Active link gets a pill background (`bg-[var(--awrs-text)]/[0.08]`) sliding behind it; each link is `px-5 py-1.5 rounded-full text-sm font-medium`. `Home` text color `var(--awrs-primary)`, others `var(--awrs-text-secondary)`.
3. **Cmd-K trigger button** — fixed `top-5 right-[18%]` (same note as logo re: exact offset — a fixed `right-6 md:right-8` is fine), 40×40, `rounded-xl`, `bg-[var(--awrs-card)]` border, centers a `Command` icon from `lucide-react` (size 18). `onClick` → opens CommandPalette.
4. **Mobile trigger** — `md:hidden`, single centered pill fixed `top-4 inset-x-0 mx-auto w-fit`, contains a `Menu` icon (lucide-react) + text "Tap to Explore". `onClick` → opens CommandPalette (same modal, which renders as a bottom sheet at `<md` widths — that responsive swap lives inside `CommandPalette.tsx`, not here).

## Computed Styles (exact values)
### FloatingNav (collapsed)
- position: fixed; top: 16px; z-index: 40; border-radius: 9999px (full)
- background: `#ffffffd9` (i.e. `var(--awrs-navbar)`)
- backdrop-filter: blur(12px) (approximate — use `backdrop-blur-md`)
- Collapsed width ≈ 185px, height: 48px (h-12)
- border: 1px solid `var(--awrs-border)`, subtle box-shadow (`shadow-sm`)

### Collapsed greeting content
- padding: `h-12 px-8`, `flex items-center gap-2.5`
- emoji `text-base`; label `text-sm font-medium text-[var(--awrs-text)]`

### Expanded nav links
- container: `h-12 px-1.5`, inner links row `flex items-center gap-1 px-1`
- each link: `px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors`
- active ("Home"): `text-[var(--awrs-primary)]`, sits above a sliding pill `bg-[var(--awrs-text)]/[0.08]`
- inactive: `text-[var(--awrs-text-secondary)] hover:text-[var(--awrs-text)]`

### Logo
- 32×32px, `text-[var(--awrs-text)]` (the SVG uses currentColor... actually it's a raster/vector asset via `<Image>`, no currentColor tinting needed, it's solid black — leave as-is)

### Cmd-K button
- 40×40px, `rounded-xl`, `bg-[var(--awrs-card)]` border `var(--awrs-border)`, icon `text-[var(--awrs-text)]` size 18-20px, centered

## States & Behaviors

### Time-of-day greeting (collapsed nav pill)
- **Trigger:** compute once on client mount via `new Date().getHours()`.
- Ranges: 5-11 → "Good Morning" ☀️ (or 🌅), 12-16 → "Good Afternoon" ☀️, 17-20 → "Good Evening" 🌆, 21-4 → "Good Night" 🌙 (site showed 🌙 for evening in our capture — use 🌙 for both Evening and Night to match; exact emoji choice is not critical, keep it simple: 🌙 for evening/night, ☀️ for morning/afternoon).
- Implementation: `useState` + `useEffect` (client component, `"use client"`), compute once, no re-render loop needed.

### Nav hover-expand (desktop only)
- **Trigger:** `onMouseEnter` on the `<nav>` element (React state `isExpanded`), `onMouseLeave` collapses again (small delay of ~150-300ms feels right, optional).
- **State A (collapsed):** greeting div visible (`opacity-100`), links div hidden/collapsed (`opacity-0 w-0 overflow-hidden` or `display:none`).
- **State B (expanded):** greeting div hidden, links div visible, nav pill grows from ~185px to ~456px wide.
- **Transition:** animate `width` on the `<nav>` (e.g. `transition-[width] duration-300 ease-out` with explicit `style={{width: isExpanded ? 'auto'/'456px' : '185px'}}`, or simplest: use CSS `grid-template-columns` trick, or just crossfade both children absolutely-positioned inside a fixed-height flex and let the nav's width be driven by whichever child is currently rendered with a `transition-all duration-300` on the nav's own width via a measured ref — a simpler acceptable approximation: keep both children always in the DOM, toggle visibility with `AnimatePresence`/conditional render, and let the flex `<nav>` auto-size with `transition-[width]`. Don't over-engineer; a clean CSS-only fade+width transition reads as equivalent.
- **Implementation approach:** plain React state + CSS transition (Tailwind `transition-all duration-300`). No GSAP needed.

### Mobile trigger
- No hover state; simple `active:scale-95` tap feedback is a nice touch (optional).

## Assets
- Logo: `LogoMark` component from `../shared/icons` (already built, wraps the real `/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/logo.svg`)
- Icons: `Command`, `Menu` from `lucide-react`

## Text Content (verbatim)
Nav links: `Home`, `Projects`, `Blog`, `The Wall`, `Contact`
Mobile trigger label: `Tap to Explore`
Greeting: time-computed, see Behavior above (verbatim strings: "Good Morning", "Good Afternoon", "Good Evening", "Good Night")

## Responsive Behavior
- **Desktop (≥768px / `md:`):** Logo + FloatingNav + Cmd-K button all visible as 3 separate fixed elements; mobile trigger hidden.
- **Mobile (<768px):** Logo, FloatingNav, Cmd-K button all hidden (`hidden md:flex`/`md:block`); only the single centered "Tap to Explore" pill shows.
- **Breakpoint:** 768px (Tailwind `md`).

## Props / Composition note
This component should own an `open` boolean state for the command palette and render:
```tsx
<CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
```
Both the Cmd-K button and the mobile trigger set `paletteOpen(true)`.
