"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Monogram } from "@/components/primitives/Monogram";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface NavProps {
  brandName: string;
}

const LINKS = [
  { id: "manifesto", label: "Manifest" },
  { id: "servicii", label: "Servicii" },
  { id: "echipa", label: "Echipa" },
  { id: "galerie", label: "Galerie" },
  { id: "locatie", label: "Locație" },
  { id: "programare", label: "Programare" },
];

export function Nav({ brandName }: NavProps) {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();

  // The dark backdrop fades in as the user starts scrolling so the nav
  // sits directly over the Hero photo at top, then "becomes a chrome bar"
  // once content slides under it.
  const backdropOpacity = useTransform(scrollY, [0, 200], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [40, 200], [0, 1]);

  return (
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

          <a
            href="#programare"
            className="hidden items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hot)] sm:inline-flex"
          >
            <span>Programează</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

function NavMonogram() {
  return <Monogram size={20} />;
}
