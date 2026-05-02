# BARBER 021 — Brief asseturi (round 1)

Toate asseturile pe care le poți genera (cu GPT-4o Image / orice gen pic) ca să trecem de la placeholdere la nivel Awwwards. **Nu sări peste detaliile de paletă, ele sunt esențiale**.

## Constraints globale (aplicabile la toate)

**Paletă strictă** — nu se abate de la asta:
- Negru profund: `#0A0807` (background)
- Cream cald: `#F5EFE6` (text/highlight)
- Cupru cald: `#D9764D` (accent unic)
- Bone: `#C9B89A` (auxiliar rar folosit)
- Grayscale dintre `#0A0807` → `#F5EFE6`, niciodată albastru/verde/violet

**Direcție vizuală**: editorial-industrial · cinematic · warm · grain · lemn vechi · oțel mat · piele uzată · vinil · neon difuz · "club privat 1970s din București" întâlnește "atelier de tipar"

**Anti-slop ban list**:
- ❌ Aesthetic Instagram coffee-shop generic
- ❌ Hipster moodboard cu mustăți răsucite
- ❌ Stock photo cu barber zâmbind la cameră
- ❌ Mov, albastru, neon roz
- ❌ Tipografie sans-serif curată tip Apple
- ❌ Backgrounduri albe, rounded corners, pastel
- ❌ AI obvious — fețe simetrice, mâini cu 6 degete, "cinematic 4K hyperrealistic"

**Format livrare**: PNG sau JPG la rezoluții minime indicate. Pune-le în `public/clients/barber-021/` (sau spune-mi unde le-ai pus).

---

## 1. HERO ILLUSTRATION (cea mai importantă)

**Slot**: în secțiunea Hero, integrată cu tipografia "BARBER / 021". Apare la load.

**Compoziție** (alege una):

### Variante A — Brici editorial
Un singur brici (straight razor) tradițional, lama deschisă la ~120°, mâner din lemn negru sau corn de cerb. Privire de sus, plutind pe fundal negru, lumină rece dintr-o parte care atinge muchia lamei și o face să strălucească. Ușor abstractizat — nu fotorealist 100%, mai degrabă ca o ilustrație cu textură de gravură + grain. Ar trebui să arate "ascuțit, periculos, prețios".

### Variante B — Portret silueted
Bărbat 30-40 ani, ras impecabil, contur de profil pe lateral, doar siluetă întunecată cu un singur rim-light cupru pe partea conturului feței. Fundal negru profund. Fără detalii pe față — doar silhouette + accent pe textura pielii/părului unde lumina o atinge. Stil: editorial fashion magazine 90s (Helmut Newton meets Saul Bass).

### Variante C — Atelier abstract
Plan de detaliu pe scaunul de barber clasic (vintage, piele cracelată, cromaj), focus pe brațul de piele și tetiera, restul în umbră. Lumină caldă într-un singur con din stânga sus, mult negativ space în dreapta. Fundal: fragmente de oglindă + raft cu sticle.

**Toate variantele trebuie să**:
- Funcționeze decupate cu `mix-blend-mode: multiply` peste negru `#0A0807`
- Aibă grain organic (nu digital noise)
- Lase loc de respirat — text-ul Hero stă peste ea
- Fie majoritar întunecate (~70% negru/umbră, 25% mid-tones, 5% accent cupru sau cream)

**Dimensiuni**: 2400×1600px minim (Hero portrait) sau 2400×3000px (variantă portrait verticală). Orientarea finală o decid eu după ce o văd.

**Prompt sugerat (oricare variantă)**:
> Editorial dark cinematic illustration of a [vintage straight razor / male profile silhouette / barber chair detail], single warm copper light source from left, deep black background #0A0807, cream highlights #F5EFE6, fine film grain, subtle texture, 1990s Helmut Newton fashion editorial mood, vintage barbershop atmosphere Bucharest, no text, no logo, no faces visible / silhouetted, intentional negative space, asymmetric composition, art-direction, no glossy modern look, anti-instagram, slight engraving texture, warm but moody, premium magazine aesthetic.

**Câte vreau**: **2-3 variante** ca să aleg.

---

## 2. PORTRETE ECHIPA (3 buc)

**Slot**: secțiunea Echipa, cardurile cu Andrei / Vlad / Radu.

**Stil obligatoriu**:
- 4:5 portrait (vertical), 1200×1500px minim
- B&W cu wash duotone: shadow → cupru `#D9764D`, highlight → cream `#F5EFE6`, NU full grayscale neutru
- Lumină laterală single-source, hard contrast (Avedon-style)
- Background uniform: zid texturat negru (`#0A0807`) sau perdea de catifea închisă
- Privire NU directă spre cameră — preferabil ¾ profile sau privire ușor descentrată
- Expresie: serioasă, gravă, demnă — NU zâmbet de stock photo
- Cadru: bust (până la piept), spațiu deasupra capului, marja încadrare strânsă pe stânga
- Detalii vizibile: structura părului, textura bărbii, eventual un accesoriu (foarfecă în mână, șorț de piele, prosop pe umăr) — DAR nu obvious "I am a barber"

**Variații per persoană** (pentru personalitate diferită):
- **Andrei** (Master Barber, 12 ani): cel mai în vârstă pare, barbă mai pronunțată, șorț de piele
- **Vlad** (Senior, foarfecă tradițională): mai sec, ține o foarfecă de epocă undeva în cadru
- **Radu** (Barber junior): cel mai tânăr, look mai curat, fără barbă lungă

