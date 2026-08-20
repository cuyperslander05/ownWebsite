# Page Topology — awrs.me/en

Source: https://awrs.me/en ("Abdulwahed Aldaghir | Software Engineer & Full-Stack Mobile Developer")
Stack: Next.js (App Router, RSC — no `__NEXT_DATA__`), Tailwind CSS utility classes throughout (className strings are literal Tailwind), GSAP + ScrollTrigger, Lenis smooth scroll (`html.lenis`), `react-activity-calendar` for the GitHub graph, `next/font` self-hosted fonts (Inter for body/UI, a serif display face for a few accent words — see BEHAVIORS.md).

Total scroll height ≈ 11,925px at 1440 width.

## Global / persistent overlays (outside normal flow)
1. **Logo** — fixed `<a>` top-5 left-[18%], 32×32, links home. Desktop only (`hidden md:flex`).
2. **FloatingNav** — fixed `<nav>` top-4, centered (`inset-x-0 mx-auto w-fit`), z-40, pill shape, `bg-[var(--color-navbar)]` (`#ffffffd9`) + backdrop-blur. Collapsed = "Good Evening"-style greeting pill; hover-expands to full nav links pill (Home/Projects/Blog/The Wall/Contact) with a sliding active-pill background behind "Home". Desktop only.
3. **Cmd-K trigger button** — fixed top-5 right-[18%], 40×40 rounded-xl, opens the CommandPalette modal. Desktop only.
4. **Mobile nav** — single "☰ Tap to Explore" pill, centered, opens the SAME CommandPalette content as a bottom sheet (rounded top corners, drag handle) instead of a centered modal.
5. **CommandPalette** — search input "Jump to a project...", "Reach out" button, language-globe toggle, dark/light moon toggle, then grouped sections: PAGES (Home/Projects/Blog/The Wall/Contact), CONNECT (GitHub/LinkedIn/X/Reddit), LEGAL (Privacy Policy/Terms of Use).
6. **Scroll progress indicator** — thin vertical bar, fixed right edge (~x=1560 at 1440 viewport), pink, grows/moves with scroll position.

## Sections (top → bottom, in `<main class="flex-1 pt-20">`)

| # | Section | id | Interaction model |
|---|---------|----|--------------------|
| 1 | Hero | (none) | time-driven greeting text + entrance animation (char-by-char blur/gradient reveal) + infinite marquee ribbons |
| 2 | About | `about` | scroll-entrance fade/blur-in per card; big orbital-clock SVG illustration overflows its grid cell (static layout, not scroll-pinned); animated count-up stats |
| 3 | Experience | `experience` | scroll-entrance fade-in; static vertical timeline, alternating left/right |
| 4 | Skills | `skills` | scroll-entrance stagger fade-in; static icon grid |
| 5 | Projects | `projects` (div, not section) | **scroll-driven horizontal carousel** — GSAP ScrollTrigger pins the section and translateX-scrubs `.work`-style track through 6 cards (5 projects + "View All Projects" end card) as user scrolls ~2700px of pinned vertical scroll |
| 6 | Achievements | `achievements` | scroll-entrance stagger fade-in; static 2-col grid (5 cards, last one spans/centers) |
| 7 | GitHub | `github` | static layout; calendar + stats numbers count up from 0 after a live client-side fetch (GitHub public API) |
| 8 | Misc ("The Wall" teaser) | `misc` | static; scattered rotated sticker images on dotted-grid bg, CTA link to `/en/wall` |
| 9 | Contact CTA | (unnamed section) | same char-by-char gradient-reveal treatment on "FROM IDEA TO IMPACT" |
| — | Footer | `<footer>` | static; logo, quote, 3 link columns, social icons, copyright |

## Layout notes
- Content max-width container appears to be a constrained centered column (~1200px) with consistent horizontal padding; sections use `py-20 md:py-28` vertical rhythm.
- z-layers: CommandPalette backdrop > CommandPalette modal > FloatingNav/Logo/CmdK button (z-40/z-50) > scroll progress bar > normal content.
- No dark-mode class observed active by default (`data-theme` absent); a dark/light toggle exists in the CommandPalette (not fully reverse-engineered — treat as a nice-to-have, document as a known gap if not implemented).
- Language toggle (globe icon) implies an `/ar` locale variant — out of scope; keep the control visually present but inert.

## Routes referenced by nav/links (out of scope, not built)
`/en/projects`, `/en/projects/<slug>` (5 project detail pages), `/en/blog`, `/en/wall`, `/en/contact`, `/en/privacy`, `/en/terms`. These stay as plain non-functional visual affordances in the clone (or omitted hrefs) since only `/en` (mapped to `/`) is in scope.
