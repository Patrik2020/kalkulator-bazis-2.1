const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const legacyFile = path.join(root, "kalkulatorok", "hosszusag-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const lengthIntentBlock = `<!-- KB_P15:length-intent:START -->
<section id="hosszusag" class="converter-intent-block" data-converter-intent="length">
  <h2>Hosszúság átváltás: mérföld, kilométer, láb, inch és méter</h2>
  <p>
    A <strong>Hosszúság</strong> kategóriában milliméter, centiméter, méter, kilométer, inch, láb, yard és mérföld között válthatsz.
    A leggyakoribb angolszász–metrikus átváltásoknál a pontos szabványos szorzókat használjuk.
  </p>
  <ul>
    <li>1 mérföld = 1,609344 km = 1609,344 m</li>
    <li>1 láb = 30,48 cm = 0,3048 m</li>
    <li>1 inch = 25,4 mm = 2,54 cm</li>
    <li>1 yard = 0,9144 m</li>
  </ul>

  <h3>Gyakori mérföld → kilométer és méter átváltások</h3>
  <table>
    <thead><tr><th>Mérföld</th><th>Kilométer</th><th>Méter</th></tr></thead>
    <tbody>
      <tr><td>1 mi</td><td>1,609344 km</td><td>1609,344 m</td></tr>
      <tr><td>5 mi</td><td>8,04672 km</td><td>8046,72 m</td></tr>
      <tr><td>10 mi</td><td>16,09344 km</td><td>16 093,44 m</td></tr>
      <tr><td>100 mi</td><td>160,9344 km</td><td>160 934,4 m</td></tr>
    </tbody>
  </table>

  <h3>Gyakori láb → centiméter és méter átváltások</h3>
  <table>
    <thead><tr><th>Láb</th><th>Centiméter</th><th>Méter</th></tr></thead>
    <tbody>
      <tr><td>1 ft</td><td>30,48 cm</td><td>0,3048 m</td></tr>
      <tr><td>3 ft</td><td>91,44 cm</td><td>0,9144 m</td></tr>
      <tr><td>6 ft</td><td>182,88 cm</td><td>1,8288 m</td></tr>
      <tr><td>10 ft</td><td>304,8 cm</td><td>3,048 m</td></tr>
    </tbody>
  </table>

  <h3>Gyakori inch → milliméter és centiméter átváltások</h3>
  <table>
    <thead><tr><th>Inch</th><th>Milliméter</th><th>Centiméter</th></tr></thead>
    <tbody>
      <tr><td>1 in</td><td>25,4 mm</td><td>2,54 cm</td></tr>
      <tr><td>10 in</td><td>254 mm</td><td>25,4 cm</td></tr>
      <tr><td>12 in</td><td>304,8 mm</td><td>30,48 cm</td></tr>
      <tr><td>24 in</td><td>609,6 mm</td><td>60,96 cm</td></tr>
    </tbody>
  </table>
</section>
<!-- KB_P15:length-intent:END -->`;

function transformHub(html) {
  const blockPattern = /<!--\s*KB_P15:length-intent:START\s*-->[\s\S]*?<!--\s*KB_P15:length-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, lengthIntentBlock);

  const legacyLengthBlock = /<section\s+id=["']hosszusag["'][^>]*\bdata-converter-intent=["']length["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacyLengthBlock.test(html)) return html.replace(legacyLengthBlock, lengthIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${lengthIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

function transformLegacy(html) {
  const retiredPattern = /<!--\s*KB_PHASE2:converter-retired:START\s*-->[\s\S]*?<!--\s*KB_PHASE2:converter-retired:END\s*-->/i;
  const match = html.match(retiredPattern);
  if (!match) throw new Error("Hiányzó Phase 2 kivezetési blokk a hosszúság átváltó oldalon.");

  const updated = match[0].replace(
    /<a href="[^"]+">[^<]*<\/a>/i,
    '<a href="mertekegyseg-atvalto-kalkulator#hosszusag">Nyisd meg közvetlenül a Hosszúság átváltást.</a>'
  );
  return html.replace(retiredPattern, updated);
}

function apply(file, transform, label) {
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);

  if (checkOnly) {
    if (after !== before) {
      console.error(`${label} nincs materializálva vagy nem egyezik a forrással.`);
      process.exitCode = 1;
    }
    return;
  }

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    console.log(`${label} frissítve.`);
  } else {
    console.log(`${label} már naprakész.`);
  }
}

apply(hubFile, transformHub, "P15 hosszúság-intent blokk");
apply(legacyFile, transformLegacy, "P15 hosszúság CTA");

if (checkOnly && process.exitCode) process.exit(process.exitCode);
