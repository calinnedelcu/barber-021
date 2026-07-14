import type { Metadata, Viewport } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PageLoader } from "@/components/providers/PageLoader";
import {
  anton,
  fraunces,
  jetbrainsMono,
  spaceGrotesk,
  cormorant,
  syne,
  archivo,
  bricolage,
} from "@/lib/fonts";
import { assetPath } from "@/lib/assetPath";
import { cn } from "@/lib/cn";
import { getActiveClient, ACTIVE_SLUG } from "@/lib/clients";
import "./globals.css";

const config = getActiveClient();
// The Start-package demo stays intentionally plain: no branded entry loader,
// no smooth-scroll — those are part of the upper tiers' polish.
const isStartDemo = ACTIVE_SLUG === "demo-start";
// The Custom flagship ships its own cinematic preloader (BriciPreloader),
// so the shared PageLoader is skipped — Lenis stays on.
const isCustomDemo = ACTIVE_SLUG === "demo-custom" || ACTIVE_SLUG === "demo-custom-v2";
const brandName = config.brand.shortName ?? config.brand.name;
const description = config.seo?.description ?? config.brand.tagline;
const siteUrl = config.seo?.siteUrl ?? "https://example.com";
// Only the fictional demo pulls images from Unsplash; real clients ship local
// assets, so skip the preconnect (and any unsplash reference) for them.
const usesUnsplash = JSON.stringify(config).includes("images.unsplash.com");

// Per-client palette override. Maps config.theme onto the CSS custom properties
// that globals.css declares (and every component reads via var(--…)). Omitted
// keys fall back to the default dark palette in globals.css.
const t = config.theme ?? {};
const themeStyle: React.CSSProperties = {
  ...(t.bg ? { ["--bg" as string]: t.bg } : {}),
  ...(t.surface ? { ["--surface" as string]: t.surface } : {}),
  ...(t.ink ? { ["--ink" as string]: t.ink } : {}),
  ...(t.inkMuted ? { ["--ink-muted" as string]: t.inkMuted } : {}),
  ...(t.accent ? { ["--accent" as string]: t.accent } : {}),
  ...(t.accentHot ? { ["--accent-hot" as string]: t.accentHot } : {}),
  ...(t.bone ? { ["--bone" as string]: t.bone } : {}),
  ...(t.line ? { ["--line" as string]: t.line } : {}),
  ...(t.scheme ? { colorScheme: t.scheme } : {}),
};

export const metadata: Metadata = {
  title: {
    default: `${config.brand.name} — ${config.brand.tagline}`,
    template: `%s · ${brandName}`,
  },
  description,
  metadataBase: new URL(`${siteUrl}/`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: brandName,
    description,
    locale: "ro_RO",
    type: "website",
    siteName: brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: brandName,
    description,
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  other: {
    "msapplication-TileColor": config.theme?.bg ?? "#0A0807",
  },
};

export const viewport: Viewport = {
  themeColor: config.theme?.bg ?? "#0A0807",
  colorScheme: config.theme?.scheme ?? "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ro"
      style={themeStyle}
      className={cn(
        anton.variable,
        fraunces.variable,
        jetbrainsMono.variable,
        spaceGrotesk.variable,
        cormorant.variable,
        syne.variable,
        archivo.variable,
        bricolage.variable
      )}
    >
      <head>
        {usesUnsplash && (
          <>
            <link rel="preconnect" href="https://images.unsplash.com" />
            <link rel="dns-prefetch" href="https://images.unsplash.com" />
          </>
        )}
      </head>
      <body
        style={
          {
            "--grain-url":
              config.theme?.grain === false
                ? "none"
                : `url("${assetPath("/textures/grain.svg")}")`,
          } as React.CSSProperties
        }
      >
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-mono focus:uppercase focus:tracking-[0.22em] focus:text-[var(--bg)]"
        >
          Sari la conținut
        </a>
        {!isStartDemo && !isCustomDemo && <PageLoader />}
        {isStartDemo ? children : <LenisProvider>{children}</LenisProvider>}
      </body>
    </html>
  );
}
