"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InstagramProps {
  handle: string;
  posts?: string[];
}

const PLACEHOLDERS = [
  { tone: "razor", aspect: "aspect-square" },
  { tone: "type", aspect: "aspect-square" },
  { tone: "scissor", aspect: "aspect-square" },
  { tone: "espresso", aspect: "aspect-square" },
  { tone: "vinyl", aspect: "aspect-square" },
  { tone: "atelier", aspect: "aspect-square" },
];

export function Instagram({ handle, posts }: InstagramProps) {
  const profileUrl = `https://instagram.com/${handle.replace(/^@/, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const items = posts && posts.length > 0 ? posts : PLACEHOLDERS;

  return (
    <section
      id="instagram"
      className="relative overflow-hidden bg-[var(--bg)] py-28 sm:py-36"
      aria-labelledby="instagram-heading"
    >
      <div className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-16">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 08 — Instagram</MaskReveal>
            </span>
          </div>
          <h2
            id="instagram-heading"
            className="text-display col-span-12 mt-8 text-[length:var(--fs-700)] leading-[0.9] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1.1} delay={0.15}>
              <span className="block text-[var(--ink-muted)]">@{handle}</span>
            </MaskReveal>
          </h2>
        </header>

        <div ref={ref} className="grid grid-cols-12 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <motion.a
              key={i}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Vezi postarea ${i + 1} pe Instagram`}
              className="group relative col-span-6 aspect-square overflow-hidden bg-[var(--surface)] sm:col-span-4 md:col-span-2"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.06,
                    }
              }
            >
              {typeof item === "string" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              ) : (
                <ProceduralIgArt variant={item.tone} index={i} />
              )}
              {/* duotone overlay */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background:
                    "linear-gradient(180deg, rgb(20 17 15 / 0.15) 0%, rgb(20 17 15 / 0.55) 100%)",
                }}
              />
              {/* hover veil + arrow */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center bg-[var(--accent)] text-[var(--bg)]"
                >
                  ↗
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          <span>
            <MaskReveal duration={0.6}>Urmărește atelierul, în timp real</MaskReveal>
          </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 border-b border-[var(--ink)] pb-1 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span>@{handle}</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProceduralIgArt({ variant, index }: { variant: string; index: number }) {
  const accent = "var(--accent)";
  const ink = "var(--ink)";
  const muted = "var(--ink-muted)";

  if (variant === "razor") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <path
          d="M 60 320 C 140 280, 220 160, 340 80"
          stroke={accent}
          strokeWidth="2.5"
          fill="none"
        />
        <line x1="40" y1="40" x2="40" y2="360" stroke={muted} strokeWidth="0.5" />
      </svg>
    );
  }
  if (variant === "type") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--bg)" />
        <text
          x="200"
          y="240"
          fill={ink}
          fontFamily="var(--font-display), Impact, sans-serif"
          fontSize="180"
          letterSpacing="-8"
          textAnchor="middle"
        >
          021
        </text>
        <line x1="80" y1="320" x2="320" y2="320" stroke={accent} strokeWidth="1" />
      </svg>
    );
  }
  if (variant === "scissor") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <circle cx="120" cy="280" r="55" fill="none" stroke={ink} strokeWidth="1.5" />
        <circle cx="280" cy="120" r="55" fill="none" stroke={accent} strokeWidth="1.5" />
        <line x1="160" y1="240" x2="240" y2="160" stroke={muted} strokeWidth="1" />
      </svg>
    );
  }
  if (variant === "espresso") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--surface)" />
        <ellipse cx="200" cy="200" rx="80" ry="20" fill="none" stroke={ink} strokeWidth="1.5" />
        <ellipse cx="200" cy="200" rx="60" ry="14" fill={accent} opacity="0.55" />
        <line x1="100" y1="290" x2="300" y2="290" stroke={muted} strokeWidth="0.5" />
      </svg>
    );
  }
  if (variant === "vinyl") {
    return (
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill="var(--bg)" />
        {[150, 110, 75, 40, 14].map((r, i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke={i === 0 ? accent : muted}
            strokeWidth={i === 0 ? "1.4" : "0.5"}
          />
        ))}
        <circle cx="200" cy="200" r="4" fill={accent} />
      </svg>
    );
  }
  // atelier / fallback
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      <rect width="100%" height="100%" fill="var(--surface)" />
      <rect x="60" y="60" width="280" height="280" fill="none" stroke={muted} strokeWidth="0.5" />
      <line x1="60" y1="200" x2="340" y2="200" stroke={muted} strokeWidth="0.5" />
      <line x1="200" y1="60" x2="200" y2="340" stroke={muted} strokeWidth="0.5" />
      <text
        x="200"
        y="230"
        fill={accent}
        fontFamily="var(--font-mono), monospace"
        fontSize="56"
        textAnchor="middle"
        letterSpacing="2"
      >
        № {String(index + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}
