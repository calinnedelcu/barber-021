import barber021 from "@/content/clients/barber-021.json";
import hairmann from "@/content/clients/hairmann.json";
import andreiCanciu from "@/content/clients/andrei-canciu.json";
import aaBarber from "@/content/clients/aa-barber.json";
import mrMrsStyle from "@/content/clients/mr-mrs-style.json";
import nicoBeautyStyle from "@/content/clients/nico-beauty-style.json";
import { loadClientConfig, type ClientConfig } from "./config";

// Registry of all client content files. Add a new entry per client draft.
const REGISTRY: Record<string, unknown> = {
  "barber-021": barber021,
  hairmann: hairmann,
  "andrei-canciu": andreiCanciu,
  "aa-barber": aaBarber,
  "mr-mrs-style": mrMrsStyle,
  "nico-beauty-style": nicoBeautyStyle,
};

// Active client is chosen at build time via NEXT_PUBLIC_CLIENT (set in the
// deploy workflow alongside NEXT_PUBLIC_BASE_PATH). Locally: `NEXT_PUBLIC_CLIENT=hairmann npm run dev`.
export const ACTIVE_SLUG =
  (process.env.NEXT_PUBLIC_CLIENT ?? "").trim() || "barber-021";

let cached: ClientConfig | null = null;

export function getActiveClient(): ClientConfig {
  if (cached) return cached;
  const raw = REGISTRY[ACTIVE_SLUG] ?? barber021;
  cached = loadClientConfig(raw);
  return cached;
}
