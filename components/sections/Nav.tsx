"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/primitives/Monogram";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface NavProps {
  brandName: string;
}

const LINKS = [
  { id: "servicii", label: "Servicii" },
  { id: "echipa", label: "Echipa" },
  { id: "manifesto", label: "Manifest" },
  { id: "galerie", label: "Galerie" },
  { id: "locatie", label: "Locație" },
  { id: "programare", label: "Programare" },
];

export function Nav({ brandName }: NavProps) {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const backdropOpacity = useTransform(scrollY, [0, 200], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [40, 200], [0, 1]);

  // Close menu on Esc + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.nav
        aria-label="Navigare principală"
        initial={reduced ? false : { opacity: 0, y: -16 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
        }
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "rgb(10 8 7)", opacity: backdropOpacity }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--line)", opacity: borderOpacity }}
        />
        <div className="relative">
          <div className="container-x flex items-center justify-between gap-6 py-4 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em]">
            <a
              href="#top"
              className="flex items-center gap-3 text-[var(--ink)] hover:text-[var(--accent)]"
            >
              <NavMonogram />
              <span className="hidden sm:inline">{brandName}</span>
            </a>

            <ul className="hidden items-center gap-7 lg:flex">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-[var(--ink-muted)] transition-colors duration-200 hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <a
                href="#programare"
                className="hidden items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hot)] sm:inline-flex"
              >
                <span>Programează</span>
                <span aria-hidden>→</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Închide meniul" : "Deschide meniul"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="relative z-10 flex h-10 w-10 items-center justify-center text-[var(--ink)] hover:text-[var(--accent)] lg:hidden"
              >
                <Burger open={open} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu navigare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[var(--bg)]" aria-hidden />
            <div className="container-x relative flex h-full flex-col justify-between pb-12 pt-28">
              <ul className="grid gap-2">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.05 + i * 0.04,
                    }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className="text-display block py-3 text-[length:var(--fs-700)] leading-[0.95] text-[var(--ink)] hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                className="grid gap-6"
              >
                <a
                  href="#programare"
                  onClick={() => setOpen(false)}
                  className="text-mono inline-flex items-center justify-between border border-[var(--accent)] bg-[var(--accent)] px-6 py-5 uppercase tracking-[0.22em] text-[length:var(--fs-200)] text-[var(--bg)] transition-colors hover:bg-[var(--accent-hot)]"
                >
                  <span>Programează</span>
                  <span aria-hidden>→</span>
                </a>
                <div className="text-mono grid gap-2 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  <span className="text-[var(--accent)]">{brandName}</span>
                  <span>EST. 2018 · Sector 3 · București</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavMonogram() {
  return <Monogram size={20} />;
}

function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-6">
      <motion.span
        className="absolute left-0 right-0 top-0 block h-px bg-current"
        animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute left-0 right-0 top-1/2 block h-px -translate-y-1/2 bg-current"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute left-0 right-0 bottom-0 block h-px bg-current"
        animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
