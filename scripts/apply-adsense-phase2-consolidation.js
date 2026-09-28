const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const slugs = [
  "hosszusag-atvalto-kalkulator",
  "terulet-atvalto-kalkulator",
  "terfogat-atvalto-kalkulator",
  "tomeg-atvalto-kalkulator",
  "homerseklet-atvalto-kalkulator",
  "ido-atvalto-kalkulator",
  "sebesseg-atvalto-kalkulator",
  "adatmeret-atvalto-kalkulator",
  "energia-atvalto-kalkulator",
  "nyomas-atvalto-kalkulator",
  "teljesitmeny-atvalto-kalkulator",
];

const canonical = "https://kalkulatorbazis.hu/kalkulatorok/mertekegyseg-atvalto-kalkulator";
const genericNotice = `<!-- KB_PHASE2:converter-retired:START -->
<section class="info-box phase2-retired-converter">
  <strong>Ez az önálló átváltó kivezetés alatt van.</strong>
  A mértékegység-átváltásokat egy közös, 11 kategóriás eszközbe vontuk össze.
  <a href="mertekegyseg-atvalto-kalkulator">Nyisd meg a Mértékegység átváltó központot.</a>
</section>
<!-- KB_PHASE2:converter-retired:END -->`;

const timeNotice = `<!-- KB_PHASE2:converter-retired:START -->
<section class="info-box phase2-retired-converter">
  <strong>Az időátváltó a közös Mértékegység átváltóba költözött.</strong>
  Az óra, perc, másodperc, nap, hét, átlagos hónap és átlagos év átváltását ugyanott éred el.
  <a href="mertekegyseg-atvalto-kalkulator#ido">Nyisd meg közvetlenül az Idő átváltást.</a>
</section>
<!-- KB_PHASE2:converter-retired:END -->`;

const noticeFor = (slug) => slug === "ido-atvalto-kalkulator" ? timeNotice : genericNotice;

const reliabilityNote = `<p class="reliability-note">
      <strong>Megbízhatósági megjegyzés:</strong>
      Az átváltó rögzített, dokumentált egységkapcsolatokkal számol. A kijelzett pontosság
      nem növeli a bemeneti mérés pontosságát; műszaki felhasználásnál az eredeti
      specifikációt, tűrést és gyártói adatlapot is ellenőrizd.
    </p>`;

const timeIntentBlock = `<!-- KB_PHASE2:time-intent:START -->
<section id="ido" class="converter-intent-block" data-converter-intent="time">
  <h2>Idő átváltás: óra, perc, másodperc és nap kalkulátor</h2>
  <p>
    Az <strong>Idő</strong> kategóriában másodpercet, percet, órát, napot és hetet válthatsz át,
    valamint átlagos hónap- és évhosszal is számolhatsz. Az átváltó például megmutatja,
    hogy 90 perc hány óra, 120 óra hány nap, vagy 1 nap hány perc és másodperc.
  </p>
  <ul>
    <li>1 perc = 60 másodperc</li>
    <li>1 óra = 60 perc = 3600 másodperc</li>
    <li>1 nap = 24 óra = 1440 perc = 86 400 másodperc</li>
    <li>1 hét = 7 nap = 168 óra</li>
  </ul>

  <h3>Gyakori perc → óra átváltások</h3>
  <table>
    <thead><tr><th>Perc</th><th>Óra</th></tr></thead>
    <tbody>
      <tr><td>30 perc</td><td>0,5 óra</td></tr>
      <tr><td>60 perc</td><td>1 óra</td></tr>
      <tr><td>90 perc</td><td>1,5 óra</td></tr>
      <tr><td>120 perc</td><td>2 óra</td></tr>
      <tr><td>150 perc</td><td>2,5 óra</td></tr>
      <tr><td>180 perc</td><td>3 óra</td></tr>
      <tr><td>240 perc</td><td>4 óra</td></tr>
      <tr><td>300 perc</td><td>5 óra</td></tr>
    </tbody>
  </table>

  <h3>Gyakori óra → nap átváltások</h3>
  <table>
    <thead><tr><th>Óra</th><th>Nap</th></tr></thead>
    <tbody>
      <tr><td>24 óra</td><td>1 nap</td></tr>
      <tr><td>48 óra</td><td>2 nap</td></tr>
      <tr><td>72 óra</td><td>3 nap</td></tr>
      <tr><td>120 óra</td><td>5 nap</td></tr>
      <tr><td>168 óra</td><td>7 nap</td></tr>
      <tr><td>240 óra</td><td>10 nap</td></tr>
    </tbody>
  </table>

  <p>
    A hónap és az év nem állandó hosszúságú naptári egység. Az átváltó ezért ezeknél
    <strong>átlagos hónappal (30,436875 nap)</strong> és <strong>átlagos évvel (365,2425 nap)</strong>
    számol. Konkrét dátumok, határidők vagy naptári hónapok közötti különbséghez dátum- vagy
    munkanap-kalkulátort használj.
  </p>
</section>
<!-- KB_PHASE2:time-intent:END -->`;

