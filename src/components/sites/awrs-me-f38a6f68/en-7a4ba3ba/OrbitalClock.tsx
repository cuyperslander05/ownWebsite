"use client";

import { useEffect, useState } from "react";

const TICKS = Array.from({ length: 60 });

/**
 * Decorative dark "wristwatch face" illustration for the About section.
 * Sits in its own full-width row and overlaps the rows above/below it via
 * negative vertical margins. Purely decorative — an approximation of the
 * source site's clock graphic, not a pixel-perfect asset recreation.
 */
interface ClockReadout {
  day: number;
  weekday: string;
  city: string;
}

export function OrbitalClock() {
  const [readout, setReadout] = useState<ClockReadout | null>(null);

  useEffect(() => {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" })
      .format(now)
      .toUpperCase();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const rawCity = timeZone.split("/").pop() ?? timeZone;
    const city = rawCity.replace(/_/g, " ").toUpperCase();

    // Date/Intl output is inherently client-only (server/client clocks and
    // locales can differ); computing it after mount avoids an SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadout({ day: now.getDate(), weekday, city });
  }, []);

  const mounted = readout !== null;
  const day = readout?.day ?? 0;
  const weekday = readout?.weekday ?? "";
  const city = readout?.city ?? "";

  return (
    <div className="relative -my-8 md:-my-16 flex justify-center">
      <div className="relative w-[220px] h-[220px] md:w-[340px] md:h-[340px]">
        {/* live readout */}
        <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center gap-2 whitespace-nowrap text-[9px] font-medium tracking-widest text-[var(--awrs-text-tertiary)] md:gap-3 md:text-xs">
          <span className="min-w-[2ch]">{mounted ? weekday : ""}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--awrs-text-tertiary)]" />
          <span>{mounted ? city : ""}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--awrs-text-tertiary)]" />
          <span>MOON</span>
        </div>

        <svg
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-[0_0_40px_rgba(212,84,126,0.15)]"
          role="img"
          aria-label="Decorative watch face"
        >
          <defs>
            <radialGradient id="awrs-clock-bezel" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#4b4b52" />
              <stop offset="45%" stopColor="#232327" />
              <stop offset="100%" stopColor="#050506" />
            </radialGradient>
            <clipPath id="awrs-clock-moon-clip">
              <circle cx="62" cy="58" r="17" />
            </clipPath>
          </defs>

          {/* outer bezel */}
          <circle cx="100" cy="100" r="98" fill="url(#awrs-clock-bezel)" />
          <circle
            cx="100"
            cy="100"
            r="96.5"
            fill="none"
            stroke="#6b6b73"
            strokeWidth="1"
            opacity="0.55"
          />

          {/* inner face */}
          <circle
            cx="100"
            cy="100"
            r="84"
            fill="#0b0b0d"
            stroke="#2a2a2f"
            strokeWidth="1"
          />

          {/* tick marks */}
          <g stroke="#e4e4e7">
            {TICKS.map((_, i) => {
              const isMajor = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="16"
                  x2="100"
                  y2={isMajor ? "30" : "22"}
                  strokeWidth={isMajor ? 1.6 : 0.75}
                  opacity={isMajor ? 0.85 : 0.35}
                  transform={`rotate(${i * 6} 100 100)`}
                />
              );
            })}
          </g>

          {/* moon-phase indicator */}
          <circle
            cx="62"
            cy="58"
            r="18.5"
            fill="none"
            stroke="#3a3a3f"
            strokeWidth="1"
          />
          <circle cx="62" cy="58" r="17" fill="#d4d4d8" />
          <circle
            cx="75"
            cy="58"
            r="17"
            fill="#0b0b0d"
            clipPath="url(#awrs-clock-moon-clip)"
          />

          {/* watch hand, pointing toward ~5 o'clock */}
          <line
            x1="100"
            y1="100"
            x2="128"
            y2="148"
            stroke="#d1d5db"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* day-of-month readout tag */}
          <rect
            x="84"
            y="121"
            width="32"
            height="17"
            rx="4"
            fill="#111114"
            stroke="#3a3a3f"
            strokeWidth="1"
          />
          <text
            x="100"
            y="133"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#f4f4f5"
          >
            {mounted ? day : ""}
          </text>

          {/* center pivot */}
          <circle
            cx="100"
            cy="100"
            r="3.5"
            fill="#e4e4e7"
            stroke="#0b0b0d"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
