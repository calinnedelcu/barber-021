import barber021 from "@/content/clients/barber-021.json";
import ritualBarber from "@/content/clients/ritual-barber.json";
import mihaiCiobanu from "@/content/clients/mihai-ciobanu.json";
import zeroFade from "@/content/clients/zero-fade.json";
import coloriSalon from "@/content/clients/colori-salon.json";
import bellaCoafor from "@/content/clients/bella-coafor.json";
import demoStart from "@/content/clients/demo-start.json";
import demoCustom from "@/content/clients/demo-custom.json";
import demoCustomV2 from "@/content/clients/demo-custom-v2.json";
import { loadClientConfig, type ClientConfig } from "./config";

const demoSignature = {
  ...mihaiCiobanu,
  slug: "demo-signature",
  brand: {
    ...mihaiCiobanu.brand,
    name: "DEMO SIGNATURE",
    shortName: "SIGNATURE",
    tagline: "Cinci direcții de design unic pentru saloane și frizerii.",
  },
  seo: {
    ...mihaiCiobanu.seo,
    siteUrl: "https://calinnedelcu.github.io/barber-021/demo-signature",
    description: "Demo Signature: cinci direcții de design unic, comutabile într-un singur website.",
  },
};

// Registry of all client content files. Add a new entry per client draft.
const REGISTRY: Record<string, unknown> = {
  "barber-021": barber021,
  "ritual-barber": ritualBarber,
  "mihai-ciobanu": mihaiCiobanu,
  "zero-fade": zeroFade,
  "colori-salon": coloriSalon,
  "bella-coafor": bellaCoafor,
  "demo-start": demoStart,
  "demo-signature": demoSignature,
  "demo-custom": demoCustom,
  "demo-custom-v2": demoCustomV2,
};

// Active client is chosen at build time via NEXT_PUBLIC_CLIENT (set in the
// deploy workflow alongside NEXT_PUBLIC_BASE_PATH). Locally: `NEXT_PUBLIC_CLIENT=ritual-barber npm run dev`.
export const ACTIVE_SLUG =
  (process.env.NEXT_PUBLIC_CLIENT ?? "").trim() || "barber-021";

let cached: ClientConfig | null = null;

export function getClientConfig(slug: string): ClientConfig {
  return loadClientConfig(REGISTRY[slug] ?? barber021);
}

export function getActiveClient(): ClientConfig {
  if (cached) return cached;
  cached = getClientConfig(ACTIVE_SLUG);
  return cached;
}
