import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/sandbox"],
      },
    ],
    sitemap: "https://barber-021.vercel.app/sitemap.xml",
  };
}
