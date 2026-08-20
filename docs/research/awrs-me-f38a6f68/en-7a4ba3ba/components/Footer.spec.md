# Footer Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/Footer.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/15-footer.jpg`
- **Interaction model:** static.

## DOM Structure
```
<footer class="border-t border-[var(--awrs-border)] py-14">
  <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
    <div>
      <LogoMark size={28} />
      <p class="mt-4 text-sm text-[var(--awrs-text-secondary)] max-w-xs leading-relaxed">
        { Work, for Allah will observe your deeds, and so will His Messenger and the believers. }
      </p>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">Links</p>
      <ul class="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
        <li><a href="/">Home</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">The Wall</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">Legal</p>
      <ul class="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Use</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">Social</p>
      <div class="flex gap-3">
        <a href="https://github.com/abdulwahed-s" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"><GithubIcon size={16} /></a>
        <a href="https://linkedin.com/in/abdulwahed-s" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors"><LinkedinIcon size={16} /></a>
        <a href="mailto:abdulwahedaldaghir0@gmail.com" class="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"><Mail size={16} /></a>
      </div>
    </div>
  </div>
  <div class="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-[var(--awrs-border)] text-center text-sm text-[var(--awrs-text-tertiary)]">
    © 2026 Abdulwahed Aldaghir. All rights reserved.
  </div>
</footer>
```

## Assets
- `LogoMark` from `../shared/icons`
- `GithubIcon, LinkedinIcon` from `../shared/brand-icons`
- `Mail` icon from `lucide-react`

## Text Content (verbatim)
"{ Work, for Allah will observe your deeds, and so will His Messenger and the believers. }"
LINKS: Home, Projects, Blog, The Wall
LEGAL: Privacy Policy, Terms of Use
SOCIAL: GitHub, LinkedIn, Email
"© 2026 Abdulwahed Aldaghir. All rights reserved."

## Responsive Behavior
- **Desktop (1440px):** 4-column grid as above.
- **Mobile (390px):** single column, stacked, each group full width with normal top margin between groups (`grid-cols-1 gap-8`).
- **Breakpoint:** `md` = 768px.
