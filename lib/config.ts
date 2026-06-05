import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.string(),
  price: z.number().int().nonnegative(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string().optional(),
  portrait: z.string(),
});

export const ReviewSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  source: z.string().optional(),
  /** Optional real photo paired with the quote. Omit → quote-only spread. */
  photo: z.string().optional(),
});

export const HoursSchema = z.object({
  day: z.string(),
  hours: z.string(),
});

export const ClientConfigSchema = z.object({
  slug: z.string(),
  tier: z.enum(["standard", "premium"]).default("standard"),
  brand: z.object({
    name: z.string(),
    /** Compact wordmark for nav / colophon / loader (defaults to `name`). */
    shortName: z.string().optional(),
    tagline: z.string(),
    /** Colophon serial, e.g. "N° HM / 2026". */
    serial: z.string().optional(),
    /** Founding year shown in meta strips, e.g. "2018". */
    est: z.string().optional(),
    /** If set, the brand mark renders these initials instead of the geometric 021 glyph. */
    monogramInitials: z.string().optional(),
    logoVariant: z.string().default("primary"),
  }),
  hero: z
    .object({
      backdropUrl: z.string().optional(),
      /** Small kicker above the title, e.g. "Frizerie urbană · cu intenție". */
      eyebrow: z.string().optional(),
      /** Two display lines of the big hero type, e.g. ["HAIR", "MANN"]. */
      titleLines: z.tuple([z.string(), z.string()]).optional(),
      /** Vertical left-rail line, e.g. "Sibiu · Centrul Vechi · 2016→". */
      localityLine: z.string().optional(),
      /** Coordinates label in the top meta strip, e.g. "45.7983° N · 24.1499° E". */
      coordsLabel: z.string().optional(),
      /** Short schedule label in the right rail, e.g. "Marți → Sâmb.". */
      scheduleLabel: z.string().optional(),
      /** Bottom marquee tokens. */
      marquee: z.array(z.string()).optional(),
    })
    .optional(),
  geo: z
    .object({
      /** Map top-right region label, e.g. "Centrul Vechi". */
      region: z.string().optional(),
      /** Map bottom-right locality, e.g. "Sibiu · RO". */
      localityCountry: z.string().optional(),
      /** Location section headline — plain lead + accent fragment. */
      mapHeadlineLead: z.string().optional(),
      mapHeadlineAccent: z.string().optional(),
    })
    .optional(),
  seo: z
    .object({
      /** Canonical site URL (no trailing slash), e.g. "https://calinnedelcu.github.io/hairmann". */
      siteUrl: z.string().optional(),
      description: z.string().optional(),
      /** OG image kicker line. */
      ogEyebrow: z.string().optional(),
    })
    .optional(),
  theme: z
    .object({
      /** "light" or "dark" — drives native UI (form controls, scrollbars). */
      scheme: z.enum(["light", "dark"]).optional(),
      bg: z.string().optional(),
      surface: z.string().optional(),
      ink: z.string().optional(),
      inkMuted: z.string().optional(),
      accent: z.string().optional(),
      accentHot: z.string().optional(),
      bone: z.string().optional(),
      /** Hairline color (e.g. "rgb(43 38 34 / 0.12)"). */
      line: z.string().optional(),
      /** Set false to drop the global film-grain overlay (e.g. clean/light sites). */
      grain: z.boolean().optional(),
    })
    .optional(),
  manifesto: z.object({
    /** Optional parallax backdrop image (e.g. a blueprint). Omitted → clean dark section. */
    backdropUrl: z.string().optional(),
    panels: z
      .array(
        z.object({
          eyebrow: z.string(),
          title: z.string(),
          body: z.string(),
        })
      )
      .min(1),
  }),
  services: z.array(ServiceSchema).min(1),
  gallery: z.array(z.string()).default([]),
  team: z.array(TeamMemberSchema).default([]),
  reviews: z.array(ReviewSchema).default([]),
  instagram: z
    .object({
      handle: z.string(),
      posts: z.array(z.string()).default([]),
    })
    .optional(),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
    address: z.string(),
    mapCenter: z.tuple([z.number(), z.number()]),
    hours: z.array(HoursSchema),
    email: z.string().email().optional(),
    /** External booking URL (e.g. the client's MERO page). Drives the "Programează" CTAs. */
    bookingUrl: z.string().url().optional(),
  }),
  social: z
    .object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .default({}),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type Review = z.infer<typeof ReviewSchema>;

export function loadClientConfig(raw: unknown): ClientConfig {
  return ClientConfigSchema.parse(raw);
}
