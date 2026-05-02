"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollPinProps {
  children: ReactNode;
  className?: string;
  /** total scroll distance in viewport heights to spend pinned */
  distance?: number;
  /** horizontal wrapper width — children should set their own widths */
  horizontal?: boolean;
}

/**
 * Lightweight pin without GSAP — uses sticky positioning.
 * For complex pinned timelines (Manifesto horizontal scroll), Section 4.2
 * upgrades to GSAP ScrollTrigger.pin in its own component.
 */
export function ScrollPin({
  children,
  className,
  distance = 2,
  horizontal = false,
}: ScrollPinProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || !horizontal || reduced) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const maxX = inner.scrollWidth - window.innerWidth;
        inner.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [horizontal, reduced]);

  if (!horizontal) {
    return (
      <div className={className} style={{ height: `${distance * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden" ref={wrapperRef}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} style={{ height: `${distance * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={innerRef} className="flex h-full will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}
