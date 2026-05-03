import type { Metadata } from "next";
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
  metadataBase: new URL("https://barber-021.vercel.app"),
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
      <body>
        <PageLoader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
