"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ClientConfig } from "@/lib/config";
import { assetPath } from "@/lib/assetPath";
import { cn } from "@/lib/cn";
import styles from "./aa.module.css";
import { AANav } from "./AANav";
import { Marquee } from "./Marquee";
import { Tile } from "./Tile";

/* ===========================================================================
   A'A BARBER — bespoke "Neon Barber / Electric Blue" site
   Dark, industrial, streetwear energy. Antonio condensed display + Space
   Grotesk UI + JetBrains Mono meta. Icy electric blue (#46B6DC) on near-black.
   =========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      // `animate` is reactive: useReducedMotion() is false on first paint and
      // flips true in an effect. Forcing the visible state when reduced
      // guarantees content shows even though `initial` was captured at mount.
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: reduced ? 0 : 0.85, ease: EASE, delay: reduced ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className={cn(styles.mono, "flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.3em] text-[var(--ink-muted)]")}>
      <span className={styles.neon}>{index}</span>
      <span className="h-px w-8 bg-[var(--line)]" />
      <span>{label}</span>
    </div>
  );
}

export function AASite({ config }: { config: ClientConfig }) {
  const { brand, hero, services, team, reviews, gallery, contact, social, manifesto, geo } = config;

  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const heroMarkY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-12%"]);

  const phone = contact.phone;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;
  const [lng, lat] = contact.mapCenter;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ro`;

  const titleA = hero?.titleLines?.[0] ?? "A'A";
  const titleB = hero?.titleLines?.[1] ?? "BARBER";
  const marqueeItems = hero?.marquee ?? [];

  // Small photo strip for the hero — use a few low-res gallery shots at tile size.
  const heroStrip = gallery.slice(0, 4);

  return (
    <div id="top" className={styles.root}>
      <AANav brandName={brand.name} bookingUrl={contact.bookingUrl} phone={phone} />

      {/* ===================================================================
          HERO
      =================================================================== */}
      <section
        ref={heroRef}
        className={cn(styles.scanlines, "relative min-h-[100svh] overflow-hidden pt-[68px]")}
      >
        <div className={cn(styles.blueprintGrid, "pointer-events-none absolute inset-0 opacity-60")} />
        <div className={styles.glowBlob} style={{ top: "-12%", left: "-8%", width: "46vw", height: "46vw" }} />
        <div className={styles.glowBlob} style={{ bottom: "-18%", right: "-10%", width: "40vw", height: "40vw" }} />

        {/* Top meta strip */}
        <div className="container-x relative z-10 mx-auto max-w-[1500px]">
          <div
            className={cn(
              styles.mono,
              "flex flex-wrap items-center justify-between gap-y-2 border-b border-[var(--line)] py-3 text-[0.6rem] uppercase tracking-[0.28em] text-[var(--ink-muted)]"
            )}
          >
            <span>{hero?.eyebrow ?? "Barbershop · Sibiu"}</span>
            <span className="hidden sm:inline">{hero?.coordsLabel}</span>
            <span className="flex items-center gap-2">
              <span className={cn(styles.neon, "text-[0.7rem]")}>★</span>
              4.99 · 4050 evaluări
            </span>
          </div>
        </div>

        {/* Hero body */}
        <div className="container-x relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 gap-8 pb-10 pt-10 lg:grid-cols-[1fr_auto] lg:gap-10 lg:pt-16">
          {/* Left: huge type */}
          <div className="flex flex-col justify-center">
            <motion.div style={{ y: heroMarkY }}>
              <div className="relative">
                <motion.h1
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className={cn(styles.display, "leading-[0.82]")}
                >
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                      className={cn(
                        styles.neon,
                        styles.neonFlicker,
                        "block text-[clamp(5.5rem,22vw,17rem)]"
                      )}
                    >
                      {titleA}
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                      className={cn(styles.outline, "block text-[clamp(3rem,12.5vw,9.5rem)]")}
                    >
                      {titleB}
                    </motion.span>
                  </span>
                </motion.h1>
              </div>
            </motion.div>

            <Reveal delay={0.5} className="mt-7 max-w-[34ch]">
              <p
                className={cn(styles.grotesk, "text-[var(--ink-muted)] text-[length:var(--fs-400)] leading-relaxed")}
              >
                {brand.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.62} className="mt-8 flex flex-wrap items-center gap-4">
              {contact.bookingUrl && (
                <a
                  href={contact.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    styles.mono,
                    styles.neonBtn,
                    "relative inline-flex items-center gap-3 bg-[var(--accent)] px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--bg)]"
                  )}
                >
                  <span className={styles.neonBtnSweep} aria-hidden />
                  Programări pe MERO
                  <span aria-hidden>→</span>
                </a>
              )}
              <a
                href={telHref}
                className={cn(
                  styles.mono,
                  "inline-flex items-center gap-3 border border-[var(--line)] px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                )}
              >
                Sună-ne
              </a>
            </Reveal>

            {/* Hero photo strip — small, low-res friendly */}
            <Reveal delay={0.75} className="mt-10">
              <div className="grid grid-cols-4 gap-2.5">
                {heroStrip.map((src, i) => (
                  <Tile
                    key={src}
                    src={src}
                    alt={`Tunsoare ${brand.shortName ?? brand.name} ${i + 1}`}
                    sizes="(max-width: 1024px) 22vw, 140px"
                    className="aspect-[3/4]"
                    priority={i === 0}
                  />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: the real neon-sign brand shot, contained + framed */}
          <Reveal delay={0.35} className="hidden lg:block">
            <div className="relative h-full w-[clamp(320px,30vw,460px)]">
              <motion.div style={{ y: heroImgY }} className="sticky top-[120px]">
                {/* Source is 500x500 (the neon-sign brand shot) — keep it square so the whole sign reads. */}
                <div className={cn(styles.tile, "relative aspect-square w-full overflow-hidden")}>
                  {hero?.backdropUrl && (
                    <Image
                      src={assetPath(hero.backdropUrl)}
                      alt={brand.name}
                      fill
                      sizes="460px"
                      priority
                      className="object-cover"
                      style={{ filter: "contrast(1.08) saturate(1.05)" }}
                    />
                  )}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--bg) 85%, transparent) 100%)",
                    }}
                  />
                  <span className={cn(styles.corner, styles.cornerTL)} />
                  <span className={cn(styles.corner, styles.cornerTR)} />
                  <span className={cn(styles.corner, styles.cornerBL)} />
                  <span className={cn(styles.corner, styles.cornerBR)} />
                </div>
                {/* Vertical caption */}
                <div
                  className={cn(
                    styles.mono,
                    "absolute -left-7 top-0 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--ink-muted)]"
                  )}
                >
                  <span className={styles.vertical}>{hero?.localityLine ?? "Sibiu · Hipodrom"}</span>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Bottom marquee */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] py-3 backdrop-blur-sm">
          <Marquee
            items={marqueeItems}
            className={cn(styles.mono, "text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink)]")}
          />
        </div>
      </section>

      {/* ===================================================================
          MANIFESTO — three panels
      =================================================================== */}
      <section className="relative border-t border-[var(--line)] py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <Reveal>
            <SectionTag index="00" label="Despre" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {manifesto.panels.map((panel, i) => (
              <Reveal key={panel.eyebrow} delay={i * 0.1}>
                <div className="group relative h-full bg-[var(--bg)] p-7 transition-colors duration-500 hover:bg-[var(--surface)] lg:p-9">
                  <span
                    className={cn(
                      styles.display,
                      styles.outlineAccent,
                      "block text-[3.5rem] leading-none opacity-70 transition-opacity group-hover:opacity-100"
                    )}
                  >
                    {panel.eyebrow}
                  </span>
                  <h3 className={cn(styles.grotesk, "mt-6 text-[length:var(--fs-500)] font-semibold tracking-tight text-[var(--ink)]")}>
                    {panel.title}
                  </h3>
                  <p className={cn(styles.grotesk, "mt-3 text-[var(--ink-muted)] leading-relaxed text-[0.95rem]")}>
                    {panel.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SERVICES — bold barber price menu
      =================================================================== */}
      <section id="servicii" className="relative border-t border-[var(--line)] py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionTag index="01" label="Servicii & Prețuri" />
              <h2 className={cn(styles.display, "mt-5 text-[clamp(2.6rem,7vw,5.5rem)] text-[var(--ink)]")}>
                Lista de <span className={styles.neon}>prețuri</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={cn(styles.mono, "max-w-[32ch] text-[0.72rem] uppercase tracking-[0.2em] leading-relaxed text-[var(--ink-muted)]")}>
                Tarife corecte, finisaj curat. Programare rapidă pe MERO.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 border-t border-[var(--line)]">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <div className={cn(styles.serviceRow, "grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[var(--line)] px-2 py-7 md:gap-8 md:px-5")}>
                  <span className={cn(styles.mono, styles.serviceIndex, "text-[0.7rem] text-[var(--ink-muted)]")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className={cn(styles.grotesk, styles.serviceName, "text-[length:var(--fs-500)] font-semibold tracking-tight text-[var(--ink)]")}>
                      {s.name}
                    </h3>
                    <p className={cn(styles.mono, styles.serviceMeta, "mt-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]")}>
                      {s.duration}
                      {s.description ? ` · ${s.description.replace(/\.$/, "")}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className={cn(styles.serviceArrow, styles.mono, "hidden text-[var(--accent)] md:inline")}>→</span>
                    <span className={cn(styles.display, styles.servicePrice, "whitespace-nowrap text-[2rem] text-[var(--accent)] md:text-[2.6rem]")}>
                      {s.price}
                      <span className="ml-1 text-[0.9rem] tracking-normal text-[var(--ink-muted)]">lei</span>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          MARQUEE BREAK
      =================================================================== */}
      <div className="border-y border-[var(--line)] bg-[var(--surface)] py-5">
        <Marquee
          reverse
          fast
          sep="/"
          items={["TUNS", "BARBĂ", "BRICI", "FADE", "FOARFECĂ", "STYLING", brand.shortName ?? brand.name]}
          className={cn(styles.display, styles.outline, "text-[2.4rem] md:text-[3.4rem]")}
        />
      </div>

      {/* ===================================================================
          TEAM — the 3 barbers
      =================================================================== */}
      <section id="echipa" className="relative py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <Reveal>
            <SectionTag index="02" label="Echipa" />
            <h2 className={cn(styles.display, "mt-5 text-[clamp(2.6rem,7vw,5.5rem)] text-[var(--ink)]")}>
              Barberii <span className={styles.neon}>{brand.shortName ?? brand.name}</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 0.12}>
                <article className="group relative">
                  <div className={cn(styles.tile, "relative aspect-[4/5] w-full overflow-hidden")}>
                    <Image
                      src={assetPath(member.portrait)}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg) 92%, transparent) 100%)",
                      }}
                    />
                    <span
                      className={cn(
                        styles.mono,
                        "absolute left-4 top-4 bg-[var(--accent)] px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--bg)]"
                      )}
                    >
                      {member.role}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className={cn(styles.display, "text-[1.9rem] leading-[0.95] text-[var(--ink)]")}>
                        {member.name}
                      </h3>
                    </div>
                    <span className={cn(styles.corner, styles.cornerTR)} />
                    <span className={cn(styles.corner, styles.cornerBL)} />
                  </div>
                  {member.bio && (
                    <p className={cn(styles.grotesk, "mt-4 text-[0.9rem] leading-relaxed text-[var(--ink-muted)]")}>
                      {member.bio}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          GALLERY — marquee strips of cuts
      =================================================================== */}
      <section id="galerie" className="relative border-t border-[var(--line)] py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <Reveal>
            <SectionTag index="03" label="Galerie" />
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className={cn(styles.display, "text-[clamp(2.6rem,7vw,5.5rem)] text-[var(--ink)]")}>
                Lucrările <span className={styles.neon}>noastre</span>
              </h2>
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(styles.mono, "text-[0.72rem] uppercase tracking-[0.2em] text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]")}
                >
                  @{config.instagram?.handle ?? "a.abarbersibiu"} ↗
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {/* Two-row marquee of small tiles */}
        <div className="mt-12 flex flex-col gap-3.5">
          <GalleryStrip images={galleryRow(gallery, config.instagram?.posts ?? [], 0)} />
          <GalleryStrip images={galleryRow(gallery, config.instagram?.posts ?? [], 1)} reverse />
        </div>
      </section>

      {/* ===================================================================
          REVIEWS
      =================================================================== */}
      <section id="recenzii" className="relative border-t border-[var(--line)] py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Left rail — big trust signal */}
            <Reveal>
              <SectionTag index="04" label="Recenzii" />
              <div className="mt-10">
                <div className={cn(styles.stars, "text-[2.4rem] leading-none")}>★★★★★</div>
                <div className={cn(styles.display, "mt-5 flex items-end gap-3 text-[var(--ink)]")}>
                  <span className={cn(styles.neon, "text-[clamp(4rem,9vw,7rem)]")}>4.99</span>
                  <span className="pb-3 text-[1.4rem] text-[var(--ink-muted)]">/ 5</span>
                </div>
                <p className={cn(styles.grotesk, "mt-2 text-[var(--ink-muted)]")}>
                  din <span className="text-[var(--ink)]">4050 de evaluări</span> pe MERO
                </p>
                {contact.bookingUrl && (
                  <a
                    href={contact.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(styles.mono, "mt-8 inline-flex items-center gap-2 border-b border-[var(--accent)] pb-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--accent)]")}
                  >
                    Vezi pe MERO ↗
                  </a>
                )}
              </div>
            </Reveal>

            {/* Right — quote cards */}
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
              {reviews.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <figure className="flex h-full flex-col justify-between gap-6 bg-[var(--bg)] p-7 transition-colors duration-500 hover:bg-[var(--surface)]">
                    <span className={cn(styles.display, styles.neon, "text-[2.5rem] leading-none opacity-60")}>“</span>
                    <blockquote className={cn(styles.grotesk, "text-[1.05rem] leading-relaxed text-[var(--ink)]")}>
                      {r.quote}
                    </blockquote>
                    <figcaption className="flex items-center justify-between">
                      <span className={cn(styles.grotesk, "text-[0.9rem] font-semibold text-[var(--ink)]")}>
                        {r.author}
                      </span>
                      {r.source && (
                        <span className={cn(styles.mono, "text-[0.6rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]")}>
                          {r.source}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          LOCATION
      =================================================================== */}
      <section id="locatie" className="relative border-t border-[var(--line)] py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x mx-auto max-w-[1500px]">
          <Reveal>
            <SectionTag index="05" label="Locație" />
            <h2 className={cn(styles.display, "mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] text-[var(--ink)]")}>
              {geo?.mapHeadlineLead ?? "Pe Strada Luptei, în"}{" "}
              <span className={styles.neon}>{geo?.mapHeadlineAccent ?? "cartierul Hipodrom"}</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
            {/* Info column */}
            <Reveal>
              <div className="flex h-full flex-col justify-between gap-8 border border-[var(--line)] bg-[var(--surface)] p-7 lg:p-9">
                <div className="space-y-7">
                  <InfoRow label="Adresă" value={contact.address} />
                  <InfoRow label="Telefon" value={phone} href={telHref} />
                  <div>
                    <span className={cn(styles.mono, "text-[0.62rem] uppercase tracking-[0.24em] text-[var(--ink-muted)]")}>
                      Program
                    </span>
                    <ul className="mt-3 space-y-1.5">
                      {contact.hours.map((h) => {
                        const closed = /închis/i.test(h.hours);
                        return (
                          <li
                            key={h.day}
                            className={cn(styles.grotesk, "flex items-center justify-between text-[0.92rem]")}
                          >
                            <span className="text-[var(--ink-muted)]">{h.day}</span>
                            <span className={cn("tabular-nums", closed ? "text-[var(--ink-muted)]" : "text-[var(--ink)]")}>
                              {h.hours}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {contact.bookingUrl && (
                  <a
                    href={contact.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      styles.mono,
                      styles.neonBtn,
                      "relative inline-flex items-center justify-center gap-2 bg-[var(--accent)] px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--bg)]"
                    )}
                  >
                    <span className={styles.neonBtnSweep} aria-hidden />
                    Programează-te
                  </a>
                )}
              </div>
            </Reveal>

            {/* Map */}
            <Reveal delay={0.1}>
              <div className={cn(styles.tile, "relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full")}>
                <iframe
                  title={`Hartă ${brand.shortName ?? brand.name}`}
                  src={mapSrc}
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.9) hue-rotate(180deg)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <span className={cn(styles.corner, styles.cornerTL)} />
                <span className={cn(styles.corner, styles.cornerTR)} />
                <span className={cn(styles.corner, styles.cornerBL)} />
                <span className={cn(styles.corner, styles.cornerBR)} />
                <div
                  className={cn(
                    styles.mono,
                    "pointer-events-none absolute bottom-3 right-3 bg-[var(--bg)] px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--ink-muted)]"
                  )}
                >
                  {geo?.localityCountry ?? "Sibiu · RO"}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FOOTER — big CTA
      =================================================================== */}
      <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)]">
        <div className={cn(styles.blueprintGrid, "pointer-events-none absolute inset-0 opacity-50")} />
        <div className={styles.glowBlob} style={{ top: "-30%", left: "30%", width: "50vw", height: "50vw" }} />

        <div className="container-x relative z-10 mx-auto max-w-[1500px] py-[clamp(4rem,9vw,7rem)]">
          {/* CTA */}
          <Reveal>
            <p className={cn(styles.mono, "text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ink-muted)]")}>
              Gata pentru un tuns curat?
            </p>
            <h2 className={cn(styles.display, "mt-5 text-[clamp(3rem,12vw,10rem)] leading-[0.82]")}>
              <span className={cn(styles.neon, styles.neonFlicker)}>PROGRAMEAZĂ-TE</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12} className="mt-8 flex flex-wrap items-center gap-4">
            {contact.bookingUrl && (
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  styles.mono,
                  styles.neonBtn,
                  "relative inline-flex items-center gap-3 bg-[var(--accent)] px-9 py-5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[var(--bg)]"
                )}
              >
                <span className={styles.neonBtnSweep} aria-hidden />
                Programări pe MERO →
              </a>
            )}
            <a
              href={telHref}
              className={cn(
                styles.mono,
                "inline-flex items-center gap-3 border border-[var(--line)] px-8 py-5 text-[0.74rem] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
            >
              Sună · {phone}
            </a>
          </Reveal>

          {/* Footer grid */}
          <div className="mt-20 grid grid-cols-1 gap-10 border-t border-[var(--line)] pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className={cn(styles.display, styles.neon, "text-[2rem]")}>A&apos;A BARBER</span>
              <p className={cn(styles.grotesk, "mt-3 max-w-[28ch] text-[0.85rem] leading-relaxed text-[var(--ink-muted)]")}>
                {brand.tagline}
              </p>
            </div>

            <FooterCol title="Contact">
              <FooterLink href={telHref}>{phone}</FooterLink>
              <span className="text-[var(--ink-muted)]">{contact.address}</span>
            </FooterCol>

            <FooterCol title="Program">
              {contact.hours.slice(0, 7).map((h) => (
                <span key={h.day} className="flex justify-between gap-4 text-[var(--ink-muted)]">
                  <span>{h.day.slice(0, 3)}</span>
                  <span className="tabular-nums text-[var(--ink)]">{h.hours}</span>
                </span>
              ))}
            </FooterCol>

            <FooterCol title="Social">
              {social.instagram && <FooterLink href={social.instagram} ext>Instagram</FooterLink>}
              {social.facebook && <FooterLink href={social.facebook} ext>Facebook</FooterLink>}
              {social.tiktok && <FooterLink href={social.tiktok} ext>TikTok</FooterLink>}
            </FooterCol>
          </div>

          {/* Colophon */}
          <div className={cn(styles.mono, "mt-14 flex flex-col gap-2 border-t border-[var(--line)] pt-6 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between")}>
            <span>{brand.serial ?? "N° AA / 2026"}</span>
            <span>© {new Date().getFullYear()} A&apos;A Barber · Sibiu</span>
            <span className={styles.neon}>{hero?.coordsLabel}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* === Helpers ============================================================== */

function galleryRow(gallery: string[], insta: string[], row: number): string[] {
  const all = [...gallery, ...insta];
  // Alternate split so the two rows don't show identical sequences.
  return all.filter((_, i) => i % 2 === row);
}

function GalleryStrip({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
  const run = [...images, ...images];
  return (
    <div className={cn(styles.galleryStrip, "overflow-hidden")}>
      <div className={cn(styles.galleryTrack, reverse && styles.reverse)}>
        {run.map((src, i) => (
          <Tile
            key={`${src}-${i}`}
            src={src}
            alt="Lucrare barbershop"
            corners={false}
            sizes="200px"
            className="aspect-[3/4] w-[150px] flex-none sm:w-[200px]"
          />
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <span className={cn(styles.grotesk, "mt-2 block text-[1.05rem] text-[var(--ink)]")}>{value}</span>
  );
  return (
    <div>
      <span className={cn(styles.mono, "text-[0.62rem] uppercase tracking-[0.24em] text-[var(--ink-muted)]")}>
        {label}
      </span>
      {href ? (
        <a href={href} className="block transition-colors hover:text-[var(--accent)]">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className={cn(styles.mono, "text-[0.62rem] uppercase tracking-[0.26em] text-[var(--ink-muted)]")}>
        {title}
      </h4>
      <div className={cn(styles.grotesk, "mt-4 flex flex-col gap-2 text-[0.85rem]")}>{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
  ext = false,
}: {
  href: string;
  children: React.ReactNode;
  ext?: boolean;
}) {
  return (
    <a
      href={href}
      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
    >
      {children}
      {ext && <span className="ml-1 text-[var(--ink-muted)]">↗</span>}
    </a>
  );
}
