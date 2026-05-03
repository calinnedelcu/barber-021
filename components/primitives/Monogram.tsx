import { cn } from "@/lib/cn";

interface MonogramProps {
  size?: number;
  className?: string;
  tone?: "ink" | "accent";
}

/**
 * BARBER 021 monogram — interlocked geometric "021" in thin lines.
 * Clean SVG version (no raster, no transparency artifacts), scales freely.
 */
export function Monogram({ size = 24, className, tone = "ink" }: MonogramProps) {
  const stroke = tone === "accent" ? "var(--accent)" : "var(--ink)";
  return (
    <svg
      width={size}
      height={(size * 110) / 96}
      viewBox="0 0 96 110"
      fill="none"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("inline-block", className)}
    >
      {/* 0 — rounded pill */}
      <rect x="4" y="6" width="48" height="98" rx="24" />
      <line x1="28" y1="20" x2="28" y2="90" />
      {/* 2 — curved top loop */}
      <path d="M 52 30 Q 52 10 70 10 Q 88 10 88 28 Q 88 42 70 56 L 60 70 L 88 70" />
      {/* 1 — descending tail with foot */}
      <line x1="84" y1="70" x2="84" y2="100" />
      <line x1="76" y1="100" x2="92" y2="100" />
    </svg>
  );
}
