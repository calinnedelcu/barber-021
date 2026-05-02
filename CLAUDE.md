# BARBER 021

Template reutilizabil Next.js 15 pentru frizerii urbane premium din România. Direcție: **editorial-industrial** cu asseturi 2D custom. Target: Awwwards Site of the Day.

## Plan și mapare skills

- **[docs/BARBER-021-Plan-Constructie.docx](docs/BARBER-021-Plan-Constructie.docx)** — planul complet (15 pași). Citește secțiunea relevantă înainte să atingi cod nou.
- **[docs/SKILLS-MAPPING.md](docs/SKILLS-MAPPING.md)** — ce skills să folosești la fiecare pas. Skill-urile 🔴 critic sunt obligatorii pentru pasul respectiv.

## Stack și constraints

- **Framework**: Next.js 15 App Router + React Server Components + SSG
- **TypeScript**: strict + `noUncheckedIndexedAccess`
- **Styling**: Tailwind v4 cu config în CSS (`@theme`); CSS modules pentru componentele cu identitate vizuală puternică (Hero, Gallery, Manifesto)
- **Animations**: Motion (declarative) + GSAP cu ScrollTrigger/DrawSVG (cinematic) + Lenis (smooth scroll). Lottie pentru loader și form states.
- **Imagini**: `next/image` (AVIF + WebP), duotone overlay pe foto pentru consistență
- **Forms**: React Hook Form + Zod resolver
- **CMS**: Sanity v3 (schema unică, dataset per client)
- **Hosting**: Vercel + Edge runtime + ISR

## Design philosophy — anti-slop

**Niciodată**:
- Inter / Roboto / Arial / system fonts ca display
- Gradient mov pe fundal alb
- Layout "centered hero + 3 cards beneath"
- Iconițe generice Lucide/Heroicons fără adaptare
- shadcn/ui out-of-the-box pentru componente cu identitate
- Animații pe `width`/`height`/`top`/`left` (doar `transform` + `opacity`)
- Easing default browser (folosește `cubic-bezier(0.65, 0, 0.35, 1)` sau `expo.out`)

**Întotdeauna**:
- Fonturi: Anton/Big Shoulders Display + Fraunces + JetBrains/Geist Mono
- Paletă caldă (negru #0A0807, cream #F5EFE6, cupru #D9764D), distribuție 70/20/10
- Asimetrie editorială deliberată; grid-uri rupte intenționat în Hero
- `prefers-reduced-motion` respectat (hook `useReducedMotion`)
- Toate imaginile cu `width`/`height` explicite (CLS <0.05)
- `next/font` (nu `<link>` manual)

## Performance budget (din §6 al planului)

- Lighthouse: 95+ pe **toate** metricile, mobile inclusiv
- LCP <2.0s · CLS <0.05 · JS initial <150kb gzipped
- GSAP/Mapbox/Lottie code-splitted, lazy-loaded la entry de secțiune
- Asseturi: SVG prin SVGO, Lottie max 100KB, texturi PNG 1x/2x cu Squoosh

## Arhitectură (din §3 al planului)

```
app/         — layout.tsx (Lenis + fonts + grain), page.tsx, sandbox/
components/
├── primitives/   — MaskReveal, MagneticButton, KineticText, ParallaxLayer, ScrollPin
├── providers/    — LenisProvider
├── sections/     — Hero, Manifesto, Services, Gallery, Team, Booking, Reviews, Instagram, Contact, Footer
└── ui/           — Heading, Tag, Button
hooks/       — useLenis, useScrollTrigger, useMagnetic, useReducedMotion
lib/         — config (Zod schema), whatsapp (deeplink builder), cn (className util), fonts
content/clients/<slug>.json    — config per client, validat Zod
public/      — textures/, illustrations/, icons/, clients/<slug>/
```

**Reguli arhitecturale**:
- Identitatea vizuală (text, imagini, paletă) izolată în config JSON sau folder asseturi per client
- Codul template-ului **nu se atinge** când onboard un client nou
- Tokens-urile expuse ca CSS custom properties în `globals.css` — temă schimbată per client prin override la 8-10 valori
- Tot textul vine din config (nu hardcoded în JSX)

## Workflow per task

1. **Înainte de cod**: citește secțiunea relevantă din plan + tabelul corespunzător din `docs/SKILLS-MAPPING.md`
2. **În timpul codului**: skill-urile 🔴 critic auto-trigger pe context sau le invoci explicit ("folosește `<nume-skill>`")
3. **Înainte să închei un pas**: rulează `web-design-guidelines` audit pe fișierele noi; rulează `design-motion-principles` dacă pasul a adăugat animații
4. **Comits**: mesaje umane scurte, fără atribuire AI (vezi convențiile git mai jos)

## Convenții git

- Mesaje commit umane, scurte (1-2 propoziții, focus pe *de ce*)
- **Niciodată** `Co-Authored-By: Claude` sau alt trailer de atribuire AI
- **Niciodată** "Generated with Claude Code" footer
- Branch-uri: `feat/<scop-scurt>`, `fix/<scop-scurt>`, `chore/<scop-scurt>`
- PR-uri scurt descriptive, fără atribuire AI

## Comenzi rapide

```bash
npm run dev         # Next.js dev server
npm run typecheck   # tsc --noEmit (rulează des în development)
npm run build       # Production build (verifică bundle size)
npm run lint        # ESLint
```

## Stadiu actual

Pas 1 (Foundation) și Pas 2 (Primitive de animație) — **complete**. Vezi `app/sandbox` pentru testarea primitivelor. Următor: Pas 3 (Hero) — dependent de asseturile prioritare ale designerului (logotype + Hero illustration).
