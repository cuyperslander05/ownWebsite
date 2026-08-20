# CommandPalette Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/CommandPalette.tsx`
- **Screenshot:** none captured in isolation — described in full below from live inspection.
- **Interaction model:** click-driven (controlled modal). Receives `open: boolean` and `onOpenChange: (open: boolean) => void` props from the parent `Nav.tsx`.

## DOM Structure
A controlled dialog with two responsive presentations sharing the same inner content:
- **Desktop (≥768px):** centered modal — dark backdrop (`bg-black/40`) covering the viewport, white `rounded-2xl` panel centered (`max-w-2xl`), fades + scales in.
- **Mobile (<768px):** bottom sheet — same backdrop, panel pinned to the bottom of the screen, full width, `rounded-t-2xl` only (square bottom corners), small horizontal drag-handle bar centered at the top of the sheet, slides up from `translateY(100%)` to `translateY(0)`.

Use a single component with Tailwind responsive classes to switch positioning (`items-center justify-center` vs `items-end`, `rounded-2xl` vs `md:rounded-2xl rounded-b-none`, etc.) rather than two separate implementations. A plain controlled `<div>`-based modal is fine — no headless UI library is required, but you may use `@base-ui/react` (already a dependency) `Dialog` primitives if that's faster/cleaner. Close on: click on backdrop, `Escape` key, or clicking any nav-row item.

### Panel content (top to bottom)
1. Header row: search `<input placeholder="Jump to a project...">` (with a `Search` icon, `lucide-react`, left-aligned inside the input) — non-functional is fine (no real search wiring needed, filtering the PAGES list by text is a nice-to-have but not required), "Reach out" button (pill, `mailto:` link or just visual), globe icon button (`Globe` from lucide-react — inert, locale switcher, no functional /ar route to link to), moon icon button (`Moon` from lucide-react — toggle theme, see Behavior).
2. Divider (`border-t`).
3. **"PAGES"** section label (`text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]`), then a 2-column grid of pill buttons, each with an icon + label:
   - `Home` (`Home` icon) — **active** (this is the current page): pink border + pink text + pale pink background (`border-[var(--awrs-primary)] text-[var(--awrs-primary)] bg-[var(--awrs-primary)]/5`)
   - `Projects` (`Folder` icon)
   - `Blog` (`Book` icon)
   - `The Wall` (`Pencil` or `PenLine` icon)
   - `Contact` (`MessageCircle` icon)
   All inert links (`href="#"` or real internal anchors like `#projects`/`#contact` scrolling to the matching section on THIS page where one exists — `Home` and `Contact` can scroll-to-section; `Projects`/`Blog`/`The Wall` have no route in this clone, keep as visual-only `<button>` or `<a href="#">`).
4. **"CONNECT"** section label, then a row of pill buttons with brand icon + label + small external-link arrow (`ArrowUpRight` from lucide-react, small, top-right of each pill):
   - `GitHub` → `https://github.com/abdulwahed-s` (use `GithubIcon` from `../shared/brand-icons`)
   - `LinkedIn` → `https://linkedin.com/in/abdulwahed-s` (use `LinkedinIcon` from `../shared/brand-icons`)
   - `X (Twitter)` → real profile if known, else `#` (use `XIcon` from `../shared/brand-icons`)
   - `Reddit` → `#` (use `RedditIcon` from `../shared/brand-icons`)
   All `target="_blank" rel="noopener noreferrer"`.
5. **"LEGAL"** section label, then 2 pill buttons: `Privacy Policy` (`Shield` icon), `Terms of Use` (`FileText` icon) — inert links.

## Computed Styles
- Panel: `bg-[var(--awrs-card)] rounded-2xl shadow-xl` (mobile: `rounded-b-none`), `max-w-2xl w-full mx-4` (desktop), full-width on mobile.
- Search input row: `flex items-center gap-3 p-4` container; input `flex-1 h-11 pl-10 pr-4 rounded-xl bg-[var(--awrs-bg-secondary)] text-sm`; "Reach out" button `h-11 px-5 rounded-xl bg-[var(--awrs-bg-secondary)] font-medium text-sm`; globe/moon buttons `w-11 h-11 rounded-xl bg-[var(--awrs-bg-secondary)] flex items-center justify-center`.
- Section label: `px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]`
- Pill buttons (PAGES/CONNECT/LEGAL rows): `flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--awrs-border)] text-sm font-medium hover:bg-[var(--awrs-card-hover)] transition-colors`, laid out in a responsive grid (`grid grid-cols-2 gap-2 px-6` for PAGES; `flex flex-wrap gap-2 px-6` for CONNECT/LEGAL), with `pb-6` on the last group.

## States & Behaviors

### Open/close
- **Trigger:** `open` prop from parent.
- **State A (closed):** not rendered / `opacity-0 pointer-events-none`.
- **State B (open):** backdrop fades in (`transition-opacity duration-200`), panel fades+scales in on desktop (`scale-95→100, opacity-0→100`) or slides up on mobile (`translate-y-full → translate-y-0`).
- **Transition:** ~200-250ms ease-out.
- Lock body scroll while open (`document.body.style.overflow = 'hidden'` in a `useEffect`, restore on close/unmount).

### Dark/light toggle (moon icon)
- Simplified scope: toggle a `dark` class on `document.documentElement` and persist to `localStorage` on click (standard pattern). Full dark-theme token values were not exhaustively reverse-engineered from the source (see BEHAVIORS.md) — wiring the toggle to flip Tailwind's existing `dark:` variant infrastructure (already configured in this project's `globals.css` via `@custom-variant dark`) is sufficient; you do not need to author bespoke dark-mode colors for every section unless time allows. This is a known scope reduction — acceptable.

### Locale toggle (globe icon)
- Inert — no `/ar` route exists in this clone. `onClick` can be a no-op or show nothing; do not build a language switcher.

## Assets
- Icons: `Search, Home, Folder, Book, PenLine, MessageCircle, ArrowUpRight, Shield, FileText, Globe, Moon` from `lucide-react`
- Brand icons: `GithubIcon, LinkedinIcon, XIcon, RedditIcon` from `../shared/brand-icons`

## Text Content (verbatim)
"Jump to a project...", "Reach out", "PAGES", "Home", "Projects", "Blog", "The Wall", "Contact", "CONNECT", "GitHub", "LinkedIn", "X (Twitter)", "Reddit", "LEGAL", "Privacy Policy", "Terms of Use"

## Responsive Behavior
- **Desktop (≥768px):** centered modal, `items-center justify-center`, both PAGES/CONNECT items can sit 2-per-row.
- **Mobile (<390px):** bottom sheet, `items-end`, drag-handle bar visible, PAGES grid still 2 columns (fits fine at 390px).
- **Breakpoint:** 768px.
