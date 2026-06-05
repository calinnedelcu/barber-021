"use client";

import { cn } from "@/lib/cn";
import styles from "./andrei.module.css";

/**
 * "Cut geometry" — an angular line-art motif abstracting a geometric haircut:
 * a profile/head implied by intersecting lines, angles and a tick-arc, plus the
 * scissor pivot dot. Pure SVG, no photos. Inherits currentColor for strokes.
 */
export function CutGeometry({
  className,
  animate = true,
  accent = "var(--accent)",
}: {
  className?: string;
  animate?: boolean;
  accent?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 480"
      fill="none"
      className={cn(animate ? styles.draw : styles.drawStatic, className)}
      aria-hidden="true"
      role="presentation"
    >
      {/* outer construction frame */}
      <rect
        x="20"
        y="20"
        width="360"
        height="440"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
        style={{ ["--len" as string]: 1600 }}
      />
      {/* implied skull/profile arc */}
      <path
        d="M120 360 C 80 300 80 200 140 150 C 200 100 300 120 320 200 C 335 260 300 320 250 350"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ ["--len" as string]: 900, animationDelay: "0.15s" }}
      />
      {/* angular "cut" lines — the geometry of the haircut */}
      <polyline
        points="60,150 200,80 360,170"
        stroke={accent}
        strokeWidth="1.5"
        style={{ ["--len" as string]: 500, animationDelay: "0.35s" }}
      />
      <line
        x1="200"
        y1="80"
        x2="200"
        y2="430"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        style={{ ["--len" as string]: 360, animationDelay: "0.5s" }}
      />
      <line
        x1="60"
        y1="430"
        x2="340"
        y2="300"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        style={{ ["--len" as string]: 320, animationDelay: "0.6s" }}
      />
      <line
        x1="340"
        y1="430"
        x2="60"
        y2="300"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        style={{ ["--len" as string]: 320, animationDelay: "0.7s" }}
      />
      {/* protractor tick-arc — the "measured angle" idea */}
      <path
        d="M140 430 A 60 60 0 0 1 260 430"
        stroke={accent}
        strokeWidth="1.5"
        style={{ ["--len" as string]: 200, animationDelay: "0.8s" }}
      />
      {/* scissor pivot dots */}
      <circle cx="200" cy="430" r="4" fill={accent} stroke="none" />
      <circle
        cx="200"
        cy="80"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ ["--len" as string]: 40, animationDelay: "1s" }}
      />
    </svg>
  );
}
