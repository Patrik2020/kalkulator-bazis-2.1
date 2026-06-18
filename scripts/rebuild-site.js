const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(dataCode, context);

const { categories, calculators } = context.window.KB_DATA;
const siteUrl = "https://kalkulatorbazis.hu";

const escapeHtml = (value) =>
  value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const categoryById = (id) => categories.find((category) => category.id === id);

const prioritySeoBlocks = {
  "kalkulatorok/netto-brutto-kalkulator.html": {
    title: "Bértervezés gyorsan és érthetően",
    paragraphs: [
      "A nettó-bruttó számítás az egyik leggyakoribb pénzügyi kérdés álláskeresés, bértárgyalás vagy vállalkozói tervezés közben. A kalkulátor segít gyorsan átlátni, hogy egy megadott bérből mennyi maradhat kézhez kapott összegként.",
      "Érdemes több forgatókönyvet is kipróbálni: kedvezményekkel, kedvezmények nélkül, illetve eltérő bruttó vagy nettó elvárásokkal. Így könnyebb reális bérigényt megfogalmazni.",
    ],
  },
  "kalkulatorok/hitel-torleszto-kalkulator.html": {
    title: "Hitel előtt érdemes több változatot számolni",
    paragraphs: [
      "A törlesztőrészlet nemcsak a felvett összegtől, hanem a futamidőtől és a kamattól is erősen függ. Egy kis kamatkülönbség hosszabb távon jelentős eltérést okozhat a teljes visszafizetésben.",
      "A kalkulátor gyors előszűrésre jó: megmutatja, milyen havi teherrel érdemes számolni, mielőtt részletes banki ajánlatokat hasonlítanál össze.",
    ],
  },
  "kalkulatorok/bmi-kalkulator.html": {
    title: "BMI értelmezése józanul",
    paragraphs: [
      "A BMI egyszerű, gyors mutató, de nem diagnózis. Sportolóknál, magas izomtömeg mellett vagy speciális egészségi helyzetben félrevezető lehet.",
      "Arra viszont hasznos, hogy kiindulópontot adjon, és segítsen észrevenni, ha érdemes részletesebben foglalkozni a testsúllyal vagy életmóddal.",
    ],
  },
  "kalkulatorok/kaloria-kalkulator.html": {
    title: "Kalóriatervezés fenntartható módon",
    paragraphs: [
      "A napi kalóriaszükséglet becslése jó alap étrendtervezéshez, fogyáshoz vagy tömegnöveléshez. A legjobb eredményt akkor adja, ha néhány hétig figyeled a testsúlyod változását is.",
      "A túl nagy kalóriadeficit hosszú távon nehezen tartható, ezért érdemes fokozatos és mérhető változtatásokban gondolkodni.",
    ],
  },
  "kalkulatorok/deviza-atvalto-kalkulator.html": {
    title: "Devizaátváltásnál a díjak is számítanak",
    paragraphs: [
      "Az árfolyam csak az egyik része a végső költségnek. Bankoknál, pénzváltóknál és online szolgáltatóknál eltérhet az alkalmazott árfolyam és a felszámított díj.",
      "Nagyobb összeg váltása előtt érdemes több szolgáltatóval összehasonlítani a ténylegesen megkapott összeget.",
    ],
  },
  "kalkulatorok/beton-kalkulator.html": {
    title: "Anyagtervezés ráhagyással",
    paragraphs: [
      "Betonozásnál ritkán jó ötlet pontosan nullára számolni az anyagot. A felület egyenetlensége, zsaluzat, tömörítés és veszteség miatt érdemes biztonsági ráhagyással tervezni.",
      "A kalkulátor becslést ad, de a végleges rendelés előtt mindig ellenőrizd a tényleges méreteket a helyszínen is.",
    ],
  },
  "kalkulatorok/csempe-kalkulator.html": {
    title: "Burkolásnál a vágási veszteség természetes",
    paragraphs: [
      "Csempénél és járólapnál a vágások, minták, törések és későbbi javítások miatt célszerű több anyagot venni a nettó felületnél.",
      "Egyszerű burkolásnál kisebb, diagonál vagy mintás lerakásnál nagyobb ráhagyással érdemes számolni.",
    ],
  },
  "kalkulatorok/festek-kalkulator.html": {
    title: "Festésnél nem csak a négyzetméter számít",
    paragraphs: [
      "A festékfogyás függ a fal állapotától, színétől, nedvszívásától és attól is, hány rétegben kell festeni.",
      "Erős színváltásnál vagy javított felületnél érdemes alapozóval és plusz réteggel is kalkulálni.",
    ],
  },
  "kalkulatorok/auto-kalkulator.html": {
    title: "Autós költségnél a kis tételek is összeadódnak",
    paragraphs: [
      "Egy út költsége nemcsak az üzemanyagról szól. Autópályadíj, parkolás, kopás, biztosítás és szerviz is része lehet a valós költségnek.",
      "Ha rendszeresen autózol, érdemes havi vagy éves szinten is ránézni a teljes fenntartási költségre.",
    ],
  },
  "kalkulatorok/afa-kalkulator.html": {
    title: "ÁFA számítás számlázás és vásárlás előtt",
    paragraphs: [
      "Az ÁFA kalkulátor gyorsan megmutatja, hogyan alakul a nettó és bruttó ár, illetve mekkora adótartalom van egy összegben.",
      "Vállalkozásoknál különösen hasznos, amikor ajánlatot, számlát vagy árképzést kell ellenőrizni.",
    ],
  },
  "kalkulatorok/szazalek-kalkulator.html": {
    title: "Százalékszámítás hétköznapi döntésekhez",
    paragraphs: [
      "Kedvezmények, áremelkedések, arányok és teljesítményváltozások megértéséhez a százalék az egyik leghasznosabb gyors számítás.",
      "A kalkulátor segít elkerülni a fejben számolásból adódó tévedéseket, különösen vásárlás vagy pénzügyi döntés előtt.",
    ],
  },
};

