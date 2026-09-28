const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const finalIntentBlock = `<!-- KB_P16:final-converter-intents:START -->
<section id="energia" class="converter-intent-block" data-converter-intent="energy">
  <h2>Energia átváltás: kWh, MJ, kJ, kcal és joule</h2>
  <p>
    Az <strong>Energia</strong> kategóriában joule, kilojoule, megajoule, wattóra, kilowattóra, kalória és kilokalória között válthatsz.
    Az élelmiszereknél használt „kalória” jellemzően kilokalóriát (kcal) jelent.
  </p>
  <ul>
    <li>1 kWh = 3,6 MJ = 3600 kJ</li>
    <li>1 MJ = 0,2777777778 kWh</li>
    <li>1 kcal = 4,184 kJ = 4184 J</li>
    <li>1 cal = 4,184 J</li>
  </ul>
  <h3>Gyakori kWh → MJ átváltások</h3>
  <table>
    <thead><tr><th>kWh</th><th>MJ</th></tr></thead>
    <tbody>
      <tr><td>0,5 kWh</td><td>1,8 MJ</td></tr>
      <tr><td>1 kWh</td><td>3,6 MJ</td></tr>
      <tr><td>5 kWh</td><td>18 MJ</td></tr>
      <tr><td>10 kWh</td><td>36 MJ</td></tr>
    </tbody>
  </table>
  <h3>Gyakori kcal → kJ átváltások</h3>
  <table>
    <thead><tr><th>kcal</th><th>kJ</th></tr></thead>
    <tbody>
      <tr><td>100 kcal</td><td>418,4 kJ</td></tr>
      <tr><td>500 kcal</td><td>2092 kJ</td></tr>
      <tr><td>1000 kcal</td><td>4184 kJ</td></tr>
    </tbody>
  </table>
</section>

<section id="teljesitmeny" class="converter-intent-block" data-converter-intent="power">
  <h2>Teljesítmény átváltás: kW, watt, LE/PS és hp</h2>
  <p>
    A <strong>Teljesítmény</strong> kategóriában watt, kilowatt, megawatt, metrikus lóerő (LE/PS) és mechanikai horsepower (hp) között válthatsz.
    A metrikus LE/PS és az angolszász mechanikai hp nem pontosan ugyanaz az egység.
  </p>
  <ul>
    <li>1 kW = 1000 W</li>
    <li>1 kW ≈ 1,3596216173 LE/PS</li>
    <li>1 LE/PS = 0,73549875 kW</li>
    <li>1 mechanikai hp ≈ 0,7456998716 kW</li>
  </ul>
  <h3>Gyakori kW → LE/PS átváltások</h3>
  <table>
    <thead><tr><th>kW</th><th>LE/PS</th></tr></thead>
    <tbody>
      <tr><td>50 kW</td><td>≈ 67,98 LE</td></tr>
      <tr><td>75 kW</td><td>≈ 101,97 LE</td></tr>
      <tr><td>100 kW</td><td>≈ 135,96 LE</td></tr>
      <tr><td>150 kW</td><td>≈ 203,94 LE</td></tr>
    </tbody>
  </table>
</section>

<section id="nyomas" class="converter-intent-block" data-converter-intent="pressure">
  <h2>Nyomás átváltás: bar, kPa, atm, PSI és pascal</h2>
  <p>
    A <strong>Nyomás</strong> kategóriában pascal, kilopascal, bar, standard atmoszféra és PSI között válthatsz.
    Az átváltás az egységet változtatja meg; azt nem dönti el, hogy abszolút nyomásról vagy túlnyomásról van-e szó.
  </p>
  <ul>
    <li>1 bar = 100 kPa = 100 000 Pa</li>
    <li>1 atm = 1,01325 bar</li>
    <li>1 bar ≈ 14,5037738 PSI</li>
    <li>1 PSI ≈ 0,0689475729 bar</li>
  </ul>
  <h3>Gyakori bar → kPa és PSI átváltások</h3>
  <table>
    <thead><tr><th>bar</th><th>kPa</th><th>PSI</th></tr></thead>
    <tbody>
      <tr><td>1 bar</td><td>100 kPa</td><td>≈ 14,50 PSI</td></tr>
      <tr><td>2 bar</td><td>200 kPa</td><td>≈ 29,01 PSI</td></tr>
      <tr><td>2,3 bar</td><td>230 kPa</td><td>≈ 33,36 PSI</td></tr>
      <tr><td>2,5 bar</td><td>250 kPa</td><td>≈ 36,26 PSI</td></tr>
      <tr><td>3 bar</td><td>300 kPa</td><td>≈ 43,51 PSI</td></tr>
    </tbody>
  </table>
</section>
<!-- KB_P16:final-converter-intents:END -->`;

function transformHub(html) {
  const blockPattern = /<!--\s*KB_P16:final-converter-intents:START\s*-->[\s\S]*?<!--\s*KB_P16:final-converter-intents:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, finalIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${finalIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transformHub(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P16 végső átváltó intent blokkok nincsenek materializálva vagy nem egyeznek a forrással.");
    process.exit(1);
  }
  console.log("P16 végső átváltó intent blokkok rendben.");
  process.exit(0);
}

if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P16 végső átváltó intent blokkok frissítve.");
} else {
  console.log("P16 végső átváltó intent blokkok már naprakészek.");
}
