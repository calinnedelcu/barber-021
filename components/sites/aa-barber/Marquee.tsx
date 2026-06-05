"use client";

import { cn } from "@/lib/cn";
import styles from "./aa.module.css";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  fast?: boolean;
  className?: string;
  /** Character between tokens. */
  sep?: string;
}

/**
 * Infinite horizontal marquee. Duplicates the token list so the -50% keyframe
 * loops seamlessly. Pauses on hover (handled in CSS).
 */
export function Marquee({
  items,
  reverse = false,
  fast = false,
  className,
  sep = "✦",
}: MarqueeProps) {
  const run = [...items, ...items];

  return (
    <div className={cn(styles.marquee, "overflow-hidden", className)}>
      <div
        className={cn(
          styles.marqueeTrack,
          reverse && styles.reverse,
          fast && styles.fast
        )}
      >
        {run.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span>{item}</span>
            <span
              aria-hidden
              className={cn(styles.neon, "mx-[1.2em] text-[0.7em] opacity-70")}
            >
              {sep}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
