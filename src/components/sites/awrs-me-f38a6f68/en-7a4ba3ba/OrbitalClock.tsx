"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative dark "wristwatch face" illustration for the About section.
 * Sits in its own full-width row and overlaps the rows above/below it via
 * negative vertical margins.
 *
 * Structure matches the live site's SVG closely: a 360x360 layered metal
 * bezel, a 60-tick chapter ring with 12 glowing dots + 8 diamond markers at
 * the non-cardinal major positions, a weekday+day-of-month readout box on
 * the right, the city name below
 * center, and hour/minute/second hands driven by the visitor's local time.
 *
 * The hands sweep continuously rather than stepping once per second: angles are
 * computed with millisecond precision and written straight to the elements'
 * transform inside a rAF loop. They deliberately stay out of React state — at
 * 60fps that would re-render the whole dial every frame, and nothing else on
 * the page depends on the angles. Only the date readout, which changes once a
 * minute at most, lives in state.
 */

/**
 * Dial furniture is luminous paint on a near-black dial, so it has to read
 * light. The original clone painted the markers and hands in #1a1a1a — dark
 * ink on a dark face, which made the time unreadable.
 */
const LUME = "#e9ede7";
const LUME_DIM = "rgba(233,237,231,0.30)";
const HAND = "#eceff1";
/** The seconds hand picks up the site accent, the way a watch has one colour. */
const SECOND_HAND = "var(--awrs-primary)";

const CENTER = 180;
const TICKS = Array.from({ length: 60 });
const DOT_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const DIAMOND_ANGLES = DOT_ANGLES.filter((angle) => angle % 90 !== 0);

interface ClockReadout {
  day: number;
  weekday: string;
  city: string;
}

function Tick({ index }: { index: number }) {
  const isMajor = index % 5 === 0;
  return (
    <line
      transform={`rotate(${index * 6} ${CENTER} ${CENTER})`}
      x1={CENTER}
      y1={isMajor ? 30 : 23}
      x2={CENTER}
      y2={15}
      stroke={isMajor ? LUME : LUME_DIM}
      strokeWidth={isMajor ? 2.4 : 0.7}
      strokeLinecap="round"
    />
  );
}

function LumeDot({ angle }: { angle: number }) {
  return (
    <circle
      className="awrs-lume-dot"
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
      cx={CENTER}
      cy={CENTER - 162}
      r={3.2}
      fill={LUME}
      filter="url(#awrs-clock-lume-glow)"
    />
  );
}

function DiamondMarker({ angle }: { angle: number }) {
  const cy = CENTER - 144;
  return (
    <polygon
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
      points={`${CENTER},${cy - 6} ${CENTER + 5},${cy} ${CENTER},${cy + 6} ${CENTER - 5},${cy}`}
      fill={LUME}
      filter="url(#awrs-clock-lume-glow)"
    />
  );
}

function Hand({
  angle,
  length,
  baseWidth,
  ref,
}: {
  /** Where the hand is drawn before the sweep takes over on mount. */
  angle: number;
  length: number;
  baseWidth: number;
  ref: React.Ref<SVGPolygonElement>;
}) {
  const tipY = CENTER - length;
  const baseY = CENTER - 6;
  const tailY = CENTER + 12;
  return (
    <polygon
      ref={ref}
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
      points={`${CENTER},${tipY} ${CENTER + baseWidth},${baseY} ${CENTER},${tailY} ${CENTER - baseWidth},${baseY}`}
      fill={HAND}
      stroke="rgba(0,0,0,0.45)"
      strokeWidth={0.5}
      filter="url(#awrs-clock-hand-glow)"
    />
  );
}

