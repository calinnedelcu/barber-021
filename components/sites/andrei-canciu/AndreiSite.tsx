"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { ClientConfig } from "@/lib/config";
import { assetPath } from "@/lib/assetPath";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import styles from "./andrei.module.css";
import { CutGeometry } from "./CutGeometry";

const LOGO = "/clients/andrei-canciu/marks/logo.jpg";
const PORTRAIT = "/clients/andrei-canciu/about/andrei.jpg";

const NAV = [
  { id: "manifest", label: "Manifest" },
  { id: "servicii", label: "Servicii" },
  { id: "portofoliu", label: "Portofoliu" },
  { id: "studio", label: "Studio" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ utils */

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  // Reduced motion: force the final visible state via `animate` (reactive to the
  // post-mount reduced-motion flip). Normal motion reveals via `whileInView`.
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* A small monospace section index / eyebrow */
function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <div className={cn(styles.mono, "flex items-center gap-3 text-[length:var(--fs-100)] uppercase tracking-[0.28em]")}>
      <span style={{ color: "var(--accent)" }}>{index}</span>
      <span className="h-px w-8" style={{ background: "var(--accent)" }} />
      <span style={{ color: "var(--ink-muted)" }}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------- site */

export function AndreiSite({ config }: { config: ClientConfig }) {
  const { brand, hero, manifesto, services, gallery, contact, social, geo } = config;
  const reduced = useReducedMotion();
  const heroImg = hero?.backdropUrl;

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const geomY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  const phoneHref = `tel:${contact.phone.replace(/\s+/g, "")}`;
  const [lng, lat] = contact.mapCenter;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ro`;

  const titleLines = hero?.titleLines ?? [brand.name.split(" ")[0] ?? brand.name, brand.name.split(" ")[1] ?? ""];
  const marquee = hero?.marquee ?? [];

  return (
    <main id="top" className={cn(styles.root, "min-h-screen")}>
      <Nav brand={brand} phoneHref={phoneHref} />

      {/* ======================================================= HERO */}
      <section ref={heroRef} className="relative">
        <div className="container-x relative mx-auto max-w-[1600px] pt-28 sm:pt-32">
          {/* top meta strip */}
          <div
            className={cn(styles.mono, "flex flex-wrap items-center justify-between gap-y-2 border-b pb-4 text-[length:var(--fs-100)] uppercase tracking-[0.24em]")}
            style={{ borderColor: "var(--line)", color: "var(--ink-muted)" }}
          >
            <span>{hero?.eyebrow ?? "Hairstyling"}</span>
            <span className="hidden sm:inline">{hero?.coordsLabel}</span>
            <span style={{ color: "var(--accent)" }}>★ 4.9 · Google</span>
          </div>

          {/* name + ghost outline + real work image */}
          <div className="relative grid grid-cols-1 gap-8 pt-10 lg:grid-cols-12 lg:pt-16">
            <div className={cn(styles.heroNameCol, "lg:col-span-7")}>
              {/* ghost outlined echo behind the solid name */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-24 -z-0 hidden select-none lg:block"
                style={reduced ? undefined : { y: ghostY }}
              >
                <span
                  className={cn(styles.heroName, styles.outline)}
                  style={{ fontSize: "clamp(5rem, 14vw, 15rem)", opacity: 0.16 }}
                >
                  {titleLines[1] || titleLines[0]}
                </span>
              </motion.div>

              <h1 className="relative z-10">
                <span className="sr-only">{brand.name}</span>
                {titleLines.map((line, i) => (
                  <HeroLine key={i} text={line} delay={0.2 + i * 0.12} reduced={reduced} />
                ))}
              </h1>
            </div>

            {/* real hero image — his salon + work */}
            <motion.div
              className="relative z-10 lg:col-span-5"
              style={reduced ? undefined : { y: geomY }}
            >
              {heroImg ? (
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden border"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Image
                    src={assetPath(heroImg)}
                    alt="Lucrare Andrei Canciu — coafat în salon"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                    priority
                  />
                  {/* geometric brand motif over the photo corner */}
                  <div aria-hidden="true" className="pointer-events-none absolute -bottom-5 -left-5 hidden opacity-90 lg:block">
                    <CutGeometry className="h-36 w-auto" animate={!reduced} accent="var(--accent)" />
                  </div>
                </div>
              ) : (
                <div className="hidden items-end justify-center lg:flex">
                  <CutGeometry className="h-[clamp(20rem,30vw,34rem)] w-auto" animate={!reduced} accent="var(--accent)" />
                </div>
              )}
            </motion.div>
          </div>

          {/* tagline + cta row */}
          <div
            className="mt-12 grid grid-cols-1 items-end gap-8 border-t pt-8 lg:grid-cols-12"
            style={{ borderColor: "var(--line)" }}
          >
            <Reveal className="lg:col-span-6" delay={0.5}>
              <p
                className={cn(styles.syne, "max-w-xl text-[length:var(--fs-500)] font-medium leading-tight")}
              >
                {brand.tagline}
              </p>
            </Reveal>

            <div className="flex flex-col gap-4 lg:col-span-6 lg:items-end">
              <Reveal delay={0.62} className="w-full lg:w-auto">
                <a
                  href={phoneHref}
                  className={cn(
                    styles.mono,
                    "group inline-flex w-full items-center justify-between gap-6 px-7 py-5 text-[length:var(--fs-200)] uppercase tracking-[0.2em] transition-colors duration-300 lg:w-auto"
                  )}
                  style={{ background: "var(--ink)", color: "var(--bg)" }}
                >
                  <span>Programează</span>
                  <span style={{ color: "var(--accent)" }}>{contact.phone}</span>
                </a>
              </Reveal>
              <Reveal delay={0.7}>
                <p className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.22em]")} style={{ color: "var(--ink-muted)" }}>
                  {hero?.localityLine ?? contact.address}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* marquee strip */}
        {marquee.length > 0 && <Marquee items={marquee} reduced={reduced} />}
      </section>

      {/* ======================================================= MANIFEST */}
      <section id="manifest" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container-x mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Kicker index="—01" label="Manifest" />
              <h2 className={cn(styles.display, "mt-6 text-[length:var(--fs-700)]")}>
                Tunsoarea<br />ca<br /><span style={{ color: "var(--accent)" }}>geometrie.</span>
              </h2>
              <p className={cn(styles.archivo, "mt-6 max-w-xs text-[length:var(--fs-200)] leading-relaxed")} style={{ color: "var(--ink-muted)" }}>
                Trei principii după care lucrez. Fără șabloane, fără grabă.
              </p>

              {/* signature — Andrei himself */}
              <div className="mt-10 flex items-center gap-4">
                <span
                  className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full border"
                  style={{ borderColor: "var(--line)", background: "var(--surface)" }}
                >
                  <Image
                    src={assetPath(PORTRAIT)}
                    alt="Andrei Canciu"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className={cn(styles.syne, "text-[length:var(--fs-300)] font-bold")}>Andrei Canciu</p>
                  <p className={cn(styles.mono, "mt-1 text-[length:var(--fs-100)] uppercase tracking-[0.2em]")} style={{ color: "var(--ink-muted)" }}>
                    Hairstylist · fondator
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-px" style={{ background: "var(--line)" }}>
                {manifesto.panels.map((panel, i) => (
                  <Reveal key={panel.eyebrow} delay={i * 0.08}>
                    <article
                      className="group grid grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-12 sm:gap-8 sm:px-8 sm:py-10"
                      style={{ background: "var(--bg)" }}
                    >
                      <div className={cn(styles.mono, "sm:col-span-2 text-[length:var(--fs-500)]")} style={{ color: "var(--accent)" }}>
                        {panel.eyebrow}
                      </div>
                      <h3 className={cn(styles.syne, "sm:col-span-4 text-[length:var(--fs-400)] font-bold leading-tight")}>
                        {panel.title}
                      </h3>
                      <p className={cn(styles.archivo, "sm:col-span-6 text-[length:var(--fs-200)] leading-relaxed")} style={{ color: "var(--ink-muted)" }}>
                        {panel.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= SERVICES */}
      <section id="servicii" className="relative scroll-mt-24 py-24 sm:py-32" style={{ background: "var(--bg)" }}>
        <div className="container-x mx-auto max-w-[1600px]">
          <Reveal className="mb-12 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between" >
            <div>
              <Kicker index="—02" label="Servicii" />
              <h2 className={cn(styles.display, "mt-5 text-[length:var(--fs-700)]")}>Lista</h2>
            </div>
            <p className={cn(styles.mono, "max-w-sm text-[length:var(--fs-100)] uppercase leading-relaxed tracking-[0.16em]")} style={{ color: "var(--ink-muted)" }}>
              Prețurile sunt orientative și se confirmă în salon, în funcție de lungime și complexitate.
            </p>
          </Reveal>

          <ul style={{ borderTop: "1px solid var(--line)" }}>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i * 0.05, 0.3)}>
                <li
                  className={cn(styles.serviceRow, "grid grid-cols-12 items-baseline gap-3 px-2 py-7 sm:gap-6 sm:px-6")}
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <span className={cn(styles.mono, styles.serviceIndex, "col-span-2 text-[length:var(--fs-100)] sm:col-span-1")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10 sm:col-span-6">
                    <h3 className={cn(styles.syne, styles.serviceName, "text-[length:var(--fs-400)] font-bold")}>{s.name}</h3>
                    {s.description && (
                      <p className={cn(styles.archivo, styles.serviceDesc, "mt-1 max-w-md text-[length:var(--fs-100)] leading-relaxed")}>
                        {s.description}
                      </p>
                    )}
                  </div>
                  <span className={cn(styles.mono, styles.serviceDuration, "col-span-6 text-[length:var(--fs-100)] uppercase tracking-[0.16em] sm:col-span-3")}>
                    {s.duration}
                  </span>
                  <span className={cn(styles.syne, styles.servicePrice, "col-span-6 text-right text-[length:var(--fs-500)] font-bold sm:col-span-2")}>
                    {s.price}
                    <span className="ml-1 text-[length:var(--fs-100)] font-normal opacity-60">lei</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ======================================================= PORTFOLIO */}
      <Portfolio reduced={reduced} instagram={social.instagram} gallery={gallery} />

      {/* ======================================================= STUDIO / LOCATION */}
      <section id="studio" className="relative scroll-mt-24 py-24 sm:py-32" style={{ background: "var(--bg)" }}>
        <div className="container-x mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Kicker index="—04" label="Studio" />
              <h2 className={cn(styles.display, "mt-6 text-[length:var(--fs-700)]")}>
                {geo?.mapHeadlineLead ?? "În"}{" "}
                <span style={{ color: "var(--accent)" }}>{geo?.mapHeadlineAccent ?? "Sibiu"}</span>
              </h2>

              <dl className="mt-10 flex flex-col gap-px" style={{ background: "var(--line)" }}>
                <MetaRow label="Adresă" value={contact.address} />
                {contact.hours.map((h) => (
                  <MetaRow key={h.day} label={h.day} value={h.hours} />
                ))}
                <MetaRow label="Telefon" value={contact.phone} href={phoneHref} />
              </dl>

              <a
                href={phoneHref}
                className={cn(styles.mono, "mt-8 inline-flex items-center gap-3 px-6 py-4 text-[length:var(--fs-200)] uppercase tracking-[0.2em]")}
                style={{ background: "var(--ink)", color: "var(--bg)" }}
              >
                Programează la telefon
                <span style={{ color: "var(--accent)" }}>→</span>
              </a>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={0.1}>
              <div className="relative h-[clamp(20rem,42vw,34rem)] w-full overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                <iframe
                  title={`Hartă — ${contact.address}`}
                  src={mapSrc}
                  className="h-full w-full"
                  style={{ border: 0, filter: "grayscale(1) contrast(1.05)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                  <span className={cn(styles.mono, "px-3 py-1 text-[length:var(--fs-100)] uppercase tracking-[0.2em]")} style={{ background: "var(--ink)", color: "var(--bg)" }}>
                    {geo?.region ?? "Sibiu"}
                  </span>
                </div>
                <span className={cn(styles.mono, "pointer-events-none absolute bottom-4 right-4 px-3 py-1 text-[length:var(--fs-100)] uppercase tracking-[0.2em]")} style={{ background: "var(--ink)", color: "var(--bg)" }}>
                  {geo?.localityCountry ?? "Sibiu · RO"}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ======================================================= CONTACT / FOOTER */}
      <Footer config={config} phoneHref={phoneHref} social={social} />
    </main>
  );
}

/* ----------------------------------------------------------------- pieces */

function HeroLine({ text, delay, reduced }: { text: string; delay: number; reduced: boolean }) {
  if (reduced) {
    return (
      <span className={cn(styles.heroName, styles.heroNameFit, "block")}>
        {text}
      </span>
    );
  }
  return (
    <span className={styles.heroNameMask}>
      <motion.span
        className={cn(styles.heroName, styles.heroNameFit, "block")}
        initial={{ y: "108%", rotate: 2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function Marquee({ items, reduced }: { items: string[]; reduced: boolean }) {
  const seq = [...items, ...items];
  return (
    <div
      className={cn(styles.mono, "mt-16 overflow-hidden border-y py-4", reduced && styles.marqueePaused)}
      style={{ borderColor: "var(--line)" }}
    >
      <div className={styles.marqueeTrack}>
        {seq.map((item, i) => (
          <span key={i} className="flex items-center text-[length:var(--fs-100)] uppercase tracking-[0.28em]">
            <span style={{ color: i % 2 ? "var(--accent)" : "var(--ink)" }} className="mx-6">{item}</span>
            <span style={{ color: "var(--ink-muted)" }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MetaRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-baseline justify-between gap-4 px-5 py-4" style={{ background: "var(--bg)" }}>
      <span className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.2em]")} style={{ color: "var(--ink-muted)" }}>
        {label}
      </span>
      <span className={cn(styles.archivo, "text-right text-[length:var(--fs-200)] font-medium")}>{value}</span>
    </div>
  );
  return href ? <a href={href} className="block transition-opacity hover:opacity-70">{inner}</a> : inner;
}

function Portfolio({ reduced, instagram, gallery }: { reduced: boolean; instagram?: string; gallery: string[] }) {
  return (
    <section id="portofoliu" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32" style={{ background: "var(--surface)", color: "var(--bg)" }}>
      <div className="container-x mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <div className={cn(styles.mono, "flex items-center gap-3 text-[length:var(--fs-100)] uppercase tracking-[0.28em]")}>
              <span style={{ color: "var(--accent)" }}>—03</span>
              <span className="h-px w-8" style={{ background: "var(--accent)" }} />
              <span style={{ color: "rgb(255 255 255 / 0.5)" }}>Portofoliu</span>
            </div>
            <h2 className={cn(styles.display, "mt-6 text-[length:var(--fs-800)]")} style={{ color: "var(--bg)" }}>
              Lucrări
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={cn(styles.archivo, "max-w-sm text-[length:var(--fs-200)] leading-relaxed")} style={{ color: "rgb(255 255 255 / 0.6)" }}>
              Color, balayage și coafat — câteva lucrări din salon. Galeria completă, în timp real, e pe Instagram.
            </p>
          </Reveal>
        </div>

        {/* real work — editorial grid */}
        <div className="mt-14 grid grid-cols-2 gap-px sm:grid-cols-3" style={{ background: "rgb(255 255 255 / 0.1)" }}>
          {gallery.map((src, i) => (
            <Reveal key={src} delay={Math.min(i * 0.06, 0.4)}>
              <figure
                className="group relative aspect-[3/4] overflow-hidden"
                style={{ background: "var(--surface)" }}
              >
                <Image
                  src={assetPath(src)}
                  alt={`Lucrare Andrei Canciu ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
                />
                <figcaption
                  className={cn(styles.mono, "absolute left-3 top-3 px-2 py-1 text-[length:var(--fs-100)] uppercase tracking-[0.2em]")}
                  style={{ background: "var(--ink)", color: "var(--bg)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            </Reveal>
          ))}
          {instagram && (
            <Reveal delay={Math.min(gallery.length * 0.06, 0.4)}>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-[3/4] flex-col justify-between p-6 transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                <span className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.22em]")}>Instagram</span>
                <span className={cn(styles.syne, "text-[length:var(--fs-500)] font-bold leading-tight")}>
                  Vezi toate<br />lucrările ↗
                </span>
              </a>
            </Reveal>
          )}
        </div>
      </div>

      {/* decorative outsized geometry in the corner */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 hidden opacity-[0.12] lg:block">
          <CutGeometry className="h-[36rem] w-auto" animate={false} accent="var(--bg)" />
        </div>
      )}
    </section>
  );
}

