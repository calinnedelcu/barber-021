import type { MetadataRoute } from "next";
import { getActiveClient } from "@/lib/clients";

export const dynamic = "force-static";

const SITE = getActiveClient().seo?.siteUrl ?? "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/sandbox"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
