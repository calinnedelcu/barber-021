# STATUS — drafturi website pentru lead-uri (Sibiu)

_Ultima actualizare: 2026-06-12._

Sursa de adevăr pentru unde am ajuns. Detaliile per client sunt în `docs/<NUME>-DRAFT.md`.
Pricing & vânzare: `docs/PRICING-STRATEGY.md` + configurator `tools/oferta.html`.

## Ce e proiectul
`barber-021` e un **template Next.js multi-client**: tot site-ul se „îmbracă" per client
dintr-un singur JSON (`content/clients/<slug>.json`) + asset-uri în `public/clients/<slug>/`.
Scop: vindem site-uri frizeriilor/saloanelor „fără website" (lead-uri din
`~/Downloads/Leads + Dashboard.xlsx`, foaia „Fara website", rândurile verzi).
**Model de vânzare (schimbat 2026-06-12): FĂRĂ draft per lead înainte de apel** — vindem pe
demo-uri per pachet + portofoliul live; designul unic se construiește după avansul de 50%.
Site-urile existente au fost drafturi pre-apel (modelul vechi) și rămân ca showroom/portofoliu.

## Cum rulezi
**Preview un client:**
```powershell
cd c:\PersonalProjects\website-frizerii\barber-021
$env:NEXT_PUBLIC_CLIENT="hairmann"   # sau: aa-barber | mr-mrs-style | andrei-canciu | barber-021
npm run dev                          # -> http://localhost:3000
```
Schimbi clientul: `Ctrl+C` → `Remove-Item -Recurse -Force .next` → setezi env → `npm run dev`.
**Un singur `next dev` odată** (serverele concurente împart cache-ul `.next`).

**Build TOȚI clienții (ca pe producție):** `node scripts/build-all.mjs` → `dist/<slug>/` + landing.

## 🟢 LIVE (publicat)
Toți clienții sunt live dintr-un singur repo (`calinnedelcu/barber-021`, GitHub Pages, deploy automat la push pe `main`):
- **Landing:** https://calinnedelcu.github.io/barber-021/
- https://calinnedelcu.github.io/barber-021/hairmann/
- https://calinnedelcu.github.io/barber-021/aa-barber/
- https://calinnedelcu.github.io/barber-021/mr-mrs-style/
- https://calinnedelcu.github.io/barber-021/andrei-canciu/
- https://calinnedelcu.github.io/barber-021/nico-beauty-style/ (bespoke live din 2026-06-12)
- https://calinnedelcu.github.io/barber-021/demo-start/ (demo pachet Start, 10 teme)
- https://calinnedelcu.github.io/barber-021/oferta/ (pagina de ofertă client — noindex, fără link pe landing)

Mecanism: workflow-ul rulează `node scripts/build-all.mjs` → fiecare client cu `NEXT_PUBLIC_BASE_PATH=/barber-021/<slug>` în `dist/<slug>/` + landing `dist/index.html`. Ca să adaugi/scoți un client publicat → editezi `CLIENTS` în `scripts/build-all.mjs`.

## Status per client

**Design:** HAIRMANN + barber-021 folosesc compoziția comună (`components/sites/DefaultSite.tsx`).
A'A, Mr&Mrs și Andrei au fiecare **design bespoke complet diferit** în `components/sites/<slug>/`
(layout/tipografie/secțiuni proprii) — dispatch în `app/page.tsx` după slug.

