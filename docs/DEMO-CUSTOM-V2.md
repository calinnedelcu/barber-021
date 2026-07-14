# BRICI Cinema - demo-custom-v2

_Ultima actualizare: 2026-07-14._

## Scop

`demo-custom-v2` este varianta Custom cu o poveste AI controlată de scroll. Refolosește
complet site-ul `demo-custom` (conținut, navigație, secțiuni, bilingv, preloader,
cursor și pagina `/povestea`) și înlocuiește hero-ul 3D cu o poveste cinematică
distribuită prin aproape întreaga pagină. V1 rămâne disponibil separat la slugul
`demo-custom`.

## Regie

Arcul este `instrument -> incizie -> atelier -> mână -> rezultat -> oameni ->
dovadă -> invitație`, iar fiecare secvență aparține conținutului pe care îl susține:

| Secțiune | Regie |
| --- | --- |
| `Hero · 280svh` | briciul se ridică, muchia taie ecranul și deschide atelierul |
| `Manifest · pinned` | dolly-ul prin atelier avansează odată cu panourile orizontale |
| `Servicii` | o fantă verticală înlocuiește atelierul cu gestul clipper-over-comb; filmul este scrub-uit de lista de servicii |
| `Galerie · pinned` | un wipe roșu dezvăluie rezultatul, iar lucrările alunecă peste el |
| `Echipă` | fundalul trece continuu între portretele barberilor, sincronizat cu cardurile sticky |
| `Recenzii · pinned` | fiecare citat schimbă și cadrul fotografic din spate; primul citat este vizibil încă de la intrarea secțiunii |
| `Contact` | un reveal vertical revine la scaunul gol, închizând povestea ca invitație la programare |

Cele trei planuri video au aproximativ 5 secunde fiecare. Nu există autoplay:
fiecare cadru, wipe, crossfade și mișcare de cameră este determinată direct de
poziția scroll-ului și funcționează și în sens invers.

## Implementare

- Componentă: `components/sites/demo-custom/CinematicHero.tsx`
- Dispatch: `BriciSite` primește `variant="cinema"` doar pentru `demo-custom-v2`.
- Fundalul cinematic este un layer `position: fixed`, full-viewport, montat o
  singură dată sub toate secțiunile. Nu este eliberat la finalul hero-ului.
- Hero-ul transparent are `280svh` și controlează numai deschiderea briciului și
  tăierea ecranului. Restul poveștii nu mai este blocat într-un prolog separat.
- GSAP ScrollTrigger publică în `heroState` progres separat pentru hero, manifest,
  servicii, galerie, echipă, recenzii și contact.
- Un singur `requestAnimationFrame` mapează aceste valori în `video.currentTime`,
  `clip-path`, crossfade-uri și transformări pentru toate straturile fixed.
- Hero-ul are numai capitolele `DESCHIDERE` și `INCIZIE`; titlurile secțiunilor
  reale devin capitolele următoare ale poveștii.
- Fiecare MP4 are toate cadrele ca keyframes, pentru seek rapid și stabil în
  ambele direcții.
- Tăietura este deterministă: două copii ale cadrului final al briciului sunt
  decupate cu `clip-path` și deplasate în direcții opuse. Seedance nu este folosit
  pentru geometria tranziției.
- Intrarea în secvența de lucru este o fantă full-height care se extinde, nu un
  video încadrat. Reveal-ul final este un wipe cu muchie roșie.
- Fundalul fixed rămâne montat până la footer. Manifestul și serviciile folosesc
  filmele, galeria folosește rezultatul final, echipa și recenziile schimbă
  cadrele fotografice odată cu slide-urile, iar contactul revine la atelier.
- Secțiunile folosesc suprafețe negre translucide. Secțiunea pinned de recenzii
  nu folosește `backdrop-filter`, deoarece acesta ar schimba containing block-ul
  elementului `position: fixed` creat de GSAP.
- `prefers-reduced-motion` afișează direct rezultatul static, păstrează hero-ul la
  `100svh` și nu montează niciun video.
