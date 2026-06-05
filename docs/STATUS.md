# STATUS — drafturi website pentru lead-uri (Sibiu)

_Ultima actualizare: 2026-06-04._

Sursa de adevăr pentru unde am ajuns. Detaliile per client sunt în `docs/<NUME>-DRAFT.md`.

## Ce e proiectul
`barber-021` e un **template Next.js multi-client**: tot site-ul se „îmbracă" per client
dintr-un singur JSON (`content/clients/<slug>.json`) + asset-uri în `public/clients/<slug>/`.
Scop: facem drafturi personalizate pentru frizerii/saloane „fără website" (lead-uri din
`~/Downloads/Leads + Dashboard.xlsx`, foaia „Fara website", rândurile verzi) ca să le arătăm
la apelul de vânzare.

## Cum rulezi (preview)
```powershell
cd c:\PersonalProjects\website-frizerii\barber-021
$env:NEXT_PUBLIC_CLIENT="hairmann"     # sau: aa-barber | mr-mrs-style | andrei-canciu | barber-021
npm run dev                            # -> http://localhost:3000
```
Schimbi clientul: `Ctrl+C` → `Remove-Item -Recurse -Force .next` → setezi env → `npm run dev`.
**Un singur `next dev` odată** (serverele concurente împart cache-ul `.next` și se încurcă).

## Status per client

**Design:** HAIRMANN + barber-021 folosesc compoziția comună (`components/sites/DefaultSite.tsx`).
A'A, Mr&Mrs și Andrei au fiecare **design bespoke complet diferit** în `components/sites/<slug>/`
(layout/tipografie/secțiuni proprii) — dispatch în `app/page.tsx` după slug.

| Client | slug | Design | Date reale | Stare | De confirmat / lipsă |
|--------|------|--------|-----------|-------|----------------------|
| **HAIRMANN** | `hairmann` | dark/cupru (DefaultSite) | ✅ complet (5.0★/5066, prețuri, 5 echipă, 4 recenzii, ~15 poze, TOP 100 RO) | **gata de arătat** | mapare poză↔barber; prețuri „de la"; bio-uri neutre |
| **A'A Barber** | `aa-barber` | **bespoke: neon-dark modern barber (albastru-ice)** | ✅ complet (4.99★/4050, prețuri, program, 8 galerie, 3 echipă, 4 recenzii) | **gata** | logo „Barbers Arena"≠A'A?; mapare echipă; poze online mici |
| **Mr&Mrs Style** | `mr-mrs-style` | **bespoke: light editorial salon (crem + salvie)** | ✅ complet (5.0★/48, 11 servicii, program, 15 galerie, 3 echipă, 4 recenzii, logo real) | **gata** | mapare echipă; IG neconfirmat; cod poștal 557260 vs 550019 |
| **Andrei Canciu** | `andrei-canciu` | **bespoke: portofoliu geometric monocrom (bone + clay)** | ⚠️ text+logo real; fără poze de lucru | **schelet stilat** | **POZE** (blocate); prețuri reale; recenzii; program complet |
| barber-021 | `barber-021` | dark/cupru (DefaultSite) | demo fictiv (Unsplash) | referință template | — |

Toate verificate: typecheck ✓, build ✓ (toți 5), 0 conținut blocat sub reduced-motion, 0 poze stock.

## De făcut (TODO)

### Prioritar
- [ ] **Andrei Canciu — poze.** IG/FB/Maps blocate, n-are MERO, `andreicanciu.ro` e alt om (IT).
      Trebuie 10–15 poze de pe `@andreicanciu.hairstyle` (le iei tu manual) → `public/clients/andrei-canciu/{hero,gallery}/`,
      apoi adaug în JSON (`gallery` + `hero.backdropUrl`). Plus prețuri/recenzii reale de la el.
- [ ] **Confirmări înainte de trimitere la client** (per `docs/*-DRAFT.md`):
      - maparea poză↔persoană la „Maestrii" (e ghicită la toți)
      - A'A: relația A'A Barber ↔ „Barbers Arena" (logo)
      - Mr&Mrs: contul de Instagram + codul poștal