const categoryFaq = (category) => `
      <h2>Gyakori kérdések</h2>
      <div class="faq-list">
        <details>
          <summary>Mire jók a ${escapeHtml(category.title.toLowerCase())}?</summary>
          <p>${escapeHtml(category.seo)}</p>
        </details>
        <details>
          <summary>Mobilon is használhatók ezek a kalkulátorok?</summary>
          <p>Igen, az oldal mobil-first elven készült, ezért telefonon, tableten és asztali gépen is kényelmesen használható.</p>
        </details>
        <details>
          <summary>Pontos eredményt adnak a kalkulátorok?</summary>
          <p>A számítások tájékoztató jellegűek, de a megadott adatok alapján gyors és követhető becslést adnak a döntések előkészítéséhez.</p>
        </details>
      </div>`;

const calculatorSeoBlock = (calculator) => {
  const category = categoryById(calculator.category);
  const lowerTitle = calculator.title.toLowerCase();

  return `
    <section class="article generated-seo" data-generated-seo="calculator">
      <h2>${escapeHtml(calculator.title)} használata</h2>
      <p>
        A ${escapeHtml(lowerTitle)} gyors segítséget ad, ha pontosabb képet szeretnél kapni egy gyakori
        ${escapeHtml(category.shortTitle.toLowerCase())} számítás eredményéről. A kalkulátor egyszerűen használható:
        add meg a szükséges adatokat, az eredmény pedig azonnal megjelenik.
      </p>
      <p>
        ${escapeHtml(calculator.description)} Az eszköz célja, hogy a számolás ne vegyen el felesleges időt,
        és mobilon is könnyen ellenőrizhető legyen az eredmény.
      </p>
      <p>
        A kapott értékek tájékoztató jellegűek. Pénzügyi, egészségügyi, építőipari vagy nagyobb értékű
        döntés előtt érdemes a számítást saját adatokkal többször is ellenőrizni, illetve szükség esetén
        szakértői tanácsot kérni.
      </p>

      <h2>Gyakori kérdések</h2>
      <div class="faq-list">
        <details>
          <summary>Mire jó a ${escapeHtml(lowerTitle)}?</summary>
          <p>${escapeHtml(calculator.description)} Akkor hasznos, ha gyors, áttekinthető eredményt szeretnél kapni kézi számolás nélkül.</p>
        </details>
        <details>
          <summary>Ingyenes a kalkulátor használata?</summary>
          <p>Igen, a Kalkulátor Bázis kalkulátorai ingyenesen használhatók, külön regisztráció nélkül.</p>
        </details>
        <details>
          <summary>Mobilon is működik?</summary>
          <p>Igen, a kalkulátor mobil-first felülettel készült, ezért telefonon és tableten is kényelmesen használható.</p>
        </details>
        <details>
          <summary>Mennyire pontos az eredmény?</summary>
          <p>Az eredmény a megadott adatokból számított tájékoztató érték. Ha hivatalos, szerződéses vagy egészségügyi döntéshez használod, ellenőrizd más forrásból is.</p>
        </details>
      </div>
    </section>`;
};

const prioritySeoBlock = (calculator) => {
  const block = prioritySeoBlocks[calculator.url];

  if (!block) return "";

  return `
    <section class="article priority-seo" data-priority-seo="calculator">
      <h2>${escapeHtml(block.title)}</h2>
      ${block.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n      ")}
    </section>`;
};

