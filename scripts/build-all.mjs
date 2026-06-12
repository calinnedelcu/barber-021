// Builds every client into its own sub-path under one static `dist/` so the
// whole set can be published from a single GitHub Pages repo:
//   /<repoBase>/                 -> landing (lists all sites)
//   /<repoBase>/<slug>/          -> that client's site
//
// Each client is built independently with its own basePath, so assetPath() and
// next/image resolve correctly under the nested path. .next/out are wiped
// between builds because NEXT_PUBLIC_* is inlined at build time.

import { execSync } from "node:child_process";
import { rmSync, renameSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";

const REPO_BASE = (process.env.SITE_BASE_PATH || "/barber-021").replace(/\/$/, "");

const CLIENTS = [
  { slug: "andrei-canciu", name: "Andrei Canciu", tag: "Hairstyling · tunsori geometrice", loc: "Sibiu" },
  { slug: "hairmann", name: "HAIRMANN", tag: "Barbershop · male esthetics", loc: "Sibiu" },
  { slug: "aa-barber", name: "A'A Barber", tag: "Barbershop pentru bărbați", loc: "Sibiu" },
  { slug: "mr-mrs-style", name: "Mr&Mrs Style", tag: "Salon de înfrumusețare", loc: "Sibiu" },
  { slug: "nico-beauty-style", name: "Nico Beauty Style", tag: "Coafor unisex · tuns, vopsit, barbă", loc: "Sibiu" },
  { slug: "demo-start", name: "Demo · Pachetul Start", tag: "Exemplu pachet Start · 5 teme la alegere", loc: "Demo" },
];

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

for (const c of CLIENTS) {
  const base = `${REPO_BASE}/${c.slug}`;
  console.log(`\n=== building ${c.slug}  (basePath ${base}) ===`);
  rmSync(".next", { recursive: true, force: true });
  rmSync("out", { recursive: true, force: true });
  execSync("npm run build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_CLIENT: c.slug, NEXT_PUBLIC_BASE_PATH: base },
  });
  renameSync("out", `dist/${c.slug}`);
}

// ---- landing page -----------------------------------------------------------
const cards = CLIENTS.map(
  (c) => `        <a class="card" href="./${c.slug}/">
          <span class="card-name">${c.name}</span>
          <span class="card-tag">${c.tag}</span>
          <span class="card-go">Vezi site-ul <em>&rarr;</em></span>
        </a>`
).join("\n");

const landing = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Drafturi website · saloane Sibiu</title>
<meta name="robots" content="noindex" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0c0d10; --ink:#eef1f4; --muted:#8b95a1; --accent:#cf7d4e; --line:rgb(238 241 244 / .1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--bg); color:var(--ink); font-family:"Space Grotesk",system-ui,sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh; }
  .wrap { max-width:1100px; margin:0 auto; padding:clamp(2.5rem,6vw,6rem) clamp(1.25rem,4vw,3rem); }
  .mono { font-family:"JetBrains Mono",monospace; text-transform:uppercase; letter-spacing:.24em; font-size:.72rem; color:var(--muted); }
  h1 { font-size:clamp(2.2rem,7vw,4.5rem); font-weight:700; line-height:.98; letter-spacing:-.02em; margin:1.5rem 0 .75rem; }
  h1 em { color:var(--accent); font-style:normal; }
  .lede { color:var(--muted); max-width:46ch; line-height:1.5; font-size:1.05rem; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:var(--line); border:1px solid var(--line); margin-top:clamp(2.5rem,6vw,4.5rem); }
  .card { background:var(--bg); padding:2rem 1.75rem 1.75rem; display:flex; flex-direction:column; gap:.5rem; text-decoration:none; color:inherit; min-height:200px; position:relative; transition:background .3s ease; }
  .card:hover { background:#13151a; }
  .card-name { font-size:1.7rem; font-weight:700; letter-spacing:-.01em; }
  .card-tag { color:var(--muted); font-size:.95rem; }
  .card-go { margin-top:auto; font-family:"JetBrains Mono",monospace; text-transform:uppercase; letter-spacing:.18em; font-size:.72rem; color:var(--accent); }
  .card-go em { font-style:normal; transition:margin .3s ease; display:inline-block; }
  .card:hover .card-go em { margin-left:.4rem; }
  footer { margin-top:3rem; }
</style>
</head>
<body>
  <main class="wrap">
    <span class="mono">Drafturi website · 2026</span>
    <h1>Saloane &amp; frizerii<br><em>din Sibiu.</em></h1>
    <p class="lede">Drafturi de prezentare, fiecare cu identitatea lui vizuală. Apasă pe oricare ca să vezi site-ul complet.</p>
    <div class="grid">
${cards}
    </div>
    <footer class="mono">Realizate ca propuneri · date &amp; poze din surse publice</footer>
  </main>
</body>
</html>
`;

writeFileSync("dist/index.html", landing);
writeFileSync("dist/.nojekyll", "");

// ---- pagina de ofertă client-facing ------------------------------------------
// Publicată la /<repoBase>/oferta/ ca s-o poți deschide/trimite pe call.
// Nu apare pe landing și are noindex — o distribui doar tu, deliberat.
// (tools/oferta.html — configuratorul intern cu override-uri — NU se publică.)
mkdirSync("dist/oferta", { recursive: true });
copyFileSync("tools/oferta-client.html", "dist/oferta/index.html");

console.log(`\n✓ Built ${CLIENTS.length} clients + landing + /oferta/ into dist/`);
