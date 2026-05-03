"use client";

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };
type AsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

export type MagneticButtonProps = AsButton | AsAnchor;

const base =
  "group relative inline-flex items-center justify-center gap-3 px-7 py-4 text-mono uppercase tracking-[0.18em] text-[length:var(--fs-200)] transition-colors duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hot)]",
  ghost: "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]",
};

export function MagneticButton(props: MagneticButtonProps) {
  const { children, variant = "primary", className } = props;

  if (props.as === "a") {
    const { as: _as, variant: _v, className: _c, children: _ch, ...rest } = props;
    void _as; void _v; void _c; void _ch;
    return (
      <a className={cn(base, variants[variant], className)} {...rest}>
        {children}
      </a>
    );
  }

  const { as: _as, variant: _v, className: _c, children: _ch, type = "button", ...rest } = props;
  void _as; void _v; void _c; void _ch;

  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
