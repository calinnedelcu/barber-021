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
    tagline: z.string(),
    logoVariant: z.string().default("primary"),
  }),
  theme: z
    .object({
      bg: z.string().optional(),
      surface: z.string().optional(),
      ink: z.string().optional(),
      inkMuted: z.string().optional(),
      accent: z.string().optional(),
      accentHot: z.string().optional(),
      bone: z.string().optional(),
    })
    .optional(),
  manifesto: z.object({
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