const searchBox = () => `
    <div class="search-box">
      <label class="visually-hidden" for="calculatorSearch">Keresés kalkulátorok között</label>
      <input type="search" id="calculatorSearch" placeholder="Keresés kalkulátorok között..." autocomplete="off" />
      <div class="search-results" id="calculatorSearchResults" aria-live="polite"></div>
    </div>`;

const calculatorCard = (calculator) => {
  const category = categoryById(calculator.category);

  return `
      <a class="card card-link calculator-card ${category.cardClass}" href="${calculator.url}">
        <h3>${escapeHtml(calculator.title)}</h3>
        <p>${escapeHtml(calculator.description)}</p>
      </a>`;
};

const homeCategoryCard = (category) => `
      <a href="${category.url}" class="card card-link ${category.cardClass}">
        <h3>${escapeHtml(category.title)}</h3>
        <p>${escapeHtml(category.description)}</p>
      </a>`;

const categoryPage = (category) => {
  const items = calculators.filter((calculator) => calculator.category === category.id);
  const cards = items.map(calculatorCard).join("\n");

  return `<!doctype html>
<html lang="hu">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(category.description)}" />
  <link rel="canonical" href="${siteUrl}/${category.url}" />
  <title>${escapeHtml(category.title)} | Kalkulátor Bázis</title>
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/global-head.js"></script>
</head>

<body>
  <div id="header"></div>

  <main class="container" data-category-page="${category.id}">
    <section class="page-hero" data-render="category-intro">
      <h1>${escapeHtml(category.title)}</h1>
      <p>${escapeHtml(category.description)}</p>
    </section>
${searchBox()}
    <section class="category-grid" data-render="category-calculators">
${cards}
    </section>
    <section data-render="wise-banner"></section>
    <section class="ad-section" data-render="ad-slot"></section>
    <section class="category-seo" data-render="category-seo">
      <h2>${escapeHtml(category.title)} egy helyen</h2>
      <p>${escapeHtml(category.seo)}</p>
      <p>A kalkulátorok mobilon is gyorsan használhatók, a számításokhoz csak a legfontosabb adatokat kell megadnod.</p>
      <p>Válaszd ki a számodra releváns eszközt, add meg a szükséges adatokat, és néhány másodperc alatt áttekinthető eredményt kapsz. A kategória folyamatosan bővíthető, ezért új kalkulátor hozzáadásakor elég a központi adatlistát frissíteni.</p>
${categoryFaq(category)}
    </section>
  </main>

  <div id="footer"></div>

  <script src="js/site-data.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/site-ui.js"></script>
</body>

</html>
`;
};

const upsertCanonical = (html, href) => {
  const tag = `  <link rel="canonical" href="${href}" />`;

  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/i, `\n${tag}\n`);
  }

  return html.replace(/(\s*<title>)/i, `\n${tag}\n$1`);
};

