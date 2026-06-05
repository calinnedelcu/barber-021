# Andrei Canciu — draft website (SCHELET, în așteptarea pozelor)

Draft pentru lead-ul **Andrei Canciu hairstyle** (Sibiu, Șoseaua Alba Iulia 40).
Pe același template multi-client. Preview: `$env:NEXT_PUBLIC_CLIENT="andrei-canciu"; npm run dev`.

## Real (verificat 2026-06-04)
- Nume, logo (scissor-„A", de pe Facebook `hairstylingsibiu`)
- Adresă: Șoseaua Alba Iulia 40, Sibiu · coordonate geocodate `45.7928° N, 24.1347° E`
- Telefon: 0722 163 509 · Rating: **4.9★ pe Google**
- Poziționare: hairstylist din Sibiu, specializat în **tunsori geometrice**, susține seminarii
- Social: IG `@andreicanciu.hairstyle`, FB `hairstylingsibiu`

## ⚠️ Lipsește — de obținut de la Andrei / manual

1. **POZE cu lucrările lui — blocaj real.** Spre deosebire de HAIRMANN, NU se pot lua automat:
   IG/FB/Google Maps cer login, nu are profil MERO individual, iar `andreicanciu.ro`
   e ALT om (un dezvoltator IT cu același nume — NU el).
   → Momentan: hero fără poză + galerie cu artă geometrică abstractă (placeholder, NU stock fake).
   → De făcut: descarcă 10–15 poze de pe `@andreicanciu.hairstyle` și pune-le în
   `public/clients/andrei-canciu/{hero,gallery}/`, apoi adaugă căile în `gallery` din JSON
   + `hero.backdropUrl`. (Logo-ul lui transparent ar ajuta și pentru brand mark.)
2. **PREȚURI — orientative, marcate „de confirmat".** Nu am găsit prețurile lui reale.
   Cele din site sunt estimări de piață, fiecare cu „Preț orientativ — de confirmat".
3. **PROGRAM** — Google arăta doar Joi 12–19 și Vineri (deschide 12). Restul e pus
   orientativ (Luni–Vineri 12–20, weekend închis) — de confirmat.
4. **RECENZII** — am doar ratingul 4.9★ (textul e în spatele login-ului), așa că secțiunea
   de recenzii e ascunsă momentan. Cere-i 3–4 recenzii sau ia-le de pe Google/Facebook.

## Secțiuni active
Hero · Servicii · Manifest · Galerie (artă abstractă) · Locație/Hartă · Programare · Footer.
Ascunse până avem conținut real: Echipă (e solo), Recenzii, Instagram.
