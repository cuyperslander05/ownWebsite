"use client";

import { useEffect, useState } from "react";

/**
 * Decorative dark "wristwatch face" illustration for the About section.
 * Sits in its own full-width row and overlaps the rows above/below it via
 * negative vertical margins.
 *
 * Structure matches the live site's SVG closely: a 360x360 layered metal
 * bezel, a 60-tick chapter ring with 12 glowing dots + 8 diamond markers at
 * the non-cardinal major positions, a moon-phase disc on the left, a
 * weekday+day-of-month readout box on the right, the city name below
 * center, and hour/minute/second hands driven by the visitor's local time.
 * The readout ticks once per second, aligned to the wall-clock second so the
 * second hand lands on the ticks of the chapter ring.
 */

const CENTER = 180;
const TICKS = Array.from({ length: 60 });
const DOT_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const DIAMOND_ANGLES = DOT_ANGLES.filter((angle) => angle % 90 !== 0);

interface ClockReadout {
  day: number;
  weekday: string;
  city: string;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
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
      stroke={isMajor ? "rgba(26,26,26,0.55)" : "#bbbbbb"}
      strokeWidth={isMajor ? 2.2 : 0.6}
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
      fill="#1a1a1a"
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
      fill="#1a1a1a"
      filter="url(#awrs-clock-lume-glow)"
    />
  );
}

function Hand({ angle, length, baseWidth }: { angle: number; length: number; baseWidth: number }) {
  const tipY = CENTER - length;
  const baseY = CENTER - 6;
  const tailY = CENTER + 12;
  return (
    <polygon
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
      points={`${CENTER},${tipY} ${CENTER + baseWidth},${baseY} ${CENTER},${tailY} ${CENTER - baseWidth},${baseY}`}
      fill="rgba(20,20,20,0.9)"
      stroke="rgba(20,20,20,0.1)"
      strokeWidth={0.6}
      filter="url(#awrs-clock-hand-glow)"
    />
  );
}

export function OrbitalClock() {
  const [readout, setReadout] = useState<ClockReadout | null>(null);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const rawCity = timeZone.split("/").pop() ?? timeZone;
    const city = rawCity.replace(/_/g, " ").toUpperCase();

    const tick = () => {
      const now = new Date();
      const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" })
        .format(now)
        .toUpperCase();

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Date/Intl output is inherently client-only (server/client clocks and
      // locales can differ); computing it after mount avoids an SSR mismatch.
      setReadout({
        day: now.getDate(),
        weekday,
        city,
        hourAngle: (hours % 12) * 30 + minutes * 0.5,
        minuteAngle: minutes * 6 + seconds * 0.1,
        secondAngle: seconds * 6,
      });
    };

    tick();

    // Line the interval up with the next whole second so the hand steps on the
    // beat instead of drifting a few hundred milliseconds off it.
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 1000);
    }, 1000 - new Date().getMilliseconds());

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const mounted = readout !== null;
  const day = readout?.day ?? 0;
  const weekday = readout?.weekday ?? "";
  const city = readout?.city ?? "";
  const hourAngle = readout?.hourAngle ?? 315;
  const minuteAngle = readout?.minuteAngle ?? 30;
  const secondAngle = readout?.secondAngle ?? 247;

  return (
    <div className="relative -my-8 md:-my-16 flex justify-center">
      <div className="relative w-[220px] h-[220px] md:w-[340px] md:h-[340px]">
        <div
          className="awrs-clock-halo pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[220px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[400px] md:w-[360px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,.06) 0%, rgba(0,0,0,.03) 35%, rgba(0,0,0,.01) 55%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <svg viewBox="0 0 360 360" className="h-full w-full" role="img" aria-label="Decorative watch face">
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
            <clipPath id="awrs-clock-moon-clip">
              <circle cx="120.24" cy="180" r="27.88" />
            </clipPath>
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
            <line x1="172.2" y1="31.2" x2="173" y2="46.18" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="187.8" y1="31.2" x2="187" y2="46.18" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
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
            fill="rgba(26,26,26,0.45)"
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
            fill="rgba(26,26,26,0.35)"
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

          {/* moon-phase disc, left side */}
          <circle cx="120.24" cy="180" r="31.38" fill="none" stroke="#c8c8c8" strokeWidth="0.3" opacity="0.3" />
          <circle cx="120.24" cy="180" r="29.88" fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.7" />
          <text
            x="120.24"
            y="145.12"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="4.5"
            fill="rgba(26,26,26,0.35)"
            letterSpacing="1.2"
          >
            MOON
          </text>
          <g clipPath="url(#awrs-clock-moon-clip)">
            <circle cx="120.24" cy="180" r="27.88" fill="rgba(26,26,26,0.06)" />
            <path
              d="M 120.24 152.12 A 27.88 27.88 0 0 1 120.24 207.88 A 5.48 27.88 0 0 1 120.24 152.12 Z"
              fill="rgba(26,26,26,0.5)"
            />
          </g>

          {/* hour / minute hands */}
          <Hand angle={hourAngle} length={80} baseWidth={2.4} />
          <Hand angle={minuteAngle} length={116} baseWidth={1.8} />

          {/* second hand */}
          <g transform={`rotate(${secondAngle} ${CENTER} ${CENTER})`}>
            <line x1={CENTER} y1={CENTER + 36.52} x2={CENTER} y2={CENTER - 141.1} stroke="#333333" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx={CENTER} cy={CENTER + 36.52} r="3.5" fill="#333333" />
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
