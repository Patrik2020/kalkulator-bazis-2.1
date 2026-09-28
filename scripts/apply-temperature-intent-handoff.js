const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const temperatureIntentBlock = `<!-- KB_P12:temperature-intent:START -->
<section id="homerseklet" class="converter-intent-block" data-converter-intent="temperature">
  <h2>Hőmérséklet átváltás: Kelvin, Celsius és Fahrenheit</h2>
  <p>
    A <strong>Hőmérséklet</strong> kategóriában Celsius (°C), Fahrenheit (°F) és Kelvin (K) között válthatsz.
    Ezeknél nem elég egy egyszerű szorzás: a skálák nullpontja is eltér, ezért az átváltás eltolást is használ.
  </p>
  <ul>
    <li>Celsius → Kelvin: K = °C + 273,15</li>
    <li>Kelvin → Celsius: °C = K − 273,15</li>
    <li>Celsius → Fahrenheit: °F = °C × 9/5 + 32</li>
    <li>Fahrenheit → Celsius: °C = (°F − 32) × 5/9</li>
  </ul>

  <h3>Gyakori Kelvin → Celsius átváltások</h3>
  <table>
    <thead><tr><th>Kelvin</th><th>Celsius</th></tr></thead>
    <tbody>
      <tr><td>0 K</td><td>−273,15 °C</td></tr>
      <tr><td>100 K</td><td>−173,15 °C</td></tr>
      <tr><td>273,15 K</td><td>0 °C</td></tr>
      <tr><td>293,15 K</td><td>20 °C</td></tr>
      <tr><td>300 K</td><td>26,85 °C</td></tr>
      <tr><td>373,15 K</td><td>100 °C</td></tr>
    </tbody>
  </table>

  <h3>Gyakori Celsius → Kelvin és Fahrenheit értékek</h3>
  <table>
    <thead><tr><th>Celsius</th><th>Kelvin</th><th>Fahrenheit</th></tr></thead>
    <tbody>
      <tr><td>0 °C</td><td>273,15 K</td><td>32 °F</td></tr>
      <tr><td>20 °C</td><td>293,15 K</td><td>68 °F</td></tr>
      <tr><td>25 °C</td><td>298,15 K</td><td>77 °F</td></tr>
      <tr><td>37 °C</td><td>310,15 K</td><td>98,6 °F</td></tr>
      <tr><td>100 °C</td><td>373,15 K</td><td>212 °F</td></tr>
    </tbody>
  </table>

  <p>
    Az abszolút nulla 0 K, vagyis −273,15 °C. A kalkulátor ennél alacsonyabb fizikai hőmérsékletet nem fogad el.
  </p>
</section>
<!-- KB_P12:temperature-intent:END -->`;

function transform(html) {
  const blockPattern = /<!--\s*KB_P12:temperature-intent:START\s*-->[\s\S]*?<!--\s*KB_P12:temperature-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, temperatureIntentBlock);

  const legacyTemperatureBlock = /<section\s+id=["']homerseklet["'][^>]*\bdata-converter-intent=["']temperature["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacyTemperatureBlock.test(html)) return html.replace(legacyTemperatureBlock, temperatureIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${temperatureIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transform(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P12 hőmérséklet-intent blokk nincs materializálva vagy nem egyezik a forrással.");
    process.exit(1);
  }
  console.log("P12 hőmérséklet-intent blokk rendben.");
  process.exit(0);
}

if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P12 hőmérséklet-intent blokk frissítve.");
} else {
  console.log("P12 hőmérséklet-intent blokk már naprakész.");
}
