import Image from "next/image";

/**
 * The two things flanking the watch face inside the About panel: spoken
 * languages on one side, a portrait on the other. Levels are the ones stated on
 * the owner's CV — nothing is inferred.
 *
 * Both are rendered once and reordered with flex `order`, so the panel reads
 * languages / dial / portrait on desktop and dial / portrait / languages when
 * it stacks, without duplicating either in the DOM.
 */

const PORTRAIT = "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/lander.jpg";

interface Language {
  name: string;
  level: string;
  /** Share of the bar that is filled, 0-1. */
  fill: number;
}

const LANGUAGES: Language[] = [
  { name: "Dutch", level: "Native", fill: 1 },
  { name: "English", level: "Advanced", fill: 0.7 },
  { name: "French", level: "Elementary", fill: 0.35 },
];

export function Languages({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--awrs-text-tertiary)]">
        Languages
      </p>

      <ul className="flex flex-col gap-4">
        {LANGUAGES.map((language) => (
          <li key={language.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">{language.name}</span>
              <span className="text-[11px] uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
                {language.level}
              </span>
            </div>
            {/* A proportional bar reads as a level at a glance, where the old
                three dashes just looked like stray punctuation. */}
            <div
              className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[var(--awrs-border)]"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-[var(--awrs-primary)]"
                style={{ width: `${language.fill * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The portrait, round like the dial it sits beside. Fixed dimensions and a
 * matching intrinsic size keep it from shifting the layout as it loads.
 */
export function Portrait({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto h-24 w-24 lg:h-28 lg:w-28">
        <Image
          src={PORTRAIT}
          alt="Lander Cuypers"
          width={320}
          height={320}
          className="h-full w-full rounded-full object-cover ring-1 ring-[var(--awrs-border)]"
        />
        {/* The same soft halo the dial carries, so the two read as a pair. */}
        <div
          className="awrs-clock-halo pointer-events-none absolute inset-[-22%] -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--awrs-primary-glow) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
