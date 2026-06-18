"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { ClientConfig, Service } from "@/lib/config";
import { assetPath } from "@/lib/assetPath";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./mrmrs.module.css";

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function Star({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6.1 21.3l1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
    </svg>
  );
}

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className={s.starRow} aria-label="5 din 5 stele">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} />
      ))}
    </span>
  );
}

/** Fade + rise on scroll into view. Respects reduced motion. */
function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  const reduced = useReducedMotion();

  // Reduced motion: force the final visible state via `animate` (reactive to the
  // post-mount reduced-motion flip). Normal motion reveals via `whileInView`.
  const motionProps = {
    className,
    initial: reduced ? false : { opacity: 0, y },
    animate: reduced ? { opacity: 1, y: 0 } : undefined,
    whileInView: reduced ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: reduced
      ? { duration: 0 }
      : { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (as === "article") return <motion.article {...motionProps}>{children}</motion.article>;
  if (as === "section") return <motion.section {...motionProps}>{children}</motion.section>;
  return <motion.div {...motionProps}>{children}</motion.div>;
}

/* ------------------------------------------------------------------ */
/* Service grouping — keeps the price menu tasteful                    */
/* ------------------------------------------------------------------ */

const GROUP_DEFS: { title: string; ids: string[] }[] = [
  {
    title: "Tuns & Coafat",
    ids: ["tuns-dama-scurt", "tuns-dama-mediu", "tuns-dama-lung", "spalat-coafat"],
  },
  {
    title: "Color & Blond",
    ids: ["balayage", "airtouch", "suvite", "decolorare-color"],
  },
  {
    title: "Eveniment & Pentru El",
    ids: ["coafura-eveniment", "tuns-barbat", "tuns-copii"],
  },
];

function groupServices(services: Service[]) {
  const byId = new Map(services.map((sv) => [sv.id, sv]));
  const used = new Set<string>();
  const groups = GROUP_DEFS.map((g) => {
    const items = g.ids
      .map((id) => byId.get(id))
      .filter((sv): sv is Service => Boolean(sv));
    items.forEach((sv) => used.add(sv.id));
    return { title: g.title, items };
  }).filter((g) => g.items.length > 0);

  // Any service not matched by the curated map still gets shown.
  const leftovers = services.filter((sv) => !used.has(sv.id));
  if (leftovers.length > 0) {
    groups.push({ title: "Și altele", items: leftovers });
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "#filozofie", label: "Filozofie" },
  { href: "#servicii", label: "Servicii" },
  { href: "#echipa", label: "Echipă" },
  { href: "#galerie", label: "Galerie" },
  { href: "#contact", label: "Contact" },
];

function Nav({
  config,
  bookingUrl,
}: {
  config: ClientConfig;
  bookingUrl?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const name = config.brand.shortName ?? config.brand.name;
  // "MR&MRS STYLE" → render the ampersand in accent
  const parts = name.split("&");

  return (
    <>
      <header className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
        <div
          className="container-x"
          style={{ paddingBlock: scrolled ? "0.85rem" : "1.4rem" }}
        >
          <div className={s.navInner}>
            <a href="#top" className={s.wordmark} aria-label={name}>
              <span className={s.wordmarkMain}>
                {parts.length === 2 ? (
                  <>
                    {parts[0]}
                    <span className={s.wordmarkAmp}>&amp;</span>
                    {parts[1]}
                  </>
                ) : (
                  name
                )}
              </span>
            </a>

            <nav className={s.navLinks} aria-label="Navigare principală">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className={s.navLink}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.cta}
                  style={{ display: "inline-flex" }}
                >
                  Programează
                </a>
              )}
              <button
                type="button"
                className={`${s.burger} ${open ? s.burgerOpen : ""}`}
                aria-label={open ? "Închide meniul" : "Deschide meniul"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span className={s.burgerLine} />
                <span className={s.burgerLine} />
                <span className={s.burgerLine} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className={s.mobileSheet}>
          <div className="container-x" style={{ width: "100%" }}>
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className={s.mobileLink}
                onClick={() => setOpen(false)}
              >
                {l.label}
                <span>0{i + 1}</span>
              </a>
            ))}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={s.cta}
                style={{ marginTop: "2rem", alignSelf: "flex-start" }}
              >
                Programează pe MERO
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — editorial "Mrs / Mr" split                                   */
/* ------------------------------------------------------------------ */

