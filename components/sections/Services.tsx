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
      className="relative bg-[var(--surface)] py-28 sm:py-36"
      aria-labelledby="services-heading"
    >
      <div className="container-x">
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

        <ul className="grid grid-cols-1">
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
      className="group relative"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--line)" }}
      />
      <div className="grid grid-cols-12 items-baseline gap-x-6 py-7 sm:py-9">
        {/* number */}
        <span
          className="text-display col-span-2 text-[length:var(--fs-500)] tracking-[0]"
          style={{ color: "transparent", WebkitTextStroke: "1px var(--ink-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* name */}
        <div className="col-span-7 sm:col-span-5">
          <h3 className="text-display text-[length:var(--fs-600)] leading-[0.95] transition-colors duration-300 group-hover:text-[var(--accent)]">
            {service.name}
          </h3>
          {service.description && (
            <p className="mt-3 hidden max-w-md text-[length:var(--fs-200)] leading-[1.5] text-[var(--ink-muted)] sm:block">
              {service.description}
            </p>
          )}
        </div>

        {/* duration */}
        <span className="col-span-2 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:col-span-2">
          {service.duration}
        </span>

        {/* price */}
        <span className="text-display col-span-3 text-right text-[length:var(--fs-500)] tabular-nums">
          {service.price}
          <span className="ml-2 text-mono text-[length:var(--fs-200)] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            ron
          </span>
        </span>
      </div>

      {/* mobile description */}
      {service.description && (
        <p className="block max-w-md pb-7 text-[length:var(--fs-200)] leading-[1.5] text-[var(--ink-muted)] sm:hidden">
          {service.description}
        </p>
      )}

      {/* last row hairline */}
      {index === 9999 && (
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--line)" }}
        />
      )}
    </motion.li>
  );
}
