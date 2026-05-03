"use client";

import { MaskReveal } from "@/components/primitives/MaskReveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { buildWhatsAppDeeplink } from "@/lib/whatsapp";
import type { ClientConfig } from "@/lib/config";

interface FooterProps {
  config: ClientConfig;
}

export function Footer({ config }: FooterProps) {
  const { brand, contact, social } = config;
  const wa = buildWhatsAppDeeplink({ phone: contact.whatsapp });

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[var(--bg)] pt-24 sm:pt-32"
      aria-labelledby="footer-heading"
    >
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 pb-20">
          {/* CTA block */}
          <div className="col-span-12 md:col-span-7">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 04 — Contact</MaskReveal>
            </span>
            <h2
              id="footer-heading"
              className="text-display mt-8 text-[length:var(--fs-800)] leading-[0.85]"
            >
              <MaskReveal duration={1.1} delay={0.15}>
                <span className="block">Treci pe</span>
              </MaskReveal>
              <MaskReveal duration={1.1} delay={0.3}>
                <span className="block text-[var(--accent)]">la noi.</span>
              </MaskReveal>
            </h2>
            <p className="mt-8 max-w-md text-[length:var(--fs-400)] leading-[1.5] text-[var(--ink-muted)]">
              <MaskReveal duration={0.9} delay={0.45}>
                Sună, scrie pe WhatsApp sau lasă un semn — îți răspundem în maxim 30 de minute în
                programul de lucru.
              </MaskReveal>
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <MagneticButton
                as="a"
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                WhatsApp
              </MagneticButton>
              <MagneticButton
                as="a"
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                variant="ghost"
              >
                Sună-ne
              </MagneticButton>
            </div>
          </div>

          {/* contact details */}
          <div className="col-span-12 md:col-span-5 md:pl-6">
            <ul className="grid gap-8 text-mono text-[length:var(--fs-200)] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              <li>
                <span className="block text-[length:var(--fs-100)] tracking-[0.3em] text-[var(--accent)]">
                  Adresă
                </span>
                <span className="mt-2 block normal-case tracking-normal text-[var(--ink)]">
                  {contact.address}
                </span>
              </li>
              <li>
                <span className="block text-[length:var(--fs-100)] tracking-[0.3em] text-[var(--accent)]">
                  Telefon
                </span>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="mt-2 block text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  {contact.phone}
                </a>
              </li>
              {contact.email && (
                <li>
                  <span className="block text-[length:var(--fs-100)] tracking-[0.3em] text-[var(--accent)]">
                    Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-2 block normal-case tracking-normal text-[var(--ink)] hover:text-[var(--accent)]"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <span className="block text-[length:var(--fs-100)] tracking-[0.3em] text-[var(--accent)]">
                  Program
                </span>
                <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 normal-case tracking-normal">
                  {contact.hours.map((h) => (
                    <div key={h.day} className="contents">
                      <dt className="text-[var(--ink)]">{h.day}</dt>
                      <dd className="tabular-nums text-[var(--ink-muted)]">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized brand mark — like an editorial colophon */}
        <div
          aria-hidden
          className="text-display select-none border-t border-[var(--line)] pt-10 text-[clamp(5rem,18vw,16rem)] leading-[0.85]"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px var(--ink)",
          }}
        >
          BARBER 021
        </div>

        {/* Colophon strip */}
        <div className="hairline mt-6 flex flex-col gap-3 py-6 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {brand.name} · Toate drepturile rezervate
          </span>
          <span className="flex flex-wrap gap-5">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--ink)]"
              >
                Instagram
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--ink)]"
              >
                Facebook
              </a>
            )}
            {social.tiktok && (
              <a
                href={social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--ink)]"
              >
                TikTok
              </a>
            )}
            <span className="text-[var(--accent)]">N° 021 / 2026</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
