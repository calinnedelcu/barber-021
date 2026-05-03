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
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ro`;

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
              <span>Pe colț, lângă</span>
            </MaskReveal>{" "}
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">croitoria veche</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <div ref={ref} className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* real Google Maps embed framed editorial */}
          <div className="relative col-span-12 md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }
              className="relative aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[var(--surface)]"
            >
              <iframe
                title="Hartă · Strada Calea Călărașilor 27"
                src={embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />

              {/* editorial corner meta over the map */}
              <div className="pointer-events-none absolute left-5 top-5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                <span className="block text-[var(--accent)]">Lat / Lng</span>
                <span className="mt-1 block tabular-nums text-[var(--ink)]">
                  {lat.toFixed(4)}° N · {lng.toFixed(4)}° E
                </span>
              </div>

              <div className="pointer-events-none absolute bottom-5 right-5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
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
                rel="noopener noreferrer"
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
