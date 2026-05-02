import barber021 from "@/content/clients/barber-021.json";
import { loadClientConfig } from "@/lib/config";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { MapSection } from "@/components/sections/MapSection";
import { Booking } from "@/components/sections/Booking";
import { Instagram } from "@/components/sections/Instagram";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const config = loadClientConfig(barber021);

  return (
    <>
      <Nav brandName={config.brand.name} />
      <main id="top">
        <Hero
          brandName={config.brand.name}
          tagline={config.brand.tagline}
          address={config.contact.address}
          phone={config.contact.phone}
        />
        <Manifesto panels={config.manifesto.panels} />
        <Services services={config.services} />
        <Team members={config.team} />
        <Gallery items={config.gallery} />
        <Reviews reviews={config.reviews} />
        <MapSection
          address={config.contact.address}
          hours={config.contact.hours}
          mapCenter={config.contact.mapCenter}
        />
        <Booking services={config.services} whatsapp={config.contact.whatsapp} />
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
