"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Preloader-ul BRICI: numărătoare 000→100 cu lama care se desenează, apoi
// ecranul e „tăiat" — cele două jumătăți alunecă în direcții opuse pe o
// diagonală. Implementat FĂRĂ GSAP (rAF + CSS), ca să fie imun la dubla
// montare din StrictMode și la orice race de import async; un safety-timeout
// garantează că scroll-ul se deblochează orice s-ar întâmpla.
const COUNT_MS = 1400;
const CUT_MS = 1000;

export function BriciPreloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"count" | "cut" | "gone">("count");
  const num = useRef<HTMLParagraphElement>(null);

  // numărătoarea + tranziția de fază (idempotent, restartabil)
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      if (num.current) num.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("cut");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (phase !== "cut") return;
    const id = setTimeout(() => setPhase("gone"), CUT_MS);
    return () => clearTimeout(id);
  }, [phase]);

  // blocarea scroll-ului — se eliberează GARANTAT (cleanup + safety timeout)
  useEffect(() => {
    if (reduced || phase === "gone") return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const release = () => {
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
    const safety = setTimeout(() => setPhase("gone"), COUNT_MS + CUT_MS + 2500);
    return () => {
      clearTimeout(safety);
      release();
    };
  }, [reduced, phase]);

  if (reduced || phase === "gone") return null;

  return (
    <div aria-hidden data-phase={phase} className="brici-pre fixed inset-0 z-[400]">
      <style>{`
        .brici-pre [data-pre-half]{transition:transform .9s cubic-bezier(.87,0,.13,1)}
        .brici-pre[data-phase="cut"] [data-pre-half="top"]{transform:translateY(-102%)}
        .brici-pre[data-phase="cut"] [data-pre-half="bottom"]{transform:translateY(102%)}
        .brici-pre [data-pre-content]{transition:opacity .35s ease}
        .brici-pre[data-phase="cut"] [data-pre-content]{opacity:0}
        .brici-pre [data-pre-cut]{transform:rotate(-4.6deg) scaleX(0);transform-origin:left center}
        .brici-pre[data-phase="cut"] [data-pre-cut]{animation:pre-cut .55s cubic-bezier(.7,0,.84,0) forwards}
        @keyframes pre-cut{60%{transform:rotate(-4.6deg) scaleX(1);opacity:1}100%{transform:rotate(-4.6deg) scaleX(1);opacity:0}}
        .brici-pre [data-pre-word]{animation:pre-word .8s cubic-bezier(.16,1,.3,1) .15s both}
        @keyframes pre-word{from{transform:translateY(120%)}to{transform:none}}
        .brici-pre [data-pre-draw]{stroke-dasharray:70;stroke-dashoffset:70;animation:pre-draw 1.1s cubic-bezier(.16,1,.3,1) .1s forwards}
        @keyframes pre-draw{to{stroke-dashoffset:0}}
      `}</style>

      <div
        data-pre-half="top"
        className="absolute inset-0 bg-[#0a0a0b]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 42%, 0 58%)" }}
      />
      <div
        data-pre-half="bottom"
        className="absolute inset-0 bg-[#0a0a0b]"
        style={{ clipPath: "polygon(0 58%, 100% 42%, 100% 100%, 0 100%)" }}
      />
      <div
        data-pre-cut
        className="absolute left-0 top-1/2 h-[2px] w-full bg-[#ff4533]"
        style={{ boxShadow: "0 0 18px rgb(255 69 51 / 0.9)" }}
      />
      <div data-pre-content className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
          <path
            data-pre-draw
            d="M6 19 L24 4.5 L27.5 8.5 L10.5 22 Z"
            stroke="#f1eee7"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="21" r="1.6" fill="#ff4533" />
        </svg>
        <div className="overflow-hidden">
          <p
            data-pre-word
            className="text-[2rem] font-extrabold tracking-[0.14em] text-[#f1eee7]"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            BRICI
          </p>
        </div>
        <p
          ref={num}
          className="text-sm tracking-[0.3em] text-[#8e8b84]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          000
        </p>
      </div>
    </div>
  );
}