const timeFaqBlock = `<!-- KB_PHASE2:time-faq:START -->
      <details>
        <summary>1 óra hány perc és másodperc?</summary>
        <p>1 óra pontosan 60 perc, vagyis 3600 másodperc.</p>
      </details>
      <details>
        <summary>90 perc hány óra?</summary>
        <p>90 perc = 1,5 óra, vagyis 1 óra 30 perc.</p>
      </details>
      <details>
        <summary>120 óra hány nap?</summary>
        <p>120 óra = 5 nap.</p>
      </details>
      <details>
        <summary>1 nap hány perc és másodperc?</summary>
        <p>1 nap = 1440 perc = 86 400 másodperc.</p>
      </details>
      <details>
        <summary>Átváltható a hónap és az év órára vagy napra?</summary>
        <p>Becsült időtartamként igen: az átváltó átlagos hónappal (30,436875 nap) és átlagos évvel (365,2425 nap) számol. Konkrét naptári dátumhoz külön dátumszámítás szükséges.</p>
      </details>
<!-- KB_PHASE2:time-faq:END -->`;

const hubFaq = {
  "@type": "FAQPage",
  "@id": `${canonical}#gyik`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Miért jobb egy közös átváltó, mint sok külön oldal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ugyanazt a feladatot egy felületen végzi el, kevesebb ismétlődő tartalommal és gyorsabb kategóriaváltással.",
      },
    },
    {
      "@type": "Question",
      name: "Az MB és a MiB ugyanaz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nem. Az MB decimális, 1 MB = 1 000 000 byte. Az MiB bináris, 1 MiB = 1 048 576 byte.",
      },
    },
    {
      "@type": "Question",
      name: "Miért nem egyszerű szorzás a hőmérséklet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mert a Celsius, Fahrenheit és Kelvin skálák nullpontja eltér, ezért eltolást is alkalmazni kell.",
      },
    },
    {
      "@type": "Question",
      name: "1 óra hány perc és másodperc?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 óra pontosan 60 perc, vagyis 3600 másodperc.",
      },
    },
    {
      "@type": "Question",
      name: "90 perc hány óra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "90 perc = 1,5 óra, vagyis 1 óra 30 perc.",
      },
    },
    {
      "@type": "Question",
      name: "120 óra hány nap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "120 óra = 5 nap.",
      },
    },
    {
      "@type": "Question",
      name: "1 nap hány perc és másodperc?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 nap = 1440 perc = 86 400 másodperc.",
      },
    },
    {
      "@type": "Question",
      name: "Átváltható a hónap és az év órára vagy napra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Becsült időtartamként igen: az átváltó átlagos hónappal (30,436875 nap) és átlagos évvel (365,2425 nap) számol. Konkrét naptári dátumhoz külön dátumszámítás szükséges.",
      },
    },
  ],
};

const retiredHubSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "Mértékegység átváltó – 11 kategória egy helyen",
      description: "Mértékegység átváltó 11 kategóriával egy helyen.",
      inLanguage: "hu-HU",
      isPartOf: { "@id": "https://kalkulatorbazis.hu/#website" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${canonical}#calculator`,
      name: "Mértékegység átváltó",
      applicationCategory: "CalculatorApplication",
      operatingSystem: "Web",
      url: canonical,
      description: "11 mértékegység-kategória átváltása egy közös eszközben.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "HUF" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Főoldal", item: "https://kalkulatorbazis.hu/" },
        { "@type": "ListItem", position: 2, name: "Átváltók", item: "https://kalkulatorbazis.hu/atvaltok" },
        { "@type": "ListItem", position: 3, name: "Mértékegység átváltó", item: canonical },
      ],
    },
  ],
};

function setRetiredHubStructuredData(html) {
  const blockPattern = /<!--\s*KB_STATIC:structured-data:START\s*-->[\s\S]*?<!--\s*KB_STATIC:structured-data:END\s*-->/i;
  const targetBlock = `<!-- KB_STATIC:structured-data:START -->
<script id="kb-structured-data" type="application/ld+json">${JSON.stringify(retiredHubSchema)}</script>
<!-- KB_STATIC:structured-data:END -->`;

  if (!blockPattern.test(html)) {
    throw new Error("Hiányzó strukturáltadat-konténer a kivezetett átváltó oldalon.");
  }
  return html.replace(blockPattern, targetBlock);
}

