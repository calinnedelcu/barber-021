# BARBER 021 — Skills mapping

Mapare skill-uri Claude Code per pas de implementare. Companion la `BARBER-021-Plan-Constructie.docx`. Vezi inventarul complet în secțiunea finală.

**Cum se folosesc**: skill-urile cu auto-description se activează singure când Claude detectează context relevant. Pentru declanșare manuală: *"Folosește skill-ul `<nume>` pentru a..."*. Pentru audit-uri: *"Rulează `<nume>` pe `<fișier sau secțiune>`"*.

**Convenții**:
- 🔴 critic — rulează obligatoriu la pasul ăla
- 🟡 recomandat — folosește când e relevant
- ⚪ opțional — disponibil dacă apare nevoie

---

## Pas 0 — Artbook & brief designer

| Skill | Cum | Output așteptat |
|---|---|---|
| 🔴 `ui-ux-pro-max` | Cerere reasoning engine pe product type "barbershop editorial-industrial" | Recomandări paletă + font pairings + product type rules |
| 🔴 `frontend-design` | Validare anti-slop a direcției finale | Confirmare/contraargumente la deciziile vizuale |
| 🔴 `imagegen-frontend-web` | Generare 15-20 reference images Awwwards-level | Mood board pentru artbook PDF |
| 🟡 `industrial-brutalist-ui` | Reference pentru direcția aleasă | Tokens, spacing, type pairing pentru editorial-industrial |
| 🟡 `ckm:brand` / `brandkit` | Brand identity — voce, ton, mood | Brief care merge la designer |
| ⚪ `gpt-taste` / `design-taste-frontend` | Cross-check pe taste decisions | Validare suplimentară |

---

## Pas 1 — Foundation (✅ făcut)

| Skill | Cum | Status |
|---|---|---|
| 🔴 `vercel-react-best-practices` | Setup Next.js 15 + RSC patterns | Aplicat la layout/page setup |
| 🟡 `vercel-composition-patterns` | Arhitectura `components/primitives/` și `components/ui/` | Aplicat |

---

## Pas 2 — Primitive de animație (✅ făcut, polish posibil)

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `design-motion-principles` | Audit pe `MaskReveal`, `MagneticButton`, `KineticText`, `ParallaxLayer`, `ScrollPin` | Validare timings/easings prin lentile Kowalski/Krehel |
| 🟡 `vercel-composition-patterns` | Review API design al primitivelor | Asigură compoziție flexibilă |
| ⚪ `vercel-react-view-transitions` | Alternative native pentru tranziții simple | Reduce dependență Motion unde se poate |

**Acțiune concretă imediat după restart**: rulează *"Folosește `design-motion-principles` să auditezi primitivele din `components/primitives/`"*

---

## Pas 3 — Hero

| Skill | Cum | Output |
|---|---|---|
| 🔴 `industrial-brutalist-ui` | Direcție vizuală pentru kinetic typography + asymmetric stacking | Layout decisions cu identitate proprie |
| 🔴 `frontend-design` | Anti-slop pe Hero compoziție | Detectează patterns generice (centered + 3 cards = nu) |
| 🔴 `design-motion-principles` | Audit stagger reveal + DrawSVG la load | Timings 80-120ms între elemente, durată ≤1.4s |
| 🔴 `high-end-visual-design` | Premium polish | Detalii care duc Hero la nivel Awwwards |
| 🟡 `imagegen-frontend-web` | Reference compositions Hero editorial | Idei concrete de framing înainte să cod |
| 🟡 `vercel-react-best-practices` | LCP <2.0s — preload Hero image, font display swap | Asigură target din §6 |
| ⚪ `image-to-code` | Dacă designerul livrează Hero mock în PNG/PSD | Conversie rapidă mock → cod |

---