| Client | slug | Design | Date reale | Stare | De confirmat / lipsă |
|--------|------|--------|-----------|-------|----------------------|
| **HAIRMANN** | `hairmann` | dark/cupru (DefaultSite) | ✅ complet | **live, gata** | mapare poză↔barber; prețuri „de la"; bio-uri neutre |
| **A'A Barber** | `aa-barber` | **bespoke neon-dark (albastru-ice)** | ✅ complet | **live, QA făcut** (desktop+tabletă+mobil+meniu) | logo „Barbers Arena"≠A'A?; mapare echipă; poze online mici |
| **Mr&Mrs Style** | `mr-mrs-style` | **bespoke light editorial (crem + salvie)** | ✅ complet | **live, QA făcut** (perfect pe toate dimensiunile) | mapare echipă; IG neconfirmat; cod poștal |
| **Andrei Canciu** | `andrei-canciu` | **bespoke geometric monocrom (bone + clay)** | ✅ **poze reale integrate** (hero salon, 5 galerie, portret, logo) | **live, finalizat** (V1 ales, hero+manifest reparate) | prețuri reale (acum orientative); recenzii reale |
| barber-021 | `barber-021` | dark/cupru (DefaultSite) | demo fictiv (Unsplash) | referință template | — |
| **Demo Start** | `demo-start` | **StartSite dedicat — 10 teme comutabile** (`?tema=`) | fictiv „Atelier Central" (Unsplash) | construit + îmbogățit (recenzii/despre/categorii) | **live** (deploy 2026-06-12) | —
| **BRICI (Custom)** | `demo-custom` | **flagship 3D — 3 variante hero** (`?hero=`), bilingv, `/povestea` | fictiv „BRICI" (Unsplash) | construit, verificat local (typecheck/build/console, fără regresii) | **de ales varianta de hero** + push | |

Toate verificate: typecheck ✓, build ✓ (toți), 0 conținut blocat sub reduced-motion, 0 poze stock, deploy live ✓.

## QA făcut (A'A + Mr&Mrs)
- Verificate secțiune-cu-secțiune pe **desktop (1440) + tabletă (768) + mobil (390) + meniu**.
- Mr&Mrs: perfect, fără modificări.
- A'A: reparat **meniul mobil** (era dropdown scurt prin care se vedea hero-ul → acum overlay full-screen, body-lock, Esc). `components/sites/aa-barber/AANav.tsx`.

