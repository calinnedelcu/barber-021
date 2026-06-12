"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ClientConfig } from "@/lib/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buildWhatsAppDeeplink } from "@/lib/whatsapp";
import { UI, EN_SERVICES, EN_REVIEWS, EN_MANIFESTO, EN_TEAM, EN_MARQUEE, type Lang } from "./copy";
import { BriciLogo } from "./BriciLogo";
import { BriciPreloader } from "./BriciPreloader";
import { BriciCursor } from "./BriciCursor";
import { heroState } from "./heroState";

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
  const introPlayed = useRef(false);
  const [lang, setLang] = useState<Lang>("ro");
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

  // ── init: limbă din URL/localStorage; capabilitate 3D ────────────────────
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem(LANG_KEY);
    if ((fromUrl ?? saved) === "en") setLang("en");
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

  // ── regia GSAP — fiecare secțiune e un moment; totul sare la reduced ─────
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

      const fine = window.matchMedia("(pointer: fine)").matches;
      const introDelay = introPlayed.current ? 0.1 : 2.45; // după tăietura preloader-ului
      introPlayed.current = true;

      const ctx = gsap.context((self) => {
        const root = rootRef.current;
        if (!root) return;

        /* ── HERO — titlul tăiat, linia verticală, scrub-ul lamei ─────────── */
        const title = root.querySelector("[data-hero-title]");
        if (title) {
          const split = new SplitText(title, { type: "chars" });
          gsap.from(split.chars, {
            yPercent: 115,
            stagger: 0.045,
            duration: 1.1,
            ease: "expo.out",
            delay: introDelay,
          });
        }
        gsap.from("[data-hero-fade] > *", {
          y: 26,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          delay: introDelay + 0.25,
        });
        gsap.fromTo(
          "[data-hero-line]",
          { scaleY: 0 },
          { scaleY: 1, duration: 1.2, ease: "expo.inOut", delay: introDelay - 0.15 }
        );

        ScrollTrigger.create({
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (s) => {
            heroState.p = s.progress;
          },
        });
        gsap.to("[data-hero-fade]", {
          yPercent: -16,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });

        /* ── titluri mascate + reveal-uri + linii-tăietură ─────────────────── */
        (gsap.utils.toArray("[data-split]") as Element[]).forEach((el) => {
          const s = new SplitText(el, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 110,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
        (gsap.utils.toArray("[data-reveal]") as Element[]).forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.85,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
        (gsap.utils.toArray("[data-slice]") as Element[]).forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "expo.inOut",
              scrollTrigger: { trigger: el, start: "top 92%" },
            }
          );
        });

        /* ── marquee infinit ───────────────────────────────────────────────── */
        gsap.to("[data-marquee-track]", { xPercent: -50, ease: "none", duration: 24, repeat: -1 });

        /* ── MANIFEST — bandă orizontală pinned ────────────────────────────── */
        const mTrack = root.querySelector<HTMLElement>("[data-h-track]");
        const mPin = root.querySelector<HTMLElement>("[data-manifest-pin]");
        if (mTrack && mPin) {
          const dist = () => mTrack.scrollWidth - window.innerWidth;
          gsap.to(mTrack, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: mPin,
              start: "top top",
              end: () => "+=" + dist() * 1.15,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          gsap.to("[data-h-progress]", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mPin,
              start: "top top",
              end: () => "+=" + dist() * 1.15,
              scrub: 0.6,
            },
          });
        }

        /* ── SERVICII — preview care urmărește cursorul ────────────────────── */
        if (fine) {
          const preview = root.querySelector<HTMLElement>("[data-svc-preview]");
          const list = root.querySelector<HTMLElement>("[data-svc-list]");
          if (preview && list) {
            const imgs = Array.from(preview.querySelectorAll<HTMLElement>("[data-svc-img]"));
            const px = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
            const py = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });
            const pr = gsap.quickTo(preview, "rotation", { duration: 0.6, ease: "power3" });
            let lastX = 0;
            const move = (e: PointerEvent) => {
              px(e.clientX + 28);
              py(e.clientY - 140);
              pr(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.55));
              lastX = e.clientX;
            };
            const show = () => gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" });
            const hide = () => gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "power3.in" });
            list.addEventListener("pointermove", move);
            list.addEventListener("pointerenter", show);
            list.addEventListener("pointerleave", hide);
            cleanup.push(() => {
              list.removeEventListener("pointermove", move);
              list.removeEventListener("pointerenter", show);
              list.removeEventListener("pointerleave", hide);
            });
            list.querySelectorAll<HTMLElement>("[data-svc-row]").forEach((row) => {
              const idx = Number(row.dataset.svcRow ?? 0);
              const enter = () =>
                imgs.forEach((im, i) => gsap.to(im, { autoAlpha: i === idx ? 1 : 0, duration: 0.25 }));
              row.addEventListener("pointerenter", enter);
              cleanup.push(() => row.removeEventListener("pointerenter", enter));
            });
          }
        }

        /* ── GALERIE — bandă cinematică orizontală pinned ──────────────────── */
        const gTrack = root.querySelector<HTMLElement>("[data-gal-track]");
        const gPin = root.querySelector<HTMLElement>("[data-gal-pin]");
        if (gTrack && gPin) {
          const dist = () => gTrack.scrollWidth - window.innerWidth;
          const tween = gsap.to(gTrack, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: gPin,
              start: "top top",
              end: () => "+=" + dist(),
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (s) => {
                const counter = root.querySelector("[data-gal-counter]");
                if (counter) {
                  const n = Math.min(8, Math.max(1, Math.round(s.progress * 7) + 1));
                  counter.textContent = "0" + n;
                }
              },
            },
          });
          // parallax intern: fiecare imagine alunecă ușor împotriva benzii
          gTrack.querySelectorAll<HTMLElement>("[data-gal-inner]").forEach((im, i) => {
            gsap.fromTo(
              im,
              { xPercent: i % 2 ? -6 : 0 },
              { xPercent: i % 2 ? 0 : -6, ease: "none", scrollTrigger: { containerAnimation: tween, trigger: im, start: "left right", end: "right left", scrub: true } }
            );
          });
        }

        /* ── ECHIPA — carduri care se sting sub următorul ──────────────────── */
        const cards = gsap.utils.toArray("[data-team-card]") as HTMLElement[];
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.93,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        });

        /* ── RECENZII — pinned, citatele se schimbă sub scroll ─────────────── */
        const rPin = root.querySelector<HTMLElement>("[data-rev-pin]");
        const quotes = gsap.utils.toArray("[data-rev-q]") as HTMLElement[];
        if (rPin && quotes.length > 0) {
          gsap.set(quotes, { autoAlpha: 0 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rPin,
              start: "top top",
              end: "+=" + quotes.length * 90 + "%",
              pin: true,
              scrub: 0.5,
            },
          });
          quotes.forEach((q, i) => {
            const text = q.querySelector("[data-rev-text]");
            const words = text ? new SplitText(text, { type: "words" }).words : [];
            tl.to(q, { autoAlpha: 1, duration: 0.18 }, i)
              .from(words, { yPercent: 60, opacity: 0, stagger: 0.018, duration: 0.3, ease: "power3.out" }, i + 0.02)
              .to("[data-rev-bar]", { scaleX: (i + 1) / quotes.length, duration: 0.4, ease: "none" }, i + 0.1);
            if (i < quotes.length - 1) {
              tl.to(q, { autoAlpha: 0, yPercent: -4, duration: 0.18 }, i + 0.78);
            }
          });
        }

        /* ── FINALĂ + footer marquee ───────────────────────────────────────── */
        gsap.to("[data-foot-marquee]", { xPercent: -50, ease: "none", duration: 30, repeat: -1 });

        /* ── bara de progres globală ───────────────────────────────────────── */
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });

        /* ── CTA-uri magnetice ─────────────────────────────────────────────── */
        if (fine) {
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
        }
        void self;
      }, rootRef);
      cleanup.push(() => ctx.revert());

      requestAnimationFrame(() => ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      cleanup.push(() => window.removeEventListener("load", onLoad));
    })();

    return () => {
      killed = true;
      cleanup.forEach((f) => f());
      heroState.p = 0;
    };
  }, [reduced, lang]);

  return (
    <div ref={rootRef} id="top" data-anim={reduced ? "off" : "on"} className="brici bg-[var(--bg)] text-[var(--ink)]">
      <style>{`
        .brici{font-family:var(--font-archivo),system-ui,sans-serif}
        .brici .bd{font-family:var(--font-bricolage),sans-serif;font-weight:800;letter-spacing:-0.015em;line-height:1.02}
        .brici .kicker{font-family:var(--font-jetbrains-mono),monospace;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.24em;color:var(--accent)}
        .brici .chrome{background:linear-gradient(178deg,#ffffff 8%,#cfccc4 38%,#76736c 62%,#403f43 86%);-webkit-background-clip:text;background-clip:text;color:transparent}
        .brici .outline-num{-webkit-text-stroke:1.5px var(--line);color:transparent}
        .brici .btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;border-radius:6px;padding:.8rem 1.5rem;font-weight:700;font-size:.95rem;background:var(--accent);color:#0a0a0b;border:1px solid transparent;transition:background var(--dur-fast) var(--ease-default)}
        .brici .btn:hover{background:var(--accent-hot)}
        .brici .btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
        .brici .btn.ghost:hover{border-color:var(--ink-muted)}
        .brici .map-dark{filter:grayscale(1) invert(0.9) hue-rotate(180deg) contrast(0.86)}
        .brici .gal-img{filter:grayscale(1) brightness(.85);transition:filter .6s var(--ease-default)}
        .brici .gal-fig:hover .gal-img{filter:grayscale(0) brightness(1)}
        .brici .svc-row .svc-num{transition:color .3s var(--ease-default)}
        .brici .svc-row:hover .svc-num{color:var(--accent);-webkit-text-stroke:0}
        .brici .svc-row .svc-arrow{opacity:0;transform:translate(-8px,8px);transition:all .35s var(--ease-expo-out)}
        .brici .svc-row:hover .svc-arrow{opacity:1;transform:none}
        .brici .svc-row h3{transition:transform .35s var(--ease-expo-out)}
        .brici .svc-row:hover h3{transform:translateX(10px)}
        .brici .finale-cta{display:block;border-block:1px solid var(--line);padding:4.5vw 0;text-align:center;transition:background .4s var(--ease-default),color .4s var(--ease-default)}
        .brici .finale-cta:hover{background:var(--accent);color:#0a0a0b}
        .brici .finale-cta:hover .chrome{-webkit-text-fill-color:#0a0a0b}
        /* fallback static: fără pin-uri, totul curge normal */
        .brici[data-anim="off"] [data-h-track]{display:grid;width:100%;grid-template-columns:1fr;gap:2.5rem}
        @media(min-width:768px){.brici[data-anim="off"] [data-h-track]{grid-template-columns:repeat(3,1fr)}}
        .brici[data-anim="off"] [data-gal-track]{display:grid;width:100%;grid-template-columns:repeat(2,1fr);gap:1rem;padding-inline:1.25rem;height:auto}
        .brici[data-anim="off"] [data-gal-track] figure{width:100%!important;height:auto!important;aspect-ratio:4/5}
        .brici[data-anim="off"] [data-rev-q]{position:relative;opacity:1;visibility:visible;margin-bottom:3rem}
        .brici[data-anim="off"] [data-rev-pin]{min-height:0;padding-block:4rem}
        .brici[data-anim="off"] .gal-img{filter:none}
      `}</style>

      <BriciPreloader />
      <BriciCursor />

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
        {/* ── HERO — lama plutește peste litere ───────────────────────────── */}
        <section data-hero className="relative flex min-h-[100svh] flex-col overflow-hidden">
          <div aria-hidden className="absolute inset-0">
            {config.hero?.backdropUrl && (
              <Image src={config.hero.backdropUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.16]" />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 38%, rgb(255 69 51 / 0.10), transparent 65%), linear-gradient(180deg, rgb(10 10 11 / 0.45), rgb(10 10 11 / 0.78) 78%, var(--bg))",
              }}
            />
          </div>

          {/* linia verticală a tăieturii */}
          <div
            data-hero-line
            aria-hidden
            className="absolute left-5 top-0 z-[6] h-[38vh] w-[2px] origin-top bg-[var(--accent)] sm:left-[8vw]"
          />
          {/* coordonate pe șina din dreapta */}
          <p
            aria-hidden
            className="kicker absolute right-5 top-1/2 z-[6] hidden origin-right -translate-y-1/2 rotate-90 !tracking-[0.3em] !text-[var(--ink-muted)] lg:block"
          >
            45.7975° N · 24.1495° E
          </p>

          {show3D && (
            <Suspense fallback={null}>
              <Hero3D />
            </Suspense>
          )}

          <div className="relative z-[5] mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-28 pb-10">
            <div data-hero-fade>
              <p className="kicker">{t.hero.kicker}</p>
              <h1
                key={lang}
                data-hero-title
                className="bd chrome mt-4 overflow-hidden text-[clamp(5rem,22vw,16rem)] uppercase leading-[0.9]"
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
                {contact.address} · est. {brand.est} ·{" "}
                <a href={telHref} className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)]">
                  {contact.phone}
                </a>
              </p>
            </div>
          </div>

          <p aria-hidden className="kicker relative z-[5] mx-auto pb-5 !text-[var(--ink-muted)]">
            ↓ {t.hero.scroll}
          </p>
        </section>

        {/* ── Marquee ─────────────────────────────────────────────────────── */}
        {marquee.length > 0 && (
          <div className="-rotate-[1.2deg] overflow-hidden border-y border-[var(--line)] bg-[var(--surface)] py-3">
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

        {/* ── MANIFEST — bandă orizontală ─────────────────────────────────── */}
        <section id="manifest" className="relative">
          <div data-manifest-pin className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-20">
            <div className="mx-auto w-full max-w-6xl px-5">
              <p className="kicker">{t.manifest.kicker}</p>
              <h2 key={lang} data-split className="bd mt-4 max-w-3xl text-[length:var(--fs-700)]">
                {t.manifest.title}
              </h2>
            </div>
            <div data-h-track className="mt-14 flex w-max gap-[7vw] px-5 sm:px-[8vw]">
              {manifesto.map((panel) => (
                <article key={panel.eyebrow} className="w-[80vw] max-w-[560px] shrink-0 md:w-[42vw]">
                  <div data-slice aria-hidden className="h-[2px] w-full origin-left bg-[var(--accent)]" />
                  <p className="bd outline-num mt-6 text-[5.5rem] leading-none">{panel.eyebrow}</p>
                  <h3 className="bd mt-4 text-[1.7rem]">{panel.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-[var(--ink-muted)]">{panel.body}</p>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-14 w-full max-w-6xl px-5">
              <div className="h-[2px] w-full bg-[var(--line)]">
                <div data-h-progress className="h-full w-full origin-left scale-x-0 bg-[var(--accent)]" />
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICII — lista cu preview flotant ─────────────────────────── */}
        <section id="servicii" className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
            <p className="kicker">{t.services.kicker}</p>
            <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
              {t.services.title}
            </h2>
            <ul data-svc-list className="mt-12">
              {services.map((service, i) => (
                <li key={service.id} data-reveal>
                  <a
                    data-svc-row={i}
                    data-cursor={t.contact.cursor}
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="svc-row flex items-baseline gap-5 border-b border-[var(--line)] py-6"
                  >
                    <span className="bd svc-num outline-num text-[1.6rem]">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="bd text-[1.5rem] sm:text-[2rem]">{svcName(service)}</h3>
                      {svcDesc(service) && <p className="mt-1 text-sm text-[var(--ink-muted)]">{svcDesc(service)}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="bd text-[1.3rem] text-[var(--accent)]">{service.price} lei</p>
                      <p className="text-xs text-[var(--ink-muted)]">{service.duration}</p>
                    </div>
                    <span aria-hidden className="svc-arrow bd hidden text-[1.5rem] text-[var(--accent)] sm:block">
                      ↗
                    </span>
                  </a>
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
          {/* preview-ul care urmărește cursorul (doar pointer fin) */}
          <div
            data-svc-preview
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-[300px] w-[240px] overflow-hidden rounded-lg border border-[var(--line)] opacity-0 lg:block"
          >
            {services.map((service, i) => (
              <div key={service.id} data-svc-img className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image
                  src={config.gallery[i % config.gallery.length] ?? ""}
                  alt=""
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── GALERIE — banda cinematică ──────────────────────────────────── */}
        <section id="galerie" className="relative">
          <div data-gal-pin className="flex min-h-[100svh] items-center overflow-hidden">
            <div data-gal-track className="flex w-max items-center gap-[4vw] px-5 sm:px-[8vw]">
              <div className="w-[78vw] shrink-0 sm:w-[34vw]">
                <p className="kicker">{t.gallery.kicker}</p>
                <h2 key={lang} data-split className="bd mt-4 text-[length:var(--fs-700)]">
                  {t.gallery.title}
                </h2>
                <p className="bd mt-8 text-[3rem] text-[var(--line)]">
                  <span data-gal-counter className="text-[var(--accent)]">01</span>
                  <span className="text-[var(--ink-muted)]"> / 08</span>
                </p>
              </div>
              {config.gallery.slice(0, 8).map((src, i) => (
                <figure
                  key={src}
                  className={`gal-fig relative shrink-0 overflow-hidden rounded-lg border border-[var(--line)] ${
                    i % 2 ? "h-[46vh] w-[64vw] sm:w-[30vw]" : "h-[62vh] w-[74vw] sm:w-[38vw]"
                  }`}
                >
                  <div data-gal-inner className="absolute inset-[-8%]">
                    <Image src={src} alt={`${brand.name} — galerie ${i + 1}`} fill sizes="60vw" className="gal-img object-cover" />
                  </div>
                  <figcaption className="kicker absolute bottom-3 left-3 z-[2] rounded bg-[rgb(10_10_11/0.55)] px-2 py-1 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── ECHIPA — carduri suprapuse ──────────────────────────────────── */}
        {team.length > 0 && (
          <section id="echipa" className="relative border-t border-[var(--line)]">
            <div className="mx-auto max-w-6xl px-5 pt-24">
              <p className="kicker">{t.team.kicker}</p>
              <h2 key={lang} data-split className="bd mt-4 max-w-2xl text-[length:var(--fs-700)]">
                {t.team.title}
              </h2>
            </div>
            <div className="mx-auto max-w-6xl px-5 pb-24">
              {team.map((member, i) => (
                <div key={member.id} data-team-card className="sticky top-[12vh] pt-8">
                  <article className="grid min-h-[72vh] overflow-hidden rounded-xl border border-[var(--line)] bg-[#101013] md:grid-cols-[1fr_1.25fr]">
                    <div className="relative min-h-[300px]">
                      <Image
                        src={member.portrait}
                        alt={member.name}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgb(10_10_11/0.5)] to-transparent" />
                    </div>
                    <div className="relative flex flex-col justify-center p-8 lg:p-14">
                      <p aria-hidden className="bd outline-num absolute right-6 top-4 text-[7rem] leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="kicker">{memberRole(member)}</p>
                      <h3 className="bd mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">{member.name}</h3>
                      <div aria-hidden className="mt-6 h-[2px] w-16 bg-[var(--accent)]" />
                      <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-muted)]">{memberBio(member)}</p>
                    </div>
                  </article>
                </div>
              ))}
              <div className="pt-10" data-reveal>
                <Link href="/povestea" className="btn ghost">
                  {t.team.more} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── RECENZII — pinned, un citat pe ecran ────────────────────────── */}
        {reviews.length > 0 && (
          <section id="recenzii" className="relative border-t border-[var(--line)] bg-[var(--surface)]">
            <div data-rev-pin className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-20">
              <p aria-hidden className="bd outline-num pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[34vw] leading-none">
                5,0
              </p>
              <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between">
                  <p className="kicker">{t.reviews.kicker}</p>
                  <p className="kicker rounded-full border border-[var(--line)] px-4 py-2">★★★★★ {t.reviews.badge}</p>
                </div>
                <div className="relative mt-10 min-h-[46vh]">
                  {reviews.slice(0, 3).map((review) => (
                    <figure key={review.id} data-rev-q className="absolute inset-0 flex flex-col justify-center">
                      <p aria-label="5 din 5" className="tracking-[0.3em] text-[var(--accent)]">★★★★★</p>
                      <blockquote key={lang + review.id} data-rev-text className="bd mt-6 text-[clamp(1.6rem,4.6vw,3.4rem)] leading-[1.12]">
                        „{revQuote(review)}”
                      </blockquote>
                      <figcaption className="mt-8 text-sm text-[var(--ink-muted)]">
                        <span className="font-bold text-[var(--ink)]">{review.author}</span>
                        {review.source && <> · {review.source}</>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <div className="mt-8 h-[2px] w-full bg-[var(--line)]">
                  <div data-rev-bar className="h-full w-full origin-left scale-x-0 bg-[var(--accent)]" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT + FINALĂ ────────────────────────────────────────────── */}
        <section id="contact" className="border-t border-[var(--line)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2 lg:py-28">
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
              <div className="mt-10" data-reveal>
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

          {/* finala — banda CTA gigant */}
          <div className="mx-auto max-w-6xl px-5 pb-6">
            <p key={lang} data-split className="bd max-w-4xl text-[length:var(--fs-700)]">
              {t.contact.finale}
            </p>
          </div>
          <a
            data-cursor={t.contact.cursor}
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            className="finale-cta"
          >
            <span className="bd chrome text-[clamp(2.4rem,8vw,7rem)] uppercase leading-none">
              {t.contact.cta} ↗
            </span>
          </a>
        </section>
      </main>

      {/* ── Footer — marquee gigant + bara finală ─────────────────────────── */}
      <footer className="overflow-hidden">
        <div aria-hidden className="pointer-events-none select-none py-10 opacity-60">
          <div data-foot-marquee className="flex w-max gap-[5vw] whitespace-nowrap">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex gap-[5vw]">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="bd outline-num text-[16vw] uppercase leading-none">
                    BRICI — {brand.tagline.split(",")[0]?.toUpperCase() ?? "FRIZERIE DE PRECIZIE"}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-9 text-sm text-[var(--ink-muted)] sm:flex-row sm:items-center">
            <BriciLogo size={22} />
            <Link href="/povestea" className="transition-colors hover:text-[var(--ink)]">
              {t.footer.story}
            </Link>
            <p className="max-w-sm">{t.footer.demo}</p>
            <a href="#top" data-magnetic className="btn ghost !px-3 !py-2 text-xs">
              ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