export function OrbitalClock() {
  const [readout, setReadout] = useState<ClockReadout | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hourRef = useRef<SVGPolygonElement>(null);
  const minuteRef = useRef<SVGPolygonElement>(null);
  const secondRef = useRef<SVGGElement>(null);

  // The date readout. Date/Intl output is inherently client-only (server and
  // client clocks and locales differ), so it is filled in after mount to avoid
  // an SSR mismatch. A minute is plenty: none of these change faster.
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const rawCity = timeZone.split("/").pop() ?? timeZone;
    const city = rawCity.replace(/_/g, " ").toUpperCase();

    const refresh = () => {
      const now = new Date();
      setReadout({
        day: now.getDate(),
        weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" })
          .format(now)
          .toUpperCase(),
        city,
      });
    };

    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // The sweeping hands.
  useEffect(() => {
    const rotate = (el: SVGElement | null, angle: number) =>
      el?.setAttribute("transform", `rotate(${angle.toFixed(3)} ${CENTER} ${CENTER})`);

    const apply = () => {
      const now = new Date();
      // Fractional units all the way down, so every hand glides instead of
      // stepping — including the hour hand creeping between the markers.
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      rotate(hourRef.current, hours * 30);
      rotate(minuteRef.current, minutes * 6);
      rotate(secondRef.current, seconds * 6);
    };

    // A continuously gliding hand is exactly the kind of perpetual motion
    // prefers-reduced-motion asks us to drop, but a frozen clock would be
    // wrong rather than calm — so it steps once a second instead.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let interval = 0;

    const start = () => {
      if (frame || interval) return;
      if (reduced) {
        interval = window.setInterval(apply, 1000);
        return;
      }
      const loop = () => {
        apply();
        frame = window.requestAnimationFrame(loop);
      };
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (interval) window.clearInterval(interval);
      frame = 0;
      interval = 0;
    };

    // Show the right time immediately, then only keep animating while the dial
    // is actually on screen.
    apply();

    const svg = svgRef.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Catch up after being paused before resuming the loop.
          apply();
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(svg);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const mounted = readout !== null;
  const day = readout?.day ?? 0;
  const weekday = readout?.weekday ?? "";
  const city = readout?.city ?? "";

  return (
    <div className="relative w-[220px] h-[220px] shrink-0 md:w-[340px] md:h-[340px]">
      <div className="relative h-full w-full">
        <div
          className="awrs-clock-halo pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[220px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[400px] md:w-[360px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,.06) 0%, rgba(0,0,0,.03) 35%, rgba(0,0,0,.01) 55%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <svg
          ref={svgRef}
          viewBox="0 0 360 360"
          className="h-full w-full"
          role="img"
          aria-label="Decorative watch face"
        >
          <defs>
            <filter id="awrs-clock-lume-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="awrs-clock-hand-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="awrs-clock-metal-bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="18%" stopColor="#555555" />
              <stop offset="38%" stopColor="#888888" />
              <stop offset="50%" stopColor="#aaaaaa" />
              <stop offset="62%" stopColor="#888888" />
              <stop offset="82%" stopColor="#505050" />
              <stop offset="100%" stopColor="#333333" />
            </linearGradient>
            <linearGradient id="awrs-clock-inner-bezel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#444444" />
              <stop offset="50%" stopColor="#262626" />
              <stop offset="100%" stopColor="#444444" />
            </linearGradient>
            <radialGradient id="awrs-clock-dial-face" cx="50%" cy="42%" r="55%">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="75%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
          </defs>

          {/* bezel stack */}
          <circle cx={CENTER} cy={CENTER} r="180" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
          <circle cx={CENTER} cy={CENTER} r="178" fill="none" stroke="url(#awrs-clock-metal-bezel)" strokeWidth="5" />
          <circle cx={CENTER} cy={CENTER} r="172" fill="none" stroke="url(#awrs-clock-inner-bezel)" strokeWidth="3.5" />
          <circle cx={CENTER} cy={CENTER} r="169" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
          <circle cx={CENTER} cy={CENTER} r="168" fill="url(#awrs-clock-dial-face)" />

          {/* faint decorative chapter rings */}
          <circle cx={CENTER} cy={CENTER} r="152.72" fill="none" stroke="#d8d8d8" strokeWidth="0.3" opacity="0.22" />
          <circle cx={CENTER} cy={CENTER} r="129.48" fill="none" stroke="#d8d8d8" strokeWidth="0.3" opacity="0.22" />
          <circle cx={CENTER} cy={CENTER} r="99.6" fill="none" stroke="#d8d8d8" strokeWidth="0.3" opacity="0.22" />
          <circle cx={CENTER} cy={CENTER} r="69.72" fill="none" stroke="#d8d8d8" strokeWidth="0.3" opacity="0.22" />
          <circle cx={CENTER} cy={CENTER} r="150" fill="none" stroke="#c8c8c8" strokeWidth="0.5" opacity="0.5" />

          {/* 60-tick chapter ring */}
          {TICKS.map((_, i) => (
            <Tick key={i} index={i} />
          ))}

          {/* 12 o'clock double-tick accent */}
          <g filter="url(#awrs-clock-lume-glow)">
            <line x1="172.2" y1="31.2" x2="173" y2="46.18" stroke={LUME} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="187.8" y1="31.2" x2="187" y2="46.18" stroke={LUME} strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* dots at all 12 major positions, diamonds at the 8 non-cardinal ones */}
          {DOT_ANGLES.map((angle) => (
            <LumeDot key={angle} angle={angle} />
          ))}
          {DIAMOND_ANGLES.map((angle) => (
            <DiamondMarker key={angle} angle={angle} />
          ))}

          {/* city name, below center */}
          <text
            x={CENTER}
            y="233.12"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7"
            fontWeight="500"
            fill="rgba(233,237,231,0.5)"
            letterSpacing="2"
          >
            {mounted ? city : ""}
          </text>

          {/* weekday + day-of-month readout, right side */}
          <text
            x="239.76"
            y="160.08"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="5.5"
            fill="rgba(233,237,231,0.45)"
            letterSpacing="1.2"
          >
            {mounted ? weekday : ""}
          </text>
          <rect x="221.5" y="167.55" width="36.52" height="24.9" rx="3.5" fill="#ffffff" stroke="#c8c8c8" strokeWidth="0.7" />
          <text
            x="239.76"
            y="180"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="700"
            fill="#1a1a1a"
            filter="url(#awrs-clock-lume-glow)"
          >
            {mounted ? day : ""}
          </text>

          {/* hour / minute hands */}
          {/* The angles here are only the pose the dial is drawn in for the
              server render; the sweep overwrites them on mount. */}
          <Hand ref={hourRef} angle={315} length={82} baseWidth={4.6} />
          <Hand ref={minuteRef} angle={30} length={120} baseWidth={3.4} />

          {/* second hand */}
          <g ref={secondRef} transform={`rotate(247 ${CENTER} ${CENTER})`}>
            <line x1={CENTER} y1={CENTER + 36.52} x2={CENTER} y2={CENTER - 141.1} stroke={SECOND_HAND} strokeWidth="1.3" strokeLinecap="round" />
            <circle cx={CENTER} cy={CENTER + 36.52} r="3.5" fill={SECOND_HAND} />
          </g>

          {/* center pivot */}
          <circle cx={CENTER} cy={CENTER} r="8.5" fill="#b0b0b0" />
          <circle cx={CENTER} cy={CENTER} r="6" fill="#1a1a1a" filter="url(#awrs-clock-lume-glow)" />
          <circle cx={CENTER} cy={CENTER} r="2.2" fill="#f5f5f5" />
        </svg>
      </div>
    </div>
  );
}
