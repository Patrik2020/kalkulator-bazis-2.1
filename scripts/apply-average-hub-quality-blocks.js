const fs = require("fs");
const path = require("path");

// Batch 2 finalization checkpoint: keep the average hub quality shell deterministic after materialization.
const file = path.resolve(__dirname, "..", "kalkulatorok", "atlag-kalkulator.html");
let html = fs.readFileSync(file, "utf8");

const lifestyle = `<!-- KB_STATIC:quality-lifestyle:START -->
<section data-static-quality-version="2026-09" data-static-quality-fallback="lifestyle" class="lifestyle-quality lq-average">
  <p class="lq-kicker">Átlag és medián ellenőrzése</p>
  <h2>Ugyanaz az adatsor többféle középértéket is indokolhat</h2>
  <p>Az 10, 11, 12, 13 és 60 értékek számtani átlaga 21,2, miközben a medián 12. A különbség rögtön jelzi, hogy egy szélső érték erősen elhúzza az átlagot.</p>
  <div class="lq-metrics">
    <div><span>Számtani átlag</span><strong>21,2</strong></div>
    <div><span>Medián</span><strong>12</strong></div>
    <div><span>Minimum – maximum</span><strong>10 – 60</strong></div>
  </div>
  <p class="lq-caption">A kalkulátor ezért nem csak eredményt ad: a számtani módban a medián segít gyorsan felismerni, ha a középérték értelmezéséhez több kontextus kell.</p>
</section>
<!-- KB_STATIC:quality-lifestyle:END -->`;

const method = `<!-- KB_STATIC:everyday-method:START -->
<section data-static-runtime-fallback="everyday-method" class="article everyday-method">
  <h2>Melyik átlagot válaszd?</h2>
  <p><strong>Számtani átlagot</strong> azonos jelentőségű értékekhez, <strong>súlyozott átlagot</strong> eltérő fontosságú vagy mennyiségű elemekhez, <strong>mértani átlagot</strong> pedig pozitív, egymásra épülő szorzótényezőkhöz használj.</p>
  <p>A mértani mód logaritmikus számítással dolgozik, ezért nagyobb adatsoroknál sem kell a köztes szorzatot közvetlenül előállítani. Nulla vagy negatív értéket ebben a módban szándékosan nem fogad el.</p>
  <h3>Adatkezelés</h3>
  <p>A beírt értékeket ez a kalkulátor a böngésződben dolgozza fel; a számításhoz nem szükséges saját szerverre elküldeni őket.</p>
  <p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="2026-09-19">2026. szeptember 19.</time></p>
</section>
<!-- KB_STATIC:everyday-method:END -->`;

const ensureBeforeMainEnd = (marker, block) => {
  if (html.includes(marker)) return;
  if (!/<\/main>/i.test(html)) throw new Error("Az Átlag kalkulátor oldalon hiányzik a </main> zárás.");
  html = html.replace(/<\/main>/i, `${block}\n</main>`);
};

ensureBeforeMainEnd("KB_STATIC:quality-lifestyle:START", lifestyle);
ensureBeforeMainEnd("KB_STATIC:everyday-method:START", method);

// A mezők a label elemekbe vannak ágyazva, ezért a for attribútum redundáns.
// Egységesen eltávolítjuk, hogy a materializált HTML és a lint ugyanazt a szerkezetet várja.
html = html.replace(/<label class="everyday-field" for="[^"]+">/g, '<label class="everyday-field">');

fs.writeFileSync(file, html, "utf8");
console.log("Average hub quality blocks applied.");