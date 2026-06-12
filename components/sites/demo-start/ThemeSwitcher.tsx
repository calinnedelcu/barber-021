"use client";

import { useEffect, useState } from "react";

/**
 * Demo-only theme switcher for the Start-package showcase. The sold site ships
 * with ONE of these themes baked in — the switcher exists so the lead can flip
 * through them live on the sales call. Themes share the exact same layout;
 * only palette + heading typeface change ("aceeași structură, altă haină").
 *
 * Deep-linkable: ?tema=<id> wins over the saved choice.
 */
export interface StartTheme {
  id: string;
  label: string;
  scheme: "light" | "dark";
  /** Swatch preview colors for the picker UI. */
  swatch: [string, string];
  vars: Record<string, string>;
}

export const START_THEMES: StartTheme[] = [
  {
    id: "carbune",
    label: "Cărbune",
    scheme: "dark",
    swatch: ["#0c0a09", "#c87f4a"],
    vars: {
      "--bg": "#0c0a09",
      "--surface": "#16120f",
      "--ink": "#f3ece1",
      "--ink-muted": "#94897a",
      "--accent": "#c87f4a",
      "--accent-hot": "#dd9258",
      "--line": "rgb(243 236 225 / 0.1)",
      "--sd-head": "var(--font-anton)",
      "--sd-case": "uppercase",
      "--sd-track": "0.03em",
      "--sd-weight": "700",
    },
  },
  {
    id: "salvie",
    label: "Salvie",
    scheme: "light",
    swatch: ["#f6f3ec", "#5d7a5f"],
    vars: {
      "--bg": "#f6f3ec",
      "--surface": "#fffdf8",
      "--ink": "#262b24",
      "--ink-muted": "#71796c",
      "--accent": "#5d7a5f",
      "--accent-hot": "#4c6a4e",
      "--line": "rgb(38 43 36 / 0.14)",
      "--sd-head": "var(--font-cormorant)",
      "--sd-case": "none",
      "--sd-track": "0",
      "--sd-weight": "600",
    },
  },
  {
    id: "cerneala",
    label: "Cerneală",
    scheme: "light",
    swatch: ["#f7f8fa", "#2a5fae"],
    vars: {
      "--bg": "#f7f8fa",
      "--surface": "#ffffff",
      "--ink": "#16191e",
      "--ink-muted": "#667085",
      "--accent": "#2a5fae",
      "--accent-hot": "#234f92",
      "--line": "rgb(22 25 30 / 0.12)",
      "--sd-head": "var(--font-grotesk)",
      "--sd-case": "none",
      "--sd-track": "-0.01em",
      "--sd-weight": "700",
    },
  },
  {
    id: "mahon",
    label: "Mahon",
    scheme: "dark",
    swatch: ["#101713", "#c9a25a"],
    vars: {
      "--bg": "#101713",
      "--surface": "#1a231c",
      "--ink": "#ece5d2",
      "--ink-muted": "#91937f",
      "--accent": "#c9a25a",
      "--accent-hot": "#d8b46c",
      "--line": "rgb(236 229 210 / 0.12)",
      "--sd-head": "var(--font-fraunces)",
      "--sd-case": "none",
      "--sd-track": "0",
      "--sd-weight": "600",
    },
  },
  {
    id: "teracota",
    label: "Teracotă",
    scheme: "light",
    swatch: ["#faf2ea", "#c75b39"],
    vars: {
      "--bg": "#faf2ea",
      "--surface": "#fffaf4",
      "--ink": "#38271c",
      "--ink-muted": "#8b7263",
      "--accent": "#c75b39",
      "--accent-hot": "#b04e30",
      "--line": "rgb(56 39 28 / 0.14)",
      "--sd-head": "var(--font-syne)",
      "--sd-case": "none",
      "--sd-track": "0",
      "--sd-weight": "700",
    },
  },
  {
    // Feminin pudrat — roz prăfuit + tonuri calde de cafea; saloane de coafor/beauty.
    id: "pudra",
    label: "Pudră",
    scheme: "light",
    swatch: ["#f9f0ef", "#b25f70"],
    vars: {
      "--bg": "#f9f0ef",
      "--surface": "#fffbfa",
      "--ink": "#3a2a2f",
      "--ink-muted": "#93767e",
      "--accent": "#b25f70",
      "--accent-hot": "#9d4f60",
      "--line": "rgb(58 42 47 / 0.13)",
      "--sd-head": "var(--font-fraunces)",
      "--sd-case": "none",
      "--sd-track": "0",
      "--sd-weight": "600",
    },
  },
  {
    // Monocrom minimal — alb + negru pur, contrast maxim; barbershop modern, streetwear.
    id: "beton",
    label: "Beton",
    scheme: "light",
    swatch: ["#ffffff", "#101010"],
    vars: {
      "--bg": "#ffffff",
      "--surface": "#f4f4f2",
      "--ink": "#101010",
      "--ink-muted": "#6e6e6a",
      "--accent": "#101010",
      "--accent-hot": "#2e2e2e",
      "--line": "rgb(16 16 16 / 0.16)",
      "--sd-head": "var(--font-anton)",
      "--sd-case": "uppercase",
      "--sd-track": "0.05em",
      "--sd-weight": "700",
    },
  },
];

const STORAGE_KEY = "demo-start-theme";
// First theme = the one baked into demo-start.json (SSR default).
const DEFAULT_THEME = START_THEMES[0] as StartTheme;

function applyTheme(theme: StartTheme) {
  const el = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    el.style.setProperty(key, value);
  }
  el.style.colorScheme = theme.scheme;
}

export function ThemeSwitcher() {
  const [active, setActive] = useState(DEFAULT_THEME.id);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tema");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = START_THEMES.find((t) => t.id === (fromUrl ?? saved));
    if (initial && initial.id !== DEFAULT_THEME.id) {
      setActive(initial.id);
      applyTheme(initial);
    }
  }, []);

  const choose = (theme: StartTheme) => {
    setActive(theme.id);
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme.id);
    const url = new URL(window.location.href);
    url.searchParams.set("tema", theme.id);
    window.history.replaceState(null, "", url);
  };

  return (
    <div
      role="group"
      aria-label="Demo: alege tema site-ului"
      className="fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-3 py-2 shadow-[0_6px_24px_rgb(0_0_0/0.25)] backdrop-blur-md"
    >
      <span className="hidden pl-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:block">
        Temă · demo
      </span>
      {START_THEMES.map((theme) => {
        const isActive = theme.id === active;
        return (
          <button
            key={theme.id}
            type="button"
            title={theme.label}
            aria-pressed={isActive}
            onClick={() => choose(theme)}
            className="flex items-center gap-1.5 rounded-full p-1 transition-transform hover:scale-105"
          >
            <span
              aria-hidden
              className="block h-6 w-6 rounded-full border"
              style={{
                background: `linear-gradient(135deg, ${theme.swatch[0]} 50%, ${theme.swatch[1]} 50%)`,
                borderColor: isActive ? "var(--accent)" : "var(--line)",
                boxShadow: isActive ? "0 0 0 2px var(--accent)" : "none",
              }}
            />
            {isActive && (
              <span className="pr-1 text-xs font-semibold text-[var(--ink)]">
                {theme.label}
              </span>
            )}
            <span className="sr-only">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
