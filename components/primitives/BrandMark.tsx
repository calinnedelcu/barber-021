import { cn } from "@/lib/cn";
import { Monogram } from "./Monogram";

interface BrandMarkProps {
  size?: number;
  className?: string;
  tone?: "ink" | "accent";
  /** When set, render these letters as the mark instead of the geometric 021 glyph. */
  initials?: string;
}

/**
 * Client-aware brand mark. Falls back to the geometric BARBER 021 monogram when
 * no initials are supplied; otherwise draws the initials in the display face so
 * each client gets its own lockup (e.g. "HM" for HAIRMANN).
 */
export function BrandMark({ size = 24, className, tone = "ink", initials }: BrandMarkProps) {
  if (!initials) {
    return <Monogram size={size} className={className} tone={tone} />;
  }

  const color = tone === "accent" ? "var(--accent)" : "var(--ink)";
  const letters = initials.trim().toUpperCase();
  // Keep the same vertical footprint as the 021 monogram (96 × 110) so swapping
  // marks never shifts surrounding layout.
  const vbW = 110;
  const vbH = 110;

  return (
    <svg
      width={(size * vbW) / 96}
      height={(size * vbH) / 96}
      viewBox={`0 0 ${vbW} ${vbH}`}
      fill="none"
      aria-hidden
      className={cn("inline-block", className)}
    >
      <text
        x={vbW / 2}
        y="74"
        textAnchor="middle"
        fontFamily="var(--font-display), Impact, sans-serif"
        fontSize="74"
        letterSpacing="-3"
        fill={color}
      >
        {letters}
      </text>
      <line
        x1="14"
        y1="96"
        x2={vbW - 14}
        y2="96"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