function Nav({
  brand,
  phoneHref,
}: {
  brand: ClientConfig["brand"];
  phoneHref: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-[200]">
      <div
        className="container-x mx-auto flex max-w-[1600px] items-center justify-between py-4"
        style={{
          background: "color-mix(in srgb, var(--bg) 82%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <a href="#top" className="flex items-center gap-3">
          <span className="relative block h-9 w-9 overflow-hidden rounded-full" style={{ background: "var(--ink)" }}>
            <Image
              src={assetPath(LOGO)}
              alt={brand.name}
              fill
              sizes="36px"
              className="object-contain p-1"
            />
          </span>
          <span className={cn(styles.syne, "text-[length:var(--fs-200)] font-bold uppercase tracking-[0.14em]")}>
            {brand.shortName ?? brand.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.18em] transition-opacity hover:opacity-60")}
              style={{ color: "var(--ink-muted)" }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={phoneHref}
            className={cn(styles.mono, "px-4 py-2 text-[length:var(--fs-100)] uppercase tracking-[0.18em]")}
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Programează
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.18em] md:hidden")}
          aria-expanded={open}
          aria-label="Meniu"
        >
          {open ? "Închide" : "Meniu"}
        </button>
      </div>

      {open && (
        <div className="container-x mx-auto max-w-[1600px] md:hidden">
          <nav
            className="flex flex-col gap-px"
            style={{ background: "var(--line)" }}
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={cn(styles.syne, "px-5 py-4 text-[length:var(--fs-400)] font-bold uppercase")}
                style={{ background: "var(--bg)" }}
              >
                {item.label}
              </a>
            ))}
            <a
              href={phoneHref}
              onClick={() => setOpen(false)}
              className={cn(styles.mono, "px-5 py-4 text-[length:var(--fs-200)] uppercase tracking-[0.18em]")}
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Programează →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer({
  config,
  phoneHref,
  social,
}: {
  config: ClientConfig;
  phoneHref: string;
  social: ClientConfig["social"];
}) {
  const { brand, contact } = config;
  const socials = [
    social.instagram && { label: "Instagram", href: social.instagram },
    social.facebook && { label: "Facebook", href: social.facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden pt-24" style={{ background: "var(--surface)", color: "var(--bg)" }}>
      <div className="container-x mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* big CTA */}
          <div className="lg:col-span-7">
            <p className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.28em]")} style={{ color: "var(--accent)" }}>
              Programări la telefon
            </p>
            <a
              href={phoneHref}
              className={cn(styles.display, "mt-5 block break-words text-[length:var(--fs-800)] transition-colors")}
              style={{ color: "var(--bg)" }}
            >
              {contact.phone}
            </a>
            <p className={cn(styles.archivo, "mt-6 max-w-md text-[length:var(--fs-200)] leading-relaxed")} style={{ color: "rgb(255 255 255 / 0.55)" }}>
              {brand.tagline}
            </p>
          </div>

          {/* logo panel + meta */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div className="relative ml-auto h-40 w-full max-w-xs overflow-hidden">
              {/* logo is white-on-black → sits perfectly on this dark panel */}
              <Image
                src={assetPath(LOGO)}
                alt={`${brand.name} — logo`}
                fill
                sizes="(max-width: 1024px) 80vw, 320px"
                className="object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-px" style={{ background: "rgb(255 255 255 / 0.12)" }}>
              <FooterCell label="Adresă" value={contact.address} />
              <FooterCell label="Program" value={contact.hours[0]?.hours ?? ""} sub={contact.hours[0]?.day} />
              {socials.map((s) => (
                <FooterCellLink key={s.label} label={s.label} href={s.href} />
              ))}
            </div>
          </div>
        </div>

        {/* colophon */}
        <div
          className={cn(styles.mono, "mt-20 flex flex-col gap-3 border-t py-8 text-[length:var(--fs-100)] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between")}
          style={{ borderColor: "rgb(255 255 255 / 0.14)", color: "rgb(255 255 255 / 0.45)" }}
        >
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <span style={{ color: "var(--accent)" }}>{brand.serial ?? "Sibiu · RO"}</span>
          <span>Tunsori geometrice · Sibiu</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-5 py-5" style={{ background: "var(--surface)" }}>
      <p className={cn(styles.mono, "text-[length:var(--fs-100)] uppercase tracking-[0.2em]")} style={{ color: "rgb(255 255 255 / 0.4)" }}>
        {label}
      </p>
      <p className={cn(styles.archivo, "mt-2 text-[length:var(--fs-200)] font-medium")} style={{ color: "var(--bg)" }}>
        {value}
      </p>
      {sub && <p className={cn(styles.mono, "mt-1 text-[length:var(--fs-100)] uppercase")} style={{ color: "rgb(255 255 255 / 0.4)" }}>{sub}</p>}
    </div>
  );
}

function FooterCellLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between px-5 py-5 transition-colors"
      style={{ background: "var(--surface)" }}
    >
      <span className={cn(styles.archivo, "text-[length:var(--fs-200)] font-medium")} style={{ color: "var(--bg)" }}>
        {label}
      </span>
      <span style={{ color: "var(--accent)" }}>↗</span>
    </a>
  );
}
