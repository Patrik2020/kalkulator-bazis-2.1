const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reviewedIso = "2026-09-16";
const reviewedHu = "2026. szeptember 16.";

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

const trustBlock = `<!-- KB_ADSENSE:ymyl-trust:START -->
<div class="reliability-meta ymyl-trust-meta">
  <p><strong>Szerkesztés és fejlesztés:</strong> Kovács Patrik, a Kalkulátor Bázis üzemeltetője és fejlesztője.</p>
  <p><strong>Ellenőrzési folyamat:</strong> a számítási logikát referenciaesetekkel és automatizált regressziós tesztekkel ellenőrizzük; a publikálási döntés és a módszertani felelősség az üzemeltetőé.</p>
  <p><strong>AI és automatizálás:</strong> fejlesztési, hibakeresési és szerkesztési segítségként használható, de önmagában nem tekintjük szakértői lektorálásnak. Külső szakértői ellenőrzést csak ott tüntetünk fel, ahol az ténylegesen megtörtént.</p>
  <p class="last-reviewed">Utolsó minőségi ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time></p>
</div>
<!-- KB_ADSENSE:ymyl-trust:END -->`;

const trustPattern = /<!-- KB_ADSENSE:ymyl-trust:START -->[\s\S]*?<!-- KB_ADSENSE:ymyl-trust:END -->/;

for (const slug of ymylSlugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó YMYL kalkulátor: ${slug}.html`);
  let html = fs.readFileSync(file, "utf8");

  if (trustPattern.test(html)) {
    html = html.replace(trustPattern, trustBlock);
  } else {
    const reliabilityEnd = "<!-- KB_STATIC:reliability:END -->";
    if (!html.includes(reliabilityEnd)) throw new Error(`Hiányzó reliability marker: ${slug}.html`);
    html = html.replace(reliabilityEnd, `${trustBlock}\n${reliabilityEnd}`);
  }

  fs.writeFileSync(file, html, "utf8");
}

const transparencyPath = path.join(root, "atlathatosag-es-minoseg.html");
let transparency = fs.readFileSync(transparencyPath, "utf8");
const transparencyBlock = `<!-- KB_ADSENSE:editorial-process:START -->
<section class="article editorial-process" id="szerkesztesi-es-automatizalasi-folyamat">
  <h2>Szerkesztési, fejlesztési és automatizálási folyamat</h2>
  <p>A Kalkulátor Bázis üzemeltetője és fejlesztője Kovács Patrik. A kalkulátoroknál a cél nem az, hogy automatizált szöveggyártással minél több oldal készüljön, hanem hogy a számítás működése, korlátai és – ahol szükséges – az alkalmazott hivatalos forrás visszakövethető legyen.</p>
  <h3>Hogyan készül vagy változik egy kalkulátor?</h3>
  <ol>
    <li>meghatározzuk a számítás célját, képletét, bemeneteit és ismert korlátait;</li>
    <li>szabály- vagy adatfüggő számításnál elsődleges, lehetőleg hivatalos forrást keresünk;</li>
    <li>a számítási logikát implementáljuk, majd referenciaesetekkel és automatizált regressziós tesztekkel ellenőrizzük;</li>
    <li>a crawler által látható HTML-t, canonicalt, strukturált adatot és mobil/asztali működést külön minőségi kapuk vizsgálják;</li>
    <li>a publikálási döntés és a módszertani felelősség az üzemeltetőé.</li>
  </ol>
  <h3>Mire használunk AI-t és automatizálást?</h3>
  <p>AI és automatizált eszközök segíthetnek kódjavaslatokban, hibakeresésben, tesztesetek összeállításában, szövegek szerkesztésében és ismétlődő technikai ellenőrzésekben. Ezeket nem tekintjük önálló forrásnak vagy szakértői lektorálásnak. Jogszabályi, adózási, egészségügyi vagy más érzékeny állítást nem azért tekintünk helyesnek, mert egy AI-rendszer megfogalmazta.</p>
  <h3>Szakértői lektorálás</h3>
  <p>A webhely általános működésére nem állítunk külső könyvelői, jogi, orvosi vagy befektetési szakértői lektorálást. Ha egy konkrét oldal később igazolt külső szakértői ellenőrzést kap, azt névvel, szerepkörrel és az ellenőrzés dátumával külön jelezzük.</p>
  <p class="last-reviewed">A folyamatleírás utolsó ellenőrzése: <time datetime="${reviewedIso}">${reviewedHu}</time></p>
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

console.log(`Updated YMYL trust metadata on ${ymylSlugs.length} calculators and the transparency page.`);
