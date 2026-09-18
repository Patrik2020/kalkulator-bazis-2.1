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
const notice = `<!-- KB_PHASE2:converter-retired:START -->
<section class="info-box phase2-retired-converter">
  <strong>Ez az önálló átváltó kivezetés alatt van.</strong>
  A mértékegység-átváltásokat egy közös, 11 kategóriás eszközbe vontuk össze.
  <a href="mertekegyseg-atvalto-kalkulator">Nyisd meg a Mértékegység átváltó központot.</a>
</section>
<!-- KB_PHASE2:converter-retired:END -->`;

const reliabilityNote = `<p class="reliability-note">
      <strong>Megbízhatósági megjegyzés:</strong>
      Az átváltó rögzített, dokumentált egységkapcsolatokkal számol. A kijelzett pontosság
      nem növeli a bemeneti mérés pontosságát; műszaki felhasználásnál az eredeti
      specifikációt, tűrést és gyártói adatlapot is ellenőrizd.
    </p>`;

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
  ],
};

function neutralizeRetiredStructuredData(html) {
  const blockPattern = /<!--\s*KB_STATIC:structured-data:START\s*-->[\s\S]*?<!--\s*KB_STATIC:structured-data:END\s*-->/i;
  const neutralBlock = `<!-- KB_STATIC:structured-data:START -->
<script id="kb-structured-data" type="application/ld+json">{"@context":"https://schema.org","@graph":[]}</script>
<!-- KB_STATIC:structured-data:END -->`;

  if (!blockPattern.test(html)) {
    throw new Error("Hiányzó strukturáltadat-konténer a kivezetett átváltó oldalon.");
  }
  return html.replace(blockPattern, neutralBlock);
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

const transform = (html) => {
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

  if (!html.includes("KB_PHASE2:converter-retired:START")) {
    const hero = html.match(/<section\s+class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
    if (!hero) throw new Error("Hiányzó hero blokk a kivezetett átváltó oldalon.");
    html = html.replace(hero[0], `${hero[0]}\n${notice}`);
  }

  // A buildlánc a #kb-structured-data konténert szerkezeti bemenetként
  // használja, ezért a blokkot megtartjuk. A kivezetett/noindex oldalon
  // viszont az @graph üres: nem marad régi WebPage, SoftwareApplication,
  // BreadcrumbList vagy FAQPage publikus entitás.
  html = neutralizeRetiredStructuredData(html);

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

  return ensureHubFaqSchema(html);
};

let changed = 0;
for (const slug of slugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
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