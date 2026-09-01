import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionEmpty } from "./SectionEmpty";

const BASE = "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/misc/";

interface Sticker {
  file: string;
  /** Alt text: what the sticker actually shows. */
  alt: string;
  top: string;
  left: string;
  rotate: number;
  width: number;
}

/**
 * Empty until there are images to pin. Drop files into
 * `public/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/misc/` and add:
 *
 * ```ts
 * { file: "photo.png", alt: "What it shows", top: "8%", left: "22%", rotate: -4, width: 130 }
 * ```
 *
 * `top`/`left`/`rotate` only affect the desktop collage; mobile lays them out
 * in a simple wrap.
 */
const stickers: Sticker[] = [];

export function MiscWall() {
  return (
    <section id="misc" className="py-20 md:py-28 awrs-dot-grid">
      {/* The collage is the design; the heading is for structure and is only
          exposed to screen readers and search engines. */}
      <h2 className="sr-only">The Wall</h2>

      {stickers.length === 0 && (
        <Reveal className="max-w-3xl mx-auto px-6">
          <SectionEmpty>Nothing pinned to the wall yet.</SectionEmpty>
        </Reveal>
      )}

      {/* Desktop: absolutely-positioned scattered collage */}
      <div
        className="max-w-6xl mx-auto px-6 relative h-[420px] md:h-[520px] hidden md:block"
        hidden={stickers.length === 0}
      >
        {stickers.map((sticker) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={sticker.file}
            src={BASE + sticker.file}
            style={{
              position: "absolute",
              top: sticker.top,
              left: sticker.left,
              width: sticker.width,
              transform: `rotate(${sticker.rotate}deg)`,
            }}
            className="drop-shadow-lg select-none pointer-events-none"
            alt={sticker.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {/* Mobile: simple flex-wrap layout, no absolute positioning/rotation */}
      <div
        className="max-w-6xl mx-auto px-6 md:hidden flex flex-wrap justify-center gap-4"
        hidden={stickers.length === 0}
      >
        {stickers.map((sticker) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={sticker.file}
            src={BASE + sticker.file}
            style={{ width: sticker.width }}
            className="drop-shadow-lg select-none"
            alt={sticker.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <Reveal className="mt-10 text-center" delay={80}>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "Pin something on the wall"
          )}`}
          className="inline-flex flex-col items-center gap-1 text-sm"
        >
          <span className="font-semibold">wanna leave your mark?</span>
          <span className="text-[var(--awrs-primary)]">pin something on the visitor wall</span>
        </a>
      </Reveal>
    </section>
  );
}
