# HAIRMANN Male Esthetics — draft website

Draft personalizat pentru lead-ul **HAIRMANN Male Esthetics** (Sibiu, Strada Lungă 31).
Construit pe template-ul existent (`barber-021`), îmbrăcat 100% cu datele lor reale.

## Cum îl vezi local

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_CLIENT = "hairmann"; npm run dev
# apoi deschide http://localhost:3000
```

Fără `NEXT_PUBLIC_CLIENT` rulează clientul implicit (`barber-021`). Switch-ul de client
se face prin `lib/clients.ts` (registry) + variabila de mediu `NEXT_PUBLIC_CLIENT`.

## Deploy (GitHub Pages)

Pages servește un singur site per repo. Pentru a publica HAIRMANN:
- rulează workflow-ul `Deploy` manual (Actions → Run workflow) cu `client = hairmann`,
  `base_path = /hairmann`, **sau**
- setează variabilele de repo `CLIENT=hairmann` și `BASE_PATH=/hairmann`.

Pentru a păstra și `barber-021` live în paralel → repo separat / fork.

## Surse de date (toate reale, verificate 2026-06-04)

| Date | Sursă |
|------|-------|
| Servicii + prețuri | MERO — `mero.ro/p/hairmann` (citit prin reader) |
| Program | MERO |
| Echipă (nume + rol) | MERO (Cătălin Rus, Cristi Gherghel, Lucian Joarza, Luke Stef, Ronald Antonio) |
| Recenzii | MERO — 5.0★ din 5066 evaluări |
| Poze | CDN MERO (`d3uxkpn8v3i9eu.cloudfront.net`) + poza de profil Facebook |
| Adresă / coordonate | Nominatim — `45.80416° N · 24.14408° E` |
| Premiu | TOP 100 of Romania — categoria Hair Stylists |

Pozele-sursă brute (29 buc.) sunt în `docs/hairmann-source-photos/` pentru
înlocuiri/variante (nu se publică — sunt în afara `public/`).

## ⚠️ DE CONFIRMAT înainte de a trimite clientului

1. **Maparea poză ↔ barber în secțiunea „Maestrii" este o presupunere.** Numele și
   rolurile sunt reale (din MERO), dar nu știu sigur care chip e care barber. Cere-i lui
   Cătălin pozele etichetate, sau confirmă maparea. Fișiere: `public/clients/hairmann/team/*.jpg`.
2. **Prețurile sunt afișate „de la" (capătul de jos al intervalului MERO)**, cu intervalul
   complet în descriere. Confirmă că sunt actuale.
3. **Bio-urile echipei** sunt scrise de mine (neutre, pe rol) — nu sunt citate reale.
4. Telefon/adresă/program — verificate, dar merită o privire rapidă.

## Ce mai poate fi adăugat

- Email de contact (nu l-am găsit public).
- Mai multe recenzii reale (am pus 4; MERO are mii).
- Un backdrop pentru secțiunea Manifest (acum e curat, fără imagine — barber-021 are blueprint).
