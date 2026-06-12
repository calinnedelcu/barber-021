"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Cursor de precizie: un punct roșu rapid + un inel care îl urmărește cu
// inerție. Pe elementele interactive inelul crește; pe [data-cursor] afișează
// o etichetă. Doar pe pointer fin (desktop) și fără reduced-motion — pe
// touch nu există și nu costă nimic.
export function BriciCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    let killed = false;
    const cleanup: (() => void)[] = [];

    document.documentElement.classList.add("brici-no-cursor");
    cleanup.push(() => document.documentElement.classList.remove("brici-no-cursor"));

    (async () => {
      const { gsap } = await import("gsap");
      if (killed || !dot.current || !ring.current) return;

      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
      const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
      const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const t = (e.target as HTMLElement).closest("a, button, [data-cursor]");
        const text = t instanceof HTMLElement ? t.dataset.cursor ?? "" : "";
        if (label.current) label.current.textContent = text;
        gsap.to(ring.current, {
          scale: t ? (text ? 3 : 1.7) : 1,
          backgroundColor: text ? "rgb(255 69 51 / 0.95)" : "rgb(255 69 51 / 0)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.25 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      cleanup.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      });
    })();

    return () => {
      killed = true;
      cleanup.forEach((f) => f());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        .brici-no-cursor, .brici-no-cursor a, .brici-no-cursor button, .brici-no-cursor [data-cursor] { cursor: none !important; }
      `}</style>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[390] h-2 w-2 rounded-full bg-[var(--accent)]"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[389] flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]"
      >
        <span
          ref={label}
          className="text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[#0a0a0b]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        />
      </div>
    </>
  );
}
