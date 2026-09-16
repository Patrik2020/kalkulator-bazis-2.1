const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const notes = {
  "etf-kalkulator.html": `<!-- KB_ADSENSE:primary-sources:START -->
<div class="notice-box source-note adsense-primary-sources">
  <strong>Források és ellenőrzési alap:</strong>
  az ETF-ek kockázatának, költségeinek és befektetői tájékoztatásának értelmezéséhez az
  <a href="https://www.mnb.hu/fogyasztovedelem/befektetes-megtakaritas/befektetes-elott" target="_blank" rel="noopener noreferrer">MNB Befektetés előtt</a>
  fogyasztóvédelmi útmutatóját és az
  <a href="https://www.mnb.hu/felugyelet/felugyeleti-keretrendszer/felugyeleti-hirek/hirek-ujdonsagok/az-uj-befektetesi-alapok-csokkentik-a-befektetok-koltsegeit" target="_blank" rel="noopener noreferrer">MNB befektetési alapok költségeiről szóló tájékoztatását</a>
  használjuk ellenőrzési háttérként. A kalkulátor hozamadatai felhasználói feltételezések, nem MNB-előrejelzések.
</div>
<!-- KB_ADSENSE:primary-sources:END -->`,
  "osztalek-kalkulator.html": `<!-- KB_ADSENSE:primary-sources:START -->
<div class="notice-box source-note adsense-primary-sources">
  <strong>Források és ellenőrzési alap:</strong>
  az osztalék jogi fogalmának és adózási környezetének ellenőrzési alapja a
  <a href="https://njt.hu/jogszabaly/1995-117-00-00" target="_blank" rel="noopener noreferrer">személyi jövedelemadóról szóló 1995. évi CXVII. törvény</a>,
  különösen az osztalékból származó jövedelemre vonatkozó rendelkezések, valamint a
  <a href="https://nav.gov.hu/ado/szja" target="_blank" rel="noopener noreferrer">NAV aktuális személyijövedelemadó-tájékoztatói</a>.
  A kalkulátor nem feltételez automatikusan minden élethelyzetre érvényes adómértéket: a levonásokat a felhasználó által megadott adatokkal modellezi.
</div>
<!-- KB_ADSENSE:primary-sources:END -->`,
};

const markerPattern = /<!-- KB_ADSENSE:primary-sources:START -->[\s\S]*?<!-- KB_ADSENSE:primary-sources:END -->/;

for (const [fileName, block] of Object.entries(notes)) {
  const file = path.join(root, "kalkulatorok", fileName);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó forrásolandó kalkulátor: ${fileName}`);
  let html = fs.readFileSync(file, "utf8");

  if (markerPattern.test(html)) {
    html = html.replace(markerPattern, block);
  } else if (html.includes("<!-- KB_STATIC:reliability:START -->")) {
    html = html.replace("<!-- KB_STATIC:reliability:START -->", `${block}\n<!-- KB_STATIC:reliability:START -->`);
  } else if (html.includes("</main>")) {
    html = html.replace("</main>", `${block}\n</main>`);
  } else {
    throw new Error(`Nem található biztonságos forrásblokk-beszúrási pont: ${fileName}`);
  }

  fs.writeFileSync(file, html, "utf8");
}

console.log(`Added primary source notes to ${Object.keys(notes).length} calculators.`);
