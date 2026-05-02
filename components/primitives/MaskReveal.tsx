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
      style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: initialY }}
        animate={inView ? { y: 0 } : { y: initialY }}
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