const dedupeMetaDescription = (html, fallback) => {
  const matches = [...html.matchAll(/^\s*<meta\s+name=["']description["'][\s\S]*?\/>\s*$/gim)];

  if (matches.length <= 1) return html;

  const keep = matches[matches.length - 1][0];
  let removed = html;

  matches.forEach((match) => {
    removed = removed.replace(match[0], "");
  });

  const normalizedKeep = keep.trim() || `<meta name="description" content="${escapeHtml(fallback)}" />`;

  return removed.replace(/(<meta charset=["']UTF-8["']\s*\/>)/i, `$1\n    ${normalizedKeep}`);
};

const ensureGlobalHead = (html, prefix) => {
  const script = `<script src="${prefix}js/global-head.js"></script>`;

  if (html.includes(script)) return html;

  return html.replace(/(<\/head>)/i, `  ${script}\n$1`);
};

const ensureUtilsScript = (html, prefix) => {
  const script = `<script src="${prefix}js/utils.js"></script>`;

  if (new RegExp(`<script\\s+src=["']${prefix.replace(/\./g, "\\.")}js/utils\\.js["'][^>]*><\\/script>`, "i").test(html)) {
    return html;
  }

  return html.replace(/(<\/body>)/i, `  ${script}\n$1`);
};

const normalizeUtilsScripts = (html, prefix) => {
  const utilsPattern = new RegExp(`\\s*<script\\s+src=["']${prefix.replace(/\./g, "\\.")}js/utils\\.js["'][^>]*><\\/script>`, "gi");
  const matches = html.match(utilsPattern);

  if (!matches) return html;

  html = html.replace(utilsPattern, "");

  const pageScriptPattern = new RegExp(`(\\s*<script\\s+src=["']${prefix.replace(/\./g, "\\.")}js\\/(?:altalanos|atvaltok|autos|egeszseg|epitoipari|penzugyi)\\/[^"']+["'][^>]*><\\/script>)`, "i");
  const pageScriptMatch = html.match(pageScriptPattern);
  const normalized = `\n    <script src="${prefix}js/utils.js"></script>`;

  if (pageScriptMatch) {
    return html.replace(pageScriptMatch[0], `${normalized}${pageScriptMatch[0]}`);
  }

  return html.replace(/(<\/body>)/i, `  ${normalized}\n$1`);
};

const removeStaticCookieBanner = (html) =>
  html.replace(/\n?\s*<!-- COOKIE -->[\s\S]*?<div id="footer"><\/div>/i, "\n  <div id=\"footer\"></div>");

const removeGeneratedSeo = (html) =>
  html.replace(/\n?\s*<section class=["']article generated-seo["'] data-generated-seo=["']calculator["'][\s\S]*?<\/section>/i, "");

const removePrioritySeo = (html) =>
  html.replace(/\n?\s*<section class=["']article priority-seo["'] data-priority-seo=["']calculator["'][\s\S]*?<\/section>/i, "");

const insertCalculatorSeo = (html, calculator) => {
  const block = `${prioritySeoBlock(calculator)}${calculatorSeoBlock(calculator)}`;

  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${block}\n    </main>`);
  }

  return html;
};

const enhanceCalculatorPage = (fileName) => {
  const absolute = path.join(root, "kalkulatorok", fileName);
  const relativeUrl = `kalkulatorok/${fileName}`;
  const calculator = calculators.find((item) => item.url === relativeUrl);
  let html = fs.readFileSync(absolute, "utf8");

  html = removeGeneratedSeo(html);
  html = removePrioritySeo(html);
  html = dedupeMetaDescription(html, calculator ? calculator.description : "Online kalkulátor a Kalkulátor Bázison.");
  html = upsertCanonical(html, `${siteUrl}/${relativeUrl}`);
  html = ensureGlobalHead(html, "../");
  html = ensureUtilsScript(html, "../");
  html = normalizeUtilsScripts(html, "../");
  html = removeStaticCookieBanner(html);
  if (calculator) {
    html = insertCalculatorSeo(html, calculator);
  }

  fs.writeFileSync(absolute, html, "utf8");
};

const replaceRenderedSection = (html, marker, content) => {
  const pattern = new RegExp(`(<(section|div)[^>]+data-render=["']${marker}["'][^>]*>)([\\s\\S]*?)(<\\/\\2>)`, "i");

  return html.replace(pattern, `$1\n${content}\n    $4`);
};

const rebuildIndex = () => {
  const indexPath = path.join(root, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const categoryCards = categories.map(homeCategoryCard).join("\n");
  const popularCards = calculators
    .filter((calculator) => calculator.popular)
    .map(calculatorCard)
    .join("\n");

  html = replaceRenderedSection(html, "home-categories", categoryCards);
  html = replaceRenderedSection(html, "popular-calculators", popularCards);
  html = upsertCanonical(html, `${siteUrl}/`);

  fs.writeFileSync(indexPath, html, "utf8");
};

const rebuildAllCalculatorsPage = () => {
  const pagePath = path.join(root, "kalkulatorok.html");
  const sections = categories
    .map((category) => {
      const cards = calculators
        .filter((calculator) => calculator.category === category.id)
        .map(calculatorCard)
        .join("\n");

      return `
    <section class="section-block">
      <h2 class="section-heading">${escapeHtml(category.title)}</h2>
      <div class="category-grid">
${cards}
      </div>
    </section>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="hu">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Az összes Kalkulátor Bázis kalkulátor egy helyen, kategóriák szerint rendezve." />
  <link rel="canonical" href="${siteUrl}/kalkulatorok.html" />
  <title>Összes kalkulátor | Kalkulátor Bázis</title>
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/global-head.js"></script>
</head>

<body>
  <div id="header"></div>

  <main class="container all-calculators-page">
    <section class="page-hero">
      <h1>Összes kalkulátor</h1>
      <p>Válassz kategóriát, vagy keress rá közvetlenül a szükséges kalkulátorra.</p>
    </section>
${searchBox()}
${sections}
  </main>

  <div id="footer"></div>
  <script src="js/site-data.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/site-ui.js"></script>
</body>

</html>
`;

  fs.writeFileSync(pagePath, html, "utf8");
};

rebuildIndex();
rebuildAllCalculatorsPage();

categories.forEach((category) => {
  fs.writeFileSync(path.join(root, category.url), categoryPage(category), "utf8");
});

calculators.forEach((calculator) => {
  enhanceCalculatorPage(path.basename(calculator.url));
});

require("./generate-sitemap");

console.log(`Rebuilt ${categories.length} category pages and normalized ${calculators.length} calculator pages.`);
