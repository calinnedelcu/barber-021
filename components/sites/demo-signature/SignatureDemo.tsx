"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { ClientConfig } from "@/lib/config";
import { assetPath } from "@/lib/assetPath";
import { DemoPackageSwitcher } from "@/components/providers/DemoPackageSwitcher";
import { DefaultSite } from "@/components/sites/DefaultSite";
import { AASite } from "@/components/sites/aa-barber/AASite";
import { MrMrsSite } from "@/components/sites/mr-mrs-style/MrMrsSite";
import { AndreiSite } from "@/components/sites/andrei-canciu/AndreiSite";
import { NicoSite } from "@/components/sites/nico-beauty-style/NicoSite";

export type SignatureDemoId =
  | "mihai-ciobanu"
  | "zero-fade"
  | "colori-salon"
  | "bella-coafor"
  | "ritual-barber";

type SignatureConfigs = Record<SignatureDemoId, ClientConfig>;

interface SignatureSite {
  id: SignatureDemoId;
  label: string;
  shortLabel: string;
  swatch: [string, string];
  component: ComponentType<{ config: ClientConfig }>;
}

const SITES: SignatureSite[] = [
  { id: "mihai-ciobanu", label: "Editorial", shortLabel: "01", swatch: ["#ECE7DD", "#B4724A"], component: AndreiSite },
  { id: "zero-fade", label: "Neon", shortLabel: "02", swatch: ["#0B0D10", "#46B6DC"], component: AASite },
  { id: "colori-salon", label: "Botanic", shortLabel: "03", swatch: ["#F6F1E9", "#4E7C5E"], component: MrMrsSite },
  { id: "bella-coafor", label: "Atelier", shortLabel: "04", swatch: ["#F4ECE3", "#B5683C"], component: NicoSite },
  { id: "ritual-barber", label: "Ritual", shortLabel: "05", swatch: ["#0A0807", "#D9764D"], component: DefaultSite },
];

const DEFAULT_SITE = SITES[0] as SignatureSite;
const STORAGE_KEY = "demo-signature-site";
const DEFAULT_THEME = {
  scheme: "dark",
  bg: "#0a0807",
  surface: "#14110f",
  ink: "#f5efe6",
  inkMuted: "#8a8276",
  accent: "#d9764d",
  accentHot: "#e8915a",
  bone: "#c9b89a",
  line: "rgb(245 239 230 / 0.08)",
} as const;

function applyVisualConfig(config: ClientConfig) {
  const root = document.documentElement;
  const theme = { ...DEFAULT_THEME, ...config.theme };
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--surface", theme.surface);
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--ink-muted", theme.inkMuted);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-hot", theme.accentHot);
  root.style.setProperty("--bone", theme.bone);
  root.style.setProperty("--line", theme.line);
  root.style.colorScheme = theme.scheme;
  document.body.style.setProperty(
    "--grain-url",
    config.theme?.grain === false ? "none" : `url("${assetPath("/textures/grain.svg")}")`
  );
}

function isSignatureId(value: string | null): value is SignatureDemoId {
  return SITES.some((site) => site.id === value);
}

export function SignatureDemo({ configs }: { configs: SignatureConfigs }) {
  const [active, setActive] = useState<SignatureDemoId>(DEFAULT_SITE.id);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("site");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = isSignatureId(fromUrl) ? fromUrl : isSignatureId(saved) ? saved : DEFAULT_SITE.id;
    setActive(initial);
  }, []);

  useEffect(() => {
    applyVisualConfig(configs[active]);
  }, [active, configs]);

  const choose = (id: string) => {
    if (!isSignatureId(id)) return;
    setActive(id);
    applyVisualConfig(configs[id]);
    window.localStorage.setItem(STORAGE_KEY, id);
    const url = new URL(window.location.href);
    url.searchParams.set("site", id);
    window.history.replaceState(null, "", url);
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0 });
  };

  const site = SITES.find((candidate) => candidate.id === active) ?? DEFAULT_SITE;
  const CurrentSite = site.component;

  return (
    <>
      <div key={active} className="pb-20">
        <CurrentSite config={configs[active]} />
      </div>
      <DemoPackageSwitcher
        label="Signature · design"
        active={active}
        options={SITES.map(({ id, label, shortLabel, swatch }) => ({ id, label, shortLabel, swatch }))}
        onChange={choose}
      />
    </>
  );
}
