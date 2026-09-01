"use client";

import { useEffect, useRef } from "react";

/**
 * The dotted world globe in the "Flexible with Timezones" card, directly above
 * the watch face. It turns slowly on its axis, one revolution per minute.
 *
 * Dots sit on an actual sphere — evenly spaced rings of latitude, each ring's
 * dot count scaled by cos(lat) so the spacing stays even — and are projected
 * orthographically every frame. Dots on the far side are dropped and the rest
 * fade and shrink towards the limb, which is what makes the rotation read as a
 * sphere rather than a scrolling texture. Land dots are darker and slightly
 * larger; whether a dot is land is decided once, at build time, by
 * point-in-polygon against the coarse outlines below.
 *
 * Drawn on a canvas rather than as SVG nodes: re-projecting ~7k dots per
 * frame is nothing for fillRect, but would be thousands of DOM mutations.
 */

const RAD = Math.PI / 180;
/** Axial tilt in degrees — tips the north pole towards the viewer. */
const TILT = 12;
/** Seconds per revolution. */
const PERIOD = 60;
/** Degrees between latitude rings. */
const LAT_STEP = 2.6;
/** Dots on the equatorial ring; other rings scale by cos(lat). */
const EQUATOR_DOTS = 168;
/** Redraw cap — the motion is slow, 30fps is indistinguishable from 60. */
const FRAME_MS = 1000 / 30;

/** Coarse continent outlines as [lon, lat] rings. Unioned, so they may overlap. */
const LAND_SHAPES: [number, number][][] = [
  // Africa
  [
    [-17, 15], [-17, 21], [-13, 28], [-9, 32], [-6, 36], [10, 37], [20, 33],
    [25, 32], [32, 31], [34, 28], [38, 18], [43, 12], [51, 12], [45, 5],
    [41, -1], [40, -10], [35, -20], [32, -26], [26, -34], [19, -35], [15, -28],
    [12, -18], [9, -2], [9, 4], [3, 6], [-5, 5], [-8, 4], [-13, 9],
  ],
  // Madagascar
  [[43, -12], [50, -15], [48, -25], [44, -22]],
  // Europe
  [
    [-10, 36], [-10, 44], [-2, 44], [0, 50], [3, 52], [8, 55], [10, 59],
    [6, 62], [12, 66], [20, 70], [30, 71], [40, 66], [45, 55], [42, 46],
    [30, 45], [28, 40], [24, 38], [15, 38], [12, 45], [8, 44], [3, 42],
    [-3, 36],
  ],
  // British Isles
  [[-6, 51], [-5, 58], [-1, 58], [1, 53], [-3, 50]],
  // northern Asia
  [
    [40, 50], [45, 66], [60, 70], [75, 73], [100, 77], [115, 74], [135, 73],
    [150, 71], [165, 68], [178, 65], [180, 60], [168, 60], [160, 53],
    [150, 45], [140, 44], [135, 35], [125, 32], [122, 25], [112, 20],
    [105, 12], [98, 10], [95, 20], [88, 22], [80, 25], [70, 26], [60, 28],
    [52, 32], [48, 40], [45, 45],
  ],
  // Arabia
  [[34, 29], [43, 12], [52, 15], [57, 23], [48, 30], [40, 30]],
  // India
  [[68, 24], [72, 20], [73, 15], [77, 8], [80, 10], [82, 17], [88, 22], [80, 25], [70, 26]],
  // Indonesia / Malay archipelago
  [[95, 5], [105, -2], [115, -4], [130, -3], [140, -4], [135, -8], [120, -9], [105, -7], [98, 0]],
  // Japan
  [[130, 32], [140, 36], [145, 44], [142, 45], [136, 36], [132, 31]],
  // North America
  [
    [-168, 65], [-160, 71], [-140, 70], [-125, 70], [-110, 68], [-95, 68],
    [-85, 70], [-75, 68], [-60, 58], [-55, 50], [-65, 45], [-70, 42],
    [-75, 36], [-81, 26], [-84, 30], [-90, 29], [-97, 26], [-105, 20],
    [-110, 23], [-115, 30], [-124, 38], [-125, 48], [-135, 58], [-150, 60],
    [-165, 60],
  ],
  // Central America
  [[-97, 18], [-90, 15], [-83, 9], [-78, 8], [-84, 14], [-92, 18]],
  // Greenland
  [[-45, 60], [-52, 67], [-55, 72], [-45, 80], [-30, 82], [-22, 74], [-25, 68], [-38, 62]],
  // South America
  [
    [-81, 8], [-75, 10], [-60, 10], [-52, 5], [-45, -2], [-38, -6], [-35, -8],
    [-38, -13], [-43, -23], [-48, -28], [-58, -35], [-62, -40], [-65, -46],
    [-70, -53], [-73, -45], [-72, -38], [-71, -25], [-70, -18], [-76, -14],
    [-81, -6], [-80, 0], [-78, 2],
  ],
  // Australia
  [
    [113, -22], [114, -34], [129, -32], [138, -35], [145, -38], [150, -37],
    [153, -28], [145, -15], [135, -12], [128, -15], [122, -18],
  ],
  // New Zealand
  [[172, -41], [175, -37], [178, -38], [174, -43], [167, -46], [170, -43]],
];