function ensureHubFaqSchema(html) {
  const scriptPattern = /<script\b([^>]*)\bid=(["'])kb-structured-data\2([^>]*)>([\s\S]*?)<\/script>/i;
  const match = html.match(scriptPattern);
  if (!match) throw new Error("Hiányzó #kb-structured-data blokk az új mértékegység-központban.");

  let data;
  try {
    data = JSON.parse(match[4]);
  } catch (error) {
    throw new Error(`Hibás JSON-LD az új mértékegység-központban: ${error.message}`);
  }

  if (!Array.isArray(data["@graph"])) {
    throw new Error("Az új mértékegység-központ JSON-LD blokkjából hiányzik az @graph tömb.");
  }

  const graph = data["@graph"].filter((node) => {
    const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
    return !types.includes("FAQPage");
  });
  graph.push(hubFaq);
  data["@graph"] = graph;

  const replacement = `<script${match[1]}id="kb-structured-data"${match[3]}>${JSON.stringify(data)}</script>`;
  return html.replace(scriptPattern, replacement);
}

function ensureTimeIntentBlock(html) {
  const blockPattern = /<!--\s*KB_PHASE2:time-intent:START\s*-->[\s\S]*?<!--\s*KB_PHASE2:time-intent:END\s*-->/i;
  if (blockPattern.test(html)) return html.replace(blockPattern, timeIntentBlock);

  const insertionPoint = /<h2>Pontosság és kerekítés<\/h2>/i;
  if (!insertionPoint.test(html)) {
    throw new Error("Hiányzó 'Pontosság és kerekítés' szakasz az új mértékegység-központban.");
  }
  return html.replace(insertionPoint, `${timeIntentBlock}\n\n    <h2>Pontosság és kerekítés</h2>`);
}

function ensureTimeFaqEntries(html) {
  const markerPattern = /<!--\s*KB_PHASE2:time-faq:START\s*-->[\s\S]*?<!--\s*KB_PHASE2:time-faq:END\s*-->/gi;
  html = html.replace(markerPattern, "");

  const gyikIndex = html.search(/<h2>GYIK<\/h2>/i);
  if (gyikIndex < 0) throw new Error("Hiányzó GYIK szakasz az új mértékegység-központban.");

  const beforeGyik = html.slice(0, gyikIndex);
  const gyikTail = html.slice(gyikIndex);
  const listPattern = /(<div\b[^>]*\bclass\s*=\s*(["'])[^"']*\bfaq-list\b[^"']*\2[^>]*>)([\s\S]*?)(<\/div>)/i;
  const match = gyikTail.match(listPattern);
  if (!match) throw new Error("Hiányzó fő .faq-list az új mértékegység-központ GYIK szakaszában.");

  const body = match[3].trimEnd();
  const replacement = `${match[1]}${body}\n${timeFaqBlock}\n    ${match[4]}`;
  return beforeGyik + gyikTail.replace(listPattern, replacement);
}

function ensureTimeCategoryCopy(html) {
  return html.replace(
    /<tr><td>Idő<\/td><td>ms, s, perc, óra, nap, hét(?:, átlagos hónap és átlagos év)?<\/td><\/tr>/i,
    "<tr><td>Idő</td><td>ms, s, perc, óra, nap, hét, átlagos hónap és átlagos év</td></tr>"
  );
}

const transform = (html, slug) => {
  if (/<meta\s+name=["']robots["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']robots["'][^>]*>/i,
      '<meta name="robots" content="noindex,follow" />'
    );
  } else {
    html = html.replace(
      /(<meta[^>]+name=["']viewport["'][^>]*>)/i,
      '$1\n<meta name="robots" content="noindex,follow" />'
    );
  }

  html = html.replace(
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${canonical}" />`
  );

  const notice = noticeFor(slug);
  const noticePattern = /<!--\s*KB_PHASE2:converter-retired:START\s*-->[\s\S]*?<!--\s*KB_PHASE2:converter-retired:END\s*-->/i;
  if (noticePattern.test(html)) {
    html = html.replace(noticePattern, notice);
  } else {
    const hero = html.match(/<section\s+class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
    if (!hero) throw new Error("Hiányzó hero blokk a kivezetett átváltó oldalon.");
    html = html.replace(hero[0], `${hero[0]}\n${notice}`);
  }

  // A buildlánc WebPage node-ot vár a #kb-structured-data blokkban. A
  // kivezetett/noindex oldal ezért a célközpont minimális sémavázát tartja
  // meg; a régi kalkulátor- és GYIK-entitások nem maradnak benne.
  html = setRetiredHubStructuredData(html);

  return html;
};

const transformHub = (html) => {
  const notes = html.match(/class=["'][^"']*\breliability-note\b/gi) || [];
  if (notes.length > 1) {
    throw new Error(`Az új mértékegység-központban ${notes.length} reliability-note található; pontosan 1 szükséges.`);
  }

  if (notes.length === 0) {
    const calculationNote = html.match(
      /<p\s+class=["'][^"']*\bcalculation-note\b[^"']*["'][^>]*>[\s\S]*?<\/p>/i
    );
    if (!calculationNote) {
      throw new Error("Hiányzó calculation-note blokk az új mértékegység-központban.");
    }
    html = html.replace(calculationNote[0], `${calculationNote[0]}\n\n    ${reliabilityNote}`);
  }

  html = ensureTimeCategoryCopy(html);
  html = ensureTimeIntentBlock(html);
  html = ensureTimeFaqEntries(html);
  return ensureHubFaqSchema(html);
};

let changed = 0;
for (const slug of slugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before, slug);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

const hubFile = path.join(root, "kalkulatorok", "mertekegyseg-atvalto-kalkulator.html");
const hubBefore = fs.readFileSync(hubFile, "utf8");
const hubAfter = transformHub(hubBefore);
const hubChanged = hubAfter !== hubBefore;
if (hubChanged) fs.writeFileSync(hubFile, hubAfter, "utf8");

console.log(
  `Phase 2 converter retirement: ${changed}/${slugs.length} oldal frissítve; központ trust/schema: ${hubChanged ? "frissítve" : "rendben"}.`
);