- Dacă un video nu poate fi încărcat, secvența continuă cu start/end frames și
  tranzițiile din browser.
- Filmele nu conțin text, logo sau CTA; toate rămân HTML accesibil și responsive.

## Asset-uri de producție

| Fișier | Rol | Dimensiune |
| --- | --- | ---: |
| `public/clients/demo-custom-v2/cinema/razor-start.jpg` | poster + fallback | ~262 KB |
| `public/clients/demo-custom-v2/cinema/razor-end.jpg` | final controlat | ~236 KB |
| `public/clients/demo-custom-v2/cinema/razor-scroll.mp4` | film scroll-scrub | ~1.9 MB |
| `public/clients/demo-custom-v2/cinema/shop-start.jpg` | start atelier | ~256 KB |
| `public/clients/demo-custom-v2/cinema/shop-end.jpg` | final atelier | ~301 KB |
| `public/clients/demo-custom-v2/cinema/shop-scroll.mp4` | dolly atelier | ~2.7 MB |
| `public/clients/demo-custom-v2/cinema/craft-start.jpg` | start lucru | ~318 KB |
| `public/clients/demo-custom-v2/cinema/craft-end.jpg` | final lucru | ~327 KB |
| `public/clients/demo-custom-v2/cinema/craft-scroll.mp4` | gest clipper-pieptene | ~2.7 MB |
| `public/clients/demo-custom-v2/cinema/result-final.jpg` | rezultat persistent | ~264 KB |

Toate masterele Higgsfield sunt `1280x720`, H.264, 24 fps, 5.042 secunde.
Versiunile web au fost recodate H.264/yuv420p, fără audio, CRF 27, `faststart`,
`g=1`. Cadrele noi au fost generate cu image generation built-in, apoi reduse la
`1600x900` JPEG; nu au consumat credite Higgsfield.

## Higgsfield

