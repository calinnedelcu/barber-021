"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down";
  once?: boolean;
  className?: string;
}

export function MaskReveal({
  children,
  delay = 0,
  duration = 0.9,
  direction = "up",
  once = true,
  className,
}: MaskRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  const initialY = direction === "up" ? "100%" : "-100%";

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        // clip-path lets us mask vertically (so the inner span can slide up
        // from below) while leaving horizontal headroom for italic slants
        // and the blur halo so trailing letters don't get clipped.
        clipPath: "inset(-0.15em -0.4em 0 -0.4em)",
        verticalAlign: "bottom",
        lineHeight: 1.15,
        paddingBottom: "0.05em",
      }}
    >
      <motion.span
        style={{ display: "inline-block", lineHeight: 1.15 }}
        initial={{ y: initialY, filter: "blur(3px)" }}
        animate={
          inView
            ? { y: 0, filter: "blur(0px)" }
            : { y: initialY, filter: "blur(3px)" }
        }
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
