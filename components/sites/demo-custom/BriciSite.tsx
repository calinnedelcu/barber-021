"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ClientConfig } from "@/lib/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buildWhatsAppDeeplink } from "@/lib/whatsapp";
import { UI, EN_SERVICES, EN_REVIEWS, EN_MANIFESTO, EN_TEAM, EN_MARQUEE, type Lang } from "./copy";
import { BriciLogo } from "./BriciLogo";
import { HeroSwitcher, readInitialVariant } from "./HeroSwitcher";
import { heroState } from "./heroState";
import type { HeroVariant } from "./Hero3D";

// Tot ce e greu (three.js + R3F + drei) trăiește în chunk-ul ăsta lazy — restul
// site-ului rămâne ușor, iar buildurile celorlalți clienți nu cară 3D-ul.
// React.lazy (nu next/dynamic): se montează doar după ce `show3D` devine true
// pe client, deci nu ajunge niciodată în prerender.
const Hero3D = lazy(() => import("./Hero3D"));

type Service = ClientConfig["services"][number];
type Review = ClientConfig["reviews"][number];
type TeamMember = ClientConfig["team"][number];

const LANG_KEY = "brici-lang";

function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.hardwareConcurrency ?? 8) <= 3) return false;
  if ((nav.deviceMemory ?? 8) <= 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function BriciSite({ config }: { config: ClientConfig }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lang, setLang] = useState<Lang>("ro");
  const [variant, setVariant] = useState<HeroVariant>("lama");
  const [show3D, setShow3D] = useState(false);

  const t = UI[lang];
  const { brand, contact, services, reviews, team } = config;
  const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;
  const bookingHref = contact.bookingUrl ?? telHref;
  const whatsappHref = buildWhatsAppDeeplink({
    phone: contact.whatsapp,
    customMessage: lang === "en" ? "Hi! I'd like to book an appointment." : "Salut! Aș vrea o programare.",
  });
  const [lng, lat] = contact.mapCenter;
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=${lang}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // ── conținut bilingv (RO din JSON, EN din dicționar) ─────────────────────
  const svcName = (s: Service) => (lang === "en" ? EN_SERVICES[s.id]?.name ?? s.name : s.name);
  const svcDesc = (s: Service) =>
    lang === "en" ? EN_SERVICES[s.id]?.description ?? s.description : s.description;
  const revQuote = (r: Review) => (lang === "en" ? EN_REVIEWS[r.id] ?? r.quote : r.quote);
  const memberRole = (m: TeamMember) => (lang === "en" ? EN_TEAM[m.id]?.role ?? m.role : m.role);
  const memberBio = (m: TeamMember) => (lang === "en" ? EN_TEAM[m.id]?.bio ?? m.bio : m.bio);
  const marquee = lang === "en" ? EN_MARQUEE : config.hero?.marquee ?? [];
  const manifesto = config.manifesto.panels.map((p, i) =>
    lang === "en"
      ? { ...p, title: EN_MANIFESTO[i]?.title ?? p.title, body: EN_MANIFESTO[i]?.body ?? p.body }
      : p
  );

  // ── init: limbă + variantă hero din URL/localStorage; capabilitate 3D ────
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem(LANG_KEY);
    const initial = fromUrl ?? saved;
    if (initial === "en") setLang("en");
    setVariant(readInitialVariant());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    setShow3D(!reduced && canRun3D());
  }, [reduced]);

  const chooseLang = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem(LANG_KEY, l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState(null, "", url);
  };

  // ── coregrafia GSAP (încărcată dinamic; sare complet la reduced-motion) ──
  useEffect(() => {
    if (reduced) return;
    let killed = false;
    const cleanup: (() => void)[] = [];

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (killed || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const lenis = window.__lenis;
      const onLenis = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenis);
      cleanup.push(() => lenis?.off("scroll", onLenis));

      const ctx = gsap.context(() => {
        // intro hero — titlul pe caractere, restul în cascadă
        const title = rootRef.current?.querySelector("[data-hero-title]");
        if (title) {
          const split = new SplitText(title, { type: "chars" });
          gsap.from(split.chars, {
            yPercent: 115,
            stagger: 0.04,
            duration: 1.05,
            ease: "expo.out",
            delay: 0.2,
          });
        }
        gsap.from("[data-hero-fade] > *", {
          y: 26,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.45,
        });

        // scrub-ul hero: alimentează scena 3D + parallax pe DOM
        ScrollTrigger.create({
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            heroState.p = self.progress;
          },
        });
        gsap.to("[data-hero-fade]", {
          yPercent: -16,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });

        // titluri de secțiune — linii mascate
        (gsap.utils.toArray("[data-split]") as Element[]).forEach((el) => {
          const s = new SplitText(el, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 110,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // elemente cu reveal simplu
        (gsap.utils.toArray("[data-reveal]") as Element[]).forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.85,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        // banda marquee — buclă infinită
        gsap.to("[data-marquee-track]", { xPercent: -50, ease: "none", duration: 24, repeat: -1 });

        // galeria — două rânduri în parallax opus
        gsap.to('[data-gallery-row="1"]', {
          xPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: "[data-gallery]", start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          '[data-gallery-row="2"]',
          { xPercent: -12 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: "[data-gallery]", start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // bara de progres
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });

        // CTA-uri magnetice
        (gsap.utils.toArray("[data-magnetic]") as HTMLElement[]).forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanup.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
      }, rootRef);
      cleanup.push(() => ctx.revert());

      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      killed = true;
      cleanup.forEach((f) => f());
      heroState.p = 0;
    };
  }, [reduced, lang]);

  return (
    <div ref={rootRef} id="top" className="brici bg-[var(--bg)] text-[var(--ink)]">
      <style>{`
        .brici{font-family:var(--font-archivo),system-ui,sans-serif}
        .brici .bd{font-family:var(--font-bricolage),sans-serif;font-weight:800;letter-spacing:-0.015em;line-height:1.02}
        .brici .kicker{font-family:var(--font-jetbrains-mono),monospace;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.24em;color:var(--accent)}
        .brici .chrome{background:linear-gradient(178deg,#ffffff 8%,#cfccc4 38%,#76736c 62%,#403f43 86%);-webkit-background-clip:text;background-clip:text;color:transparent}
        .brici .btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;border-radius:6px;padding:.8rem 1.5rem;font-weight:700;font-size:.95rem;background:var(--accent);color:#0a0a0b;border:1px solid transparent;transition:background var(--dur-fast) var(--ease-default)}
        .brici .btn:hover{background:var(--accent-hot)}
        .brici .btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
        .brici .btn.ghost:hover{border-color:var(--ink-muted)}
        .brici .map-dark{filter:grayscale(1) invert(0.9) hue-rotate(180deg) contrast(0.86)}
        .brici .svc-row{transition:background var(--dur-fast) var(--ease-default),padding var(--dur-fast) var(--ease-default)}
        .brici .svc-row:hover{background:var(--surface);padding-left:1rem;padding-right:1rem}
      `}</style>

      {/* bara de progres */}
      <div
        data-progress
        aria-hidden
        className="fixed inset-x-0 top-0 z-[240] h-[2px] origin-left bg-[var(--accent)]"
        style={{ transform: "scaleX(0)" }}
      />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-[230] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" aria-label="BRICI — sus">
            <BriciLogo />
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[var(--ink-muted)] lg:flex">
            <a href="#manifest" className="transition-colors hover:text-[var(--ink)]">{t.nav.manifest}</a>
            <a href="#servicii" className="transition-colors hover:text-[var(--ink)]">{t.nav.servicii}</a>
            <a href="#galerie" className="transition-colors hover:text-[var(--ink)]">{t.nav.galerie}</a>
            <a href="#echipa" className="transition-colors hover:text-[var(--ink)]">{t.nav.echipa}</a>
            <a href="#contact" className="transition-colors hover:text-[var(--ink)]">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* comutator de limbă — modulul bilingv, inclus în Custom */}
            <div role="group" aria-label="Limbă" className="flex overflow-hidden rounded-[5px] border border-[var(--line)] text-xs font-bold">
              {(["ro", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => chooseLang(l)}
                  className="px-2.5 py-1.5 uppercase transition-colors"
                  style={lang === l ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--ink-muted)" }}
                >
                  {l}
                </button>
              ))}
            </div>
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn hidden !px-4 !py-2 text-sm sm:inline-flex">
              {t.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero 3D ──────────────────────────────────────────────────────── */}
        <section data-hero className="relative flex min-h-[100svh] flex-col overflow-hidden">
          {/* poster — vizibil instant și fallback-ul pentru reduced-motion/low-end */}
          <div aria-hidden className="absolute inset-0">
            {config.hero?.backdropUrl && (
              <Image
                src={config.hero.backdropUrl}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-[0.16]"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 38%, rgb(255 69 51 / 0.10), transparent 65%), linear-gradient(180deg, rgb(10 10 11 / 0.45), rgb(10 10 11 / 0.78) 78%, var(--bg))",
              }}
            />
          </div>

          {show3D && (
            <Suspense fallback={null}>
              <Hero3D variant={variant} />
            </Suspense>
          )}

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-28 pb-10">
            <div data-hero-fade>
              <p className="kicker">{t.hero.kicker}</p>
              <h1
                key={lang}
                data-hero-title
                className="bd chrome mt-4 overflow-hidden text-[clamp(5rem,21vw,15rem)] uppercase leading-[0.92]"
              >
                BRICI
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">{t.hero.sub}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a data-magnetic href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                  {t.hero.cta}
                </a>
                <a href="#servicii" className="btn ghost">
                  {t.hero.ctaGhost}
                </a>
              </div>
              <p className="mt-9 text-sm text-[var(--ink-muted)]">
                {contact.address} · {config.hero?.localityLine?.split("·")[2]?.trim() ?? "2026→"} ·{" "}
                <a href={telHref} className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)]">
                  {contact.phone}
                </a>
              </p>
            </div>
          </div>

          <p aria-hidden className="kicker relative z-10 mx-auto pb-5 !text-[var(--ink-muted)]">
            ↓ {t.hero.scroll}
          </p>
        </section>

        {/* ── Marquee ─────────────────────────────────────────────────────── */}
        {marquee.length > 0 && (
          <div className="overflow-hidden border-y border-[var(--line)] bg-[var(--surface)] py-3">
            <div data-marquee-track className="flex w-max gap-10 whitespace-nowrap">
              {[0, 1].map((copy) => (
                <span key={copy} aria-hidden={copy === 1} className="flex gap-10">
                  {marquee.map((tok) => (
                    <span key={tok} className="kicker !text-[var(--ink-muted)]">
                      {tok} <span className="px-3 !text-[var(--accent)]">◆</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Manifest ────────────────────────────────────────────────────── */}
        <section id="manifest" className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
          <p className="kicker">{t.manifest.kicker}</p>
          <h2 key={lang} data-split className="bd mt-4 max-w-3xl text-[length:var(--fs-700)]">
            {t.manifest.title}
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {manifesto.map((panel) => (
              <article key={panel.eyebrow} data-reveal>
                <p className="bd text-[2.6rem] text-[var(--accent)]">{panel.eyebrow}</p>
                <h3 className="bd mt-3 text-[1.35rem]">{panel.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">{panel.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Servicii ────────────────────────────────────────────────────── */}
        <section id="servicii" className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
            <p className="kicker">{t.services.kicker}</p>
            <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
              {t.services.title}
            </h2>
            <ul className="mt-12">
              {services.map((service, i) => (
                <li key={service.id} data-reveal>
                  <div className="svc-row flex items-baseline gap-5 border-b border-[var(--line)] py-5">
                    <span className="kicker !text-[var(--ink-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="bd text-[1.4rem] sm:text-[1.7rem]">{svcName(service)}</h3>
                      {svcDesc(service) && (
                        <p className="mt-1 text-sm text-[var(--ink-muted)]">{svcDesc(service)}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="bd text-[1.3rem] text-[var(--accent)]">{service.price} lei</p>
                      <p className="text-xs text-[var(--ink-muted)]">{service.duration}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-5" data-reveal>
              <a data-magnetic href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                {t.services.cta}
              </a>
              <p className="text-sm text-[var(--ink-muted)]">{t.services.note}</p>
            </div>
          </div>
        </section>

        {/* ── Galerie (parallax pe două rânduri) ──────────────────────────── */}
        <section id="galerie" data-gallery className="overflow-hidden py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-5">
            <p className="kicker">{t.gallery.kicker}</p>
            <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
              {t.gallery.title}
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {[1, 2].map((row) => (
              <div key={row} data-gallery-row={row} className="flex w-max gap-4 px-5">
                {config.gallery.slice(row === 1 ? 0 : 4, row === 1 ? 4 : 8).map((src, i) => (
                  <div
                    key={src}
                    className="relative h-[34vw] max-h-[330px] min-h-[180px] w-[46vw] max-w-[460px] shrink-0 overflow-hidden rounded-lg border border-[var(--line)]"
                  >
                    <Image
                      src={src}
                      alt={`${brand.name} — galerie ${row === 1 ? i + 1 : i + 5}`}
                      fill
                      sizes="46vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Echipa ──────────────────────────────────────────────────────── */}
        {team.length > 0 && (
          <section id="echipa" className="border-y border-[var(--line)] bg-[var(--surface)]">
            <div className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
              <p className="kicker">{t.team.kicker}</p>
              <h2 key={lang} data-split className="bd mt-4 max-w-2xl text-[length:var(--fs-700)]">
                {t.team.title}
              </h2>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {team.map((member) => (
                  <article key={member.id} data-reveal className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--line)]">
                      <Image
                        src={member.portrait}
                        alt={member.name}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <h3 className="bd mt-4 text-[1.3rem]">{member.name}</h3>
                    <p className="kicker mt-1 !tracking-[0.18em]">{memberRole(member)}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{memberBio(member)}</p>
                  </article>
                ))}
              </div>
              <div className="mt-10" data-reveal>
                <Link href="/povestea" className="btn ghost">
                  {t.team.more} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Recenzii ────────────────────────────────────────────────────── */}
        {reviews.length > 0 && (
          <section id="recenzii" className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">{t.reviews.kicker}</p>
                <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
                  {t.reviews.title}
                </h2>
              </div>
              <p data-reveal className="kicker rounded-full border border-[var(--line)] px-4 py-2">
                ★★★★★ {t.reviews.badge}
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <figure key={review.id} data-reveal className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-7">
                  <p aria-label="5 din 5" className="tracking-[0.3em] text-[var(--accent)]">★★★★★</p>
                  <blockquote className="bd mt-5 flex-1 text-[1.25rem] leading-snug">
                    „{revQuote(review)}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-[var(--ink-muted)]">
                    <span className="font-bold text-[var(--ink)]">{review.author}</span>
                    {review.source && <> · {review.source}</>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <section id="contact" className="border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2 lg:py-32">
            <div>
              <p className="kicker">{t.contact.kicker}</p>
              <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
                {t.contact.title}
              </h2>
              <p className="mt-8" data-reveal>
                <a href={telHref} className="bd text-[clamp(1.6rem,4.5vw,2.6rem)] transition-colors hover:text-[var(--accent)]">
                  {contact.phone}
                </a>
              </p>
              <p className="mt-3 text-[var(--ink-muted)]" data-reveal>
                {contact.address} ·{" "}
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--ink)]">
                  {t.contact.directions}
                </a>
              </p>
              <dl className="mt-8 max-w-sm space-y-2.5" data-reveal>
                {contact.hours.map((row) => (
                  <div key={row.day} className="flex justify-between gap-6 border-b border-[var(--line)] pb-2.5 text-sm">
                    <dt className="text-[var(--ink-muted)]">{row.day}</dt>
                    <dd className="font-semibold">{row.hours}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap gap-4" data-reveal>
                <a data-magnetic href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                  {t.contact.cta}
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn ghost">
                  {t.contact.whatsapp}
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-[var(--line)]" data-reveal>
              <iframe
                src={embedUrl}
                title={`${brand.name} — ${contact.address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-dark h-full min-h-[360px] w-full border-0"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-9 pb-20 text-sm text-[var(--ink-muted)] sm:flex-row sm:items-center">
          <BriciLogo size={22} />
          <Link href="/povestea" className="transition-colors hover:text-[var(--ink)]">
            {t.footer.story}
          </Link>
          <p className="max-w-sm">{t.footer.demo}</p>
        </div>
      </footer>

      <HeroSwitcher variant={variant} onChange={setVariant} />
    </div>
  );
}
