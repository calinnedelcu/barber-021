"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GalleryProps {
  items?: string[];
}

const TILES = [
  { tag: "Atelier", aspect: "aspect-[4/5]", art: "razor" },
  { tag: "Detaliu", aspect: "aspect-square", art: "scissor" },
  { tag: "Tunsoare", aspect: "aspect-[4/5]", art: "vinyl" },
  { tag: "Sală", aspect: "aspect-[4/3]", art: "espresso" },
  { tag: "Scaun", aspect: "aspect-square", art: "comb" },
  { tag: "Interior", aspect: "aspect-[4/5]", art: "mirror" },
  { tag: "Semn", aspect: "aspect-[4/3]", art: "type" },
  { tag: "Tools", aspect: "aspect-square", art: "atelier" },
  { tag: "Lucru", aspect: "aspect-[4/5]", art: "detail" },
] as const;

const COL_LAYOUT = [
  "col-span-7 md:col-span-5",
  "col-span-5 md:col-span-3",
  "col-span-12 md:col-span-4",
  "col-span-6 md:col-span-4",
  "col-span-6 md:col-span-3",
  "col-span-12 md:col-span-5",
  "col-span-12 md:col-span-7",
  "col-span-6 md:col-span-2",
  "col-span-6 md:col-span-3",
];

const Y_OFFSET = [0, 24, 0, 12, 0, 30, 0, 0, 18];

