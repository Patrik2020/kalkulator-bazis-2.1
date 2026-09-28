const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const dataSizeIntentBlock = `<!-- KB_P13:data-size-intent:START -->
<section id="adatmeret" class="converter-intent-block" data-converter-intent="data">
  <h2>Adatméret átváltás: KB, MB, GB, TB és bináris egységek</h2>
  <p>
    Az <strong>Adatméret</strong> kategóriában byte, kB, MB, GB, TB, valamint KiB, MiB, GiB és TiB között válthatsz.
    A kalkulátor külön kezeli a decimális (1000-es) és a bináris (1024-es) rendszert, így nem keveri össze az MB-ot a MiB-bal vagy a GB-ot a GiB-bal.
  </p>
  <ul>
    <li>8 bit = 1 byte</li>
    <li>1 MB = 1000 kB; 1 GB = 1000 MB; 1 TB = 1000 GB</li>
    <li>1 MiB = 1024 KiB; 1 GiB = 1024 MiB; 1 TiB = 1024 GiB</li>
    <li>1 MB = 1 000 000 byte; 1 MiB = 1 048 576 byte</li>
  </ul>

  <h3>1 MB hány KB, 1 GB hány MB, 1 TB hány GB?</h3>
  <table>
    <thead><tr><th>Decimális egység</th><th>Átváltás</th></tr></thead>
    <tbody>
      <tr><td>1 MB</td><td>1000 kB</td></tr>
      <tr><td>1 GB</td><td>1000 MB</td></tr>
      <tr><td>1 TB</td><td>1000 GB</td></tr>
      <tr><td>5 GB</td><td>5000 MB</td></tr>
      <tr><td>10 GB</td><td>10 000 MB</td></tr>
    </tbody>
  </table>

  <h3>Bináris átváltás: KiB, MiB, GiB és TiB</h3>
  <table>
    <thead><tr><th>Bináris egység</th><th>Átváltás</th></tr></thead>
    <tbody>
      <tr><td>1 MiB</td><td>1024 KiB</td></tr>
      <tr><td>1 GiB</td><td>1024 MiB</td></tr>
      <tr><td>1 TiB</td><td>1024 GiB</td></tr>
      <tr><td>2 GiB</td><td>2048 MiB</td></tr>
      <tr><td>4 GiB</td><td>4096 MiB</td></tr>
    </tbody>
  </table>

  <p>
    A hétköznapi „1 GB = 1024 MB” megfogalmazás gyakran a bináris arányra utal. Pontos jelöléssel ez <strong>1 GiB = 1024 MiB</strong>;
    a szabványos decimális egységeknél <strong>1 GB = 1000 MB</strong>.
  </p>
</section>
<!-- KB_P13:data-size-intent:END -->`;

function transform(html) {
  const blockPattern = /<!--\s*KB_P13:data-size-intent:START\s*-->[\s\S]*?<!--\s*KB_P13:data-size-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, dataSizeIntentBlock);

  const legacyDataSizeBlock = /<section\s+id=["']adatmeret["'][^>]*\bdata-converter-intent=["']data["'][^>]*>[\s\S]*?<\/section>/i;
  if (legacyDataSizeBlock.test(html)) return html.replace(legacyDataSizeBlock, dataSizeIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz a mértékegység-központban.");
  }

  return html.replace(insertionPoint, `${dataSizeIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

const before = fs.readFileSync(hubFile, "utf8");
const after = transform(before);

if (checkOnly) {
  if (after !== before) {
    console.error("P13 adatméret-intent blokk nincs materializálva vagy nem egyezik a forrással.");
    process.exit(1);
  }
  console.log("P13 adatméret-intent blokk rendben.");
  process.exit(0);
}

if (after !== before) {
  fs.writeFileSync(hubFile, after, "utf8");
  console.log("P13 adatméret-intent blokk frissítve.");
} else {
  console.log("P13 adatméret-intent blokk már naprakész.");
}

require("./apply-area-intent-handoff.js");
