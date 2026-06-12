import Image from "next/image";
import type { ClientConfig } from "@/lib/config";
import { buildWhatsAppDeeplink } from "@/lib/whatsapp";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Reveal } from "./Reveal";

/**
 * Demo site for the START package. Scope = the tier's promise (one page:
 * hero, servicii, galerie 6 poze, buton MERO standard, contact + hartă) plus
 * the content any salon owner can hand over (citate din recenzii, „despre",
 * puncte forte) — enough to feel buyable. What it deliberately does NOT have:
 * bespoke layout, custom logo (text wordmark only), advanced animations
 * (only a gentle fade-up + hover transitions), multi-page. Those sell the
 * upper tiers. 7 selectable themes, same skeleton (see ThemeSwitcher).
 */
export function StartSite({ config }: { config: ClientConfig }) {
  const { brand, contact, services, reviews } = config;
  const photos = config.gallery.slice(0, 6);
  const highlights = (config.hero?.marquee ?? []).slice(0, 4);
  const about = config.manifesto.panels.slice(0, 3);
  const [lng, lat] = contact.mapCenter;
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ro`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;
  const bookingHref = contact.bookingUrl ?? telHref;
  const whatsappHref = buildWhatsAppDeeplink({
    phone: contact.whatsapp,
    customMessage: "Salut! Aș vrea o programare.",
  });

  // Grupare pe categorii, în ordinea primei apariții din JSON.
  const categories: string[] = [];
  for (const s of services) {
    const c = s.category ?? "Servicii";
    if (!categories.includes(c)) categories.push(c);
  }

  return (
    <div id="top" className="start-site bg-[var(--bg)] text-[var(--ink)]">
      <style>{`
        .start-site{font-family:var(--sd-body,var(--font-archivo)),system-ui,sans-serif}
        .start-site .sd-head{font-family:var(--sd-head,var(--font-anton)),serif;text-transform:var(--sd-case,uppercase);letter-spacing:var(--sd-track,0.03em);font-weight:var(--sd-weight,700);line-height:1.08}
        .start-site .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:.65rem;padding:.72rem 1.3rem;font-weight:600;font-size:.95rem;background:var(--accent);color:var(--bg);border:1px solid transparent;transition:background var(--dur-fast) var(--ease-default),transform var(--dur-fast) var(--ease-default)}
        .start-site .btn:hover{background:var(--accent-hot);transform:translateY(-1px)}
        .start-site .btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
        .start-site .btn.ghost:hover{background:var(--surface);border-color:var(--ink-muted);transform:translateY(-1px)}
        .start-site .kicker{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:var(--accent)}
        @media (prefers-reduced-motion: no-preference){
          .start-site .sd-rise{animation:sd-rise .65s var(--ease-expo-out) both}
          @keyframes sd-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        }
      `}</style>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <a href="#top" className="sd-head text-[1.05rem]">
            {brand.shortName ?? brand.name}
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[var(--ink-muted)] md:flex">
            <a href="#servicii" className="transition-colors hover:text-[var(--ink)]">Servicii</a>
            <a href="#despre" className="transition-colors hover:text-[var(--ink)]">Despre</a>
            <a href="#galerie" className="transition-colors hover:text-[var(--ink)]">Galerie</a>
            <a href="#recenzii" className="transition-colors hover:text-[var(--ink)]">Recenzii</a>
            <a href="#contact" className="transition-colors hover:text-[var(--ink)]">Contact</a>
          </nav>
          <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn !px-4 !py-2 text-sm">
            Programează
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
          <div className="sd-rise">
            {config.hero?.eyebrow && <p className="kicker mb-4">{config.hero.eyebrow}</p>}
            <h1 className="sd-head text-[length:var(--fs-700)]">{brand.name}</h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--ink-muted)]">
              {brand.tagline} Programări online sau telefonic — fără așteptare.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                Programează-te pe MERO
              </a>
              <a href={telHref} className="btn ghost">
                {contact.phone}
              </a>
            </div>
            <p className="mt-8 text-sm text-[var(--ink-muted)]">
              {contact.address}
              {brand.est && <> · din {brand.est}</>} · {contact.hours[0]?.day}{" "}
              {contact.hours[0]?.hours}
            </p>
          </div>
          <div className="relative sd-rise">
            <div
              aria-hidden
              className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-xl border-2 border-[var(--accent)] sm:block"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--line)] lg:aspect-[4/5]">
              {config.hero?.backdropUrl && (
                <Image
                  src={config.hero.backdropUrl}
                  alt={`${brand.name} — interiorul salonului`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Puncte forte ─────────────────────────────────────────────── */}
        {highlights.length > 0 && (
          <section className="border-y border-[var(--line)] bg-[var(--surface)]">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-2.5 px-5 py-5 sm:grid-cols-2 lg:flex lg:items-center lg:justify-between">
              {highlights.map((item) => (
                <p key={item} className="text-sm text-[var(--ink-muted)]">
                  <span aria-hidden className="mr-2 text-[var(--accent)]">◆</span>
                  {item}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── Servicii pe categorii ────────────────────────────────────── */}
        <section id="servicii" className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <Reveal>
            <p className="kicker">01 · Servicii</p>
            <h2 className="sd-head mt-3 text-[length:var(--fs-600)]">Servicii & prețuri</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {categories.map((cat, ci) => (
              <Reveal key={cat} delay={ci * 70}>
                <div className="h-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
                  <h3 className="sd-head text-[1rem] text-[var(--accent)]">{cat}</h3>
                  <ul className="mt-3">
                    {services
                      .filter((s) => (s.category ?? "Servicii") === cat)
                      .map((service) => (
                        <li
                          key={service.id}
                          className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-3.5 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-semibold">{service.name}</p>
                            {service.description && (
                              <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <p className="shrink-0 text-right">
                            <span className="block font-semibold">{service.price} lei</span>
                            <span className="text-xs text-[var(--ink-muted)]">{service.duration}</span>
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Despre ───────────────────────────────────────────────────── */}
        <section id="despre" className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-20">
            <Reveal className="relative order-last lg:order-first">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--line)]">
                {config.manifesto.backdropUrl && (
                  <Image
                    src={config.manifesto.backdropUrl}
                    alt={`${brand.name} — atmosfera din salon`}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="kicker">02 · Despre</p>
                <h2 className="sd-head mt-3 text-[length:var(--fs-600)]">
                  De ce {brand.shortName ?? brand.name}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-6">
                {about.map((panel, i) => (
                  <Reveal key={panel.title} delay={i * 70}>
                    <div className="flex gap-4">
                      <span className="sd-head mt-0.5 shrink-0 text-[1rem] text-[var(--accent)]">
                        {panel.eyebrow}
                      </span>
                      <div>
                        <h3 className="font-semibold">{panel.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                          {panel.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Galerie (exact 6 poze) ───────────────────────────────────── */}
        <section id="galerie" className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <Reveal>
            <p className="kicker">03 · Galerie</p>
            <h2 className="sd-head mt-3 text-[length:var(--fs-600)]">Din salon</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {photos.map((src, i) => (
              <Reveal
                key={src}
                delay={i * 50}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <div
                  className={`group relative overflow-hidden rounded-lg border border-[var(--line)] ${
                    i === 0 ? "h-full min-h-full" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${brand.name} — galerie ${i + 1}`}
                    fill
                    sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Recenzii ─────────────────────────────────────────────────── */}
        {reviews.length > 0 && (
          <section id="recenzii" className="border-y border-[var(--line)] bg-[var(--surface)]">
            <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
              <Reveal>
                <p className="kicker">04 · Recenzii</p>
                <h2 className="sd-head mt-3 text-[length:var(--fs-600)]">Ce spun clienții</h2>
              </Reveal>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {reviews.slice(0, 3).map((review, i) => (
                  <Reveal key={review.id} delay={i * 80}>
                    <figure className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--bg)] p-6">
                      <p aria-label="5 din 5 stele" className="tracking-[0.25em] text-[var(--accent)]">
                        ★★★★★
                      </p>
                      <blockquote className="mt-4 flex-1 leading-relaxed">
                        „{review.quote}”
                      </blockquote>
                      <figcaption className="mt-5 text-sm text-[var(--ink-muted)]">
                        <span className="font-semibold text-[var(--ink)]">{review.author}</span>
                        {review.source && <> · {review.source}</>}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact + hartă ──────────────────────────────────────────── */}
        <section id="contact" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Reveal>
              <p className="kicker">05 · Contact</p>
              <h2 className="sd-head mt-3 text-[length:var(--fs-600)]">Ne găsești ușor</h2>
            </Reveal>
            <div className="mt-8 space-y-5 text-[var(--ink-muted)]">
              <p>
                <a
                  href={telHref}
                  className="text-xl font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                >
                  {contact.phone}
                </a>
              </p>
              <p>
                {contact.address} ·{" "}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
                >
                  indicații în Maps
                </a>
              </p>
              <dl className="max-w-xs space-y-2 pt-2">
                {contact.hours.map((row) => (
                  <div
                    key={row.day}
                    className="flex justify-between gap-6 border-b border-[var(--line)] pb-2 text-sm"
                  >
                    <dt>{row.day}</dt>
                    <dd className="font-medium text-[var(--ink)]">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                Programează-te pe MERO
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn ghost">
                Scrie-ne pe WhatsApp
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--line)]">
            <iframe
              src={embedUrl}
              title={`Harta — ${contact.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[340px] w-full border-0"
            />
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 pb-24 text-sm text-[var(--ink-muted)] sm:flex-row sm:items-center">
          <p>
            <span className="sd-head text-[0.95rem] text-[var(--ink)]">
              {brand.shortName ?? brand.name}
            </span>
            {brand.est && <span> · din {brand.est}</span>}
          </p>
          <nav className="flex gap-5">
            <a href="#servicii" className="transition-colors hover:text-[var(--ink)]">Servicii</a>
            <a href="#galerie" className="transition-colors hover:text-[var(--ink)]">Galerie</a>
            <a href="#contact" className="transition-colors hover:text-[var(--ink)]">Contact</a>
          </nav>
          <p>Site demonstrativ · pachetul Start — alegi una din cele 7 teme.</p>
        </div>
      </footer>

      <ThemeSwitcher />
    </div>
  );
}
