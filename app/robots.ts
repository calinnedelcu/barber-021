import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://calinnedelcu.github.io/barber-021";

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
