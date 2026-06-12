"use client";

import { useEffect, useState } from "react";

/**
 * Floating bar for flipping through the Signature-level portfolio on a sales
 * call — same idea as the demo-start theme switcher, but across SITES.
 *
 * Renders ONLY when the URL has `?tur` (e.g. …/andrei-canciu/?tur=1) and the
 * param is carried to the next site, so the bar follows you through the tour.
 * Clean per-lead links (no param) never show it — a lead browsing their own
 * draft must not see shortcuts to other salons.
 *
 * Built into every client bundle (tiny); inert without the param.
 */
interface TourSite {
  slug: string;
  name: string;
  mark: string;
}

const SITES: TourSite[] = [
  { slug: "andrei-canciu", name: "Andrei Canciu", mark: "AC" },
  { slug: "aa-barber", name: "A'A Barber", mark: "A'A" },
  { slug: "mr-mrs-style", name: "Mr&Mrs Style", mark: "MM" },
  { slug: "nico-beauty-style", name: "Nico Beauty Style", mark: "NB" },
  { slug: "hairmann", name: "HAIRMANN", mark: "HM" },
];

const CURRENT = (process.env.NEXT_PUBLIC_CLIENT ?? "").trim() || "barber-021";

const at = (i: number): TourSite =>
  SITES[((i % SITES.length) + SITES.length) % SITES.length] as TourSite;

/** Sibling site URL: swap the current slug segment of the Pages path. */
function hrefFor(slug: string): string {
  const path = window.location.pathname;
  const marker = `/${CURRENT}/`;
  const i = path.lastIndexOf(marker);
  const parent = i >= 0 ? path.slice(0, i) : "";
  return `${parent}/${slug}/?tur=1`;
}

export function PortfolioTour() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(new URLSearchParams(window.location.search).has("tur"));
  }, []);

  if (!visible) return null;

  const idx = SITES.findIndex((s) => s.slug === CURRENT);
  const prev = at(idx - 1);
  const next = at(idx + 1);
  const arrowCls =
    "flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-sm text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]";

  return (
    <nav
      aria-label="Tur portofoliu — site-uri la nivel Signature"
      className="fixed bottom-4 left-1/2 z-[300] flex max-w-[94vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-3xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-2 shadow-[0_6px_24px_rgb(0_0_0/0.3)] backdrop-blur-md"
    >
      <span className="hidden pr-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:block">
        Portofoliu
      </span>
      <a href={hrefFor(prev.slug)} aria-label={`Anterior: ${prev.name}`} className={arrowCls}>
        ←
      </a>
      {SITES.map((site) => {
        const isActive = site.slug === CURRENT;
        return (
          <a
            key={site.slug}
            href={hrefFor(site.slug)}
            aria-current={isActive ? "page" : undefined}
            title={site.name}
            className="rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors"
            style={
              isActive
                ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--bg)" }
                : { borderColor: "var(--line)", color: "var(--ink-muted)" }
            }
          >
            {isActive ? site.name : site.mark}
          </a>
        );
      })}
      <a href={hrefFor(next.slug)} aria-label={`Următor: ${next.name}`} className={arrowCls}>
        →
      </a>
    </nav>
  );
}