export function Gallery({ items }: GalleryProps) {
  const hasReal = !!items && items.length > 0;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % TILES.length));
  }, []);
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + TILES.length) % TILES.length));
  }, []);

  // Lock body scroll + keyboard nav while open
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, next, prev]);

  return (
    <section
      id="galerie"
      className="relative bg-[var(--bg)] py-28 sm:py-36"
      aria-labelledby="gallery-heading"
    >
      <div className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-20">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 05 — Atelier</MaskReveal>
            </span>
          </div>
          <h2
            id="gallery-heading"
            className="text-serif-italic col-span-12 mt-8 text-[length:var(--fs-700)] leading-[1.05] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1} delay={0.15}>
              <span>Detalii care </span>
            </MaskReveal>
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">contează</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <ul className="grid grid-cols-12 gap-4 sm:gap-6">
          {TILES.map((tile, i) => (
            <Tile
              key={i}
              tile={tile}
              index={i}
              src={hasReal ? items[i] : undefined}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </ul>
      </div>

      <Lightbox
        openIndex={openIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
        items={items}
      />
    </section>
  );
}

function Tile({
  tile,
  index,
  src,
  onOpen,
}: {
  tile: (typeof TILES)[number];
  index: number;
  src?: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduced = useReducedMotion();

  const colSpan = COL_LAYOUT[index] ?? "col-span-6 md:col-span-4";
  const yShift = Y_OFFSET[index] ?? 0;

  return (
    <motion.li
      ref={ref}
      className={`${colSpan} group`}
      style={{ marginTop: yShift }}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: (index % 5) * 0.06 }
      }
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Deschide ${tile.tag}`}
        data-cursor="hover"
        className={`relative block w-full ${tile.aspect} overflow-hidden bg-[var(--surface)] text-left`}
      >
        {src ? (
          <Image
            src={src}
            alt={tile.tag}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ filter: "grayscale(100%) contrast(1.02)" }}
          />
        ) : (
          <ProceduralArt variant={tile.art} index={index} />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgb(20 17 15 / 0.55) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[var(--accent)] opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-25" />
        <span className="text-mono absolute left-4 top-4 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          № {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-mono absolute bottom-4 right-4 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink)]">
          {tile.tag}
        </span>
      </button>
    </motion.li>
  );
}

function Lightbox({
  openIndex,
  onClose,
  onNext,
  onPrev,
  items,
}: {
  openIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  items?: string[];
}) {
  return (
    <AnimatePresence>
      {openIndex !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie deschisă"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Închide galeria"
            onClick={onClose}
            className="absolute inset-0 bg-[rgb(10_8_7_/_0.94)] backdrop-blur-md"
          />

          {/* meta header */}
          <div className="container-x absolute inset-x-0 top-0 z-10 flex items-center justify-between py-6 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em]">
            <span className="text-[var(--ink)]">
              {String(openIndex + 1).padStart(2, "0")}
              <span className="mx-2 text-[var(--ink-muted)]">/</span>
              <span className="text-[var(--ink-muted)]">
                {String(TILES.length).padStart(2, "0")}
              </span>
              <span className="ml-4 text-[var(--accent)]">{TILES[openIndex]?.tag}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-3 text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <span>Închide</span>
              <span aria-hidden className="text-[var(--accent)]">
                ✕
              </span>
            </button>
          </div>

          {/* prev / next */}
          <button
            type="button"
            onClick={onPrev}
            aria-label="Anterior"
            className="absolute left-2 z-10 flex h-14 w-14 items-center justify-center text-mono text-[length:var(--fs-200)] text-[var(--ink-muted)] hover:text-[var(--ink)] sm:left-6"
          >
            ←
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Următor"
            className="absolute right-2 z-10 flex h-14 w-14 items-center justify-center text-mono text-[length:var(--fs-200)] text-[var(--ink-muted)] hover:text-[var(--ink)] sm:right-6"
          >
            →
          </button>

          {/* the image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-[1] mx-auto flex h-[78vh] w-full max-w-5xl items-center justify-center px-6"
            >
              <div
                className={`relative ${TILES[openIndex]?.aspect ?? "aspect-[4/5]"} h-full max-h-full w-auto overflow-hidden bg-[var(--surface)]`}
              >
                {items && items[openIndex] ? (
                  <Image
                    src={items[openIndex]}
                    alt={TILES[openIndex]?.tag ?? ""}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                ) : (
                  <ProceduralArt
                    variant={TILES[openIndex]?.art ?? "detail"}
                    index={openIndex}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProceduralArt({ variant, index }: { variant: string; index: number }) {
  const accent = "var(--accent)";
  const bone = "var(--bone)";
  const ink = "var(--ink)";
  const muted = "var(--ink-muted)";

  if (variant === "razor") {
    return (
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <line x1="40" y1="60" x2="360" y2="60" stroke={muted} strokeWidth="0.5" />
        <path d="M 80 420 C 160 380, 240 200, 340 100" stroke={accent} strokeWidth="2" fill="none" />
        <circle cx="340" cy="100" r="6" fill={accent} />
        <text x="40" y="470" fill={muted} fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="3">
          STRAIGHT EDGE
        </text>
      </svg>
    );
  }
  if (variant === "scissor") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <circle cx="120" cy="120" r="60" fill="none" stroke={ink} strokeWidth="1.5" />
        <circle cx="280" cy="280" r="60" fill="none" stroke={accent} strokeWidth="1.5" />
        <line x1="120" y1="120" x2="280" y2="280" stroke={muted} strokeWidth="1" />
      </svg>
    );
  }
  if (variant === "vinyl") {
    return (
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--bg)" />
        {[180, 140, 100, 60, 30].map((r, i) => (
          <circle
            key={i}
            cx="200"
            cy="250"
            r={r}
            fill="none"
            stroke={i === 0 ? accent : muted}
            strokeWidth={i === 0 ? "1.4" : "0.5"}
          />
        ))}
        <circle cx="200" cy="250" r="6" fill={accent} />
      </svg>
    );
  }
  if (variant === "espresso") {
    return (
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <rect x="140" y="80" width="120" height="160" fill="none" stroke={ink} strokeWidth="1.5" />
        <ellipse cx="200" cy="100" rx="50" ry="10" fill={accent} opacity="0.45" />
        <line x1="40" y1="270" x2="360" y2="270" stroke={muted} strokeWidth="0.5" />
      </svg>
    );
  }
  if (variant === "comb") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={i}
            x1={60 + i * 22}
            y1="120"
            x2={60 + i * 22}
            y2={i % 2 === 0 ? "300" : "260"}
            stroke={i === 7 ? accent : ink}
            strokeWidth="1.5"
          />
        ))}
        <line x1="60" y1="120" x2={60 + 13 * 22} y2="120" stroke={ink} strokeWidth="2" />
      </svg>
    );
  }
  if (variant === "mirror") {
    return (
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--bg)" />
        <rect x="80" y="80" width="240" height="340" fill="none" stroke={bone} strokeWidth="2" />
        <rect x="92" y="92" width="216" height="316" fill="var(--surface)" />
        <line x1="92" y1="200" x2="308" y2="200" stroke={accent} strokeWidth="0.8" opacity="0.5" />
      </svg>
    );
  }
  if (variant === "type") {
    return (
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--bg)" />
        <text
          x="40"
          y="180"
          fill={ink}
          fontFamily="var(--font-display), Impact, sans-serif"
          fontSize="160"
          letterSpacing="-6"
        >
          021
        </text>
        <line x1="40" y1="220" x2="360" y2="220" stroke={accent} strokeWidth="1" />
      </svg>
    );
  }
  if (variant === "atelier") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <rect x="60" y="60" width="280" height="280" fill="none" stroke={muted} strokeWidth="0.5" />
        <line x1="60" y1="200" x2="340" y2="200" stroke={muted} strokeWidth="0.5" />
        <line x1="200" y1="60" x2="200" y2="340" stroke={muted} strokeWidth="0.5" />
        <circle cx="200" cy="200" r="50" fill={accent} opacity="0.85" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
      <rect width="100%" height="100%" fill="var(--bg)" />
      <line x1="40" y1="80" x2="360" y2="80" stroke={accent} strokeWidth="0.8" />
      <line x1="40" y1="420" x2="360" y2="420" stroke={accent} strokeWidth="0.8" />
      <text
        x="200"
        y="270"
        fill={ink}
        fontFamily="var(--font-serif), Georgia, serif"
        fontStyle="italic"
        fontSize="48"
        textAnchor="middle"
      >
        № {String(index + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}
