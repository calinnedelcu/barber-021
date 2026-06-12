"use client";

import type { HeroVariant } from "./Hero3D";

// Demo-only pill for flipping between the three 3D hero directions on the
// review call — the sold site ships with ONE. Deep-linkable via ?hero=.
export const HERO_VARIANTS: { id: HeroVariant; label: string }[] = [
  { id: "lama", label: "Lama" },
  { id: "scantei", label: "Scântei" },
  { id: "crom", label: "Crom" },
];

export const HERO_STORAGE_KEY = "brici-hero-variant";

export function readInitialVariant(): HeroVariant {
  if (typeof window === "undefined") return "lama";
  const fromUrl = new URLSearchParams(window.location.search).get("hero");
  const saved = window.localStorage.getItem(HERO_STORAGE_KEY);
  const candidate = (fromUrl ?? saved) as HeroVariant | null;
  return HERO_VARIANTS.some((v) => v.id === candidate) ? (candidate as HeroVariant) : "lama";
}

export function HeroSwitcher({
  variant,
  onChange,
}: {
  variant: HeroVariant;
  onChange: (v: HeroVariant) => void;
}) {
  const choose = (v: HeroVariant) => {
    onChange(v);
    window.localStorage.setItem(HERO_STORAGE_KEY, v);
    const url = new URL(window.location.href);
    url.searchParams.set("hero", v);
    window.history.replaceState(null, "", url);
  };

  return (
    <div
      role="group"
      aria-label="Demo: alege varianta de hero 3D"
      className="fixed bottom-4 right-4 z-[220] flex items-center gap-1 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-2 py-1.5 shadow-[0_6px_24px_rgb(0_0_0/0.35)] backdrop-blur-md"
    >
      <span className="hidden px-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:block">
        Hero 3D · demo
      </span>
      {HERO_VARIANTS.map((v) => {
        const active = v.id === variant;
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={active}
            onClick={() => choose(v.id)}
            className="rounded-full px-2.5 py-1 text-xs font-semibold transition-colors"
            style={
              active
                ? { background: "var(--accent)", color: "var(--bg)" }
                : { color: "var(--ink-muted)" }
            }
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