## Pas 4 — Servicii + Recenzii + Footer (cu asseturi 2D)

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `industrial-brutalist-ui` | Numerotare brutalistă "01/02/03", negative space deliberat | Direcție §4.3 din plan |
| 🔴 `frontend-design` | Anti-slop pe layout-ul rândurilor servicii și pull-quotes | Evită grid-ul generic de cards |
| 🟡 `design-taste-frontend` | Coerență între cele 3 secțiuni diferite | Toate trei trebuie să se simtă din același decor |
| 🟡 `image-to-code` | Iconițe SVG livrate de designer | Conversie clean cu paths optimizate |
| ⚪ `ckm:ui-styling` | Detalii fine de styling | Polish |

---

## Pas 5 — Galerie cu lightbox custom

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `frontend-design` | Masonry asimetric, frame-uri alternate, ornamente între rânduri | Evită grid-ul predictibil |
| 🔴 `design-motion-principles` | Audit mask reveals + shared-element lightbox tranziție | Stagger natural, nu mecanic |
| 🟡 `vercel-react-view-transitions` | Alternative la Motion `layoutId` pentru shared-element | View Transitions API native |
| 🟡 `vercel-react-best-practices` | Lazy loading agresiv + thumbnails 400px | Galerie 12-15 imagini fără să sparge LCP |

---

## Pas 6 — Manifesto cu ilustrație layered + parallax

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `design-motion-principles` | Audit pinned horizontal scroll + parallax orchestrat pe layers | Cel mai dificil moment de motion |
| 🔴 `industrial-brutalist-ui` | Tipografie editorial, ritm vizual generos | Caracter §4.2 |
| 🟡 `image-to-code` | PSD layers → SVG/PNG individuale animate | Pipeline asseturi |
| 🟡 `frontend-design` | Anti-slop pe compoziția finală | Evită collage-ul generic |

---

## Pas 7 — Echipa

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `industrial-brutalist-ui` | Cadre editoriale, plăci tip "expoziție", typography display nume | Caracter §4.5 |
| 🟡 `frontend-design` | Anti-slop pe team cards | Evită layout-ul "3 round portraits + role text" |
| 🟡 `design-motion-principles` | Hover states reveal nume + specialitate | Tranziție elegantă, nu mecanică |
| ⚪ `vercel-react-view-transitions` | Tranziții B&W → color | Alternativă la CSS filters + Motion |

---

## Pas 8 — Programări + Contact + Instagram

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `vercel-composition-patterns` | Mini-calendar custom — props/state shape | Componentă reutilizabilă, ~200 linii |
| 🔴 `web-design-guidelines` | Audit accesibilitate pe form Contact | RHF + Zod + ARIA correct |
| 🔴 `vercel-react-best-practices` | Server Action pentru form submit (Resend) | Pattern Next.js 15 |
| 🟡 `figma` (MCP) | Dacă Mapbox style e designat în Figma | Direct extract tokens |
| 🟡 `frontend-design` | Floating labels animate, layout split | Anti-slop pe contact form |

---

## Pas 9 — Lottie loader + animații micro

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `design-motion-principles` | Audit micro-feedback + loader timing | Loader 1.5-2s e ușor de greșit |
| 🟡 `industrial-brutalist-ui` | Coerență vizuală loader cu restul site-ului | Evită Lottie generic |
| ⚪ `vercel-react-view-transitions` | Form success/error states alternative | Native View Transitions |

---

## Pas 10 — Cursor custom + micro-interactions globale

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `design-motion-principles` | Final motion polish pe tot site-ul | Audit complet de coerență |
| 🟡 `frontend-design` | Cursor custom — `mix-blend-mode: difference` peste poze | Detaliu signature |

---

## Pas 11 — Performance audit

