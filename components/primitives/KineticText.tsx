"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

interface KineticTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  staggerEach?: number;
  splitBy?: "char" | "word";
  children?: ReactNode;
}

export function KineticText({
  text,
  as = "span",
  className,
  delay = 0,
  staggerEach = 0.04,
  splitBy = "char",
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const tokens =
    splitBy === "char"
      ? text.split("")
      : text.split(/(\s+)/);

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={cn(className)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerEach,
            delayChildren: delay,
          },
        },
      }}
      aria-label={text}
    >
      {tokens.map((token, i) => {
        if (token.match(/^\s+$/)) {
          return <span key={i}>{token}</span>;
        }
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: 1.15,
              paddingBottom: "0.05em",
            }}
            aria-hidden="true"
          >
            <motion.span
              style={{ display: "inline-block", lineHeight: 1.15 }}
              variants={{
                hidden: { y: "110%", filter: "blur(4px)" },
                visible: {
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
