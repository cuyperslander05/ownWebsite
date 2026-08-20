# MiscWall Specification

## Overview
- **Target file:** `src/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/MiscWall.tsx`
- **Screenshot:** `docs/design-references/awrs-me-f38a6f68/en-7a4ba3ba/13-misc-wall.jpg`
- **Interaction model:** static decorative collage, no interaction beyond one CTA link at the bottom.

## DOM Structure
```
<section id="misc" class="py-20 md:py-28 awrs-dot-grid">
  <div class="max-w-6xl mx-auto px-6 relative h-[420px] md:h-[520px]">
    <!-- ~13 absolutely-positioned rotated sticker images scattered across this area -->
    <!-- 1 speech-bubble card with Japanese text among them -->
  </div>
  <div class="mt-10 text-center">
    <a href="#" class="inline-flex flex-col items-center gap-1 text-sm">
      <span class="font-semibold">wanna leave your mark?</span>
      <span class="text-[var(--awrs-primary)]">pin something on the visitor wall</span>
    </a>
  </div>
</section>
```
Background uses the global `.awrs-dot-grid` utility class (already defined in `globals.css`).

## Stickers (all 13, real downloaded assets — scatter them across the container using absolute positioning; exact positions are decorative and approximate, use the screenshot as a loose visual guide, don't spend excessive time pixel-matching each one's exact coordinate)
```ts
const stickers = [
  { src: ".../images/misc/maki.png", top: "2%", left: "8%", rotate: -8, width: 70 },
  { src: ".../images/misc/aizen.png", top: "5%", left: "22%", rotate: -4, width: 130 },
  { src: ".../images/misc/flutter.png", top: "8%", left: "46%", rotate: 3, width: 90 },
  { src: ".../images/misc/gwen.png", top: "8%", left: "60%", rotate: -6, width: 150 },
  { src: ".../images/misc/tung.png", top: "5%", left: "82%", rotate: 5, width: 90 },
  { src: ".../images/misc/itachi.png", top: "38%", left: "6%", rotate: -3, width: 150 },
  { src: ".../images/misc/mikasa.png", top: "42%", left: "44%", rotate: 4, width: 100 },
  { src: ".../images/misc/sawako.png", top: "58%", left: "62%", rotate: -5, width: 130 },
  { src: ".../images/misc/mikey.png", top: "36%", left: "77%", rotate: 2, width: 80 },
  { src: ".../images/misc/yuta.png", top: "78%", left: "20%", rotate: -6, width: 110 },
  { src: ".../images/misc/android.png", top: "76%", left: "45%", rotate: 4, width: 90 },
  { src: ".../images/misc/kora.png", top: "80%", left: "65%", rotate: -3, width: 100 },
  { src: ".../images/misc/hutao.png", top: "80%", left: "85%", rotate: 6, width: 90 },
];
```
Replace `".../images/"` prefix with the real base path `/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/misc/`. Each renders as:
```tsx
<img
  src={sticker.src}
  style={{ position: "absolute", top: sticker.top, left: sticker.left, width: sticker.width, transform: `rotate(${sticker.rotate}deg)` }}
  className="drop-shadow-lg select-none pointer-events-none"
  alt=""
/>
```
The Japanese-text speech-bubble card is NOT an image — it's a small white rounded card with a drop-shadow containing the text "痛みを知らぬ者に、本当の平和は分からん" (a well-known anime quote, positioned near the Itachi sticker in the source). Render it as:
```tsx
<div className="absolute rounded-xl bg-white shadow-lg px-4 py-3 text-sm" style={{ top: "40%", left: "24%", maxWidth: 220 }}>
  痛みを知らぬ者に、本当の平和は分からん
</div>
```
Position it near the Itachi sticker to match the screenshot's grouping.

## Text Content (verbatim)
- Japanese quote: "痛みを知らぬ者に、本当の平和は分からん"
- "wanna leave your mark?"
- "pin something on the visitor wall"

## Responsive Behavior
- **Desktop (1440px):** full scattered layout as described, container ~520px tall.
- **Mobile (390px):** the absolute-scatter layout doesn't translate well to narrow viewports. Simplify to a `flex flex-wrap justify-center gap-4` layout of the same sticker images (dropping the absolute positioning/rotation on `<md:` breakpoints, or reducing rotation/scale) so nothing overflows or overlaps awkwardly. Use `hidden md:block` on the absolute-positioned desktop version and a separate simple `md:hidden` flex-wrap grid for mobile if that's cleaner than trying to make one layout responsive.
- **Breakpoint:** `md` = 768px.