## Demo-uri per pachet (noul model de vânzare)
- **Start** ✅ — `demo-start` („Atelier Central", fictiv): one-page vandabil — hero (cu ramă accent), bandou puncte forte, servicii pe categorii (schema `ServiceSchema` a primit `category` opțional), despre (din `manifesto.panels`), galerie 6 poze (mixed grid), recenzii-citate, contact + hartă + WhatsApp. **10 teme comutabile** din switcher sau `?tema=carbune|salvie|cerneala|mahon|teracota|pudra|beton|noapte|bordo|lavanda`. Fără PageLoader/Lenis/animații avansate (gated în `app/layout.tsx`; doar fade-up subtil cu IntersectionObserver + reduced-motion) — alea sunt diferențiatorii tier-elor de sus. Nuanță de onestitate: pe demo apar **citate** din recenzii; serviciul GBP + managementul recenziilor rămâne Signature+. Componente: `components/sites/demo-start/`.
- **Signature** — exemplele = portofoliul live. **Tur ghidat:** deschizi orice site cu `?tur=1` (ex. `…/andrei-canciu/?tur=1`) → bară flotantă care te plimbă prin cele 5 site-uri (Andrei, A'A, Mr&Mrs, Nico, HAIRMANN); parametrul se propagă, linkurile curate trimise lead-urilor NU arată bara (`components/providers/PortfolioTour.tsx`). Link discret „tur ghidat →" și în footer-ul landing-ului. Ofertă recalibrată la ce arată exemplele: Signature include „Animații & micro-interacțiuni" + pagini „la alegere"; exclusivitatea Custom = animații **3D/imersive** (le va demonstra BRICI).
- **Custom** ✅ — `demo-custom` (**„BRICI"**, fictiv): flagship-ul cu tot arsenalul tier-ului. **Hero 3D în 3 variante comutabile** (`?hero=lama|scantei|crom` + pill demo dreapta-jos): briciul crom procedural care se deschide la scroll / scântei-pilitură de oțel / crom lichid (MeshDistortMaterial). **Bilingv RO/EN** real (toggle în nav, `?lang=en`, persistat), **logo custom animat** (SVG draw-on), **pagină extra** `/povestea`, coregrafie **GSAP ScrollTrigger + SplitText** (titluri mascate pe linii, marquee infinit, galerie parallax pe 2 rânduri, CTA-uri magnetice, bară de progres), integrat cu Lenis (`window.__lenis`). Stack ales prin research (2026-06-12): three 0.184 + R3F 9.6 + drei 10.7 + GSAP 3.15 (gratuit comercial post-Webflow). **Perf mobil:** 3D în chunk lazy (~183KB gz, doar aici), poster static întâi, DPR≤1.75, frameloop oprit off-screen, fallback complet la reduced-motion/low-end/fără WebGL; mediu de reflexii 100% procedural (Lightformers, zero download HDRI). ⚠️ Gotcha Next 15: două rute care împart module client (`/` + `/povestea`) pierd intrări din React Client Manifest la export static → `/povestea` e deliberat self-contained (vezi comentariile din `Povestea.tsx`). Fonturi: Bricolage Grotesque (nou, doar BRICI).

✅ **CI reparat (2026-06-12, deploy verde):** push-ul Nico a lăsat build-ul roșu — 2 erori `react/no-unescaped-entities` în `NicoSite.tsx` (ghilimele `"` neescapate; înlocuite cu `”`). Din cauza lor NICIUN client nu se mai deployă. Fixat, pushat, Actions verde — bespoke-ul Nico e live.

## De făcut (TODO)
### Prioritar (înainte de a trimite/vinde)
- [ ] **Confirmări per `docs/*-DRAFT.md`:** maparea poză↔persoană la echipă (ghicită la toți); A'A: relația A'A ↔ „Barbers Arena" (logo); Mr&Mrs: cont Instagram + cod poștal.
- [ ] **Andrei:** prețuri reale + recenzii reale (acum orientative) — de luat de la el la finalizare.
- [ ] Finalizarea reală a fiecărui site se face **după apel**, cu conținutul lor (vezi procesul în pricing).

### Opțional / nice-to-have
- [x] **Pagină de ofertă client-facing** — implementată: `tools/oferta-client.html` (interactivă, comparație feature pe rânduri, logică anti-dublă-taxare, cârlig „push spre Custom"). De construit pachetul împreună pe ecran în apel.
- [ ] `opengraph-image.tsx` fundal hardcodat dark — la Mr&Mrs (light) ușor nepotrivit; de tematizat.
- [ ] `icon.svg` (favicon) e marca barber pentru toți — de făcut per-client.
- [ ] `components/sections/Booking.tsx` = cod mort (nu mai e importat) — se poate șterge.

## 💰 Vânzare / Pricing (vezi `docs/PRICING-STRATEGY.md` + `tools/oferta.html` intern + `tools/oferta-client.html` client)
Model: **setup one-time (50% avans / 50% livrare) + abonament lunar**, contract min. 12 luni, neplătitor TVA.
- **Setup:** Start 1.190 / Signature 2.290 / **Custom 2.690 🎯 (focus — push spre top)**. Strategie (Economist/reverse-decoy, acum pe AMBELE trepte): **„Design unic" e rând în tabelul de feature-uri + add-on 990 pe Start** → Signature (2.290) costă **mai puțin** decât Start + design unic + texte + Google (2.620); Custom (2.690) costă **mai puțin** decât Signature + cele 3 module exclusive (logo+bilingv+pagină extra = 2.980) → fiecare urcare e un no-brainer demonstrabil pe ecran (ambele cârlige afișate în oferta-client). „Standard" redenumit **„Start"** (2026-06-12) ca să nu sune a „alegerea normală"; Start = temă comună personalizată, designul unic începe de la Signature. Ancora externă = prețul agențiilor 4.700–8.000.
- **Abonament:** Esențial 79 / **Activ 149 ⭐** / Pro 249. Mentenanță TEHNICĂ în toate; modificările de conținut scalează (1/lună → nelimitat → nelimitat+prioritate 24h).
- **Add-on one-time:** **Design unic 990 (decoy spre Signature)** · Bilingv 250 · Logo+elemente vizuale custom 290 · Copywriting 190 · Google Business+recenzii+SEO 250 · Pagină extra 150 · Rundă revizii 100.
- **Add-on recurent:** Email pro +29 · Remindere/anti-no-show +49.
- **SCOPE:** doar site + găzduire + **Google Search organic** (SEO local + GBP + recenzii). **FĂRĂ** ședințe foto, social media, reclame plătite.
- Strategiile de vânzare (anti-„cel mai ieftin", ancorare, script apel, obiecții, retenție): `docs/PRICING-STRATEGY.md`.
- **Configurator intern** (override-uri preț, generează text email/WhatsApp): `tools/oferta.html`. **Pagină de ofertă client-facing** (interactivă, fără knob-uri interne — construiești pachetul cu clientul pe call): `tools/oferta-client.html`. Ambele cu prețuri editabile în blocul `CONFIG`. **`oferta-client.html` se publică** la `/barber-021/oferta/` (copiată de `build-all.mjs`; noindex, fără link de pe landing — o trimiți doar tu). `oferta.html` (intern, cu override-uri) rămâne NEpublicat. (Ținute sincronizate la 1.190/2.290/2.690.)

## Arhitectura / ce s-a construit
- **Registry**: `lib/clients.ts` (5 clienți) + `NEXT_PUBLIC_CLIENT` (build-time).
- **Conținut** validat zod în `lib/config.ts`.
- **Brand display** prin config: `hero.titleLines/eyebrow/marquee/coordsLabel/localityLine/scheduleLabel`, `brand.shortName/serial/est/monogramInitials`, `geo`, `seo`. `BrandMark` = inițiale sau glif 021.
- **Teme per-client**: `config.theme` injectat ca CSS vars pe `<html>` în `layout.tsx`. Overlay-urile folosesc `color-mix(var(--bg|--surface))` ca să meargă și pe teme light.
- **Booking via MERO**: NU există formular. `contact.bookingUrl` alimentează butoanele „Programează"; fără el → `tel:`.
- **Deploy multi-client**: `scripts/build-all.mjs` (vezi „LIVE" mai sus). `out/`,`dist/`,`pubtest/` sunt gitignored.
- **Assets**: toate pozele locale trec prin `assetPath()` (basePath). Pozele-sursă brute în `docs/<slug>-source-photos/`.
- **Reduced-motion** (gotcha rezolvat): pattern `initial={reduced?false:{opacity:0,y}}` + `animate={reduced?{...}:undefined}` + `whileInView` (vezi memoria `multi-client-template`).

## Surse de date per client
- HAIRMANN: MERO `mero.ro/p/hairmann` (via reader r.jina.ai), poze CDN MERO + FB.
- A'A Barber: MERO `mero.ro/p/frizeria-fin` (slug înșelător, adresa Luptei 19 confirmă), poze CDN MERO.
- Mr&Mrs: MERO `mero.ro/p/mr-mrs-style`, poze CDN MERO + logo FB.
- Andrei Canciu: Google Maps (4.9★) + logo FB; pozele reale primite de la client (Calin).
- Tehnici: `https://r.jina.ai/<url>` pentru MERO/Maps; geocodare Nominatim. **Mereu verifică adresa** unui profil MERO (capcane cu același nume).

## Fișiere cheie
- `content/clients/*.json` — conținut per client · `lib/clients.ts` registry · `lib/config.ts` schema
- `app/layout.tsx` (temă+metadata) · `app/page.tsx` (dispatch design)
- `components/sites/<slug>/` (bespoke) · `components/sites/DefaultSite.tsx` (comun)
- `scripts/build-all.mjs` (deploy multi-client) · `.github/workflows/deploy.yml`
- `tools/oferta.html` (configurator intern) · `tools/oferta-client.html` (ofertă client-facing) · `docs/PRICING-STRATEGY.md` (strategie)
- `docs/HAIRMANN-DRAFT.md`, `AA-BARBER-DRAFT.md`, `MR-MRS-STYLE-DRAFT.md`, `ANDREI-CANCIU-DRAFT.md`
