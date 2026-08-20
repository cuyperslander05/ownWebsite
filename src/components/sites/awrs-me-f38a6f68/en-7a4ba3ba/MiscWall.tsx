const BASE = "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/misc/";

interface Sticker {
  src: string;
  top: string;
  left: string;
  rotate: number;
  width: number;
}

const stickers: Sticker[] = [
  { src: BASE + "maki.png", top: "2%", left: "8%", rotate: -8, width: 70 },
  { src: BASE + "aizen.png", top: "5%", left: "22%", rotate: -4, width: 130 },
  { src: BASE + "flutter.png", top: "8%", left: "46%", rotate: 3, width: 90 },
  { src: BASE + "gwen.png", top: "8%", left: "60%", rotate: -6, width: 150 },
  { src: BASE + "tung.png", top: "5%", left: "82%", rotate: 5, width: 90 },
  { src: BASE + "itachi.png", top: "38%", left: "6%", rotate: -3, width: 150 },
  { src: BASE + "mikasa.png", top: "42%", left: "44%", rotate: 4, width: 100 },
  { src: BASE + "sawako.png", top: "58%", left: "62%", rotate: -5, width: 130 },
  { src: BASE + "mikey.png", top: "36%", left: "77%", rotate: 2, width: 80 },
  { src: BASE + "yuta.png", top: "78%", left: "20%", rotate: -6, width: 110 },
  { src: BASE + "android.png", top: "76%", left: "45%", rotate: 4, width: 90 },
  { src: BASE + "kora.png", top: "80%", left: "65%", rotate: -3, width: 100 },
  { src: BASE + "hutao.png", top: "80%", left: "85%", rotate: 6, width: 90 },
];

export function MiscWall() {
  return (
    <section id="misc" className="py-20 md:py-28 awrs-dot-grid">
      {/* Desktop: absolutely-positioned scattered collage */}
      <div className="max-w-6xl mx-auto px-6 relative h-[420px] md:h-[520px] hidden md:block">
        {stickers.map((sticker) => (
          <img
            key={sticker.src}
            src={sticker.src}
            style={{
              position: "absolute",
              top: sticker.top,
              left: sticker.left,
              width: sticker.width,
              transform: `rotate(${sticker.rotate}deg)`,
            }}
            className="drop-shadow-lg select-none pointer-events-none"
            alt=""
          />
        ))}
        <div
          className="absolute rounded-xl bg-white shadow-lg px-4 py-3 text-sm"
          style={{ top: "40%", left: "24%", maxWidth: 220 }}
        >
          痛みを知らぬ者に、本当の平和は分からん
        </div>
      </div>

      {/* Mobile: simple flex-wrap layout, no absolute positioning/rotation */}
      <div className="max-w-6xl mx-auto px-6 md:hidden flex flex-wrap justify-center gap-4">
        {stickers.map((sticker) => (
          <img
            key={sticker.src}
            src={sticker.src}
            style={{ width: sticker.width }}
            className="drop-shadow-lg select-none"
            alt=""
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="#" className="inline-flex flex-col items-center gap-1 text-sm">
          <span className="font-semibold">wanna leave your mark?</span>
          <span className="text-[var(--awrs-primary)]">pin something on the visitor wall</span>
        </a>
      </div>
    </section>
  );
}
