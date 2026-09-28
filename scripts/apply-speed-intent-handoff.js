const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const speedIntentBlock = `<!-- KB_P10:speed-intent:START -->
<section id="sebesseg" class="converter-intent-block" data-converter-intent="speed">
  <h2>Sebesség átváltás: km/h, m/s, mph és csomó</h2>
  <p>
    A <strong>Sebesség</strong> kategóriában km/h, m/s, mérföld/óra (mph) és csomó között válthatsz.
    Ez mértékegység-átváltás: út és idő alapján számolt átlagsebességhez külön sebességszámítás szükséges.
  </p>
  <ul>
    <li>1 m/s = 3,6 km/h</li>
    <li>1 km/h = 0,2777777778 m/s</li>
    <li>1 mph = 1,609344 km/h</li>
    <li>1 csomó = 1,852 km/h</li>
  </ul>

  <h3>Gyakori m/s → km/h átváltások</h3>
  <table>
    <thead><tr><th>m/s</th><th>km/h</th></tr></thead>
    <tbody>
      <tr><td>5 m/s</td><td>18 km/h</td></tr>
      <tr><td>10 m/s</td><td>36 km/h</td></tr>
      <tr><td>20 m/s</td><td>72 km/h</td></tr>
      <tr><td>30 m/s</td><td>108 km/h</td></tr>
      <tr><td>50 m/s</td><td>180 km/h</td></tr>
    </tbody>
  </table>

  <h3>Gyakori mph → km/h átváltások</h3>
  <table>
    <thead><tr><th>mph</th><th>km/h</th></tr></thead>
    <tbody>
      <tr><td>1 mph</td><td>1,609344 km/h</td></tr>
      <tr><td>30 mph</td><td>48,28032 km/h</td></tr>
      <tr><td>50 mph</td><td>80,4672 km/h</td></tr>
      <tr><td>60 mph</td><td>96,56064 km/h</td></tr>
      <tr><td>100 mph</td><td>160,9344 km/h</td></tr>
    </tbody>
  </table>

  <h3>Gyakori csomó → km/h átváltások</h3>
  <table>
    <thead><tr><th>Csomó</th><th>km/h</th></tr></thead>
    <tbody>
      <tr><td>1 csomó</td><td>1,852 km/h</td></tr>
      <tr><td>10 csomó</td><td>18,52 km/h</td></tr>
      <tr><td>15 csomó</td><td>27,78 km/h</td></tr>
      <tr><td>30 csomó</td><td>55,56 km/h</td></tr>
      <tr><td>50 csomó</td><td>92,6 km/h</td></tr>
    </tbody>
  </table>
</section>
<!-- KB_P10:speed-intent:END -->`;

function transform(html) {
  const blockPattern = /<!--\s*KB_P10:speed-intent:START\s*-->[\s\S]*?<!--\s*KB_P10:speed-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, speedIntentBlock);

  // Older browser-generated P10 output without markers should not be duplicated.
  const legacySpeedBlock = /<section\s+id=["']sebesseg["'][^>]*\bdata-converter-intent=["']speed["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacySpeedBlock.test(html)) return html.replace(legacySpeedBlock, speedIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${speedIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transform(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P10 sebesség-intent blokk nincs materializálva vagy nem egyezik a forrással.");
    process.exit(1);
  }
  console.log("P10 sebesség-intent blokk rendben.");
} else if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P10 sebesség-intent blokk frissítve.");
} else {
  console.log("P10 sebesség-intent blokk már naprakész.");
}

// Egyetlen converter-intent build hookot tartunk fenn, hogy ne szaporítsuk
// a globális npm/CI lépéseket minden új konszolidációs intenthez.
require("./apply-volume-intent-handoff.js");
require("./apply-temperature-intent-handoff.js");