| Skill | Cum | Target |
|---|---|---|
| 🔴 `web-design-guidelines` | **Full audit** pe toate paginile | 100+ rules accessibility/perf/UX |
| 🔴 `vercel-react-best-practices` | Optimizări Next.js — code splitting, ISR, image opt | LCP <2.0s, CLS <0.05, JS <150kb |
| 🔴 `playwright` (MCP) | Automated tests + Lighthouse runs | 95+ pe toate metricile, mobile inclusiv |
| 🟡 `frontend-design` | Verificare că polish-ul nu a deteriorat ierarhia vizuală | Check că performance nu a forțat compromisuri stilistice |

---

## Pas 12 — Schema config + Zod + JSON extraction

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `vercel-composition-patterns` | Pattern pentru config-driven components | Template-ul devine reutilizabil per client |
| 🟡 `ckm:design-system` | Formalizare tokens-uri ca design system | Pentru documentare per client |
| ⚪ `redesign-existing-projects` | Refactor componente hardcoded → config-driven | Iterație curată |

---

## Pas 13 — Sanity setup + migrare config

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `sanity` (MCP plugin) | Schema design + GROQ queries + Visual Editing | Direct integrare |
| 🟡 `vercel-react-best-practices` | Build-time GROQ fetching pentru SSG | ISR pattern Next.js 15 |

---

## Pas 14 — Polish & QA cross-browser

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `playwright` (MCP) | Test pe Safari, Firefox, Chrome mobile real | Animațiile exotice se sparg pe Safari |
| 🔴 `web-design-guidelines` | Final audit | Last pass înainte de deploy |
| 🔴 `design-motion-principles` | Re-audit motion pe Safari unde Motion/GSAP au comportamente diferite | Catch regresii |
| 🟡 `redesign-existing-projects` | Fix-uri rapide pe ce nu trece QA | Iterație controlată |

---

## Pas 15 — Deploy & verificare finală

| Skill | Cum | De ce |
|---|---|---|
| 🔴 `vercel` (MCP plugin) | Deploy + domain config + preview deployments | Integrare directă |
| 🔴 `web-design-guidelines` | Audit RUM (real-user metrics) după deploy | Confirmare în prod, nu doar local |
| 🟡 `playwright` (MCP) | Smoke tests pe production URL | Verificare finală |

---

## Inventar complet skills disponibile

### 🔵 Plugin-uri Anthropic (în `~/.claude/settings.json` `enabledPlugins`)
- `frontend-design` — anti-slop philosophy, official Anthropic
- `playground` — interactive HTML playgrounds (design-playground template util la Pas 0)
- `figma` (MCP) — design-to-code, extract tokens
- `sanity` (MCP) — CMS integrare
- `vercel` (MCP) — deploy management
- `playwright` (MCP) — browser automation

### 🟢 Skills community în `~/.claude/skills/`
**UI/UX Pro Max suite (8 skills)**: `ui-ux-pro-max`, `industrial-brutalist-ui`, `minimalist-ui`, `high-end-visual-design`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `redesign-existing-projects`

**CKM suite (7 skills)**: `brandkit`, `ckm:brand`, `ckm:design`, `ckm:design-system`, `ckm:ui-styling`, `ckm:banner-design`, `ckm:slides`

**Taste skills**: `design-taste-frontend`, `stitch-design-taste`, `gpt-taste`

**Vercel agent-skills (4 selectate)**: `web-design-guidelines`, `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`

**Motion**: `design-motion-principles`

**Meta**: `full-output-enforcement`

---

## Workflow recurent recomandat

**La începutul fiecărui Pas major:**
1. Citește secțiunea corespunzătoare din planul docx
2. Activează manual skill-urile 🔴 din tabelul de mai sus dacă nu auto-trigger
3. Începe implementarea

**Înainte să marchezi un Pas complet:**
1. `web-design-guidelines` audit pe noile fișiere
2. `design-motion-principles` audit dacă pasul a adăugat animații
3. `vercel-react-best-practices` pentru perf check

**La fiecare commit major:**
- Rulează skill-ul `simplify` (Anthropic, deja activ) pe diff-ul recent