**Prompt sugerat**:
> Editorial duotone portrait of a [30-40 year old / 35 year old / 25 year old] Eastern European male barber, three-quarter profile, hard side lighting from left, deep shadows, copper #D9764D and cream #F5EFE6 duotone, no full color, dark textured wall background, 4:5 vertical, 1990s Avedon style portrait photography, serious dignified expression, slight stubble / beard / clean-shaven, leather apron / scissors visible / clean white shirt, film grain, no smiling, no eye contact with camera, premium magazine cover quality, no AI plastic skin, intentional skin texture, realistic but stylized, dark moody atmosphere.

**Câte vreau**: **3 portrete** (câte unul per coechipier) — pot fi 2 variante de fiecare ca să aleg.

---

## 3. POZE GALERIE (9 tile-uri)

**Slot**: secțiunea Galerie, masonry asimetric. Tile-urile sunt:

| # | Subiect | Aspect | Ce să surprindă |
|---|---------|--------|-----------------|
| 1 | Brici tradițional | 4:5 vertical | Detaliu macro pe lama deschisă, prosop fierbinte umed lângă |
| 2 | Foarfecă | 1:1 | Două foarfeci tradiționale încrucișate pe blat de marmură închisă |
| 3 | Pickup vinyl | 4:5 vertical | Detaliu pe ac + șanț de vinil, ușor în motion blur |
| 4 | Espresso | 4:3 horizontal | Ceașcă mică de espresso, abur, lângă o foarfecă pe blat lemn |
| 5 | Pieptene | 1:1 | Vintage tortoise-shell pieptene pe oglindă cu reflexii |
| 6 | Oglindă | 4:5 vertical | Oglindă de barber în ramă de bronz, reflectă parțial scaunul |
| 7 | Tipografie | 4:3 horizontal | Detaliu macro pe semnul / placa de la intrare cu logotipul "021" |
| 8 | Atelier | 1:1 | Cadru wide cu interiorul atelierului, lumini ambient calde |
| 9 | Detaliu | 4:5 vertical | Mâna care taie cu foarfeca (close-up, focus pe muchie) |

**Stil consistent pe toate**:
- Aceeași temperatură de lumină (warm tungsten ~2800K)
- Black + cupru duotone soft (NU full color, NU full grayscale)
- Film grain subtle
- Fără text suprapus
- Cadru tight, nu lasă mult spațiu mort
- Toate trebuie să "se simtă" că provin din aceeași sesiune foto

**Dimensiuni**:
- 4:5 → minim 1600×2000px
- 1:1 → minim 1600×1600px
- 4:3 → minim 2000×1500px

**Prompt sugerat (variabil per subiect)**:
> Editorial moody close-up macro of [SUBIECT], warm tungsten lighting 2800K, copper #D9764D and deep black #0A0807 duotone, film grain, vintage barbershop in Bucharest atmosphere, shallow depth of field, no text, no logos visible (except where specified), 1990s magazine still life photography style, hard shadows, mysterious mood, premium feel, organic textures, no plastic AI look.

**Câte vreau**: **toate 9** (1 variantă fiecare e suficient inițial, alegem la review).

---

## 4. (OPȚIONAL — round 2) Manifesto background illustration

Pentru secțiunea Manifesto, pot folosi un background illustration layered cu parallax. Dacă vrei să generezi:
- 1 ilustrație orizontală 2400×1200px
- O scenă wide a interiorului atelierului în stil "blueprint editorial" — linii de elevație, secțiuni, măsurători cotă
- Aproape monocrom, doar accent pe oglinzi, scaun, lampi
- Va fi pus la opacitate 8-12% în spatele textului

**Prompt sugerat**:
> Architectural blueprint editorial illustration of a vintage barbershop interior cross-section, technical line drawing style, only thin lines on dark background, copper accent details on chairs and mirrors, wide horizontal 2:1 aspect, 1970s Italian architectural magazine aesthetic, single page tasteful, no color fills, very minimal, drafting elegance.

---

## 5. (OPȚIONAL — round 2) Lottie loader

În locul loader-ului CSS curent, pot pune o animație Lottie scurtă (~1.5s) cu monograma 021 desenându-se.

**Cum produci**: After Effects → plugin Bodymovin → export Lottie JSON, sau folosește LottieFiles editor. Trebuie să fie **<100KB**. Dacă nu te încurci cu AE, las loader-ul CSS — e suficient de bun.

---

## Unde le pui

```
public/clients/barber-021/
├── hero/
│   ├── illustration-A.jpg
│   ├── illustration-B.jpg
│   └── illustration-C.jpg
├── team/
│   ├── andrei.jpg
│   ├── vlad.jpg
│   └── radu.jpg
└── gallery/
    ├── 01-razor.jpg
    ├── 02-scissor.jpg
    ├── 03-vinyl.jpg
    ├── 04-espresso.jpg
    ├── 05-comb.jpg
    ├── 06-mirror.jpg
    ├── 07-type.jpg
    ├── 08-atelier.jpg
    └── 09-detail.jpg
```

Când le ai, spune-mi calea exactă și actualizez configul + componentele să le folosească.

---

## Prioritate de generare

1. **Hero illustration (varianta A — brici)** ← cea mai vizibilă, cea mai importantă
2. **Cele 3 portrete echipă** ← a doua cea mai vizibilă secțiune
3. **Galerie — minim 4-5 din cele 9** ← pot fi adăugate progresiv
4. (Opțional) Manifesto bg + Lottie loader
