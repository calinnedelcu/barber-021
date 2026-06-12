"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up on first scroll into view. Deliberately the ONLY motion on the
 * Start demo (besides hover transitions) — anything fancier belongs to the
 * upper tiers. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(16px)",
        transition: `opacity 0.6s var(--ease-expo-out) ${delay}ms, transform 0.6s var(--ease-expo-out) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
