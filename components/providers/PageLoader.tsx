"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Branded entry loader. Shown for ~1.4s on first paint.
 * Hidden after `MIN_DISPLAY_MS` AND `window.load`, whichever is later.
 * Skipped entirely if user prefers reduced motion.
 */
const MIN_DISPLAY_MS = 1300;

export function PageLoader() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (reduced) {
      setShown(false);
      return;
    }

    let loaded = false;
    let minPassed = false;
    const tryHide = () => {
      if (loaded && minPassed) setShown(false);
    };

    const timer = setTimeout(() => {
      minPassed = true;
      tryHide();
    }, MIN_DISPLAY_MS);

    const onLoad = () => {
      loaded = true;
      tryHide();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // safety net — never block longer than 4s
    const safety = setTimeout(() => setShown(false), 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
      window.removeEventListener("load", onLoad);
    };
  }, [reduced]);

  // body scroll lock during loader
  useEffect(() => {
    if (!shown) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shown]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key="loader"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)]"
        >
          {/* center monogram + counter */}
          <div className="container-x relative flex h-full w-full items-end justify-between pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--ink-muted)]"
            >
              <span className="block text-[var(--accent)]">BARBER 021</span>
              <span className="mt-2 block">București · Sector 3</span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-display text-[length:var(--fs-700)] leading-none tabular-nums text-[var(--ink)]"
            >
              <Counter />
            </motion.span>
          </div>

          {/* center oversized 021 */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display pointer-events-none absolute select-none text-[clamp(8rem,28vw,28rem)] leading-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px var(--ink)",
            }}
          >
            021
          </motion.span>

          {/* sweep bar */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }}
            exit={{ scaleX: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Counter() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_DISPLAY_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span>{String(value).padStart(3, "0")}</span>;
}