function Hero({ config }: { config: ClientConfig }) {
  const hero = config.hero;
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const yMrs = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-12%"]);
  const yMr = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);

  const titleA = hero?.titleLines?.[0] ?? "MR&MRS";
  const titleB = hero?.titleLines?.[1] ?? "STYLE";
  // "MR&MRS" → ["MR", "MRS"] so we can set the ampersand in accent between them.
  const ampParts = titleA.split("&");
  const mrWord = (ampParts[0] ?? titleA).trim();
  const mrsWord = ampParts.length > 1 ? (ampParts[1] ?? "").trim() : "";

  // Photos: hero backdrop (the "Mrs" balayage) + a men's cut (the "Mr").
  const mrsImg = hero?.backdropUrl ?? config.gallery[0] ?? "";
  const mrImg = config.hero?.backdropUrl2 ?? config.gallery[5] ?? config.gallery[0] ?? "";

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className={s.hero} id="top" ref={wrapRef}>
      <div className="container-x" style={{ width: "100%" }}>
        {/* top meta strip */}
        <div className={s.heroTopMeta}>
          <span className={s.kicker}>{hero?.eyebrow ?? "Salon de înfrumusețare"}</span>
          <span className={s.kicker}>{hero?.coordsLabel}</span>
        </div>

        {/* main grid: Mrs photo · type · Mr photo */}
        <div className={s.heroGrid}>
          {/* Mrs */}
          <motion.div
            className={s.heroImageWrap}
            style={{ y: yMrs }}
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease }}
          >
            {mrsImg && (
              <Image
                src={assetPath(mrsImg)}
                alt="Balayage la MR&MRS STYLE, în fața salonului din Sibiu"
                width={900}
                height={1200}
                priority
                sizes="(max-width: 880px) 100vw, 33vw"
                className={`${s.heroImg} ${s.heroImgTall}`}
                style={{ width: "100%", height: "100%" }}
              />
            )}
            <span className={s.heroTag}>Mrs · color</span>
          </motion.div>

          {/* type column */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <motion.h1
              className={s.heroDisplay}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease }}
            >
              <span className={s.heroLine}>
                {mrWord}
                <span className={s.heroAmpInline}>&amp;</span>
                {mrsWord}
              </span>
              <span className={`${s.heroLine} ${s.heroLineThin}`}>{titleB}</span>
            </motion.h1>
            <motion.div
              style={{ textAlign: "center", marginTop: "1.25rem" }}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className={s.kicker}>{hero?.localityLine}</span>
            </motion.div>
          </div>

          {/* Mr */}
          <motion.div
            className={s.heroImageWrap}
            style={{ y: yMr }}
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease }}
          >
            <Image
              src={assetPath(mrImg)}
              alt="Tuns bărbat cu fade la MR&MRS STYLE"
              width={900}
              height={1200}
              priority
              sizes="(max-width: 880px) 100vw, 33vw"
              className={`${s.heroImg} ${s.heroImgTall}`}
              style={{ width: "100%", height: "100%" }}
            />
            <span className={s.heroTag}>Mr · cut</span>
          </motion.div>
        </div>

        {/* bottom: lede + rating + scroll cue */}
        <motion.div
          className={s.heroBottom}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease }}
        >
          <p className={s.heroLede}>{config.brand.tagline}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", alignItems: "flex-start" }}>
            <span className={s.stars}>
              <Stars size={14} />
              <span className={s.kicker} style={{ letterSpacing: "0.18em" }}>
                5.0 · 48 evaluări
              </span>
            </span>
            <span className={s.scrollCue}>
              <span className={s.scrollLine} />
              Derulează
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee ribbon                                                      */
/* ------------------------------------------------------------------ */

