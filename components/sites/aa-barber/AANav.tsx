"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import styles from "./aa.module.css";

interface AANavProps {
  brandName: string;
  bookingUrl?: string;
  phone: string;
}

const LINKS = [
  { href: "#servicii", label: "Servicii" },
  { href: "#echipa", label: "Echipă" },
  { href: "#galerie", label: "Galerie" },
  { href: "#recenzii", label: "Recenzii" },
  { href: "#locatie", label: "Locație" },
];

export function AANav({ brandName, bookingUrl, phone }: AANavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduced ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md"
          : "bg-transparent"
      )}
      style={{
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav className="container-x mx-auto flex h-[68px] max-w-[1500px] items-center justify-between">
        {/* Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label={brandName}
        >
          <span
            className={cn(styles.display, styles.neon, styles.neonFlicker, "text-[1.45rem]")}
          >
            A&apos;A
          </span>
          <span
            className={cn(
              styles.mono,
              "hidden text-[0.62rem] uppercase tracking-[0.34em] text-[var(--ink-muted)] sm:inline"
            )}
          >
            Barber
          </span>
        </a>

        {/* Center links */}
        <ul
          className={cn(
            styles.mono,
            "hidden items-center gap-9 text-[0.66rem] uppercase tracking-[0.26em] text-[var(--ink-muted)] lg:flex"
          )}
        >
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative inline-block py-1 transition-colors duration-300 hover:text-[var(--ink)]"
              >
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full"
                  style={{ boxShadow: "0 0 8px var(--accent)" }}
                />
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={cn(
              styles.mono,
              "hidden text-[0.66rem] uppercase tracking-[0.2em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] md:inline"
            )}
          >
            {phone}
          </a>
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                styles.mono,
                styles.neonBtn,
                "relative inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-2.5 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[var(--bg)]"
              )}
            >
              <span className={styles.neonBtnSweep} aria-hidden />
              Programează
            </a>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Meniu"
            aria-expanded={open}
            className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-[var(--ink)] transition-all duration-300",
                open && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-[var(--ink)] transition-all duration-300",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-[var(--ink)] transition-all duration-300",
                open && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden bg-[var(--bg)] lg:hidden"
        style={{ borderBottom: open ? "1px solid var(--line)" : "none" }}
      >
        <ul className="container-x mx-auto flex max-w-[1500px] flex-col gap-1 py-5">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  styles.display,
                  "block py-2 text-[1.9rem] text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.header>
  );
}