### Deploy (de decis)
- [ ] GitHub Pages servește **un singur site per repo**. Pentru a avea mai mulți clienți live simultan:
      fie **un repo per client**, fie un host care permite mai multe (Netlify/Vercel/subdomenii).
- [ ] Workflow-ul `Deploy` acceptă deja `client` + `base_path` (inputs manuale sau repo variables `CLIENT`/`BASE_PATH`).

### Opțional / nice-to-have
- [ ] Pagină **index/landing** care listează toate drafturile (cerută anterior, neimplementată).
- [ ] `opengraph-image.tsx` are fundal hardcodat `#0A0807` (dark) — la Mr&Mrs (light) e ușor nepotrivit; de tematizat.
- [ ] `icon.svg` (favicon) e marca barber pentru toți — de făcut per-client.
- [ ] `components/sections/Booking.tsx` e cod mort (nu mai e importat) — se poate șterge.
- [ ] Rafinări de culoare dacă se cer (ex. verde Mr&Mrs mai saturat, albastru A'A mai electric).

## Arhitectura / ce s-a construit
- **Registry**: `lib/clients.ts` (5 clienți) + `NEXT_PUBLIC_CLIENT` (build-time).
- **Conținut** validat zod în `lib/config.ts`.
- **Brand display** prin config: `hero.titleLines/eyebrow/marquee/coordsLabel/localityLine/scheduleLabel`,
  `brand.shortName/serial/est/monogramInitials`, `geo`, `seo`. `BrandMark` = inițiale sau glif 021.
- **Teme per-client**: `config.theme` (scheme/bg/surface/ink/inkMuted/accent/accentHot/bone/line)
  injectat ca CSS vars pe `<html>` în `layout.tsx`. Overlay-urile din componente folosesc
  `color-mix(var(--bg|--surface))` ca să meargă și pe teme light. `themeColor`/`colorScheme` derivă din temă.
- **Booking via MERO**: NU există formular. `contact.bookingUrl` (pagina MERO) alimentează butoanele
  „Programează" din Nav/Hero/Footer (extern); fără el → `tel:`.
- **Secțiuni condiționate**: Reviews (doar dacă există), Team (ascuns dacă gol), Instagram (dacă există),
  Manifesto backdrop (opțional).
- **Assets**: toate pozele locale trec prin `assetPath()` (basePath GitHub Pages). Pozele-sursă brute
  stau în `docs/<slug>-source-photos/` (în afara `public/`).

## Surse de date per client (de unde am tras)
- HAIRMANN: MERO `mero.ro/p/hairmann` (via reader r.jina.ai), poze CDN MERO + FB; TOP 100 of Romania.
- A'A Barber: MERO `mero.ro/p/frizeria-fin` (slug înșelător, dar adresa Luptei 19 confirmă), poze CDN MERO.
- Mr&Mrs: MERO `mero.ro/p/mr-mrs-style`, poze CDN MERO + logo FB.
- Andrei Canciu: doar Google Maps (4.9★) + logo FB `hairstylingsibiu`; restul blocat.
- Tehnici: `https://r.jina.ai/<url>` pentru MERO/Maps (blocheză fetch direct); geocodare Nominatim.
  **Mereu verifică adresa** unui profil MERO înainte să-l folosești (există capcane cu același nume).

## Fișiere cheie
- `content/clients/*.json` — conținutul fiecărui client
- `lib/clients.ts` — registry; `lib/config.ts` — schema
- `app/layout.tsx` — metadata + injectare temă; `app/page.tsx` — compunerea secțiunilor
- `components/sections/*` — secțiunile; `components/primitives/BrandMark.tsx` — marca
- `docs/HAIRMANN-DRAFT.md`, `AA-BARBER-DRAFT.md`, `MR-MRS-STYLE-DRAFT.md`, `ANDREI-CANCIU-DRAFT.md`
