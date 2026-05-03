import type { Metadata, Viewport } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PageLoader } from "@/components/providers/PageLoader";
import { anton, fraunces, jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BARBER 021 — Frizerie urbană contemporană",
    template: "%s · BARBER 021",
  },
  description:
    "Frizerie urbană premium în București, Sector 3. Tunsoare, barbă cu brici, ritual atent.",
  metadataBase: new URL("https://calinnedelcu.github.io/barber-021/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BARBER 021",
    description: "Frizerie urbană contemporană în București",
    locale: "ro_RO",
    type: "website",
    siteName: "BARBER 021",
  },
  twitter: {
    card: "summary_large_image",
    title: "BARBER 021",
    description: "Frizerie urbană contemporană în București",
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  other: {
    "msapplication-TileColor": "#0A0807",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0807",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ro"
      className={cn(
        anton.variable,
        fraunces.variable,
        jetbrainsMono.variable
      )}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-mono focus:uppercase focus:tracking-[0.22em] focus:text-[var(--bg)]"
        >
          Sari la conținut
        </a>
        <PageLoader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