- Integrare: MCP oficial `https://mcp.higgsfield.ai/mcp`
- Model: Seedance 2.0
- Brici: job `52004515-5550-4650-bc18-778c09535ea8`, Seedance `std`, `22.5` credite
- Atelier: job `208c209a-31ba-47e8-9b18-e99a2aa3012f`, Seedance `fast`, `17.5` credite
- Lucru: job `0a385392-db80-47a4-b9cc-6556b74d0c0a`, Seedance `fast`, `17.5` credite
- Cost nou preflight și consumat: `35` credite; sold `87.5 -> 52.5`
- Cost total al celor trei filme: `57.5` credite
- Setări noi: 5 secunde, 16:9, 720p, high bitrate, fără audio
- Referințe: [Higgsfield MCP](https://higgsfield.ai/mcp),
  [Seedance 2.0](https://higgsfield.ai/seedance/2.0),
  [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/),
  [ScrollyVideo](https://github.com/dkaoster/scrolly-video),
  [webcodecs-scroll-sync](https://github.com/diffusionstudio/webcodecs-scroll-sync),
  [Codrops: cinematic scroll with a fixed canvas](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)

## Prompt cadru inițial

```text
Use case: ads-marketing
Asset type: cinematic 16:9 hero start frame for a premium bespoke barbershop website, designed to become the reference image for image-to-video generation
Primary request: Create a photorealistic cinematic macro product shot of an open traditional straight razor resting diagonally on a slab of matte black obsidian inside a dark precision barbershop. The razor is the unmistakable hero object.
Scene/backdrop: almost-black barbershop interior reduced to soft abstract silhouettes; a faint barber mirror edge and a distant practical light, no recognizable people
Subject: one elegant traditional straight razor, brushed gunmetal blade with a dark oxblood-red handle, pristine realistic construction, slightly open at approximately 110 degrees
Style/medium: luxury editorial product photography, tactile realism, cinematic 35mm still, restrained and sophisticated rather than sci-fi
Composition/framing: widescreen 16:9; razor occupies the central-right two thirds; blade points toward the upper-left; generous clean negative space on the left for oversized website typography; low camera angle at tabletop height; razor fully visible and sharply designed
Lighting/mood: deep black exposure, one thin saturated vermilion-red strip light grazing the blade edge, subtle warm tungsten rim from behind, controlled haze, crisp specular highlight, rich blacks, slight halation, film grain
Color palette: black, graphite, gunmetal, oxblood, one vivid vermilion-red accent
Materials/textures: microscopic brushed steel, matte obsidian with minimal reflection, natural leather handle detail, faint steam particles
Constraints: physically plausible razor geometry; one razor only; no hands; no people; no blood; no shaving foam; no logos; no readable text; no watermark; preserve clear silhouette and negative space for HTML text overlay
Avoid: cyberpunk neon overload, blue lighting, generic stock-photo barber props, duplicated blades, warped hinges, floating object, excessive smoke, lens distortion, shallow focus that hides the razor
```

## Prompt cadru final

```text
Use case: ads-marketing
Asset type: cinematic 16:9 end frame for the same website hero image-to-video sequence
Input image: reference image defining the exact razor identity, materials, red handle, blade geometry, lighting language, barbershop environment and color grade
Primary request: Create the final frame of a single continuous camera move that began from the reference image. Preserve the exact same straight razor and environment. The camera has pushed forward and orbited upward into an extreme macro view of the blade edge. The blade now rises nearly vertical through the center-right of the frame, its razor-thin vermilion highlight forming one clean luminous red line from near the bottom to near the top. The dark red handle remains partially visible in the lower-right as identity continuity.
Scene/backdrop: same nearly black precision barbershop, now abstract and heavily defocused, faint warm practical light only
Subject: exact same open traditional straight razor from the reference, no redesign
Style/medium: luxury editorial product photography, cinematic 35mm, physically plausible macro optics, restrained and sophisticated
Composition/framing: widescreen 16:9; extreme macro; blade edge is a strong near-vertical line at roughly 62% of frame width; left side is mostly pure dark negative space for the next HTML section title; clear visual continuity from reference
Lighting/mood: same deep black exposure and vermilion edge light, subtle warm tungsten rim, controlled haze, rich blacks, slight halation and film grain
Color palette: black, graphite, gunmetal, oxblood, one vermilion accent
Constraints: preserve exact razor identity and blade/handle materials; no additional props; no hands; no people; no blood; no text; no logo; no watermark; physically plausible geometry
Avoid: changing the handle shape or color, duplicate blade, blue lighting, cyberpunk, excessive smoke, warped metal, shallow focus that makes the edge unreadable
```

## Prompt Seedance 2.0

```text
Single continuous 5-second cinematic product shot, no cuts. Begin exactly from the supplied start frame: one traditional straight razor resting open on matte black obsidian in a nearly black precision barbershop. The camera performs an extremely slow controlled dolly-in combined with a smooth clockwise orbital rise, while the same razor pivots upward naturally around its hinge and lifts slightly from the slab as if guided by invisible precision mechanics. A thin vermilion strip-light reflection travels continuously along the blade edge; tiny dust motes drift through restrained haze. Preserve the exact oxblood-red handle, brushed gunmetal blade, hinge, proportions, environment, black-red color grade and physical realism. Finish exactly at the supplied end frame: extreme macro, blade almost vertical near the center-right, its red edge becoming one clean luminous vertical line, dark negative space on the left. Luxury 35mm product cinematography, macro optics, subtle halation, rich blacks, 24fps feeling, smooth ease-in-out motion. No people, no hands, no blood, no foam, no text, no logos, no duplicated blade, no morphing, no camera shake, no extra props, no blue light, no sci-fi effects.
```

## Cadre noi generate cu ChatGPT

Mod: image generation built-in, nu CLI/API. Setul final de prompturi a urmărit:

- `shop-start.jpg`: atelier intim văzut din ușă, un singur scaun, oglindă mare,
  lumină tungsten și linie vermilion la 62%, cu spațiu negativ în stânga.
- `shop-end.jpg`: edit al cadrului anterior; schimbată numai poziția camerei prin
  dolly înainte, cu obiectele, materialele și iluminarea păstrate.
- `craft-start.jpg`: macro documentar cu exact două mâini, un pieptene și o
  mașină, client fără față vizibilă, aceeași paletă și același atelier.
- `craft-end.jpg`: edit cu aceeași identitate; avansat doar gestul clipper-over-
  comb cu câțiva centimetri și curățată subtil tranziția.
- `result-final.jpg`: edit al clientului; eliminate mâinile și uneltele, cadru
  puțin mai larg, rezultatul final și reflexia parțială în oglindă.

Constrângeri comune: 16:9 fotorealist, 35mm editorial, black/amber/vermilion,
anatomie și geometrie plauzibile, fără text, logo, watermark, neon albastru,
obiecte duplicate sau aspect CGI lucios.

## Prompt Seedance - atelier

```text
Single continuous five-second cinematic interior shot, no cuts. Begin exactly from the supplied start frame and preserve the exact same intimate charcoal barbershop, black leather chair, aged mirror, counter, practical lights, doorway, materials and black-amber-vermilion grade. The camera performs only a very slow physically plausible dolly forward about two meters through the doorway with a slight controlled lowering, ending exactly at the supplied end frame. Nothing in the room changes position. The chair remains perfectly still. Only minimal atmospheric dust and natural tungsten light breathing are allowed; the thin red reflection softens gradually along the mirror edge. Luxury restrained 35mm architectural cinematography, rich blacks, smooth ease-in-out motion, stable perspective. No people, no new props, no morphing furniture, no warping mirror, no flicker, no text, no logo, no watermark, no camera shake, no blue lighting, no neon, no transition or cut.
```

## Prompt Seedance - lucru

```text
Single continuous five-second documentary macro shot, no cuts. Begin exactly from the supplied start frame and finish exactly at the supplied end frame. Preserve the same client, head shape, dark hair, low taper fade, skin, black cape, barber forearms, two hands, black comb, black clipper, chair, mirror, room and warm black-amber color grade. The barber completes one slow precise upward clipper-over-comb pass behind the client's right ear: the clipper glides upward a few centimeters, then gently lifts away while the comb shifts slightly upward to check the blend. Movement is controlled, anatomically correct and physically plausible; the client stays perfectly still. Subtle loose hair particles only. Luxury 35mm editorial realism, stable locked camera, smooth ease-in-out hand motion, rich blacks. No face reveal, no extra fingers, no duplicate hands or tools, no morphing, no haircut changing suddenly, no skin deformation, no camera move, no cut, no text, no logo, no watermark, no blood, no blue light, no neon, no flicker.
```

## QA 2026-07-14

- Desktop 1280x720 și 1440x1000: hero, manifest, servicii, galerie, echipă,
  recenzii și contact verificate individual, inclusiv cadre intermediare.
- În manifest, filmul atelierului a ajuns la `4.22s`; în servicii, filmul de lucru
  la `3.05s`; la trecerea în galerie rezultatul a fost dezvăluit complet.
- Echipă: fundalul a urmărit barberul activ (`0.893` opacitate pentru cadrul 2).
  Recenzii: cadrul 2 și citatul 2 au fost active simultan; contactul a revenit la
  atelier cu reveal complet și fără salt de layout.
- Reparat pin-ul recenziilor: eliminarea `backdrop-filter` de pe părintele pinned
  ține citatul la `top: 0`; primul citat rămâne vizibil și înainte de activarea pin-ului.
- Mobil 390x844: hero, servicii, galerie și tranzițiile de fundal verificate fără
  overflow (`scrollWidth - innerWidth = 0`) și fără text ieșit din container.
- Scroll invers galerie -> servicii -> hero: scenele au revenit `3 -> 2 -> 1 -> 0`,
  iar filmele atelier/lucru au revenit la `0.01s`.
- Erori console în scenariile desktop și mobil: `0`.
- Reduced motion la 390x844: hero `844px`, zero video-uri montate, rezultatul și
  copy-ul inițial vizibile, fără overflow.
