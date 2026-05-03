"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Service } from "@/lib/config";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  return (
    <section
      id="servicii"
      className="relative overflow-hidden bg-[var(--surface)] py-28 sm:py-36"
      aria-labelledby="services-heading"
    >
      {/* warm radial wash so the section doesn't read as pure black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 80% 0%, rgb(217 118 77 / 0.08), transparent 55%), radial-gradient(80% 60% at 0% 100%, rgb(217 118 77 / 0.05), transparent 60%)",
        }}
      />

      <div className="relative z-10 container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-16">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 02 — Lista</MaskReveal>
            </span>
          </div>
          <h2
            id="services-heading"
            className="text-display col-span-12 mt-8 text-[length:var(--fs-800)] leading-[0.85] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1.1} delay={0.15}>
              SERVICII
            </MaskReveal>
          </h2>
        </header>

        <ul
          className="grid grid-cols-1 border-t"
          style={{ borderColor: "rgb(245 239 230 / 0.14)" }}
        >
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }
      }
      className="group relative border-b transition-colors duration-300 hover:bg-[rgb(245_239_230_/_0.025)]"
      style={{ borderColor: "rgb(245 239 230 / 0.14)" }}
    >
      {/* copper accent bar that slides in on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />

      {/* MOBILE LAYOUT: two stacked rows + description */}
      <div className="px-1 py-6 sm:hidden">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span
              className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--accent)]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-display text-[length:var(--fs-600)] leading-[0.95] text-[var(--ink)]">
              {service.name}
            </h3>
          </div>
          <span className="text-display shrink-0 text-[length:var(--fs-500)] tabular-nums text-[var(--ink)]">
            {service.price}
            <span className="ml-1.5 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              ron
            </span>
          </span>
        </div>

        {service.description && (
          <p className="mt-3 max-w-md text-[length:var(--fs-200)] leading-[1.55] text-[var(--ink-muted)]">
            {service.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px flex-1"
            style={{ background: "rgb(245 239 230 / 0.1)" }}
          />
          <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            {service.duration}
          </span>
        </div>
      </div>

      {/* DESKTOP LAYOUT: 12-col row */}
      <div className="hidden grid-cols-12 items-baseline gap-x-6 px-1 py-9 sm:grid">
        <span
          className="text-display col-span-2 text-[length:var(--fs-500)] tracking-[0]"
          style={{ color: "transparent", WebkitTextStroke: "1px var(--ink-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="col-span-5">
          <h3 className="text-display text-[length:var(--fs-600)] leading-[0.95] transition-colors duration-300 group-hover:text-[var(--accent)]">
            {service.name}
          </h3>
          {service.description && (
            <p className="mt-3 max-w-md text-[length:var(--fs-200)] leading-[1.5] text-[var(--ink-muted)]">
              {service.description}
            </p>
          )}
        </div>

        <span className="col-span-2 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          {service.duration}
        </span>

        <span className="text-display col-span-3 text-right text-[length:var(--fs-500)] tabular-nums">
          {service.price}
          <span className="ml-2 text-mono text-[length:var(--fs-200)] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            ron
          </span>
        </span>
      </div>
    </motion.li>
  );
}
