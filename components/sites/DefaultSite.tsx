import type { ClientConfig } from "@/lib/config";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { MapSection } from "@/components/sections/MapSection";
import { Instagram } from "@/components/sections/Instagram";
import { Footer } from "@/components/sections/Footer";

/**
 * The original shared composition. Used by clients that don't have a bespoke
 * site (currently hairmann + the barber-021 demo).
 */
export function DefaultSite({ config }: { config: ClientConfig }) {
  const { brand, hero, geo } = config;

  const titleLines: [string, string] =
    hero?.titleLines ??
    (() => {
      const parts = brand.name.split(/\s+/).filter(Boolean);
      if (parts.length <= 1) return [brand.name, ""] as [string, string];
      return [parts.slice(0, -1).join(" "), parts[parts.length - 1] ?? ""];
    })();

  const navMeta = [
    brand.est ? `EST. ${brand.est}` : null,
    geo?.region,
    geo?.localityCountry?.replace(/ · RO$/, ""),
  ]
    .filter(Boolean)
    .join(" · ");

  const phoneTel = `tel:${config.contact.phone.replace(/\s+/g, "")}`;
  const bookingHref = config.contact.bookingUrl ?? phoneTel;
  const bookingExternal = Boolean(config.contact.bookingUrl);

  return (
    <>
      <Nav
        brandName={brand.shortName ?? brand.name}
        metaLine={navMeta}
        monogramInitials={brand.monogramInitials}
        bookingHref={bookingHref}
        bookingExternal={bookingExternal}
      />
      <main id="top">
        <Hero
          brandName={brand.shortName ?? brand.name}
          tagline={brand.tagline}
          address={config.contact.address}
          phone={config.contact.phone}
          backdropUrl={hero?.backdropUrl}
          eyebrow={hero?.eyebrow ?? brand.tagline}
          titleLines={titleLines}
          localityLine={hero?.localityLine ?? config.contact.address}
          coordsLabel={
            hero?.coordsLabel ??
            `${config.contact.mapCenter[1].toFixed(4)}° N · ${config.contact.mapCenter[0].toFixed(4)}° E`
          }
          scheduleLabel={hero?.scheduleLabel ?? "Luni → Sâmbătă"}
          serial={brand.serial ?? brand.name}
          est={brand.est}
          marquee={hero?.marquee ?? [brand.name, config.contact.address]}
          monogramInitials={brand.monogramInitials}
          bookingHref={bookingHref}
          bookingExternal={bookingExternal}
        />
        <Services services={config.services} />
        <Team members={config.team} />
        <Manifesto
          panels={config.manifesto.panels}
          backdropUrl={config.manifesto.backdropUrl}
        />
        <Gallery items={config.gallery} />
        {config.reviews.length > 0 && <Reviews reviews={config.reviews} />}
        <MapSection
          address={config.contact.address}
          hours={config.contact.hours}
          mapCenter={config.contact.mapCenter}
          region={geo?.region ?? ""}
          localityCountry={geo?.localityCountry ?? ""}
          headlineLead={geo?.mapHeadlineLead ?? "Ne găsești"}
          headlineAccent={geo?.mapHeadlineAccent ?? "ușor"}
        />
        {config.instagram && (
          <Instagram
            handle={config.instagram.handle}
            posts={config.instagram.posts}
          />
        )}
        <Footer config={config} />
      </main>
    </>
  );
}
