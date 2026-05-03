"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { KineticText } from "@/components/primitives/KineticText";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Monogram } from "@/components/primitives/Monogram";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroProps {
  brandName: string;
  tagline: string;
  address: string;
  phone: string;
  backdropUrl?: string;
}

export function Hero({ brandName, tagline, address, phone, backdropUrl }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  const drawTransition = reduced
    ? { duration: 0 }
    : { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg)]"
    >
      {/* === BACKDROP — atelier photo, ken-burns scale === */}
      {backdropUrl && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 2.6, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.32]"
            priority
          />
          {/* warm duotone wash + vignette */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, rgb(10 8 7 / 0.45) 0%, rgb(10 8 7 / 0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgb(10 8 7 / 0.7) 90%)",
            }}
          />
        </motion.div>
      )}

      {/* === DECOR — oversized monogram behind === */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 1.04 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
          }
          className="translate-x-[8%] text-[var(--accent)]"
        >
          <Monogram size={520} tone="accent" className="opacity-90" />
        </motion.div>
      </div>

      {/* === DECOR — measuring rule + razor curve + tool study === */}
      <svg
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {/* far-right vertical measuring scale — like an architect's ruler */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }
          }
        >
          <line
            x1="1410"
            y1="80"
            x2="1410"
            y2="820"
            stroke="var(--ink)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          {Array.from({ length: 30 }, (_, i) => {
            const y = 80 + i * 25;
            const long = i % 5 === 0;
            return (
              <line
                key={i}
                x1={long ? 1395 : 1402}
                y1={y}
                x2="1410"
                y2={y}
                stroke="var(--ink)"
                strokeOpacity={long ? 0.28 : 0.14}
                strokeWidth="1"
              />
            );
          })}
          <text
            x="1380"
            y="86"
            textAnchor="end"
            fill="var(--ink-muted)"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="2"
          >
            0
          </text>
          <text
            x="1380"
            y="586"
            textAnchor="end"
            fill="var(--ink-muted)"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="2"
          >
            500
          </text>
        </motion.g>

        {/* razor curve sweeping diagonal */}
        <motion.path
          d="M -20 760 C 320 720, 520 440, 880 380 C 1180 330, 1300 200, 1480 140"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.25"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
          transition={drawTransition}
        />
        <motion.circle
          cx="880"
          cy="380"
          r="3.2"
          fill="var(--accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.4, delay: 1.7, ease: [0.16, 1, 0.3, 1] }
          }
        />

        {/* tiny tool study — top right corner */}
        <motion.g
          transform="translate(1180 140)"
          initial={{ opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
          transition={
            reduced ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.6 }
          }
        >
          {/* mini scissor study */}
          <circle cx="0" cy="0" r="14" fill="none" stroke="var(--ink-muted)" strokeWidth="0.8" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="var(--ink-muted)" strokeWidth="0.8" />
          <line
            x1="6"
            y1="6"
            x2="60"
            y2="60"
            stroke="var(--ink-muted)"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
          <line
            x1="32"
            y1="6"
            x2="-22"
            y2="60"
            stroke="var(--ink-muted)"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
          <text
            x="0"
            y="-30"
            fill="var(--ink-muted)"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="3"
          >
            FIG. 02
          </text>
        </motion.g>

        {/* hatch pattern bottom-right */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.4 }
          }
        >
          {Array.from({ length: 24 }, (_, i) => (
            <line
              key={i}
              x1={1100 + i * 14}
              y1={820}
              x2={1240 + i * 14}
              y2={680}
              stroke="var(--ink)"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          ))}
        </motion.g>

        {/* corner tag */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }
          }
        >
          <line
            x1="40"
            y1="220"
            x2="120"
            y2="220"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <text
            x="40"
            y="248"
            fill="var(--accent)"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            letterSpacing="3"
          >
            STUDY № 03
          </text>
          <text
            x="40"
            y="266"
            fill="var(--ink-muted)"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            letterSpacing="2"
          >
            TYPE · BLADE · GRID
          </text>
        </motion.g>
      </svg>

      {/* === FRAME — top + side meta === */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container-x flex items-center justify-between pt-7 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          <MaskReveal duration={0.6} delay={0.1}>
            <span className="flex items-center gap-3 text-[var(--ink)]">
              <Monogram />
              <span>{brandName}</span>
            </span>
          </MaskReveal>
          <MaskReveal duration={0.6} delay={0.2}>
            <span className="hidden sm:inline">EST · 44.4254 N · 26.1097 E</span>
          </MaskReveal>
          <MaskReveal duration={0.6} delay={0.3}>
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-[var(--ink)]">
              {phone}
            </a>
          </MaskReveal>
        </header>

        {/* === MAIN GRID — asymmetric 12 col === */}
        <div className="container-x grid flex-1 grid-cols-12 items-end gap-x-6 pb-16 pt-20 sm:pt-28">
          {/* left rail — vertical eyebrow */}
          <aside className="col-span-1 hidden md:flex h-full items-end justify-start">
            <span
              className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.4em] text-[var(--ink-muted)]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              <MaskReveal delay={0.5} duration={0.7}>
                Sector 3 · București · 2018→
              </MaskReveal>
            </span>
          </aside>

          {/* main type stack */}
          <div className="col-span-12 md:col-span-8 md:col-start-2">
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px w-12 bg-[var(--accent)]" />
              <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
                <MaskReveal delay={0.35} duration={0.6}>
                  Frizerie urbană · cu intenție
                </MaskReveal>
              </span>
            </div>

            <h1 className="text-display leading-[0.82]">
              <span className="block text-[clamp(4rem,11vw,11rem)]">
                <KineticText text="BARBER" delay={0.45} staggerEach={0.05} />
              </span>
              <span className="mt-1 block text-[clamp(4rem,11vw,11rem)] text-[var(--accent)]">
                <KineticText text="021" delay={0.85} staggerEach={0.05} />
              </span>
            </h1>

            <div className="mt-10 grid grid-cols-12 gap-x-6">
              <p className="col-span-12 max-w-md text-[length:var(--fs-400)] leading-[1.45] text-[var(--ink-muted)] sm:col-span-7">
                <MaskReveal delay={1.2} duration={0.9}>
                  {tagline}
                </MaskReveal>
              </p>
              <div className="col-span-12 mt-8 flex flex-wrap items-center gap-4 sm:col-span-12">
                <MagneticButton variant="primary">Programează</MagneticButton>
                <MagneticButton variant="ghost">Servicii</MagneticButton>
              </div>
            </div>
          </div>

          {/* right rail — date / serial */}
          <aside className="col-span-12 mt-12 md:col-span-3 md:col-start-10 md:mt-0 md:self-end">
            <div className="hairline pt-5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em]">
              <MaskReveal delay={1.4} duration={0.7}>
                <div className="grid gap-3 text-[var(--ink-muted)]">
                  <span>
                    <span className="text-[var(--ink)]">N° </span>
                    021 / 2026
                  </span>
                  <span>{address}</span>
                  <span className="text-[var(--accent)]">Luni → Sâmb.</span>
                </div>
              </MaskReveal>
            </div>
          </aside>
        </div>

        {/* bottom marquee strip */}
        <Marquee />
      </div>
    </section>
  );
}

function Marquee() {
  const tokens = [
    "Tunsoare",
    "Barbă cu brici",
    "Foarfecă tradițională",
    "Spălat profesional",
    "Programări online",
    "Calea Călărașilor 27",
  ];
  const reduced = useReducedMotion();
  const seq = [...tokens, ...tokens];

  return (
    <div
      aria-hidden
      className="hairline relative overflow-hidden py-4"
      style={{ borderTopColor: "var(--line)" }}
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap text-mono text-[length:var(--fs-100)] uppercase tracking-[0.32em] text-[var(--ink-muted)]"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduced
            ? undefined
            : { duration: 32, ease: "linear", repeat: Infinity }
        }
      >
        {seq.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="text-[var(--accent)]">✕</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
