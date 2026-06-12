// Bilingual copy for the BRICI flagship. Romanian is canonical and lives in
// content/clients/demo-custom.json; this file holds the UI strings for both
// languages plus the English overrides for JSON-driven content (services,
// reviews, manifesto, team bios) keyed by id/index.

export type Lang = "ro" | "en";

export const UI = {
  ro: {
    nav: { manifest: "Manifest", servicii: "Servicii", galerie: "Galerie", echipa: "Echipa", contact: "Contact", cta: "Programează" },
    hero: {
      kicker: "Barbershop · Sibiu",
      sub: "Frizerie de precizie, în inima Sibiului. Tuns, fade și ras tradițional cu brici — pe programare.",
      cta: "Programează-te pe MERO",
      ctaGhost: "Vezi serviciile",
      scroll: "Derulează",
    },
    manifest: { kicker: "01 · Manifest", title: "Tăiem zgomotul." },
    services: { kicker: "02 · Servicii", title: "Meniul", note: "Prețurile includ consultația. Plata cash sau card.", cta: "Rezervă-ți locul" },
    gallery: { kicker: "03 · Galerie", title: "Lucrări & atelier" },
    team: { kicker: "04 · Echipa", title: "Trei lame, o singură școală", more: "Povestea completă" },
    reviews: { kicker: "05 · Recenzii", title: "Se duce vorba", badge: "5,0 pe Google" },
    contact: {
      kicker: "06 · Contact",
      title: "Vino să ne cunoaștem",
      finale: "Ia-ți locul în scaun.",
      directions: "indicații în Maps",
      whatsapp: "Scrie-ne pe WhatsApp",
      cta: "Programează-te pe MERO",
      cursor: "REZERVĂ",
    },
    footer: {
      demo: "Site demonstrativ · pachetul Custom — design unic, animații 3D, bilingv, pagină extra.",
      story: "Povestea BRICI →",
    },
    // Strings for /povestea live in Povestea.tsx — the page is deliberately
    // self-contained (shared modules across routes broke the client manifest).
  },
  en: {
    nav: { manifest: "Manifesto", servicii: "Services", galerie: "Gallery", echipa: "The team", contact: "Contact", cta: "Book now" },
    hero: {
      kicker: "Barbershop · Sibiu",
      sub: "Precision grooming in the heart of Sibiu. Haircuts, fades and traditional straight-razor shaves — by appointment.",
      cta: "Book on MERO",
      ctaGhost: "See services",
      scroll: "Scroll",
    },
    manifest: { kicker: "01 · Manifesto", title: "We cut the noise." },
    services: { kicker: "02 · Services", title: "The menu", note: "Prices include consultation. Cash or card.", cta: "Reserve your seat" },
    gallery: { kicker: "03 · Gallery", title: "Work & workshop" },
    team: { kicker: "04 · The team", title: "Three blades, one school", more: "The full story" },
    reviews: { kicker: "05 · Reviews", title: "Word gets around", badge: "5.0 on Google" },
    contact: {
      kicker: "06 · Contact",
      title: "Come meet us",
      finale: "Take your seat.",
      directions: "directions in Maps",
      whatsapp: "Message us on WhatsApp",
      cta: "Book on MERO",
      cursor: "BOOK",
    },
    footer: {
      demo: "Demo site · the Custom package — bespoke design, 3D animations, bilingual, extra page.",
      story: "The BRICI story →",
    },
  },
} as const;

/** English overrides for JSON content, keyed by id. RO falls through to JSON. */
export const EN_SERVICES: Record<string, { name: string; description?: string }> = {
  tuns: { name: "Precision haircut", description: "Consultation, scissors and clippers, millimetre finish." },
  fade: { name: "Skin fade", description: "Down to the skin, transitions with no visible line." },
  ras: { name: "Traditional straight-razor shave", description: "Hot towel, warm lather, fresh blade. The full ritual." },
  barba: { name: "Sculpted beard", description: "Razor-sharp contour, oil and balm to finish." },
  combo: { name: "Cut + beard", description: "The full package — save 20 lei." },
  ritual: { name: "Hot towel ritual", description: "Facial reset: hot compresses, short massage, cold lotion." },
};

export const EN_REVIEWS: Record<string, string> = {
  r1: "The cleanest fade in Sibiu. Period.",
  r2: "Came for the haircut, stayed for the ritual. The hot towel resets you completely.",
  r3: "A razor on your throat and complete trust. Craftsmen you rarely find anymore.",
};

export const EN_MANIFESTO: { title: string; body: string }[] = [
  {
    title: "Precision is a religion",
    body: "Every line is drawn exactly once. We measure twice, cut once — steady hand, calibrated razor.",
  },
  {
    title: "Steel, chrome, intent",
    body: "Japanese scissors, a forged razor, products we use ourselves. Nothing accidental, from the first fade to the last detail.",
  },
  {
    title: "A ritual, not an appointment",
    body: "Forty minutes that belong to you: hot towel, good music, zero rush. You walk in a client, you walk out a different man.",
  },
];

export const EN_TEAM: Record<string, { role: string; bio: string }> = {
  darius: { role: "Master barber", bio: "Ten years behind the scissors. Believes a good fade shows its worth two weeks in." },
  alex: { role: "Fade specialist", bio: "There is no «almost perfect». There is perfect, or we cut again." },
  robert: { role: "Razor & beard", bio: "The hand holding the razor does not shake. The rest is warm lather and patience." },
};

export const EN_MARQUEE: string[] = [
  "PRECISION HAIRCUTS",
  "TRADITIONAL STRAIGHT-RAZOR SHAVES",
  "CHROME · STEEL · INTENT",
  "EST. 2026 · PIAȚA MICĂ 4",
  "BOOKINGS ON MERO",
];
