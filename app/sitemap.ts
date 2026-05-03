import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://calinnedelcu.github.io/barber-021";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
