"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BriciMark } from "./BriciLogo";

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
  const bar = useRef<HTMLDivElement>(null);

  // numărătoarea + tranziția de fază (idempotent, restartabil)
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      if (num.current) num.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
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
        .brici-pre [data-pre-word]{animation:pre-word .8s cubic-bezier(.16,1,.3,1) .15s both}
        @keyframes pre-word{from{transform:translateY(120%)}to{transform:none}}
        .brici-pre [data-pre-mark]{animation:pre-mark .8s cubic-bezier(.16,1,.3,1) both}
        .brici-pre [data-pre-mark] [data-logo-blade]{clip-path:inset(0 100% 0 0);animation:pre-blade .72s cubic-bezier(.16,1,.3,1) .08s forwards}
        .brici-pre [data-pre-mark] [data-logo-edge]{opacity:0;animation:pre-edge .3s ease .52s forwards}
        .brici-pre [data-pre-mark] [data-logo-handle]{opacity:0;transform:rotate(-24deg);transform-origin:15.4px 27.8px;animation:pre-handle .68s cubic-bezier(.16,1,.3,1) .22s forwards}
        .brici-pre [data-pre-mark] [data-logo-pivot]{transform:scale(0);transform-origin:15.4px 27.8px;animation:pre-pivot .36s cubic-bezier(.34,1.56,.64,1) .62s forwards}
        @keyframes pre-mark{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes pre-blade{to{clip-path:inset(0 0 0 0)}}
        @keyframes pre-edge{to{opacity:1}}
        @keyframes pre-handle{to{opacity:1;transform:rotate(0)}}
        @keyframes pre-pivot{to{transform:scale(1)}}
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
      <div data-pre-content className="absolute inset-0 flex items-center justify-center px-5">
        <div className="w-full max-w-xl text-center">
          <div data-pre-mark className="mx-auto w-fit text-[#f1eee7]">
            <BriciMark size={88} />
          </div>
          <p
            className="mt-7 text-[.62rem] font-semibold uppercase text-[#8e8b84]"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace", letterSpacing: ".24em" }}
          >
            Atelier de precizie · Sibiu
          </p>
          <div className="mt-2 overflow-hidden">
            <p
              data-pre-word
              className="text-[clamp(3.7rem,14vw,7.5rem)] font-extrabold uppercase leading-none text-[#f1eee7]"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: ".04em" }}
            >
              BRICI
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-sm items-center gap-4">
            <p
              ref={num}
              className="w-10 text-left text-xs text-[#ff4533]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              000
            </p>
            <div className="h-px flex-1 overflow-hidden bg-white/15">
              <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-[#ff4533]" />
            </div>
            <p className="text-xs text-[#686660]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              100
            </p>
          </div>
          <div
            className="mx-auto mt-5 flex max-w-sm justify-between text-[.58rem] uppercase text-[#5f5d58]"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace", letterSpacing: ".18em" }}
          >
            <span>Est. 2026</span>
            <span>45.7975° N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
