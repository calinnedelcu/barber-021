import {
  Antonio,
  Fraunces,
  JetBrains_Mono,
  Space_Grotesk,
  Cormorant_Garamond,
  Syne,
  Archivo,
} from "next/font/google";

// Display font — Antonio is a condensed sans-serif with full Romanian
// diacritic support (Ă, Â, Î, Ș, Ț). Replaces Anton which lacked them.
export const anton = Antonio({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-anton",
});

export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// --- Extra faces available to bespoke per-client sites (all with RO diacritics) ---

// Geometric grotesk — modern, technical, masculine. Good for A'A / Andrei.
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-grotesk",
});

// High-fashion serif — elegant, editorial, airy. Good for Mr&Mrs.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});

// Artsy display — geometric, fashion-forward. Good for Andrei Canciu.
export const syne = Syne({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-syne",
});

// Versatile workhorse sans (wide weight range). General-purpose body/UI.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-archivo",
});
