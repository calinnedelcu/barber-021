import type { MetadataRoute } from "next";
import { getActiveClient } from "@/lib/clients";

export const dynamic = "force-static";

const SITE = getActiveClient().seo?.siteUrl ?? "https://example.com";

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
