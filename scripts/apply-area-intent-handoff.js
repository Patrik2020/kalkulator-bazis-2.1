const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const areaIntentBlock = `<!-- KB_P14:area-intent:START -->
<section id="terulet" class="converter-intent-block" data-converter-intent="area">
  <h2>Terület átváltás: m², hektár, ár, km² és négyzetláb</h2>
  <p>
    A <strong>Terület</strong> kategóriában négyzetméter (m²), hektár (ha), ár (a), négyzetkilométer (km²),
    négyzetláb (ft²), négyzethüvelyk (in²) és további területegységek között válthatsz.
    Ez mértékegység-átváltás: a geometriai terület kiszámításához előbb a méreteket kell ismerni.
  </p>
  <ul>
    <li>1 hektár = 10 000 m²</li>
    <li>1 ár = 100 m²</li>
    <li>1 km² = 1 000 000 m²</li>
    <li>1 ft² = 0,09290304 m²</li>
    <li>1 in² = 0,00064516 m²</li>
  </ul>

  <h3>Gyakori m² → hektár és ár átváltások</h3>
  <table>
    <thead><tr><th>Négyzetméter</th><th>Ár</th><th>Hektár</th></tr></thead>
    <tbody>
      <tr><td>100 m²</td><td>1 ár</td><td>0,01 ha</td></tr>
      <tr><td>500 m²</td><td>5 ár</td><td>0,05 ha</td></tr>
      <tr><td>1 000 m²</td><td>10 ár</td><td>0,1 ha</td></tr>
      <tr><td>5 000 m²</td><td>50 ár</td><td>0,5 ha</td></tr>
      <tr><td>10 000 m²</td><td>100 ár</td><td>1 ha</td></tr>
    </tbody>
  </table>

  <h3>Gyakori hektár → m² átváltások</h3>
  <table>
    <thead><tr><th>Hektár</th><th>Négyzetméter</th></tr></thead>
    <tbody>
      <tr><td>1 ha</td><td>10 000 m²</td></tr>
      <tr><td>5 ha</td><td>50 000 m²</td></tr>
      <tr><td>10 ha</td><td>100 000 m²</td></tr>
      <tr><td>100 ha</td><td>1 000 000 m²</td></tr>
      <tr><td>300 ha</td><td>3 000 000 m²</td></tr>
    </tbody>
  </table>

  <h3>Gyakori négyzetláb → m² átváltások</h3>
  <table>
    <thead><tr><th>Négyzetláb</th><th>Négyzetméter</th></tr></thead>
    <tbody>
      <tr><td>1 ft²</td><td>0,09290304 m²</td></tr>
      <tr><td>10 ft²</td><td>0,9290304 m²</td></tr>
      <tr><td>100 ft²</td><td>9,290304 m²</td></tr>
      <tr><td>1 000 ft²</td><td>92,90304 m²</td></tr>
    </tbody>
  </table>
</section>
<!-- KB_P14:area-intent:END -->`;

function transform(html) {
  const blockPattern = /<!--\s*KB_P14:area-intent:START\s*-->[\s\S]*?<!--\s*KB_P14:area-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, areaIntentBlock);

  const legacyAreaBlock = /<section\s+id=["']terulet["'][^>]*\bdata-converter-intent=["']area["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacyAreaBlock.test(html)) return html.replace(legacyAreaBlock, areaIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${areaIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transform(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P14 terület-intent blokk nincs materializálva vagy nem egyezik a forrással.");
    process.exit(1);
  }
  console.log("P14 terület-intent blokk rendben.");
  process.exit(0);
}

if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P14 terület-intent blokk frissítve.");
} else {
  console.log("P14 terület-intent blokk már naprakész.");
}
