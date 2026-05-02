import barber021 from "@/content/clients/barber-021.json";
import { loadClientConfig } from "@/lib/config";
import { Heading } from "@/components/ui/Heading";
import { Tag } from "@/components/ui/Tag";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { KineticText } from "@/components/primitives/KineticText";
import Link from "next/link";

export default function Home() {
  const config = loadClientConfig(barber021);

  return (
    <main className="min-h-screen">
      {/* Placeholder hero — proper Hero (Pas 3) replaces this once designer assets land */}
      <section className="container-x flex min-h-screen flex-col justify-between pb-12 pt-24">
        <header className="flex items-center justify-between">
          <Tag tone="accent">{config.brand.name}</Tag>
          <Tag>În construcție · Pas 1–2 din plan</Tag>
        </header>

        <div className="grid gap-10 py-16">
          <div>
            <Tag>Hero placeholder</Tag>
          </div>
          <Heading level={1} className="leading-[0.85]">
            <span className="block">
              <KineticText text="BARBER" />
            </span>
            <span className="block text-[var(--accent)]">
              <KineticText text="021" delay={0.15} />
            </span>
          </Heading>

          <p className="max-w-xl text-[length:var(--fs-400)] text-[var(--ink-muted)]">
            <MaskReveal delay={0.6} duration={1}>
              {config.brand.tagline}
            </MaskReveal>
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <MagneticButton variant="primary">Programează</MagneticButton>
            <MagneticButton variant="ghost">Servicii</MagneticButton>
          </div>
        </div>

        <footer className="hairline flex items-center justify-between pt-6 text-[length:var(--fs-100)] text-[var(--ink-muted)]">
          <span className="text-mono">{config.contact.address}</span>
          <Link href="/sandbox" className="text-mono uppercase tracking-[0.22em] hover:text-[var(--ink)]">
            /sandbox →
          </Link>
        </footer>
      </section>
    </main>
  );
}
