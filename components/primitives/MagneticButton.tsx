"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/cn";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  radius?: number;
  variant?: "primary" | "ghost";
}

export function MagneticButton({
  children,
  strength = 0.35,
  radius = 80,
  variant = "primary",
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>({ strength, radius });

  const base =
    "inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-mono uppercase tracking-[0.18em] text-[var(--fs-200)] transition-colors duration-300 will-change-transform";
  const variants = {
    primary:
      "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hot)]",
    ghost:
      "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]",
  } as const;

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
