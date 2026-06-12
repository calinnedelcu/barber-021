"use client";

// Pagina extra a flagship-ului BRICI (demo-custom) — demonstrează modulul
// „pagină/secțiune extra" din pachetul Custom. Ruta există în build-ul
// fiecărui client (App Router exportă toate rutele), dar pentru ceilalți
// randăm doar o trimitere înapoi — nu e legată de nicăieri la ei.
//
// Pagină CLIENT intenționat: ca entry server, ruta declanșa un bug de React
// Client Manifest în Next 15 (modulele client din demo-custom sunt partajate
// cu ruta "/", iar prerender-ul lui "/" nu mai găsea BriciSite în manifest).
// Metadata (noindex) e în layout.tsx, care rămâne server component.

import Link from "next/link";
import { ACTIVE_SLUG, getActiveClient } from "@/lib/clients";
import { Povestea } from "@/components/sites/demo-custom/Povestea";

export default function PovesteaPage() {
  if (ACTIVE_SLUG !== "demo-custom") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--ink)]">
        <Link href="/" className="underline underline-offset-4">
          ← Înapoi la site
        </Link>
      </main>
    );
  }
  return <Povestea config={getActiveClient()} />;
}
