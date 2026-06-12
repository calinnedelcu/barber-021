"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ClientConfig } from "@/lib/config";

// Pagina extra inclusă în pachetul Custom — demonstrată ca pagină reală
// (/povestea), nu ca secțiune. Ținută intenționat ușoară: fără 3D, fără GSAP,
// doar reveal-uri CSS.
//
// ATENȚIE: fișierul e deliberat SELF-CONTAINED (nu importă copy.ts/BriciLogo
// ca BriciSite). Când ruta /povestea împărțea module client cu ruta "/",
// webpack-ul din Next 15 pierdea intrarea BriciSite din React Client Manifest
// și prerender-ul lui "/" pica. Duplicarea măruntă de mai jos e prețul.

type Lang = "ro" | "en";

const T = {
  ro: {
    kicker: "Pagina extra — inclusă în Custom",
    title: "Povestea",
    back: "← Înapoi la site",
    body1:
      "BRICI s-a născut dintr-o frustrare simplă: tunsul devenise o tranzacție. Intri, aștepți, ieși. Nimeni nu se mai uita la forma capului tău, la firul de păr, la cum cade lumina pe linia maxilarului.",
    body2:
      "Așa că am construit opusul: un atelier în care fiecare client are timpul lui, scula e calibrată, iar briciul — briciul e religie. Trei oameni, o singură școală: precizia.",
    values: ["Lamă nouă la fiecare client", "Zero grabă, zero compromis", "Produse pe care le folosim și noi"],
    teamTitle: "Trei lame, o singură școală",
    roles: { darius: "Master barber", alex: "Fade specialist", robert: "Brici & barbă" } as Record<string, string>,
  },
  en: {
    kicker: "The extra page — included in Custom",
    title: "The story",
    back: "← Back to the site",
    body1:
      "BRICI was born out of a simple frustration: getting a haircut had become a transaction. Walk in, wait, walk out. Nobody looked at the shape of your head anymore, at the hair itself, at how light falls on the jawline.",
    body2:
      "So we built the opposite: a workshop where every client gets their own time, the tools are calibrated, and the razor — the razor is religion. Three people, one school: precision.",
    values: ["A fresh blade for every client", "No rush, no compromise", "Products we use ourselves"],
    teamTitle: "Three blades, one school",
    roles: { darius: "Master barber", alex: "Fade specialist", robert: "Razor & beard" } as Record<string, string>,
  },
} as const;

export function Povestea({ config }: { config: ClientConfig }) {
  const [lang, setLang] = useState<Lang>("ro");
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem("brici-lang");
    if ((fromUrl ?? saved) === "en") setLang("en");
  }, []);
  const t = T[lang];
  const { team } = config;

  return (
    <div
      className="brici-story min-h-screen bg-[var(--bg)] text-[var(--ink)]"
      style={{ fontFamily: "var(--font-archivo), sans-serif" }}
    >
      <style>{`
        .brici-story .bd{font-family:var(--font-bricolage),sans-serif;font-weight:800;letter-spacing:-0.015em;line-height:1.04}
        .brici-story .kicker{font-family:var(--font-jetbrains-mono),monospace;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.24em;color:var(--accent)}
        @media (prefers-reduced-motion: no-preference){
          .brici-story .rise{animation:story-rise .7s cubic-bezier(.16,1,.3,1) both}
          .brici-story .rise-2{animation-delay:.12s}
          .brici-story .rise-3{animation-delay:.24s}
          @keyframes story-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        }
      `}</style>

      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" aria-label="BRICI — acasă" className="bd text-[1.1rem] tracking-[0.08em]">
            BRICI
          </Link>
          <Link href="/" className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">
            {t.back}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-20">
        <p className="kicker rise">{t.kicker}</p>
        <h1 className="bd rise rise-2 mt-4 text-[length:var(--fs-700)]">{t.title}</h1>

        <div className="rise rise-3 mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-[var(--ink-muted)]">
          <p>{t.body1}</p>
          <p>{t.body2}</p>
        </div>

        <ul className="rise rise-3 mt-12 grid gap-4 sm:grid-cols-3">
          {t.values.map((value) => (
            <li key={value} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <span aria-hidden className="text-[var(--accent)]">◆</span>
              <p className="mt-2 font-semibold">{value}</p>
            </li>
          ))}
        </ul>

        {team.length > 0 && (
          <section className="mt-20">
            <h2 className="bd text-[length:var(--fs-600)]">{t.teamTitle}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {team.map((member) => (
                <article key={member.id}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--line)]">
                    <Image
                      src={member.portrait}
                      alt={member.name}
                      fill
                      sizes="(min-width: 640px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="bd mt-3 text-[1.15rem]">{member.name}</h3>
                  <p className="kicker mt-1 !tracking-[0.18em]">{t.roles[member.id] ?? member.role}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 border-t border-[var(--line)] pt-8">
          <Link href="/" className="text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">
            {t.back}
          </Link>
        </div>
      </main>
    </div>
  );
}
