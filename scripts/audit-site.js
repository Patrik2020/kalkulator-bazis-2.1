const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "docs", "projekt-audit.md");
const adsenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812";

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return [absolute];
  });

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
const allFiles = walk(root).filter(
  (file) => !relative(file).startsWith(".git/") && !relative(file).startsWith("docs/")
);
const htmlFiles = allFiles.filter((file) => {
  const name = relative(file);
  return (
    name.endsWith(".html") &&
    !name.startsWith("components/")
  );
});

const stripHtml = (value) =>
  value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const normalize = (value) =>
  stripHtml(value)
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matches = (text, regex) => [...text.matchAll(regex)];
const first = (text, regex) => text.match(regex)?.[1]?.trim() || "";
const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? match[1] : null;
};

const records = htmlFiles.map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const head = first(html, /<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const body = first(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const substantiveBody = body.replace(
    /<a\b(?=[^>]*\bclass=["'][^"']*(?:calculator-card|card-link)[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );
  const headings = matches(html, /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi).map((match) => ({
    level: Number(match[1]),
    text: stripHtml(match[2]),
  }));
  const paragraphs = matches(substantiveBody, /<p\b[^>]*>([\s\S]*?)<\/p>/gi)
    .map((match) => stripHtml(match[1]))
    .filter((value) => value.length >= 70);
  const ids = matches(html, /\bid\s*=\s*["']([^"']+)["']/gi).map((match) => match[1]);
  const imageTags = matches(html, /<img\b[^>]*>/gi).map((match) => match[0]);
  const links = matches(html, /<a\b[^>]*>/gi).map((match) => match[0]);
  const scripts = matches(html, /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi).map(
    (match) => ({ src: match[1], tag: match[0], inHead: head.includes(match[0]) })
  );

  return {
    file,
    name: relative(file),
    html,
    head,
    body,
    title: stripHtml(first(head, /<title\b[^>]*>([\s\S]*?)<\/title>/i)),
    description: first(
      head,
      /<meta\b(?=[^>]*\bname\s*=\s*["']description["'])(?=[^>]*\bcontent\s*=\s*["']([^"']*)["'])[^>]*>/i
    ),
    canonical: first(
      head,
      /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])(?=[^>]*\bhref\s*=\s*["']([^"']*)["'])[^>]*>/i
    ),
    ogTitle: first(
      head,
      /<meta\b(?=[^>]*\bproperty\s*=\s*["']og:title["'])(?=[^>]*\bcontent\s*=\s*["']([^"']*)["'])[^>]*>/i
    ),
    ogDescription: first(
      head,
      /<meta\b(?=[^>]*\bproperty\s*=\s*["']og:description["'])(?=[^>]*\bcontent\s*=\s*["']([^"']*)["'])[^>]*>/i
    ),
    lang: first(html, /<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i),
    headings,
    paragraphs,
    ids,
    imageTags,
    links,
    scripts,
  };
});

const duplicateValues = (items, valueSelector) => {
  const groups = new Map();
  items.forEach((item) => {
    const value = normalize(valueSelector(item));
    if (!value) return;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(item);
  });
  return new Map([...groups].filter(([, group]) => group.length > 1));
};

const duplicateTitles = duplicateValues(records, (record) => record.title);
const duplicateDescriptions = duplicateValues(records, (record) => record.description);
const paragraphRows = records.flatMap((record) =>
  record.paragraphs.map((paragraph) => ({ record, paragraph }))
);
const duplicateParagraphs = duplicateValues(paragraphRows, (row) => row.paragraph);

const duplicateParagraphsByFile = new Map();
for (const rows of duplicateParagraphs.values()) {
  const uniqueFiles = [...new Set(rows.map((row) => row.record.name))];
  if (uniqueFiles.length < 2) continue;
  rows.forEach(({ record, paragraph }) => {
    if (!duplicateParagraphsByFile.has(record.name)) duplicateParagraphsByFile.set(record.name, []);
    duplicateParagraphsByFile.get(record.name).push({ paragraph, files: uniqueFiles });
  });
}

const genericPatterns = [
  /A kalkulátor gyors segítséget ad/i,
  /A kalkulátor célja, hogy gyors becslést adjon/i,
  /A kalkulátor egyszerűen használható/i,
  /Add meg a szükséges adatokat/i,
  /Az eredmény azonnal megjelenik/i,
  /Első becslésre jó/i,
  /Ingyenes a kalkulátor használata\?/i,
  /Mobilon is működik\?/i,
  /Mennyire pontos az eredmény\?/i,
];

const issuesFor = (record) => {
  const issues = [];
  const add = (problem, section, recommendation, operation, risk = "Alacsony") =>
    issues.push({ problem, section, recommendation, operation, risk });

  if (record.lang !== "hu") {
    add("A dokumentum nyelve nincs magyarra állítva.", "<html>", "Állítsd a lang attribútumot hu értékre.", "Átírni");
  }
  if (!record.title) add("Hiányzik a title.", "<head>", "Adj egyedi, témaspecifikus címet.", "Hozzáadni");
  if (!record.description) add("Hiányzik a meta description.", "<head>", "Adj egyedi leírást.", "Hozzáadni");
  if (!record.canonical) add("Hiányzik a canonical URL.", "<head>", "Adj önmagára mutató canonical linket.", "Hozzáadni");
  if (!record.ogTitle || !record.ogDescription) {
    add("Hiányos Open Graph metaadatok.", "<head>", "Adj releváns og:title és og:description értékeket.", "Hozzáadni");
  }
  const h1Count = record.headings.filter((heading) => heading.level === 1).length;
  if (h1Count !== 1) {
    add(`A H1-ek száma ${h1Count}, az elvárt 1 helyett.`, "Címsorhierarchia", "Maradjon egyetlen oldalfőcím.", "Összevonni/átírni", "Közepes");
  }
  for (let index = 1; index < record.headings.length; index += 1) {
    if (record.headings[index].level - record.headings[index - 1].level > 1) {
      add("A címsorhierarchia szintet ugrik.", `„${record.headings[index].text}”`, "Igazítsd a címsorszintet a tartalmi hierarchiához.", "Átírni");
      break;
    }
  }

  const duplicateIds = [...new Set(record.ids.filter((id, index) => record.ids.indexOf(id) !== index))];
  if (duplicateIds.length) {
    add(`Duplikált ID: ${duplicateIds.join(", ")}.`, "HTML azonosítók", "Tedd egyedivé az azonosítókat és a kapcsolódó hivatkozásokat.", "Átírni", "Közepes");
  }
  const missingAlts = record.imageTags.filter((tag) => getAttribute(tag, "alt") === null);
  if (missingAlts.length) {
    add(`${missingAlts.length} kép alt attribútum nélkül szerepel.`, "Képek", "Adj értelmes altot, dekoratív képnél üres altot.", "Hozzáadni");
  }
  const emptyLinks = record.links.filter((tag) => {
    const href = getAttribute(tag, "href");
    return href === null || href.trim() === "" || href.trim() === "#";
  });
  if (emptyLinks.length) {
    add(`${emptyLinks.length} üres vagy # célú link található.`, "Belső linkek", "Adj valós cél URL-t vagy használj gombot.", "Átírni");
  }

  const adsenseScripts = record.scripts.filter((script) => script.src === adsenseSrc);
  if (adsenseScripts.length === 0) {
    add("A kért statikus AdSense betöltőkód hiányzik.", "<head>", "Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd.", "Hozzáadni", "Közepes");
  } else if (adsenseScripts.length > 1) {
    add(`Az AdSense betöltőkód ${adsenseScripts.length} alkalommal szerepel.`, "<head>", "Csak egy példány maradjon.", "Összevonni", "Közepes");
  } else if (!adsenseScripts[0].inHead) {
    add("Az AdSense betöltőkód nem a headben van.", "<body>", "Mozgasd a headbe.", "Áthelyezni", "Közepes");
  }

  const scriptGroups = new Map();
  record.scripts.forEach((script) => scriptGroups.set(script.src, (scriptGroups.get(script.src) || 0) + 1));
  const duplicateScripts = [...scriptGroups].filter(([, count]) => count > 1).map(([src]) => src);
  if (duplicateScripts.length) {
    add(`Duplán betöltött script: ${duplicateScripts.join(", ")}.`, "Scriptek", "Csak egy betöltés maradjon.", "Összevonni", "Közepes");
  }

  const genericHits = genericPatterns.filter((pattern) => pattern.test(record.html));
  if (genericHits.length) {
    add(`${genericHits.length} sablonos SEO/GYIK fordulat található.`, "Tartalmi és GYIK blokkok", "Írd át az adott számítás félreértéseire, korlátaira és valós használatára.", "Átírni");
  }
  const repeated = duplicateParagraphsByFile.get(record.name) || [];
  if (repeated.length) {
    const peerFiles = [...new Set(repeated.flatMap((item) => item.files).filter((name) => name !== record.name))];
    add(`${repeated.length} hosszabb bekezdés más oldalon is szó szerint szerepel (${peerFiles.slice(0, 4).join(", ")}${peerFiles.length > 4 ? ", …" : ""}).`, "Tartalmi blokkok", "Tartsd meg a témaspecifikus részt, a közös sablont írd újra.", "Átírni");
  }
  const ownRepeatedParagraphs = duplicateValues(
    record.paragraphs.map((paragraph) => ({ paragraph })),
    (row) => row.paragraph
  );
  if (ownRepeatedParagraphs.size) {
    add("Ugyanazon az oldalon szó szerint ismétlődik hosszabb bekezdés.", "Tartalmi blokkok", "Vond össze az ismétlődő gondolatokat.", "Összevonni");
  }
  if (record.html.includes("data-generated-seo")) {
    add("Generált SEO-blokk maradt az oldalon.", "data-generated-seo szakasz", "Cseréld számításspecifikus, tömör és egyedi tartalomra.", "Átírni");
  }
  if (
    record.name === "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html" &&
    /class=["']logo-mark["'][^>]*>\s*KB\s*</i.test(record.html)
  ) {
    add("Eltérő, szöveges KB fejlécjel látható a végleges logó helyett.", "Fejléc", "Használd a favicon/kb-logo-mark.png fájlt helyes relatív útvonallal.", "Átírni");
  }

  const titleGroup = duplicateTitles.get(normalize(record.title));
  if (titleGroup?.length > 1) {
    add("A title más nyilvános oldallal azonos.", "<head>", "Tedd egyedivé a keresési szándék alapján.", "Átírni");
  }
  const descriptionGroup = duplicateDescriptions.get(normalize(record.description));
  if (descriptionGroup?.length > 1) {
    add("A meta description más nyilvános oldallal azonos.", "<head>", "Tedd egyedivé az oldal feladata alapján.", "Átírni");
  }

  return issues;
};

const issues = new Map(records.map((record) => [record.name, issuesFor(record)]));

const resolveLocalReference = (record, href) => {
  if (!href || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(href)) return null;
  const clean = href.split(/[?#]/)[0];
  if (!clean) return null;
  const target = clean.startsWith("/")
    ? path.join(root, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(record.file), clean);
  return fs.existsSync(target) ? null : relative(target);
};

for (const record of records) {
  const refs = [
    ...record.links.map((tag) => getAttribute(tag, "href")),
    ...record.imageTags.map((tag) => getAttribute(tag, "src")),
    ...matches(record.html, /<(?:link|script)\b[^>]*(?:href|src)\s*=\s*["']([^"']+)["'][^>]*>/gi).map((match) => match[1]),
  ];
  const broken = [...new Set(refs.map((href) => resolveLocalReference(record, href)).filter(Boolean))];
  if (broken.length) {
    issues.get(record.name).push({
      problem: `Nem található helyi hivatkozás: ${broken.join(", ")}.`,
      section: "Relatív útvonalak",
      recommendation: "Javítsd az útvonalat vagy állítsd helyre a célfájlt.",
      operation: "Átírni",
      risk: "Magas",
    });
  }
}

const cssFiles = allFiles.filter((file) => file.endsWith(".css"));
const duplicateCssBlocks = [];
const declarationGroups = new Map();
for (const file of cssFiles) {
  const css = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    const selector = match[1].trim().replace(/\s+/g, " ");
    const declarations = match[2]
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .sort()
      .join(";");
    if (!declarations || selector.startsWith("@")) continue;
    if (!declarationGroups.has(declarations)) declarationGroups.set(declarations, []);
    declarationGroups.get(declarations).push({ file: relative(file), selector });
  }
}
for (const group of declarationGroups.values()) {
  const unique = [...new Map(group.map((item) => [`${item.file}:${item.selector}`, item])).values()];
  if (unique.length > 1) duplicateCssBlocks.push(unique);
}

const largeResources = allFiles
  .map((file) => ({ file: relative(file), bytes: fs.statSync(file).size }))
  .filter((item) => item.bytes > 500 * 1024)
  .sort((a, b) => b.bytes - a.bytes);

const totalIssues = [...issues.values()].reduce((sum, list) => sum + list.length, 0);
const genericPages = records.filter((record) => record.html.includes("data-generated-seo"));
const adsenseMissing = records.filter(
  (record) => !record.scripts.some((script) => script.src === adsenseSrc)
);
const brokenLinkPages = [...issues].filter(([, list]) =>
  list.some((issue) => issue.section === "Relatív útvonalak")
);

const lines = [
  "# Kalkulátor Bázis – projekt-audit",
  "",
  `Készült: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "## Hatókör és módszer",
  "",
  `- ${records.length} nyilvános HTML-oldal, ${cssFiles.length} CSS-fájl és ${allFiles.filter((file) => file.endsWith(".js")).length} JavaScript-fájl statikus vizsgálata.`,
  "- Ellenőrzés: metaadatok, címsorok, linkek, képek, ID-k, scriptbetöltések, AdSense, szó szerinti tartalmi ismétlések, sablonos SEO/GYIK és nagy erőforrások.",
  "- A statikus audit a böngészős működési és vizuális tesztet nem helyettesíti; az a módosítások után külön következik.",
  "",
  "## Vezetői összefoglaló",
  "",
  `- Összes feltárt fájlszintű tétel: **${totalIssues}**.`,
  `- Generált/sablonos SEO-blokkot tartalmazó oldalak: **${genericPages.length}**.`,
  `- A kért statikus AdSense-kódot nélkülöző nyilvános oldalak: **${adsenseMissing.length}**.`,
  `- Hibás helyi hivatkozással érintett oldalak: **${brokenLinkPages.length}**.`,
  `- Egymással megegyező CSS-deklarációs csoportok: **${duplicateCssBlocks.length}**; ezek közül csak komponensazonosság esetén javasolt összevonás.`,
  `- 500 KB-nál nagyobb helyi erőforrások: **${largeResources.length}**.`,
  genericPages.length || adsenseMissing.length
    ? "- Nyitott prioritás: a fennmaradó generikus tartalom és AdSense-eltérések rendezése."
    : "- A korábbi generikus SEO/GYIK és AdSense head-eltérések a jelenlegi állapotban nem mutathatók ki.",
  "",
  "## Fájlonkénti audit",
  "",
];

for (const record of records.sort((a, b) => a.name.localeCompare(b.name, "hu"))) {
  const list = issues.get(record.name);
  lines.push(`### \`${record.name}\``);
  lines.push("");
  if (!list.length) {
    lines.push("- Nem találtunk statikusan azonosítható problémát; működési és vizuális ellenőrzés szükséges.");
    lines.push("");
    continue;
  }
  list.forEach((issue, index) => {
    lines.push(`${index + 1}. **Probléma:** ${issue.problem}`);
    lines.push(`   **Szakasz:** ${issue.section}. **Javaslat:** ${issue.recommendation} **Művelet:** ${issue.operation}. **Kockázat:** ${issue.risk}.`);
  });
  lines.push("");
}

lines.push("## CSS-megfigyelések", "");
if (!duplicateCssBlocks.length) {
  lines.push("- Nem találtunk pontosan azonos deklarációs blokkot.", "");
} else {
  duplicateCssBlocks.slice(0, 40).forEach((group) => {
    lines.push(`- ${group.map((item) => `\`${item.file}\` (${item.selector})`).join("; ")}`);
  });
  if (duplicateCssBlocks.length > 40) lines.push(`- További ${duplicateCssBlocks.length - 40} csoport a gépi auditban található.`);
  lines.push("");
}

lines.push("## Nagy erőforrások", "");
if (!largeResources.length) {
  lines.push("- Nincs 500 KB-nál nagyobb helyi erőforrás.", "");
} else {
  largeResources.forEach((item) => lines.push(`- \`${item.file}\`: ${(item.bytes / 1024).toFixed(1)} KB`));
  lines.push("");
}

lines.push(
  "## Változtatási terv",
  "",
  "1. A generált SEO-blokkokat tartalmi klaszterenként, kalkulátorspecifikus szövegre és eltérő szerkezetre cseréljük; a működő kalkulátorformokat és számítási JavaScriptet érintetlenül hagyjuk.",
  "2. A kiemelt pénzügyi és építőipari oldalakon az egymást átfedő szakmai blokkokat összevonjuk, az ismétlődő GYIK-et eltávolítjuk.",
  "3. A hat kategóriaoldal saját döntési helyzetet, kezdőpontot és válogatási logikát kap.",
  "4. A főoldalt a hero + kereső, gyors kategóriaválasztó, népszerű kalkulátorok, pénzügyi alapozó, bizalmi blokk, rövid bemutatkozás és akadálymentes GYIK sorrendre rendezzük.",
  "5. A pénzügyi tudatosság landing fejlécében a meglévő `favicon/kb-logo-mark.png` logót használjuk.",
  "6. Az AdSense betöltőkódot minden nyilvános HTML headjében pontosan egyszer egységesítjük; a hirdetési blokkok és publisher ID változatlanok maradnak.",
  "7. Javítjuk a bizonyítható HTML-, meta-, link-, focus-, label- és accordion-problémákat; a számítási logikát csak dokumentált hiba esetén érintjük.",
  "8. A módosítások után újrafuttatjuk ezt az auditot, a link- és szintaxisellenőrzést, majd több szélességen böngészős ellenőrzést végzünk.",
  ""
);

if (process.argv.includes("--write")) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Audit written: ${relative(reportPath)}`);
} else {
  console.log(lines.join("\n"));
}
