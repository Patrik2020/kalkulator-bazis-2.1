const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pages = [
  {
    file: "landing-pages/wise/adatkezelesi-tajekoztato.html",
    title: "Adatkezelési tájékoztató",
    description: "A Wise aloldal külön adatkezelési tájékoztatója helyett a Kalkulátor Bázis központi adatvédelmi tájékoztatója érvényes.",
    canonical: "https://kalkulatorbazis.hu/adatvedelem.html",
    target: "../../adatvedelem.html",
    button: "Központi adatvédelmi tájékoztató megnyitása",
  },
  {
    file: "landing-pages/wise/cookie-tajekoztato.html",
    title: "Süti tájékoztató",
    description: "A Wise aloldal külön sütitájékoztatója helyett a Kalkulátor Bázis központi sütikezelési tájékoztatója érvényes.",
    canonical: "https://kalkulatorbazis.hu/cookie.html",
    target: "../../cookie.html",
    button: "Központi sütitájékoztató megnyitása",
  },
  {
    file: "landing-pages/wise/jogi-nyilatkozat.html",
    title: "Jogi nyilatkozat",
    description: "A Wise aloldal külön jogi nyilatkozata helyett a Kalkulátor Bázis központi jogi nyilatkozata érvényes.",
    canonical: "https://kalkulatorbazis.hu/jogi-nyilatkozat.html",
    target: "../../jogi-nyilatkozat.html",
    button: "Központi jogi nyilatkozat megnyitása",
  },
  {
    file: "landing-pages/wise/kapcsolat.html",
    title: "Kapcsolat",
    description: "A Wise aloldal külön kapcsolatoldala helyett a Kalkulátor Bázis központi kapcsolatoldala használható.",
    canonical: "https://kalkulatorbazis.hu/kapcsolat.html",
    target: "../../kapcsolat.html",
    button: "Központi kapcsolatoldal megnyitása",
  },
];

const redirectPage = ({ title, description, canonical, target, button }) => `<!doctype html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <title>${escapeHtml(title)} | Kalkulátor Bázis</title>
    <link rel="stylesheet" href="css/legal.css" />
    <script src="../../js/global-head.js"></script>
  </head>
  <body>
    <main class="legal-page">
      <section class="legal-hero">
        <div class="container">
          <span class="legal-badge"> Központi oldal </span>
          <h1>${escapeHtml(title)}</h1>
          <p class="legal-intro">${escapeHtml(description)}</p>
          <p class="legal-intro">Ha a böngésző nem irányít át automatikusan, használd az alábbi hivatkozást.</p>
          <p><a class="btn btn-primary" href="${escapeHtml(target)}">${escapeHtml(button)}</a></p>
        </div>
      </section>
    </main>
  </body>
</html>
`;

for (const page of pages) {
  fs.writeFileSync(path.join(root, page.file), redirectPage(page), "utf8");
}

const wiseFile = path.join(root, "landing-pages/wise/wise.html");
let wise = fs.readFileSync(wiseFile, "utf8");
wise = wise
  .replaceAll('href="adatkezelesi-tajekoztato.html"', 'href="../../adatvedelem.html"')
  .replaceAll('href="cookie-tajekoztato.html"', 'href="../../cookie.html"')
  .replaceAll('href="jogi-nyilatkozat.html"', 'href="../../jogi-nyilatkozat.html"')
  .replaceAll('href="kapcsolat.html"', 'href="../../kapcsolat.html"');
fs.writeFileSync(wiseFile, wise, "utf8");

console.log("Wise legal duplicate pages converted to noindex central redirects.");
