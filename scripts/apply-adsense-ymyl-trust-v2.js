const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ymylSlugs = [
  "alvasciklus-kalkulator",
  "bmi-kalkulator",
  "bmr-kalkulator",
  "derek-csipo-kalkulator",
  "etf-kalkulator",
  "feherje-szukseglet-kalkulator",
  "fizetesi-hatarido-kalkulator",
  "havi-koltsegvetes-kalkulator",
  "hitel-elotorlesztes-kalkulator",
  "hitel-torleszto-kalkulator",
  "hitelkepesseg-kalkulator",
  "idealis-testsuly-kalkulator",
  "inflacio-kalkulator",
  "kaloria-kalkulator",
  "kamatos-kamat-kalkulator",
  "lakas-hitel-onero-kalkulator",
  "makro-kalkulator",
  "milliomos-kalkulator",
  "netto-brutto-kalkulator",
  "osztalek-kalkulator",
  "pulzus-zona-kalkulator",
  "szamla-teljesites-kalkulator",
  "terhessegi-kalkulator",
  "testzsir-kalkulator",
  "vizfogyasztas-kalkulator",
];

// A korábbi blokk minden érintett kalkulátoron megismételte az üzemeltető nevét,
// a személyes felelősséget és a belső fejlesztési folyamatot. Ezek nem segítik a
// látogatót az eredmény értelmezésében; az azonosítás helye az Impresszum.
const trustPattern = /\n*<!-- KB_ADSENSE:ymyl-trust:START -->[\s\S]*?<!-- KB_ADSENSE:ymyl-trust:END -->\n*/;
const legacyGapPattern = /\n{4,}(?=<!-- KB_(?:STATIC:reliability|ADSENSE:primary-sources):START -->)/;

let removedTrustBlocks = 0;

for (const slug of ymylSlugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó YMYL kalkulátor: ${slug}.html`);
  let html = fs.readFileSync(file, "utf8");

  if (trustPattern.test(html)) {
    html = html.replace(trustPattern, "\n\n\n");
    removedTrustBlocks += 1;
  }
  html = html.replace(legacyGapPattern, "\n\n\n");

  fs.writeFileSync(file, html, "utf8");
}

const transparencyPath = path.join(root, "atlathatosag-es-minoseg.html");
let transparency = fs.readFileSync(transparencyPath, "utf8");
const transparencyBlock = `<!-- KB_ADSENSE:editorial-process:START -->
<section class="article editorial-process" id="eredmeny-ellenorzese">
  <h2>Mit érdemes ellenőrizni az eredménynél?</h2>
  <p>A kalkulátor eredménye akkor értelmezhető jól, ha a bemenetek, a feltételezések és az esetleges korlátok is egyértelműek.</p>
  <ul>
    <li>Ellenőrizd a megadott értékeket és mértékegységeket.</li>
    <li>Szabály- vagy adatfüggő számításnál nézd meg az évszámot és a hivatkozott forrást.</li>
    <li>Vedd figyelembe, ha az eredmény kerekített érték vagy becslés.</li>
    <li>Egyedi élethelyzetnél nézd meg, mely körülményeket nem kezeli a kalkulátor.</li>
  </ul>
  <p>A konkrét képletet, forrást és korlátokat az adott kalkulátor oldalán találod.</p>
</section>
<!-- KB_ADSENSE:editorial-process:END -->`;
const transparencyPattern = /<!-- KB_ADSENSE:editorial-process:START -->[\s\S]*?<!-- KB_ADSENSE:editorial-process:END -->/;

if (transparencyPattern.test(transparency)) {
  transparency = transparency.replace(transparencyPattern, transparencyBlock);
} else if (transparency.includes("</main>")) {
  transparency = transparency.replace("</main>", `${transparencyBlock}\n</main>`);
} else {
  throw new Error("Az Átláthatóság és minőség oldalon nem található </main>.");
}
fs.writeFileSync(transparencyPath, transparency, "utf8");

console.log(`Removed ${removedTrustBlocks} legacy YMYL ownership blocks and refreshed the transparency page.`);
