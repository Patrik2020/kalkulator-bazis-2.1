const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const hubPath = "kalkulatorok/atlag-kalkulator.html";
const hubCanonical = "https://kalkulatorbazis.hu/kalkulatorok/atlag-kalkulator";
const retired = [
  { page: "kalkulatorok/sulyozott-atlag-kalkulator.html", registry: "js/expansion-batch-03-data.js" },
  { page: "kalkulatorok/mertani-atlag-kalkulator.html", registry: "js/expansion-batch-02-data.js" },
];

const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content, "utf8");

const title = "Átlag kalkulátor – számtani, súlyozott és mértani átlag";
const description = "Számtani, súlyozott és mértani átlag egy helyen. Számolj számlistából, súlyokkal vagy pozitív növekedési tényezőkkel, mediánnal és ellenőrző adatokkal.";
const faq = [
  ["Mikor használjak számtani átlagot?", "Akkor, ha az értékek azonos jelentőségűek és összeadható mennyiséget átlagolsz, például jegyeket, méréseket vagy havi kiadásokat."],
  ["Mikor kell súlyozott átlag?", "Akkor, ha egyes értékek nagyobb jelentőségűek. Ilyen lehet eltérő kreditszám, különböző mennyiség vagy eltérő fontosság."],
  ["Mikor jobb a mértani átlag?", "Egymásra épülő szorzók, hozamtényezők és növekedési arányok összevetésénél, ahol a hatások szorzódnak."],
  ["Miért mutat mediánt is a számtani mód?", "A medián kevésbé érzékeny a szélsőséges értékekre, ezért gyors ellenőrzést ad arra, hogy az egyszerű átlag mennyire reprezentatív."],
];

const hubSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${hubCanonical}#webpage`, url: hubCanonical, name: title, description, inLanguage: "hu-HU", isPartOf: { "@id": "https://kalkulatorbazis.hu/#website" } },
    { "@type": "SoftwareApplication", "@id": `${hubCanonical}#calculator`, name: "Átlag kalkulátor központ", applicationCategory: "CalculatorApplication", operatingSystem: "Web", url: hubCanonical, description: "Számtani, súlyozott és mértani átlag számítása egy közös eszközben.", offers: { "@type": "Offer", price: "0", priceCurrency: "HUF" }, isPartOf: { "@id": "https://kalkulatorbazis.hu/#website" }, about: "Mindennapi kalkulátorok" },
    { "@type": "BreadcrumbList", "@id": `${hubCanonical}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Főoldal", item: "https://kalkulatorbazis.hu/" },
      { "@type": "ListItem", position: 2, name: "Mindennapok", item: "https://kalkulatorbazis.hu/mindennapi" },
      { "@type": "ListItem", position: 3, name: "Átlag kalkulátor", item: hubCanonical },
    ] },
    { "@type": "FAQPage", "@id": `${hubCanonical}#gyik`, mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
  ],
});

const retiredSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${hubCanonical}#webpage`, url: hubCanonical, name: title, description, inLanguage: "hu-HU", isPartOf: { "@id": "https://kalkulatorbazis.hu/#website" } },
    { "@type": "SoftwareApplication", "@id": `${hubCanonical}#calculator`, name: "Átlag kalkulátor központ", applicationCategory: "CalculatorApplication", operatingSystem: "Web", url: hubCanonical, description: "Számtani, súlyozott és mértani átlag számítása egy közös eszközben.", offers: { "@type": "Offer", price: "0", priceCurrency: "HUF" } },
    { "@type": "BreadcrumbList", "@id": `${hubCanonical}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Főoldal", item: "https://kalkulatorbazis.hu/" },
      { "@type": "ListItem", position: 2, name: "Mindennapok", item: "https://kalkulatorbazis.hu/mindennapi" },
      { "@type": "ListItem", position: 3, name: "Átlag kalkulátor", item: hubCanonical },
    ] },
  ],
});

const hubMain = `<main id="main-content" class="container page-simple-calculator" data-average-hub="true" data-simple-calc="atlag-kalkulator">
<nav class="breadcrumb" aria-label="Morzsamenü"><ol><li><a href="../">Főoldal</a></li><li><a href="../mindennapi">Mindennapok</a></li><li><span aria-current="page">Átlag kalkulátor</span></li></ol></nav>
<section class="hero"><p class="eyebrow">Három átlagfajta, egy helyen</p><h1>Átlag kalkulátor – számtani, súlyozott és mértani átlag</h1><p>Válaszd ki, milyen átlagot szeretnél számolni. Az eszköz az egyszerű számlistát, az eltérő súlyokat és a pozitív növekedési tényezőket külön kezeli.</p></section>
<section class="card card-calculator kb-calculator-shell" id="kalkulator">
  <div class="everyday-heading"><h2>Átlagszámítás</h2><p>A számokat pontosvesszővel, szóközzel vagy sortöréssel válaszd el. Tizedesvessző használható.</p></div>
  <div class="everyday-grid">
    <label class="everyday-field" for="averageMode"><span>Számítási mód</span><select id="averageMode"><option value="simple">Számtani átlag + medián</option><option value="weighted">Súlyozott átlag</option><option value="geometric">Mértani átlag</option></select></label>
    <div data-average-panel="simple"><label class="everyday-field" for="averageValues"><span>Értékek</span><textarea id="averageValues" rows="6">12; 15; 18; 21</textarea><small>Azonos jelentőségű értékekhez. Az eredmény mellett mediánt, összeget és elemszámot is mutatunk.</small></label></div>
    <div data-average-panel="weighted" hidden><label class="everyday-field" for="weightedValuesHub"><span>Értékek</span><textarea id="weightedValuesHub" rows="4">80; 95; 70</textarea></label><label class="everyday-field" for="weightedWeightsHub"><span>Súlyok</span><textarea id="weightedWeightsHub" rows="4">2; 3; 1</textarea><small>Minden értékhez ugyanazon a pozíción egy nem negatív súly tartozzon.</small></label></div>
    <div data-average-panel="geometric" hidden><label class="everyday-field" for="geometricValuesHub"><span>Pozitív értékek vagy növekedési tényezők</span><textarea id="geometricValuesHub" rows="5">1,05; 0,98; 1,12</textarea><small>A mértani átlaghoz minden értéknek pozitívnak kell lennie. +5% például 1,05, −3% pedig 0,97.</small></label></div>
  </div>
  <div class="everyday-result result-box" id="averageHubResult" role="status" aria-live="polite" aria-atomic="true"></div>
  <p class="reliability-note"><strong>Megbízhatósági megjegyzés:</strong> az átlag típusa legalább olyan fontos, mint maga a képlet. Az eszköz külön választja a számtani, súlyozott és mértani esetet, de nem dönti el helyetted, hogy a konkrét adathalmazhoz melyik statisztikai mutató a megfelelő.</p>
</section>
<section class="adsense-content calculator-guide">
  <h2>Három különböző átlag, három különböző kérdés</h2>
  <p><strong>Számtani átlag:</strong> add össze az értékeket, majd oszd el az elemszámmal. Jó alapmutató, ha minden adat azonos jelentőségű.</p>
  <p><strong>Súlyozott átlag:</strong> minden értéket megszorzunk a hozzá tartozó súllyal, majd a súlyozott összeget elosztjuk a súlyok összegével. Akkor kell, ha nem minden megfigyelés számít ugyanannyit.</p>
  <p><strong>Mértani átlag:</strong> pozitív értékek szorzatának n-edik gyöke. Különösen egymásra épülő növekedési tényezők, arányok és hozamszorzók esetén hasznos.</p>
  <h2>Mikor félrevezető az egyszerű átlag?</h2><p>Ha az adatok eltérő súlyúak, a számtani átlag túl- vagy alulértékelheti a fontosabb elemek hatását. Egymást követő százalékos változásoknál pedig a hatások nem összeadódnak, hanem összeszorzódnak, ezért ott a mértani szemlélet lehet megfelelőbb.</p><p>A számtani módban ezért a mediánt is megmutatjuk. Ha az átlag és a medián nagyon eltér, érdemes megnézni, nincs-e néhány szélsőséges adat, amely elhúzza az átlagot.</p>
  <h2>Példák</h2><ul><li><strong>Számtani:</strong> 10, 20 és 30 átlaga 20.</li><li><strong>Súlyozott:</strong> egy kétszeres súlyú eredmény kétszer akkora hatással vesz részt a végeredményben.</li><li><strong>Mértani:</strong> +5%, −2% és +12% növekedési tényezői 1,05; 0,98; 1,12 formában adhatók meg.</li></ul>
  <h2>Korlátok</h2><p>Az átlag önmagában nem mutatja meg az adatok szóródását, eloszlását vagy ok-okozati kapcsolatát. Statisztikai, pénzügyi vagy tudományos döntésnél az átlagot mindig az adatok jelentésével és további mutatókkal együtt értelmezd.</p>
  <h2>Gyakori kérdések</h2><div class="faq-list" data-accordion="single">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
</section>
</main>`;

function replaceMetaName(html, name, value) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\bname=["']${name}["'])[^>]*>`, "i");
  const tag = `<meta name="${name}" content="${value}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `${tag}\n</head>`);
}
function replaceMetaProperty(html, property, value) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\bproperty=["']${property}["'])[^>]*>`, "i");
  const tag = `<meta property="${property}" content="${value}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `${tag}\n</head>`);
}
function replaceCanonical(html, value) {
  const pattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i;
  const tag = `<link rel="canonical" href="${value}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `${tag}\n</head>`);
}
function replaceSchema(html, json) {
  const marked = /<!-- KB_STATIC:structured-data:START -->[\s\S]*?<!-- KB_STATIC:structured-data:END -->/i;
  const loose = /<script\b(?=[^>]*\bid=["']kb-structured-data["'])[^>]*>[\s\S]*?<\/script>/i;
  const block = `<!-- KB_STATIC:structured-data:START -->\n<script id="kb-structured-data" type="application/ld+json">${json}</script>\n<!-- KB_STATIC:structured-data:END -->`;
  if (marked.test(html)) return html.replace(marked, block);
  if (loose.test(html)) return html.replace(loose, block);
  return html.replace(/<\/head>/i, `${block}\n</head>`);
}

function transformHub(html) {
  html = replaceMetaName(html, "description", description);
  html = replaceCanonical(html, hubCanonical);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceMetaProperty(html, "og:title", title);
  html = replaceMetaProperty(html, "og:description", description);
  html = replaceMetaProperty(html, "og:url", hubCanonical);
  html = replaceMetaName(html, "twitter:title", title);
  html = replaceMetaName(html, "twitter:description", description);
  html = replaceSchema(html, hubSchema);
  html = html.replace(/<main\b[\s\S]*?<\/main>/i, hubMain);
  html = html.replace(/<script\b[^>]*src=["'][^"']*simple-calculators\.js[^"']*["'][^>]*><\/script>/i, `<script defer src="../js/atlag-kozpont.js"></script>`);
  if (!html.includes("../js/atlag-kozpont.js")) html = html.replace(/<\/body>/i, `<script defer src="../js/atlag-kozpont.js"></script>\n</body>`);
  return html;
}

const retirementNotice = `<!-- KB_PHASE2:retired:START -->\n<section class="info-box phase2-retired-calculator"><strong>Ez az önálló átlagoldal kivezetés alatt van.</strong> A számtani, súlyozott és mértani átlagot egy közös Átlag kalkulátorba vontuk össze. <a href="atlag-kalkulator">Nyisd meg az Átlag kalkulátor központot.</a></section>\n<!-- KB_PHASE2:retired:END -->`;
function transformRetired(html) {
  html = replaceMetaName(html, "robots", "noindex,follow");
  html = replaceCanonical(html, hubCanonical);
  html = replaceSchema(html, retiredSchema);
  if (!html.includes("KB_PHASE2:retired:START")) {
    const hero = html.match(/<section\b[^>]*class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
    if (!hero) throw new Error("Hiányzó hero blokk a kivezetett átlagoldalon.");
    html = html.replace(hero[0], `${hero[0]}\n${retirementNotice}`);
  }
  return html;
}

write(hubPath, transformHub(read(hubPath)));
for (const item of retired) write(item.page, transformRetired(read(item.page)));

function markHidden(registryPath, page) {
  let source = read(registryPath);
  const marker = `"url": "${page}",`;
  const index = source.indexOf(marker);
  if (index < 0) throw new Error(`Hiányzó registry-bejegyzés: ${page} (${registryPath})`);
  const blockStart = source.lastIndexOf("  {", index);
  const blockEnd = source.indexOf("\n  },", index);
  if (blockStart < 0 || blockEnd < 0) throw new Error(`Nem olvasható registry-blokk: ${page}`);
  const block = source.slice(blockStart, blockEnd);
  if (!/"hidden"\s*:\s*true/.test(block)) {
    source = source.slice(0, index + marker.length) + `\n    "hidden": true,` + source.slice(index + marker.length);
    write(registryPath, source);
  }
}
for (const item of retired) markHidden(item.registry, item.page);

let siteData = read("js/site-data.js");
const hubMarker = `url: "${hubPath}"`;
const hubIndex = siteData.indexOf(hubMarker);
if (hubIndex < 0) throw new Error("Hiányzik az Átlag kalkulátor core registry-bejegyzése.");
const hubStart = siteData.lastIndexOf("\n    {", hubIndex);
const hubEnd = siteData.indexOf("\n    },", hubIndex);
let hubBlock = siteData.slice(hubStart, hubEnd);
hubBlock = hubBlock
  .replace(/title:\s*"[^"]+"/, 'title: "Átlag kalkulátor"')
  .replace(/description:\s*"[^"]+"/, 'description: "Számtani, súlyozott és mértani átlag egy közös eszközben, mediánnal és ellenőrző adatokkal."')
  .replace(/keywords:\s*"[^"]+"/, 'keywords: "átlag számtani súlyozott mértani medián jegyátlag növekedési tényező"');
siteData = siteData.slice(0, hubStart) + hubBlock + siteData.slice(hubEnd);
write("js/site-data.js", siteData);

const retiredSlugs = retired.map((item) => item.page.replace(/\.html$/, ""));
function addRuntimeExclusions(relative) {
  let source = read(relative);
  const anchor = "const adsenseExcludedExact = new Set([";
  const index = source.indexOf(anchor);
  if (index < 0) throw new Error(`Hiányzó AdSense exclude lista: ${relative}`);
  const insertAt = index + anchor.length;
  const missing = retiredSlugs.filter((slug) => !source.includes(`"${slug}"`));
  if (missing.length) {
    const lines = missing.map((slug) => `\n    "${slug}",`).join("");
    source = source.slice(0, insertAt) + lines + source.slice(insertAt);
    write(relative, source);
  }
}
addRuntimeExclusions("js/cookie.js");
addRuntimeExclusions("scripts/apply-adsense-eligibility-v2.js");

let adsenseAudit = read("scripts/adsense-quality-v2-audit.js");
for (const item of retired) {
  if (adsenseAudit.includes(`"${item.page}"`)) continue;
  const anchor = '  "kalkulatorok/teljesitmeny-atvalto-kalkulator.html"';
  if (!adsenseAudit.includes(anchor)) throw new Error("Hiányzó Phase 2 retired audit anchor.");
  adsenseAudit = adsenseAudit.replace(anchor, `${anchor},\n  "${item.page}"`);
}
write("scripts/adsense-quality-v2-audit.js", adsenseAudit);

let redirects = read("_redirects").trimEnd();
for (const item of retired) {
  const route = item.page.replace(/\.html$/, "");
  const extensionless = `/${route} /kalkulatorok/atlag-kalkulator 301`;
  const htmlRule = `/${item.page} /kalkulatorok/atlag-kalkulator 301`;
  if (!redirects.includes(extensionless)) redirects += `\n${extensionless}`;
  if (!redirects.includes(htmlRule)) redirects += `\n${htmlRule}`;
}
write("_redirects", `${redirects}\n`);

console.log("AdSense Phase 2 Batch 2: average-calculator consolidation applied.");