function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className={s.marquee} aria-hidden>
      <div className={s.marqueeTrack}>
        {loop.map((it, i) => (
          <span key={i} className={s.marqueeItem}>
            {it}
            <span className={s.marqueeDot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Manifesto — ea & el                                                 */
/* ------------------------------------------------------------------ */

function Manifesto({ config }: { config: ClientConfig }) {
  const panels = config.manifesto.panels;
  // pick a feminine + a masculine result for the paired cards
  const mrsCard = config.hero?.backdropUrl ?? config.gallery[0] ?? "";
  const mrCard = config.hero?.backdropUrl2 ?? config.gallery[5] ?? config.gallery[0] ?? "";

  return (
    <section className={s.section} id="filozofie">
      <div className="container-x">
        <div className={s.sectionHead}>
          <span className={s.sectionIndex}>01 — Filozofie</span>
          <span className={s.kicker}>Pentru ea &amp; pentru el</span>
        </div>

        <div className={s.duo}>
          <Reveal>
            <div className={s.duoPair}>
              <div className={s.duoCard}>
                {mrsCard && (
                  <Image
                    src={assetPath(mrsCard)}
                    alt="Lucrare de color pentru ea"
                    fill
                    sizes="(max-width: 860px) 50vw, 25vw"
                    className={s.duoCardImg}
                  />
                )}
                <div className={s.duoCardLabel}>
                  <b>Ea</b>
                  <span>color · styling</span>
                </div>
              </div>
              <div className={s.duoCard}>
                <Image
                  src={assetPath(mrCard)}
                  alt="Tuns pentru el"
                  fill
                  sizes="(max-width: 860px) 50vw, 25vw"
                  className={s.duoCardImg}
                />
                <div className={s.duoCardLabel}>
                  <b>El</b>
                  <span>tuns · fade</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className={s.panels}>
            {panels.map((p, i) => (
              <Reveal key={p.eyebrow} delay={i * 0.08} className={s.panel} as="article">
                <span className={s.panelNum}>{p.eyebrow}</span>
                <div>
                  <h3 className={s.panelTitle}>{p.title}</h3>
                  <p className={s.panelBody}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services price menu                                                 */
/* ------------------------------------------------------------------ */

function priceLabel(price: number): string {
  return `${price} lei`;
}

function Services({ config }: { config: ClientConfig }) {
  const groups = groupServices(config.services);
  const bookingUrl = config.contact.bookingUrl;

  return (
    <section className={s.section} id="servicii" style={{ background: "var(--surface)" }}>
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>02 — Servicii</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.75rem" }}>
              Lista de <span className={s.serif} style={{ fontStyle: "italic", color: "var(--accent)" }}>prețuri</span>
            </h2>
          </div>
          <p className={s.panelBody} style={{ maxWidth: "32ch" }}>
            Prețurile variază în funcție de lungime și complexitate — la programare
            îți dăm estimarea exactă.
          </p>
        </div>

        <div className={s.menuGrid}>
          {groups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.06}>
              <div>
                <div className={s.menuGroupLabel}>
                  <span className={s.menuGroupTitle}>{g.title}</span>
                  <span className={s.menuGroupCount}>
                    {String(g.items.length).padStart(2, "0")} servicii
                  </span>
                </div>
                {g.items.map((sv) => (
                  <div className={s.menuItem} key={sv.id}>
                    <span className={s.menuName}>{sv.name}</span>
                    <span className={s.menuPrice}>
                      {priceLabel(sv.price)}
                    </span>
                    {sv.description && <p className={s.menuDesc}>{sv.description}</p>}
                    <span className={s.menuMeta}>{sv.duration}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {bookingUrl && (
          <Reveal delay={0.1}>
            <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)", display: "flex", justifyContent: "center" }}>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={s.cta}
              >
                Programează online pe MERO
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

function Team({ config }: { config: ClientConfig }) {
  if (config.team.length === 0) return null;
  return (
    <section className={s.section} id="echipa">
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>03 — Echipă</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.75rem" }}>
              Mâinile din spatele
              <br />
              <span className={s.serif} style={{ fontStyle: "italic", color: "var(--accent)" }}>
                fiecărui look
              </span>
            </h2>
          </div>
        </div>

        <div className={s.teamGrid}>
          {config.team.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.1}>
              <article className={s.teamCard}>
                <div className={s.teamPortrait}>
                  <Image
                    src={assetPath(m.portrait)}
                    alt={`${m.name} — ${m.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className={s.teamPortraitImg}
                  />
                </div>
                <span className={s.teamRole}>{m.role}</span>
                <h3 className={s.teamName}>{m.name}</h3>
                {m.bio && <p className={s.teamBio}>{m.bio}</p>}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery — editorial masonry                                         */
/* ------------------------------------------------------------------ */

const GALLERY_TAGS = [
  "Balayage",
  "Style wall",
  "Mahon",
  "Bob",
  "Silver",
  "Tuns · El",
  "Cupru",
  "Vivid",
  "Argintiu",
  "Style wall",
  "Ash · Moss",
  "Rose copper",
  "Blond rece",
  "Rose gold",
  "Cireșă",
];

function Gallery({ config }: { config: ClientConfig }) {
  if (config.gallery.length === 0) return null;
  return (
    <section className={s.section} id="galerie" style={{ background: "var(--surface)" }}>
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>04 — Galerie</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.75rem" }}>
              Lucrări <span className={s.serif} style={{ fontStyle: "italic", color: "var(--accent)" }}>reale</span>
            </h2>
          </div>
          <p className={s.panelBody} style={{ maxWidth: "30ch" }}>
            Color, blond, styling și tuns — fotografiate la noi în salon, pe Strada
            Alpinismului.
          </p>
        </div>

        <div className={s.galleryCols}>
          {config.gallery.map((src, i) => {
            const tag = GALLERY_TAGS[i] ?? "MR&MRS STYLE";
            return (
              <Reveal key={src} delay={(i % 3) * 0.06} className={s.galleryItem} as="div">
                <Image
                  src={assetPath(src)}
                  alt={`Lucrare MR&MRS STYLE — ${tag}`}
                  width={768}
                  height={1024}
                  sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  className={s.galleryImg}
                />
                <span className={s.galleryOverlay}>
                  <span>{tag}</span>
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

function Reviews({ config }: { config: ClientConfig }) {
  if (config.reviews.length === 0) return null;
  return (
    <section className={s.section} id="recenzii">
      <div className="container-x">
        <Reveal>
          <div className={s.reviewsHead}>
            <span className={s.sectionIndex}>05 — Recenzii</span>
            <div className={s.bigStars}>
              <span className={s.bigScore}>5.0</span>
              <Stars size={26} />
            </div>
            <p className={s.kicker}>48 de evaluări pe MERO · 100% recomandă</p>
          </div>
        </Reveal>

        <div className={s.reviewsGrid}>
          {config.reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08} as="article" className={s.reviewCard}>
              <Stars size={13} />
              <p className={s.reviewQuote}>“{r.quote}”</p>
              <div className={s.reviewAuthorRow}>
                {r.photo && (
                  <span className={s.reviewAvatar}>
                    <Image
                      src={assetPath(r.photo)}
                      alt={r.author}
                      fill
                      sizes="44px"
                      className={s.reviewAvatarImg}
                    />
                  </span>
                )}
                <span style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span className={s.reviewAuthor}>{r.author}</span>
                  {r.source && <span className={s.reviewSource}>{r.source}</span>}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Location + hours                                                    */
/* ------------------------------------------------------------------ */

const TODAY_INDEX = new Date().getDay(); // 0 = Sun … 6 = Sat
// config hours are Mon..Sun → map JS getDay() to that order
const HOURS_ORDER = [6, 0, 1, 2, 3, 4, 5]; // index into config.hours for [Sun..Sat]

function Location({ config }: { config: ClientConfig }) {
  const [lng, lat] = config.contact.mapCenter;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ro`;
  const todayConfigIndex = HOURS_ORDER[TODAY_INDEX] ?? -1;
  const geo = config.geo;

  return (
    <section className={s.section} id="contact">
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>06 — Contact</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.75rem" }}>
              {geo?.mapHeadlineLead ?? "Pe Strada Alpinismului, în"}{" "}
              <span className={s.serif} style={{ fontStyle: "italic", color: "var(--accent)" }}>
                {geo?.mapHeadlineAccent ?? "Sibiu"}
              </span>
            </h2>
          </div>
        </div>

        <div className={s.locGrid}>
          <Reveal>
            <div>
              <div className={s.contactRow}>
                <span className={s.contactLabel}>Adresă</span>
                <a
                  className={s.contactValue}
                  href={`https://maps.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.contact.address}
                </a>
              </div>
              <div className={s.contactRow}>
                <span className={s.contactLabel}>Telefon</span>
                <a
                  className={s.contactValue}
                  href={`tel:${config.contact.phone.replace(/\s+/g, "")}`}
                >
                  {config.contact.phone}
                </a>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <span className={s.contactLabel} style={{ display: "block", marginBottom: "0.5rem" }}>
                  Program
                </span>
                <div className={s.hoursTable}>
                  {config.contact.hours.map((h, i) => {
                    const isToday = i === todayConfigIndex;
                    const closed = /închis/i.test(h.hours);
                    return (
                      <div className={s.hoursRow} key={h.day}>
                        <span
                          className={`${s.hoursDay} ${isToday ? s.hoursToday : ""}`}
                        >
                          {h.day}
                          {isToday && <span className={s.todayPill}>Azi</span>}
                        </span>
                        <span
                          className={`${s.hoursVal} ${closed ? s.hoursClosed : ""} ${
                            isToday ? s.hoursToday : ""
                          }`}
                        >
                          {h.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={s.mapFrame}>
              <iframe
                src={mapSrc}
                title={`Hartă — ${config.brand.name}, ${config.contact.address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer({ config }: { config: ClientConfig }) {
  const bookingUrl = config.contact.bookingUrl;
  const phone = config.contact.phone;
  const name = config.brand.shortName ?? config.brand.name;
  const year = new Date().getFullYear();

  return (
    <footer className={`${s.footer}`}>
      <div className="container-x">
        <div className={s.footerCTA}>
          <Reveal>
            <h2 className={s.footerHeadline}>
              Pentru ea <em>&amp;</em> pentru el.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={s.footerActions}>
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.cta}
                >
                  Programează pe MERO
                </a>
              )}
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className={`${s.cta} ${s.ctaGhost}`}>
                Sună-ne · {phone}
              </a>
            </div>
          </Reveal>
        </div>

        <div className={s.footerBottom}>
          <div className={s.footerCol}>
            <span className={s.wordmarkMain} style={{ fontSize: "1.3rem" }}>
              {name}
            </span>
            <span className={s.footerColophon}>{config.contact.address}</span>
            <span className={s.footerColophon}>
              {config.brand.serial ?? `N° M&M / ${year}`}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-end" }}>
            <div className={s.footerSocial}>
              {config.social.facebook && (
                <a
                  className={s.footerSocialLink}
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              )}
              {config.social.tiktok && (
                <a
                  className={s.footerSocialLink}
                  href={config.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              )}
              {config.instagram && (
                <a
                  className={s.footerSocialLink}
                  href={`https://instagram.com/${config.instagram.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
            </div>
            <span className={s.footerColophon}>
              © {year} {name} · Sibiu, RO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function MrMrsSite({ config }: { config: ClientConfig }) {
  const marquee = config.hero?.marquee ?? [];
  return (
    <main className={s.page}>
      <Nav config={config} bookingUrl={config.contact.bookingUrl} />
      <Hero config={config} />
      <Marquee items={marquee} />
      <Manifesto config={config} />
      <Services config={config} />
      <Team config={config} />
      <Gallery config={config} />
      <Reviews config={config} />
      <Location config={config} />
      <Footer config={config} />
    </main>
  );
}
