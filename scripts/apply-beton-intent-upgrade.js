const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "kalkulatorok", "beton-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const markerStart = "<!-- KB_STATIC:beton-intent-p7:START -->";
const markerEnd = "<!-- KB_STATIC:beton-intent-p7:END -->";

const intentBlock = `${markerStart}
<section class="article beton-intent-guide" data-seo-intent="kobmeter-szamitas">
  <h2>Köbméter számítás 1 m² felülethez</h2>
  <p>A beton köbméterének kiszámításához a felületet meg kell szorozni a méterben megadott vastagsággal. Egy 1 m²-es felületnél ezért 10 cm vastagság 0,10 m³, 15 cm vastagság 0,15 m³, 20 cm vastagság pedig 0,20 m³ betont jelent ráhagyás nélkül.</p>
  <div class="example-box">
    <h3>Gyors m² → m³ példák</h3>
    <ul>
      <li><strong>1 m² × 10 cm:</strong> 0,10 m³ beton</li>
      <li><strong>1 m² × 15 cm:</strong> 0,15 m³ beton</li>
      <li><strong>1 m² × 20 cm:</strong> 0,20 m³ beton</li>
      <li><strong>10 m² × 10 cm:</strong> 1,00 m³ beton</li>
    </ul>
  </div>
  <p>Nagyobb felületnél ugyanaz a köbméter-számítás használható: <strong>m³ = felület (m²) × vastagság (m)</strong>. A rendelési mennyiségnél a geometriai eredményre külön ráhagyás lehet indokolt a zsaluzat, az aljzat egyenetlensége és a kivitelezési veszteség miatt.</p>
</section>
${markerEnd}`;

function replaceOnce(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Hiányzó beton intent-cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) {
    throw new Error(`Nem egyedi beton intent-cél: ${label}`);
  }
  return source.replace(oldText, newText);
}

function apply(source) {
  let html = source;

  html = replaceOnce(
    html,
    "<h2>Mennyi beton kell?</h2>",
    "<h2>Mennyi beton kell? Betonmennyiség számítása m³-ben</h2>",
    "betonmennyiség H2"
  );

  html = replaceOnce(
    html,
    "<h2>Beton mennyiség számítás képlete</h2>",
    "<h2>Köbméter számítás betonhoz – képlet és példa</h2>",
    "köbméter képlet H2"
  );

  const marked = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  if (marked.test(html)) {
    html = html.replace(marked, intentBlock);
  } else {
    const anchor = "<h2>Köbméter számítás betonhoz – képlet és példa</h2>";
    if (!html.includes(anchor)) throw new Error("Hiányzó köbméter-számítás beszúrási pont.");
    html = html.replace(anchor, `${intentBlock}\n\n      ${anchor}`);
  }

  return html;
}

if (!fs.existsSync(target)) throw new Error("Hiányzik a beton kalkulátor HTML.");
const source = fs.readFileSync(target, "utf8");
const expected = apply(source);
const secondPass = apply(expected);
if (secondPass !== expected) throw new Error("A beton intent-upgrade nem idempotens.");

if (!checkOnly && expected !== source) fs.writeFileSync(target, expected, "utf8");

console.log(
  checkOnly
    ? "Beton intent audit OK: köbméter/betonmennyiség célok materializálhatók és idempotensek."
    : `Beton intent-upgrade: ${expected === source ? "nincs változás" : "frissítve"}.`
);

module.exports = { apply, intentBlock };
