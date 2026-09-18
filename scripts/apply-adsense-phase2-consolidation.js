const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const slugs = [
  "hosszusag-atvalto-kalkulator",
  "terulet-atvalto-kalkulator",
  "terfogat-atvalto-kalkulator",
  "tomeg-atvalto-kalkulator",
  "homerseklet-atvalto-kalkulator",
  "ido-atvalto-kalkulator",
  "sebesseg-atvalto-kalkulator",
  "adatmeret-atvalto-kalkulator",
  "energia-atvalto-kalkulator",
  "nyomas-atvalto-kalkulator",
  "teljesitmeny-atvalto-kalkulator",
];

const canonical = "https://kalkulatorbazis.hu/kalkulatorok/mertekegyseg-atvalto-kalkulator";
const notice = `<!-- KB_PHASE2:converter-retired:START -->
<section class="info-box phase2-retired-converter">
  <strong>Ez az önálló átváltó kivezetés alatt van.</strong>
  A mértékegység-átváltásokat egy közös, 11 kategóriás eszközbe vontuk össze.
  <a href="mertekegyseg-atvalto-kalkulator">Nyisd meg a Mértékegység átváltó központot.</a>
</section>
<!-- KB_PHASE2:converter-retired:END -->`;

const transform = (html) => {
  if (/<meta\s+name=["']robots["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']robots["'][^>]*>/i,
      '<meta name="robots" content="noindex,follow" />'
    );
  } else {
    html = html.replace(
      /(<meta[^>]+name=["']viewport["'][^>]*>)/i,
      '$1\n<meta name="robots" content="noindex,follow" />'
    );
  }

  html = html.replace(
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`
  );

  if (!html.includes("KB_PHASE2:converter-retired:START")) {
    const hero = html.match(/<section\s+class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
    if (!hero) throw new Error("Hiányzó hero blokk a kivezetett átváltó oldalon.");
    html = html.replace(hero[0], `${hero[0]}\n${notice}`);
  }

  return html;
};

let changed = 0;
for (const slug of slugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(`Phase 2 converter retirement: ${changed}/${slugs.length} oldal frissítve.`);
