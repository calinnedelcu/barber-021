"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MapSectionProps {
  address: string;
  hours: { day: string; hours: string }[];
  mapCenter: [number, number];
}

export function MapSection({ address, hours, mapCenter }: MapSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  const [lng, lat] = mapCenter;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section
      id="locatie"
      className="relative bg-[var(--bg)] py-28 sm:py-36"
      aria-labelledby="map-heading"
    >
      <div className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-20">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 07 — Locație</MaskReveal>
            </span>
          </div>
          <h2
            id="map-heading"
            className="text-serif-italic col-span-12 mt-8 text-[length:var(--fs-700)] leading-[1.05] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1} delay={0.15}>
              <span>Pe colț, lângă </span>
            </MaskReveal>
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">croitoria veche</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <div ref={ref} className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* schematic map */}
          <div className="relative col-span-12 md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }
              className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]"
            >
              <SchematicMap inView={inView} reduced={reduced} />

              {/* corner meta — top-left */}
              <div className="absolute left-5 top-5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                <span className="block text-[var(--accent)]">Lat / Lng</span>
                <span className="mt-1 block tabular-nums text-[var(--ink)]">
                  {lat.toFixed(4)}° N · {lng.toFixed(4)}° E
                </span>
              </div>

              {/* corner meta — bottom-right */}
              <div className="absolute bottom-5 right-5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                <span className="block text-right text-[var(--accent)]">Sector 3</span>
                <span className="mt-1 block text-right text-[var(--ink)]">București · RO</span>
              </div>
            </motion.div>
          </div>

          {/* meta side */}
          <aside className="col-span-12 md:col-span-4 md:pl-6">
            <div>
              <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
                <MaskReveal duration={0.6} delay={0.2}>
                  Adresă
                </MaskReveal>
              </span>
              <p className="mt-3 text-[length:var(--fs-500)] leading-[1.25]">
                <MaskReveal duration={0.9} delay={0.3}>
                  {address}
                </MaskReveal>
              </p>
            </div>

            <div className="mt-12">
              <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
                Program
              </span>
              <ul className="mt-4 grid gap-3 text-mono text-[length:var(--fs-200)] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="hairline flex items-baseline justify-between gap-6 pt-3"
                  >
                    <span className="text-[var(--ink)]">{h.day}</span>
                    <span className="tabular-nums">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-mono inline-flex items-center gap-3 border-b border-[var(--ink)] pb-1 text-[length:var(--fs-200)] uppercase tracking-[0.22em] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>Obține rută</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SchematicMap({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  const drawT = (delay: number) =>
    reduced
      ? { duration: 0 }
      : { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay };

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-label="Hartă schematică a locației"
    >
      {/* base */}
      <rect width="800" height="600" fill="var(--surface)" />

      {/* subtle grid */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 70}
          y1="0"
          x2={i * 70}
          y2="600"
          stroke="var(--ink)"
          strokeOpacity="0.04"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 70}
          x2="800"
          y2={i * 70}
          stroke="var(--ink)"
          strokeOpacity="0.04"
          strokeWidth="0.5"
        />
      ))}

      {/* roads — animated draw */}
      <motion.path
        d="M 0 320 L 800 320"
        stroke="var(--ink)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={drawT(0.2)}
      />
      <motion.path
        d="M 420 0 L 420 600"
        stroke="var(--ink)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={drawT(0.35)}
      />
      <motion.path
        d="M 60 80 C 200 120, 300 220, 420 320"
        stroke="var(--ink)"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={drawT(0.5)}
      />
      <motion.path
        d="M 420 320 C 540 400, 660 460, 780 540"
        stroke="var(--ink)"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={drawT(0.65)}
      />

      {/* blocks — abstract building footprints */}
      {[
        { x: 80, y: 80, w: 240, h: 200 },
        { x: 480, y: 60, w: 260, h: 220 },
        { x: 80, y: 360, w: 280, h: 180 },
        { x: 500, y: 380, w: 240, h: 160 },
      ].map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill="none"
          stroke="var(--ink-muted)"
          strokeOpacity="0.5"
          strokeWidth="0.8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.08 }
          }
        />
      ))}

      {/* street labels */}
      <motion.text
        x="60"
        y="312"
        fill="var(--ink-muted)"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        letterSpacing="3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={drawT(1.1)}
      >
        CALEA CĂLĂRAȘILOR
      </motion.text>
      <motion.text
        x="430"
        y="200"
        fill="var(--ink-muted)"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        letterSpacing="3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={drawT(1.2)}
      >
        STR. NERVA TRAIAN
      </motion.text>

      {/* location marker — bullseye + crosshair */}
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.3 }
        }
        style={{ transformOrigin: "420px 320px" }}
      >
        {/* pulse ring */}
        {!reduced && (
          <motion.circle
            cx="420"
            cy="320"
            r="20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "420px 320px" }}
          />
        )}
        <circle cx="420" cy="320" r="20" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        <circle cx="420" cy="320" r="6" fill="var(--accent)" />
        <line x1="420" y1="290" x2="420" y2="305" stroke="var(--accent)" strokeWidth="1" />
        <line x1="420" y1="335" x2="420" y2="350" stroke="var(--accent)" strokeWidth="1" />
        <line x1="390" y1="320" x2="405" y2="320" stroke="var(--accent)" strokeWidth="1" />
        <line x1="435" y1="320" x2="450" y2="320" stroke="var(--accent)" strokeWidth="1" />
      </motion.g>

      {/* "you are here" callout */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={drawT(1.5)}
      >
        <line x1="455" y1="320" x2="540" y2="270" stroke="var(--accent)" strokeWidth="0.8" />
        <text
          x="544"
          y="266"
          fill="var(--accent)"
          fontFamily="var(--font-mono), monospace"
          fontSize="11"
          letterSpacing="3"
        >
          BARBER 021
        </text>
        <text
          x="544"
          y="283"
          fill="var(--ink-muted)"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          letterSpacing="2"
        >
          AICI ↘
        </text>
      </motion.g>

      {/* compass */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={drawT(1.6)}
        transform="translate(740 80)"
      >
        <circle cx="0" cy="0" r="20" fill="none" stroke="var(--ink-muted)" strokeWidth="0.8" />
        <line x1="0" y1="-22" x2="0" y2="-12" stroke="var(--accent)" strokeWidth="1.5" />
        <text
          x="0"
          y="-26"
          fill="var(--accent)"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          textAnchor="middle"
          letterSpacing="1"
        >
          N
        </text>
      </motion.g>
    </svg>
  );
}
