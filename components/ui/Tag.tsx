import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "accent";
}

export function Tag({ children, className, tone = "muted" }: TagProps) {
  return (
    <span
      className={cn(
        "text-mono inline-flex items-center text-[length:var(--fs-100)] uppercase tracking-[0.22em]",
        tone === "accent" ? "text-[var(--accent)]" : "text-[var(--ink-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
