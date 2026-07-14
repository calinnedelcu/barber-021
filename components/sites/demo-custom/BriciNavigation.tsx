"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BriciLogo } from "./BriciLogo";
import type { Lang } from "./copy";

interface NavLabels {
  manifest: string;
  servicii: string;
  galerie: string;
  echipa: string;
  recenzii: string;
  contact: string;
  cta: string;
}

interface BriciNavigationProps {
  lang: Lang;
  labels: NavLabels;
  bookingHref: string;
  address: string;
  phone: string;
  onLanguageChange: (lang: Lang) => void;
}

const SECTION_IDS = ["manifest", "servicii", "galerie", "echipa", "recenzii", "contact"] as const;

export function BriciNavigation({
  lang,
  labels,
  bookingHref,
  address,
  phone,
  onLanguageChange,
}: BriciNavigationProps) {
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const isRomanian = lang === "ro";

  const items = useMemo(
    () => [
      { id: "manifest", label: labels.manifest },
      { id: "servicii", label: labels.servicii },
      { id: "galerie", label: labels.galerie },
      { id: "echipa", label: labels.echipa },
      { id: "recenzii", label: labels.recenzii },
      { id: "contact", label: labels.contact },
    ],
    [labels]
  );

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const pivot = window.innerHeight * 0.42;
      let next = "top";
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= pivot) next = id;
      }
      setActiveSection((current) => (current === next ? current : next));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.__lenis?.start();
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const currentIndex = Math.max(0, items.findIndex((item) => item.id === activeSection));

  return (
    <>
      <style>{`
        .brici-nav-link{position:relative;padding-block:.45rem;transition:color .25s ease}
        .brici-nav-link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.16,1,.3,1)}
        .brici-nav-link[aria-current="location"]{color:var(--ink)}
        .brici-nav-link[aria-current="location"]::after{transform:scaleX(1)}
        .brici-menu-icon{position:relative;width:18px;height:14px}
        .brici-menu-icon::before,.brici-menu-icon::after{content:"";position:absolute;left:0;width:18px;height:1.5px;background:currentColor;transition:transform .35s cubic-bezier(.16,1,.3,1),top .35s cubic-bezier(.16,1,.3,1)}
        .brici-menu-icon::before{top:3px}.brici-menu-icon::after{top:10px}
        [aria-expanded="true"] .brici-menu-icon::before{top:7px;transform:rotate(45deg)}
        [aria-expanded="true"] .brici-menu-icon::after{top:7px;transform:rotate(-45deg)}
        .brici-mobile-menu{visibility:hidden;opacity:0;clip-path:inset(0 0 100% 0);transition:clip-path .7s cubic-bezier(.16,1,.3,1),opacity .35s ease,visibility 0s linear .7s}
        .brici-mobile-menu[data-open="true"]{visibility:visible;opacity:1;clip-path:inset(0);transition-delay:0s}
        .brici-mobile-menu [data-mobile-link]{opacity:0;transform:translateY(24px);transition:opacity .4s ease,transform .6s cubic-bezier(.16,1,.3,1)}
        .brici-mobile-menu[data-open="true"] [data-mobile-link]{opacity:1;transform:none;transition-delay:calc(.16s + var(--nav-i) * .045s)}
        .brici-mobile-menu{padding-bottom:max(2rem,env(safe-area-inset-bottom))}
        .brici-mobile-booking{bottom:max(1rem,env(safe-area-inset-bottom));transition:opacity .3s ease,transform .4s cubic-bezier(.16,1,.3,1),visibility .3s}
        @media(prefers-reduced-motion:reduce){.brici-mobile-menu,.brici-mobile-menu [data-mobile-link],.brici-mobile-booking{transition:none!important}}
      `}</style>

      <header className="fixed inset-x-0 top-0 z-[230] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" aria-label={isRomanian ? "BRICI — sus" : "BRICI — top"} onClick={closeMenu}>
            <BriciLogo />
          </a>

          <nav aria-label={isRomanian ? "Navigație principală" : "Main navigation"} className="hidden items-center gap-5 text-sm text-[var(--ink-muted)] lg:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="brici-nav-link"
                aria-current={activeSection === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div role="group" aria-label={isRomanian ? "Limbă" : "Language"} className="flex overflow-hidden rounded-[5px] border border-[var(--line)] text-xs font-bold">
              {(["ro", "en"] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  aria-pressed={lang === language}
                  onClick={() => onLanguageChange(language)}
                  className="px-2.5 py-1.5 uppercase transition-colors"
                  style={lang === language ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--ink-muted)" }}
                >
                  {language}
                </button>
              ))}
            </div>
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn nav-cta hidden !px-4 !py-2 text-sm md:inline-flex">
              {labels.cta}
            </a>
            <button
              type="button"
              aria-label={menuOpen ? (isRomanian ? "Închide meniul" : "Close menu") : (isRomanian ? "Deschide meniul" : "Open menu")}
              aria-controls="brici-mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-[var(--line)] text-[var(--ink)] lg:hidden"
            >
              <span className="brici-menu-icon" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="brici-mobile-menu"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        className="brici-mobile-menu fixed inset-0 z-[220] bg-[#080809] px-5 pb-8 pt-24 lg:hidden"
      >
        <div className="mx-auto flex h-full max-w-2xl flex-col">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
            <p className="kicker">BRICI · NAV</p>
            <p className="kicker !text-[var(--ink-muted)]">{String(currentIndex + 1).padStart(2, "0")} / 06</p>
          </div>
          <nav aria-label={isRomanian ? "Navigație mobilă" : "Mobile navigation"} className="mt-4">
            {items.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-mobile-link
                onClick={closeMenu}
                className="flex items-center gap-5 border-b border-[var(--line)] py-3.5"
                style={{ "--nav-i": index } as CSSProperties}
                aria-current={activeSection === item.id ? "location" : undefined}
              >
                <span className="kicker w-7 !text-[var(--ink-muted)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="bd flex-1 text-[clamp(1.65rem,8vw,2.7rem)]">{item.label}</span>
                <span aria-hidden className={activeSection === item.id ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"}>↘</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto grid gap-5 border-t border-[var(--line)] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="text-sm leading-relaxed text-[var(--ink-muted)]">
              <p>{address}</p>
              <p className="mt-1 text-[var(--ink)]">{phone}</p>
            </div>
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn" onClick={closeMenu}>
              {labels.cta} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>

      <a
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={activeSection === "top" || menuOpen}
        tabIndex={activeSection === "top" || menuOpen ? -1 : 0}
        className="brici-mobile-booking btn fixed right-4 z-[210] !px-4 !py-3 text-sm lg:hidden"
        style={activeSection === "top" || menuOpen ? { opacity: 0, transform: "translateY(18px)", visibility: "hidden" } : { opacity: 1, transform: "none", visibility: "visible" }}
      >
        {labels.cta} <span aria-hidden>↗</span>
      </a>
    </>
  );
}
