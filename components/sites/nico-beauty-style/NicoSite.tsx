"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { ClientConfig, Service } from "@/lib/config";
import { assetPath } from "@/lib/assetPath";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./nico.module.css";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const ease = [0.16, 1, 0.3, 1] as const;

function Star({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6.1 21.3l1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
    </svg>
  );
}

function Stars({ size = 13, value = 5 }: { size?: number; value?: number }) {
  return (
    <span className={s.starRow} aria-label={`${value} din 5 stele`}>
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
  y = 26,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const reduced = useReducedMotion();
  const motionProps = {
    className,
    initial: reduced ? false : { opacity: 0, y },
    animate: reduced ? { opacity: 1, y: 0 } : undefined,
    whileInView: reduced ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: reduced
      ? { duration: 0 }
      : { duration: 0.8, delay, ease },
  };
  if (as === "article") return <motion.article {...motionProps}>{children}</motion.article>;
  if (as === "section") return <motion.section {...motionProps}>{children}</motion.section>;
  if (as === "li") return <motion.li {...motionProps}>{children}</motion.li>;
  return <motion.div {...motionProps}>{children}</motion.div>;
}

/** Rotating "award seal" — the brand's signature motif. */
function Seal({ className }: { className?: string }) {
  return (
    <div className={`${s.seal} ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 200 200" className={s.sealSvg}>
        <defs>
          <path
            id="nico-seal-path"
            d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
          />
        </defs>
        <text className={s.sealText}>
          <textPath href="#nico-seal-path" startOffset="0">
            FIRMA DE AUR · 2022—2026 · ȘOIMII FRUMUSEȚII · SIBIU ·
          </textPath>
        </text>
      </svg>
      <span className={s.sealCore}>
        <span className={s.sealScore}>4,8</span>
        <Stars size={9} />
        <span className={s.sealLabel}>Google</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Service grouping                                                    */
/* ------------------------------------------------------------------ */

const GROUP_DEFS: { title: string; sub: string; ids: string[] }[] = [
  {
    title: "Pentru ea",
    sub: "Tuns · coafat · eveniment",
    ids: ["tuns-dama", "spalat-coafat", "coafura-eveniment"],
  },
  {
    title: "Culoare & blond",
    sub: "Vopsit · șuvițe · balayage",
    ids: ["vopsit", "suvite"],
  },
  {
    title: "Pentru el & copii",
    sub: "Tuns · barbă",
    ids: ["tuns-barbat", "tuns-barba", "barba", "tuns-copii"],
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
    return { title: g.title, sub: g.sub, items };
  }).filter((g) => g.items.length > 0);

  const leftovers = services.filter((sv) => !used.has(sv.id));
  if (leftovers.length > 0) {
    groups.push({ title: "Și altele", sub: "", items: leftovers });
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "#filozofie", label: "Filozofie" },
  { href: "#reputatie", label: "Reputație" },
  { href: "#servicii", label: "Servicii" },
  { href: "#contact", label: "Contact" },
];

function wordmarkParts(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  return words;
}

function Nav({ config }: { config: ClientConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bookingUrl = config.contact.bookingUrl;

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
  const words = wordmarkParts(name);

  return (
    <>
      <header className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
        <div className="container-x">
          <div className={s.navInner}>
            <a href="#top" className={s.wordmark} aria-label={name}>
              {words.map((w, i) => (
                <span key={i} className={i === 1 ? s.wordmarkAccent : undefined}>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </a>

            <nav className={s.navLinks} aria-label="Navigare principală">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className={s.navLink}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div className={s.navRight}>
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.cta}
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
                Programează online
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — asymmetric editorial                                         */
/* ------------------------------------------------------------------ */

function Hero({ config }: { config: ClientConfig }) {
  const hero = config.hero;
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-10%"]);
  const sealY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "32%"]);

  const tl = hero?.titleLines;
  const lines = tl ? [tl[0], tl[1]] : ["NICO", "BEAUTY"];
  const heroImg = hero?.backdropUrl ?? config.gallery[0] ?? "";
  const bookingUrl = config.contact.bookingUrl;
  const phoneTel = `tel:${config.contact.phone.replace(/\s+/g, "")}`;

  return (
    <section className={s.hero} id="top" ref={wrapRef}>
      <div className="container-x">
        <div className={s.heroGrid}>
          {/* left — type */}
          <div className={s.heroLeft}>
            <motion.span
              className={s.heroEyebrow}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              {hero?.eyebrow ?? "Coafor unisex · Sibiu"}
            </motion.span>

            <motion.h1
              className={s.heroTitle}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease }}
            >
              <span className={s.heroLine}>{lines[0]}</span>
              <span className={`${s.heroLine} ${s.heroLineAccent}`}>{lines[1]}</span>
              <span className={s.heroLineSmall}>Style</span>
            </motion.h1>

            <motion.p
              className={s.heroLede}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              {config.brand.tagline}
            </motion.p>

            <motion.div
              className={s.heroActions}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
            >
              {bookingUrl ? (
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={s.cta}>
                  Programează online
                </a>
              ) : (
                <a href={phoneTel} className={s.cta}>
                  Sună pentru programare
                </a>
              )}
              <a href="#servicii" className={`${s.cta} ${s.ctaGhost}`}>
                Vezi serviciile
              </a>
            </motion.div>

            <motion.div
              className={s.heroProof}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              <Stars size={14} />
              <span>
                <b>4,8</b> din ~150 recenzii Google · „Firma de Aur” 5 ani la rând
              </span>
            </motion.div>
          </div>

          {/* right — framed photo + rotating seal */}
          <div className={s.heroRight}>
            <motion.div
              className={s.heroFrame}
              style={{ y: photoY }}
              initial={reduced ? false : { opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease }}
            >
              {heroImg ? (
                <Image
                  src={assetPath(heroImg)}
                  alt={`Interiorul salonului ${config.brand.name} din Sibiu`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 42vw"
                  className={s.heroPhoto}
                />
              ) : (
                <span className={s.heroPlaceholder}>Foto salon — în curând</span>
              )}
              <span className={s.heroFrameTag}>Salonul · Strada Șoimului</span>
            </motion.div>

            <motion.div style={{ y: sealY }} className={s.heroSealWrap}>
              <Seal />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
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
/* Manifesto                                                           */
/* ------------------------------------------------------------------ */

function Manifesto({ config }: { config: ClientConfig }) {
  const panels = config.manifesto.panels;
  return (
    <section className={s.section} id="filozofie">
      <div className="container-x">
        <div className={s.sectionHead}>
          <span className={s.sectionIndex}>01 — Filozofie</span>
          <h2 className={s.sectionTitle}>
            Un salon de cartier în care{" "}
            <span className={s.serifItalic}>vine toată familia</span>
          </h2>
        </div>

        <ol className={s.panelList}>
          {panels.map((p, i) => (
            <Reveal key={p.eyebrow} delay={i * 0.08} as="li" className={s.panel}>
              <span className={s.panelNum}>{p.eyebrow}</span>
              <div className={s.panelBodyWrap}>
                <h3 className={s.panelTitle}>{p.title}</h3>
                <p className={s.panelBody}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reputație — signature section                                       */
/* ------------------------------------------------------------------ */

const AWARD_YEARS = ["2022", "2023", "2024", "2025", "2026"];

function Reputatie() {
  return (
    <section className={s.reputatie} id="reputatie">
      <div className="container-x">
        <div className={s.repInner}>
          <Reveal className={s.repLeft}>
            <span className={s.sectionIndex} style={{ color: "var(--bg)", opacity: 0.6 }}>
              02 — Reputație
            </span>
            <div className={s.repScoreRow}>
              <span className={s.repScore}>4,8</span>
              <div className={s.repScoreSide}>
                <Stars size={20} />
                <span className={s.repScoreMeta}>din ~150 de recenzii pe Google</span>
              </div>
            </div>
            <p className={s.repLede}>
              5,0 pe Facebook · sute de clienți din Sibiu care se întorc pentru
              același rezultat constant. Reputația e deja a ta — hai s-o pui unde
              te caută lumea.
            </p>
          </Reveal>

          <Reveal delay={0.12} className={s.repRight}>
            <span className={s.repAwardsTitle}>„Firma de Aur” — premiat în fiecare an</span>
            <div className={s.repAwards}>
              {AWARD_YEARS.map((y) => (
                <span key={y} className={s.repAward}>
                  <span className={s.repAwardStar}>
                    <Star size={14} />
                  </span>
                  <span className={s.repAwardYear}>{y}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Servicii — catalog de tarife                                        */
/* ------------------------------------------------------------------ */

function Services({ config }: { config: ClientConfig }) {
  const groups = groupServices(config.services);
  const bookingUrl = config.contact.bookingUrl;

  return (
    <section className={s.section} id="servicii" style={{ background: "var(--surface)" }}>
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>03 — Servicii</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.6rem" }}>
              Catalog de <span className={s.serifItalic}>tarife</span>
            </h2>
          </div>
          <p className={s.sectionLede}>
            Prețurile sunt orientative — variază după lungime și complexitate. La
            programare îți dăm estimarea exactă.
          </p>
        </div>

        <div className={s.menuGrid}>
          {groups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.06}>
              <div className={s.menuGroup}>
                <div className={s.menuGroupHead}>
                  <span className={s.menuGroupTitle}>{g.title}</span>
                  {g.sub && <span className={s.menuGroupSub}>{g.sub}</span>}
                </div>
                <ul className={s.menuList}>
                  {g.items.map((sv) => (
                    <li className={s.menuItem} key={sv.id}>
                      <div className={s.menuItemTop}>
                        <span className={s.menuName}>{sv.name}</span>
                        <span className={s.menuDots} aria-hidden />
                        <span className={s.menuPrice}>{sv.price} lei</span>
                      </div>
                      <div className={s.menuItemBottom}>
                        <span className={s.menuMeta}>{sv.duration}</span>
                        {sv.description && <span className={s.menuDesc}>{sv.description}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {bookingUrl && (
          <Reveal delay={0.1}>
            <div className={s.menuCta}>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={s.cta}>
                Programează online
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery (renders only when populated)                               */
/* ------------------------------------------------------------------ */

function Gallery({ config }: { config: ClientConfig }) {
  if (config.gallery.length === 0) return null;
  return (
    <section className={s.section} id="galerie">
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>04 — Galerie</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.6rem" }}>
              Lucrări <span className={s.serifItalic}>reale</span>
            </h2>
          </div>
        </div>
        <div className={s.galleryCols}>
          {config.gallery.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 0.06} className={s.galleryItem}>
              <Image
                src={assetPath(src)}
                alt={`Lucrare ${config.brand.name}`}
                width={768}
                height={1024}
                sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw"
                className={s.galleryImg}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Team (renders only when populated)                                  */
/* ------------------------------------------------------------------ */

function Team({ config }: { config: ClientConfig }) {
  if (config.team.length === 0) return null;
  return (
    <section className={s.section} id="echipa" style={{ background: "var(--surface)" }}>
      <div className="container-x">
        <div className={s.sectionHead}>
          <div>
            <span className={s.sectionIndex}>05 — Echipă</span>
            <h2 className={s.sectionTitle} style={{ marginTop: "0.6rem" }}>
              Mâinile din spatele <span className={s.serifItalic}>fiecărui look</span>
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
/* Location + hours                                                    */
/* ------------------------------------------------------------------ */

const TODAY_INDEX = new Date().getDay(); // 0 = Sun … 6 = Sat
const HOURS_ORDER = [6, 0, 1, 2, 3, 4, 5]; // config.hours is Mon..Sun

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
            <h2 className={s.sectionTitle} style={{ marginTop: "0.6rem" }}>
              {geo?.mapHeadlineLead ?? "Pe Strada Șoimului, în"}{" "}
              <span className={s.serifItalic}>{geo?.mapHeadlineAccent ?? "Sibiu"}</span>
            </h2>
          </div>
          {geo?.mapSubtitle && <p className={s.sectionLede}>{geo.mapSubtitle}</p>}
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
                <a className={s.contactValue} href={`tel:${config.contact.phone.replace(/\s+/g, "")}`}>
                  {config.contact.phone}
                </a>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <span className={s.contactLabel} style={{ display: "block", marginBottom: "0.6rem" }}>
                  Program
                </span>
                <div className={s.hoursTable}>
                  {config.contact.hours.map((h, i) => {
                    const isToday = i === todayConfigIndex;
                    const closed = /închis/i.test(h.hours);
                    return (
                      <div className={s.hoursRow} key={h.day}>
                        <span className={`${s.hoursDay} ${isToday ? s.hoursToday : ""}`}>
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
    <footer className={s.footer}>
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
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={s.cta}>
                  Programează online
                </a>
              )}
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className={`${s.cta} ${s.ctaGhost}`}>
                Sună · {phone}
              </a>
            </div>
          </Reveal>
        </div>

        <div className={s.footerBottom}>
          <div className={s.footerCol}>
            <span className={s.footerName}>{name}</span>
            <span className={s.footerColophon}>{config.contact.address}</span>
            <span className={s.footerColophon}>{config.brand.serial ?? `N° NBS / ${year}`}</span>
          </div>

          <div className={s.footerColRight}>
            <div className={s.footerSocial}>
              {config.social.facebook && (
                <a className={s.footerSocialLink} href={config.social.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {config.social.tiktok && (
                <a className={s.footerSocialLink} href={config.social.tiktok} target="_blank" rel="noopener noreferrer">
                  TikTok
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

export function NicoSite({ config }: { config: ClientConfig }) {
  const marquee = config.hero?.marquee ?? [];
  return (
    <main className={s.page}>
      <Nav config={config} />
      <Hero config={config} />
      <Marquee items={marquee} />
      <Manifesto config={config} />
      <Reputatie />
      <Services config={config} />
      <Gallery config={config} />
      <Team config={config} />
      <Location config={config} />
      <Footer config={config} />
    </main>
  );
}
