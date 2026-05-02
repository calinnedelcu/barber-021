"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { ParallaxLayer } from "@/components/primitives/ParallaxLayer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ManifestoProps {
  panels: { eyebrow: string; title: string; body: string }[];
}

export function Manifesto({ panels }: ManifestoProps) {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden bg-[var(--bg)] py-32 sm:py-40"
      aria-labelledby="manifesto-heading"
    >
      {/* Parallax background — italic monogram + grid + measurements */}
      <ManifestoBackdrop />

      <div className="relative z-10 container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-20">
          <div className="col-span-12 md:col-span-2">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 01 — Manifest</MaskReveal>
            </span>
          </div>
          <h2
            id="manifesto-heading"
            className="text-serif-italic col-span-12 mt-8 text-[length:var(--fs-700)] leading-[1.05] tracking-[-0.01em] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1} delay={0.15}>
              <span>Trei reguli pe care nu le </span>
            </MaskReveal>
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">negociem</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-y-24 md:gap-y-32">
          {panels.map((panel, i) => (
            <Panel key={panel.eyebrow} panel={panel} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ManifestoBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* faint grid */}
      <svg
        viewBox="0 0 1440 1200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 120}
            y1="0"
            x2={i * 120}
            y2="1200"
            stroke="var(--ink)"
            strokeOpacity="0.03"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 120}
            x2="1440"
            y2={i * 120}
            stroke="var(--ink)"
            strokeOpacity="0.03"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* slow parallax — italic word */}
      <ParallaxLayer
        speed={0.25}
        className="absolute inset-y-0 right-0 hidden w-1/2 lg:flex"
      >
        <div className="flex h-full w-full items-center justify-end pr-8">
          <span
            className="text-serif-italic select-none text-[clamp(10rem,22vw,22rem)] leading-[0.9]"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgb(217 118 77 / 0.1)",
            }}
          >
            credo
          </span>
        </div>
      </ParallaxLayer>

      {/* faster parallax — small measurement annotation */}
      <ParallaxLayer
        speed={-0.15}
        className="absolute left-0 top-1/3 hidden md:block"
      >
        <svg width="180" height="120" viewBox="0 0 180 120">
          <line x1="20" y1="20" x2="20" y2="100" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.8" />
          <line x1="14" y1="20" x2="26" y2="20" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="0.8" />
          <line x1="14" y1="100" x2="26" y2="100" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="0.8" />
          <line x1="14" y1="60" x2="22" y2="60" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.8" />
          <text
            x="38"
            y="64"
            fill="var(--ink-muted)"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="3"
          >
            1320 mm
          </text>
          <text
            x="38"
            y="80"
            fill="var(--accent)"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="3"
          >
            STANDARD
          </text>
        </svg>
      </ParallaxLayer>
    </div>
  );
}

function Panel({
  panel,
  index,
}: {
  panel: { eyebrow: string; title: string; body: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  // alternate left / right / left layout — editorial rhythm
  const offset =
    index % 3 === 0
      ? "md:col-start-1 md:col-span-9"
      : index % 3 === 1
      ? "md:col-start-4 md:col-span-9"
      : "md:col-start-2 md:col-span-9";

  return (
    <article ref={ref} className={`col-span-12 ${offset}`}>
      <div className="grid grid-cols-12 items-start gap-x-6">
        <div className="col-span-12 md:col-span-3">
          <motion.span
            className="text-display block text-[clamp(4rem,9vw,8rem)] leading-none"
            style={{ color: "transparent", WebkitTextStroke: "1px var(--ink)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
            }
          >
            {panel.eyebrow}
          </motion.span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h3 className="text-display text-[length:var(--fs-600)] leading-[0.95]">
            <MaskReveal duration={0.9} delay={0.2}>
              {panel.title}
            </MaskReveal>
          </h3>
          <motion.p
            className="mt-6 max-w-xl text-[length:var(--fs-400)] leading-[1.55] text-[var(--ink-muted)]"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }
            }
          >
            {panel.body}
          </motion.p>
        </div>
      </div>
    </article>
  );
}
