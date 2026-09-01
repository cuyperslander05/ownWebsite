/**
 * Spoken languages, shown as small instrument-style readouts flanking the watch
 * face. Levels are the ones stated on the owner's CV — nothing is inferred.
 *
 * They are split two-left / one-right rather than listed in one block: the dial
 * sits between them, and the date window on the dial's right side already
 * carries weight there, so the lighter column goes opposite it.
 */

interface Language {
  name: string;
  level: string;
  /** 1-3, drives the filled dots. Elementary, advanced, native. */
  strength: number;
}

const LEFT: Language[] = [
  { name: "Dutch", level: "Native", strength: 3 },
  { name: "English", level: "Advanced", strength: 2 },
];

const RIGHT: Language[] = [{ name: "French", level: "Elementary", strength: 1 }];

export const ALL_LANGUAGES = [...LEFT, ...RIGHT];

function LevelDots({ strength, align }: { strength: number; align: "start" | "end" }) {
  return (
    <span
      className={`mt-1.5 flex gap-1 ${align === "end" ? "justify-end" : "justify-start"}`}
      aria-hidden="true"
    >
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`h-1 w-3 rounded-full ${
            step <= strength ? "bg-[var(--awrs-primary)]" : "bg-[var(--awrs-border)]"
          }`}
        />
      ))}
    </span>
  );
}

function Entry({ language, align }: { language: Language; align: "start" | "end" }) {
  return (
    <li className={align === "end" ? "text-right" : "text-left"}>
      <p className="text-sm font-semibold tracking-wide">{language.name}</p>
      <p className="text-xs text-[var(--awrs-text-tertiary)]">{language.level}</p>
      <LevelDots strength={language.strength} align={align} />
    </li>
  );
}

/** The flanking columns. Hidden below md, where there is no room beside the dial. */
export function LanguageColumn({ side }: { side: "left" | "right" }) {
  const align = side === "left" ? "end" : "start";

  return (
    <div className="hidden w-40 shrink-0 md:block lg:w-48">
      {side === "left" && (
        <p className="mb-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
          Languages
        </p>
      )}
      {/* Keeps the single right-hand entry level with the left column's first
          one instead of floating at the top. */}
      {side === "right" && <div className="mb-4 h-4" aria-hidden="true" />}

      <ul className="flex flex-col gap-6">
        {(side === "left" ? LEFT : RIGHT).map((language) => (
          <Entry key={language.name} language={language} align={align} />
        ))}
      </ul>
    </div>
  );
}

/** Same content, laid out in a row under the dial on small screens. */
export function LanguageRow() {
  return (
    <div className="md:hidden">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)]">
        Languages
      </p>
      <ul className="flex justify-center gap-8">
        {ALL_LANGUAGES.map((language) => (
          <li key={language.name} className="text-center">
            <p className="text-sm font-semibold tracking-wide">{language.name}</p>
            <p className="text-xs text-[var(--awrs-text-tertiary)]">{language.level}</p>
            <span className="mt-1.5 flex justify-center gap-1" aria-hidden="true">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-1 w-3 rounded-full ${
                    step <= language.strength
                      ? "bg-[var(--awrs-primary)]"
                      : "bg-[var(--awrs-border)]"
                  }`}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
