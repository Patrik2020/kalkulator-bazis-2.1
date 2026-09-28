const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const volumeIntentBlock = `<!-- KB_P11:volume-intent:START -->
<section id="terfogat" class="converter-intent-block" data-converter-intent="volume">
  <h2>Térfogat átváltás: liter, köbméter és gallon kalkulátor</h2>
  <p>
    A <strong>Térfogat</strong> kategóriában milliliter, liter, köbméter, US gallon, UK gallon és köbláb között válthatsz.
    A „gallon” nem egyetlen egység: az amerikai és a brit gallon eltérő térfogatot jelent, ezért mindig a megfelelő típust válaszd.
  </p>
  <ul>
    <li>1 liter = 0,001 m³</li>
    <li>1000 liter = 1 m³</li>
    <li>1 US gallon = 3,785411784 liter</li>
    <li>1 UK gallon = 4,54609 liter</li>
    <li>1 köbláb (ft³) = 28,316846592 liter</li>
  </ul>

  <h3>Gyakori US gallon → liter átváltások</h3>
  <table>
    <thead><tr><th>US gallon</th><th>Liter</th></tr></thead>
    <tbody>
      <tr><td>1 gallon</td><td>3,785411784 l</td></tr>
      <tr><td>3 gallon</td><td>11,356235352 l</td></tr>
      <tr><td>5 gallon</td><td>18,92705892 l</td></tr>
      <tr><td>10 gallon</td><td>37,85411784 l</td></tr>
      <tr><td>50 gallon</td><td>189,2705892 l</td></tr>
    </tbody>
  </table>

  <h3>Gyakori liter → köbméter átváltások</h3>
  <table>
    <thead><tr><th>Liter</th><th>Köbméter</th></tr></thead>
    <tbody>
      <tr><td>100 l</td><td>0,1 m³</td></tr>
      <tr><td>500 l</td><td>0,5 m³</td></tr>
      <tr><td>1000 l</td><td>1 m³</td></tr>
      <tr><td>2000 l</td><td>2 m³</td></tr>
      <tr><td>5000 l</td><td>5 m³</td></tr>
    </tbody>
  </table>

  <p>
    Ha egy forrás csak „gallont” ír, ellenőrizd a környezetét: amerikai (US) gallon esetén 3,785411784 literrel,
    brit/imperial (UK) gallon esetén 4,54609 literrel kell számolni.
  </p>
</section>
<!-- KB_P11:volume-intent:END -->`;

function transform(html) {
  const blockPattern = /<!--\s*KB_P11:volume-intent:START\s*-->[\s\S]*?<!--\s*KB_P11:volume-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, volumeIntentBlock);

  const legacyVolumeBlock = /<section\s+id=["']terfogat["'][^>]*\bdata-converter-intent=["']volume["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacyVolumeBlock.test(html)) return html.replace(legacyVolumeBlock, volumeIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${volumeIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transform(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P11 térfogat-intent blokk nincs materializálva vagy nem egyezik a forrással.");
    process.exit(1);
  }
  console.log("P11 térfogat-intent blokk rendben.");
  process.exit(0);
}

if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P11 térfogat-intent blokk frissítve.");
} else {
  console.log("P11 térfogat-intent blokk már naprakész.");
}