function inRing(lon: number, lat: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lon: number, lat: number) {
  // Antarctica is a cap rather than an outline.
  if (lat < -63) return true;
  return LAND_SHAPES.some((ring) => inRing(lon, lat, ring));
}

interface Dot {
  /** Unit-sphere position at zero rotation, tilt already applied. */
  x: number;
  y: number;
  z: number;
  land: boolean;
}

function buildDots(): Dot[] {
  const dots: Dot[] = [];
  const tilt = TILT * RAD;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  for (let lat = -88; lat <= 88; lat += LAT_STEP) {
    const phi = lat * RAD;
    const count = Math.max(6, Math.round(EQUATOR_DOTS * Math.cos(phi)));
    for (let i = 0; i < count; i++) {
      const lon = -180 + (360 / count) * i;
      const lambda = lon * RAD;
      const y0 = Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(lambda);
      dots.push({
        x: Math.cos(phi) * Math.sin(lambda),
        // Tilt is baked in here so the frame loop only has to spin the globe.
        y: y0 * cosT - z0 * sinT,
        z: y0 * sinT + z0 * cosT,
        land: isLand(lon, lat),
      });
    }
  }
  return dots;
}

export function DotGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dots = buildDots();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // A canvas cannot inherit colours, so the two inks are read from CSS
    // tokens that change with the theme (see --awrs-globe-* in globals.css).
    let landInk = "26,26,26";
    let oceanInk = "0,0,0";

    const readInks = () => {
      const styles = getComputedStyle(document.documentElement);
      landInk = styles.getPropertyValue("--awrs-globe-land").trim() || landInk;
      oceanInk = styles.getPropertyValue("--awrs-globe-ocean").trim() || oceanInk;
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let size = 0;
    let radius = 0;

    const resize = () => {
      size = canvas.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr);
      // Leave a hair of margin so limb dots are not clipped by the canvas edge.
      radius = (size / 2 - 2) * dpr;
    };

    const draw = (spin: number) => {
      const c = (size / 2) * dpr;
      const cosS = Math.cos(spin);
      const sinS = Math.sin(spin);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        // Spin about the (tilted) polar axis: rotate x/z, y is unchanged.
        const z = dot.z * cosS - dot.x * sinS;
        if (z <= 0) continue;
        const x = dot.x * cosS + dot.z * sinS;

        // Depth drives fade and size, so the sphere reads as curved.
        const depth = 0.25 + 0.75 * z;
        const s = (dot.land ? 1.8 : 1.3) * dpr * depth;
        ctx.fillStyle = dot.land
          ? `rgba(${landInk},${0.6 * depth})`
          : `rgba(${oceanInk},${0.17 * depth})`;
        ctx.fillRect(c + x * radius - s / 2, c - dot.y * radius - s / 2, s, s);
      }
    };

    const spinAt = (now: number) =>
      reduced ? 0 : (((now - start) / 1000 / PERIOD) % 1) * Math.PI * 2;

    let frame = 0;
    let last = 0;

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(spinAt(now));
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only animate while the globe is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced) {
          if (!frame) frame = window.requestAnimationFrame(loop);
        } else {
          stop();
        }
      },
      { rootMargin: "100px" }
    );

    const onResize = () => {
      resize();
      draw(spinAt(performance.now()));
    };

    // Redraw immediately when the theme is toggled: while the globe is paused
    // off screen, or under reduced motion, no frame would otherwise repaint it.
    const themeObserver = new MutationObserver(() => {
      readInks();
      draw(spinAt(performance.now()));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    readInks();
    resize();
    draw(spinAt(performance.now()));
    observer.observe(canvas);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
