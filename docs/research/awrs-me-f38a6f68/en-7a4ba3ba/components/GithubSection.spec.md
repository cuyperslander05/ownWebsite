# GithubSection Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/GithubSection.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/12-github-calendar.jpg`
- **Interaction model:** static (the source site live-fetches real GitHub data client-side — this clone uses hardcoded static data instead, see Behavior note).

## DOM Structure
```
<section id="github" class="py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6">
    <h2>Code & Contributions</h2> <!-- pink underline bar, section heading style matches other sections -->
    <div class="grid md:grid-cols-[1fr_260px] gap-6 mt-10 items-start">
      <div class="rounded-2xl border border-[var(--awrs-border)] p-6 md:p-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[var(--awrs-primary)]/10 flex items-center justify-center">
            <GithubIcon className="w-5 h-5" style={{color: "var(--awrs-primary)"}} />
          </div>
          <div>
            <p class="font-semibold">@abdulwahed-s</p>
            <p class="text-sm text-[var(--awrs-text-secondary)]">Contribution activity on GitHub</p>
          </div>
        </div>
        <div class="mt-6 overflow-x-auto">
          <!-- <ActivityCalendar /> from react-activity-calendar goes here -->
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <!-- 3 stat cards: Followers, Repositories, GitHub Stars -->
      </div>
    </div>
  </div>
</section>
```

### Stat card (repeat ×3)
```
<div class="rounded-2xl border border-[var(--awrs-border)] p-6 flex flex-col gap-2">
  <IconComponent style="color: <accent>" size={20} />
  <p class="text-3xl font-black">6</p>
  <p class="text-sm text-[var(--awrs-text-secondary)]">Followers</p>
</div>
```
Data: `[{label:"Followers", value:6, icon:"Users", color:"#d4547e"}, {label:"Repositories", value:32, icon:"FileText", color:"#10b981"}, {label:"GitHub Stars", value:9, icon:"Star", color:"#f59e0b"}]` (icons from `lucide-react`).

## The calendar itself: use the `react-activity-calendar` package (already installed)
```tsx
import ActivityCalendar from "react-activity-calendar";
```
Generate a full year of pseudo-realistic daily activity data client-side (this is fine — the exact historical values aren't real content that can be scraped; a plausible-looking contribution graph is the expected fidelity level here, matching the "mock data for demo" scope default):
```ts
function generateContributionData(): { date: string; count: number; level: number }[] {
  const days = 371; // just over a year, matches the calendar's default week alignment
  const today = new Date();
  const data = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const count = Math.random() < 0.15 ? 0 : Math.floor(Math.random() * 12) + 1;
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    data.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return data;
}
```
Wrap this generation in `useMemo(() => generateContributionData(), [])` inside a client component (`"use client"`) so it's stable across re-renders (and to avoid an SSR/client date mismatch — guard with a `mounted` state the same way as `OrbitalClock.tsx`, rendering a simple skeleton/placeholder block until mounted).

Configure the calendar to match the site's pink palette:
```tsx
<ActivityCalendar
  data={contributionData}
  theme={{
    light: ["#f3e8ec", "#f0b8c8", "#e07a9c", "#d4547e", "#a83d62"],
  }}
  colorScheme="light"
  blockSize={12}
  blockMargin={4}
  fontSize={12}
  hideTotalCount
  labels={{
    totalCount: "{{count}} contributions in the last year",
  }}
/>
```
Below/near the calendar, render the total count line yourself to match the source's exact placement: `<p class="mt-3 text-sm text-[var(--awrs-text-secondary)]">3,470 contributions in the last year</p>` (static number — this one specific figure IS real content observed on the live site, safe to hardcode verbatim) with a small `Less [swatches] More` legend to the right if `react-activity-calendar`'s built-in legend doesn't already render one matching the source's exact "Less ... More" label pattern (it does by default via its labels; if the built-in legend looks visually equivalent, don't duplicate it).

## Assets
- `GithubIcon` from `../shared/brand-icons`.
- Icons: `Users, FileText, Star` from `lucide-react`.

## Text Content
"Code & Contributions", "@abdulwahed-s", "Contribution activity on GitHub", "3,470 contributions in the last year", "Followers", "Repositories", "GitHub Stars", stat values 6 / 32 / 9.

## Responsive Behavior
- **Desktop (≥768px):** two-column layout, calendar left (flexible width), stats stacked right in a fixed ~260px column.
- **Mobile (<768px):** single column, calendar card first (horizontally scrollable if needed via `overflow-x-auto`), then the 3 stat cards below (can be a `grid-cols-3` row instead of stacked, to save vertical space — reasonable adaptation).
- **Breakpoint:** `md` = 768px.
