import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  variant?: "display" | "serif" | "plain";
  children: ReactNode;
  className?: string;
  id?: string;
}

const sizeByLevel: Record<number, string> = {
  1: "text-[length:var(--fs-800)]",
  2: "text-[length:var(--fs-700)]",
  3: "text-[length:var(--fs-600)]",
  4: "text-[length:var(--fs-500)]",
};

export function Heading({
  level = 2,
  variant = "display",
  children,
  className,
  id,
}: HeadingProps) {
  const Tag = (`h${level}`) as "h1" | "h2" | "h3" | "h4";
  const variantClass =
    variant === "display"
      ? "text-display"
      : variant === "serif"
      ? "text-serif-italic"
      : "";
  return (
    <Tag id={id} className={cn(sizeByLevel[level], variantClass, className)}>
      {children}
    </Tag>
  );
}
