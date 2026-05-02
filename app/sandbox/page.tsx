import { Heading } from "@/components/ui/Heading";
import { Tag } from "@/components/ui/Tag";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { KineticText } from "@/components/primitives/KineticText";
import { ParallaxLayer } from "@/components/primitives/ParallaxLayer";
import { ScrollPin } from "@/components/primitives/ScrollPin";
import Link from "next/link";

export default function SandboxPage() {
  return (
    <main className="container-x py-24">
      <header className="mb-20 flex items-baseline justify-between">
        <Tag tone="accent">/sandbox</Tag>
        <Link href="/" className="text-mono uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--ink)]">
          ← acasă
        </Link>
      </header>

      <div className="grid gap-32">
        <Demo title="01 — MaskReveal">
          <MaskReveal>
            <span className="text-[length:var(--fs-600)]">Linii care se ridică ca o cortină.</span>
          </MaskReveal>
        </Demo>

        <Demo title="02 — KineticText">
          <KineticText
            text="BARBER 021"
            as="h2"
            className="text-display text-[length:var(--fs-800)]"
          />
        </Demo>

        <Demo title="03 — MagneticButton">
          <div className="flex flex-wrap gap-6">
            <MagneticButton variant="primary">Programează</MagneticButton>
            <MagneticButton variant="ghost">Vezi galeria</MagneticButton>
          </div>
        </Demo>

        <Demo title="04 — ParallaxLayer">
          <div className="relative h-[60vh] overflow-hidden rounded-sm bg-[var(--surface)]">
            <ParallaxLayer speed={0.3} className="absolute inset-x-0 top-1/4 text-center">
              <span className="text-display text-[length:var(--fs-700)] text-[var(--bone)]">
                slow layer
              </span>
            </ParallaxLayer>
            <ParallaxLayer speed={-0.5} className="absolute inset-x-0 top-1/2 text-center">
              <span className="text-display text-[length:var(--fs-800)] text-[var(--accent)]">
                fast layer
              </span>
            </ParallaxLayer>
          </div>
        </Demo>

        <Demo title="05 — ScrollPin (horizontal)">
          <ScrollPin horizontal distance={3}>
            {["CARE PROFESIONIST", "STIL CONTEMPORAN", "ATMOSFERĂ AUTENTICĂ"].map((label, i) => (
              <div
                key={label}
                className="flex h-screen w-screen flex-shrink-0 items-center justify-center"
                style={{
                  background:
                    i === 1 ? "var(--surface)" : "var(--bg)",
                }}
              >
                <h3 className="text-display text-[length:var(--fs-800)]">{label}</h3>
              </div>
            ))}
          </ScrollPin>
        </Demo>
      </div>
    </main>
  );
}

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="hairline pt-10">
      <Tag className="mb-8 block">{title}</Tag>
      <Heading level={3} variant="plain" className="mb-10 text-display text-[length:var(--fs-500)]">
        {title}
      </Heading>
      <div className="min-h-[20vh]">{children}</div>
    </section>
  );
}
