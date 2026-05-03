"use client";

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

interface CommonProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  variant?: Variant;
  className?: string;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };
type AsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

export type MagneticButtonProps = AsButton | AsAnchor;

const base =
  "group relative inline-flex items-center justify-center gap-3 px-7 py-4 text-mono uppercase tracking-[0.18em] text-[length:var(--fs-200)] transition-colors duration-300 will-change-transform select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hot)]",
  ghost: "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]",
};

export function MagneticButton(props: MagneticButtonProps) {
  const { children, strength = 0.35, radius = 80, variant = "primary", className } = props;

  if (props.as === "a") {
    const { as: _as, href, strength: _s, radius: _r, variant: _v, className: _c, children: _ch, ...rest } = props;
    void _as; void _s; void _r; void _v; void _c; void _ch;
    return (
      <AnchorMagnet
        href={href}
        strength={strength}
        radius={radius}
        className={cn(base, variants[variant], className)}
        {...rest}
      >
        {children}
      </AnchorMagnet>
    );
  }

  const { as: _as, strength: _s, radius: _r, variant: _v, className: _c, children: _ch, type = "button", ...rest } = props;
  void _as; void _s; void _r; void _v; void _c; void _ch;

  return (
    <ButtonMagnet
      type={type}
      strength={strength}
      radius={radius}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </ButtonMagnet>
  );
}

function ButtonMagnet({
  strength,
  radius,
  children,
  ...rest
}: {
  strength: number;
  radius: number;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>({ strength, radius });
  return (
    <button ref={ref} {...rest}>
      {children}
    </button>
  );
}

function AnchorMagnet({
  strength,
  radius,
  children,
  ...rest
}: {
  strength: number;
  radius: number;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength, radius });
  return (
    <a ref={ref} {...rest}>
      {children}
    </a>
  );
}
