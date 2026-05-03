import { Antonio, Fraunces, JetBrains_Mono } from "next/font/google";

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
