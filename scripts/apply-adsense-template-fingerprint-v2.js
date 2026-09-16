const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const jsPath = path.join(root, "js", "everyday-upgrades.js");
const reviewedIso = "2026-09-16";
const reviewedHu = "2026. szeptember 16.";

const methods = {
  "atlag-kalkulator": {
    title: "Melyik középértéket mutatja, és mikor melyiket nézd?",
    body: "Egyszerű módban a kalkulátor a számtani átlag mellett mediánt, minimumot és maximumot is számol, így a szélső értékek hatása könnyebben felismerhető. Súlyozott módban minden értékhez külön pozitív súly tartozik; a hibás sorokat kihagyja és külön jelzi."
  },
  "munkaido-kalkulator": {
    title: "Hogyan kezeli a műszakot és az éjfélt?",
    body: "A kezdés és befejezés különbségéből indul ki, az éjfélen átnyúló műszakot automatikusan a következő napra vezeti át, majd levonja a megadott szünetet. A heti és havi érték a megadott munkanapszámból és havi szorzóból készülő becslés; nem munkaügyi nyilvántartás."
  },
  "oraber-kalkulator": {
    title: "Miből áll össze az órabér-becslés?",
    body: "A megadott havi bért a havi alapórák számával osztja, majd a külön megadott túlóra-szorzót, pótlékszázalékot és óraszámokat alkalmazza. A nettó mód a már megadott nettó összegből számol; nem végzi el helyetted az adó- és járulékszámítást, ezért bérszámfejtésre nem használható."
  },
  "egysegar-kalkulator": {
    title: "Hogyan lesz összehasonlítható az eltérő kiszerelés?",
    body: "Legfeljebb öt termék árát és mennyiségét ugyanarra a választott egységre vetíti, majd az így kapott egységár szerint sorba rendezi őket. Az összevetés csak akkor értelmes, ha az egységre vetítés minden terméknél ugyanazt a fizikai mennyiséget jelenti."
  },
  "rezsi-megosztas-kalkulator": {
    title: "Milyen elv alapján osztja szét a közös költséget?",
    body: "Egyenlő megosztásnál minden résztvevő azonos súlyt kap; nap-, alapterület- vagy fogyasztásarányos módban a három megadott érték aránya dönti el a részesedést. A kalkulátor a teljes összeget ezekkel a súlyokkal osztja fel, és ellenőrző összeggel segít kiszúrni az eltérést."
  },
  "ar-kedvezmeny-kalkulator": {
    title: "Miért nem egyszerűen összeadódnak a kedvezmények?",
    body: "Az egymás utáni százalékos kedvezményeket sorrendben, mindig az előzőleg csökkentett árra alkalmazza, ezért például 20% és 10% nem 30%-os végső kedvezményt jelent. Ezután vonja le a fix kupont, majd – ha megadtál ilyet – érvényesíti a teljes kedvezmény felső korlátját."
  },
  "borravalo-kalkulator": {
    title: "Hogyan kezeli külön a szervizdíjat és a borravalót?",
    body: "A szervizdíjat az étel- és italfogyasztás összegére számolja, a további borravalót pedig a szervizdíjjal növelt összeg százalékaként. A végösszeget a három megadott fogyasztási összeg arányában osztja szét, ezért az eltérő fogyasztású vendégek nem automatikusan ugyanannyit fizetnek."
  },
  "eletkor-kalkulator": {
    title: "Mit jelent a pontos életkor ebben a kalkulátorban?",
    body: "A megadott születési dátumtól a választott referencia-dátumig teljes éveket, majd teljes hónapokat és maradék napokat számol. Emellett külön mutatja az eltelt teljes napokat és heteket, valamint a következő születésnap dátumát és a hátralévő napokat; a teljes hónap érték csak közelítés."
  },
  "datum-kulonbseg-kalkulator": {
    title: "Mit számol a két dátum között?",
    body: "A kalkulátor külön mutatja a naptári napkülönbséget, a hétvégi napokat és a munkanapokat, továbbá napokat tud hozzáadni vagy levonni egy dátumból. A munkanapos mód a beépített fix magyar ünnepnapokat kezeli; az évente változó munkanap-áthelyezéseket és minden speciális munkarendet külön ellenőrizni kell."
  }
};

const dataNote = "A beírt értékek a böngésződben kerülnek feldolgozásra; a kalkulátor nem menti el őket saját szerverre.";

const oldFooter = `  const article = document.createElement("section"); article.className = "article everyday-method";\n  article.innerHTML = \`<h2>Mit tud többet ez a változat?</h2><p>A kalkulátor az egyszerű egylépéses számítás helyett több gyakori élethelyzetet kezel, részletes eredményeket ad, és a hibás vagy hiányos beviteleket külön jelzi. Az eredmény tájékoztató tervezési segédlet.</p><h3>Adatkezelés</h3><p>A beírt értékek a böngésződben kerülnek feldolgozásra; a kalkulátor nem menti el őket saját szerverre.</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="2026-07-15">2026. július 15.</time></p>\`;\n  card.insertAdjacentElement("afterend", article);`;

const methodLiteral = JSON.stringify(methods, null, 2).replace(/^/gm, "  ");
const newFooter = `  const methodCopy = ${methodLiteral.trimStart()};\n  const method = methodCopy[slug];\n  const article = document.createElement("section"); article.className = "article everyday-method";\n  article.innerHTML = "<h2>" + method.title + "</h2><p>" + method.body + "</p><h3>Adatkezelés</h3><p>${dataNote}</p><p class=\\"last-reviewed\\">Utolsó módszertani ellenőrzés: <time datetime=\\"${reviewedIso}\\">${reviewedHu}</time></p>";\n  card.insertAdjacentElement("afterend", article);`;

let source = fs.readFileSync(jsPath, "utf8");
if (!source.includes("const methodCopy =")) {
  if (!source.includes(oldFooter)) throw new Error("Az everyday-upgrades.js várt sablonblokkja nem található.");
  source = source.replace(oldFooter, newFooter);
  fs.writeFileSync(jsPath, source, "utf8");
  console.log("Updated js/everyday-upgrades.js with page-specific method copy.");
} else {
  console.log("everyday-upgrades.js already contains page-specific method copy.");
}

for (const [slug, method] of Object.entries(methods)) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó kalkulátoroldal: ${slug}.html`);
  let html = fs.readFileSync(file, "utf8");
  const start = "<!-- KB_STATIC:everyday-method:START -->";
  const end = "<!-- KB_STATIC:everyday-method:END -->";
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  const block = `${start}\n<section data-static-runtime-fallback="everyday-method" class="article everyday-method"><h2>${method.title}</h2><p>${method.body}</p><h3>Adatkezelés</h3><p>${dataNote}</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time></p></section>\n${end}`;
  if (!pattern.test(html)) throw new Error(`Hiányzó everyday-method marker: ${slug}.html`);
  html = html.replace(pattern, block);
  fs.writeFileSync(file, html, "utf8");
}

const mortgagePath = path.join(root, "kalkulatorok", "lakas-hitel-onero-kalkulator.html");
let mortgage = fs.readFileSync(mortgagePath, "utf8");
mortgage = mortgage.replace(
  "Ez a kalkulátor segít gyorsan megbecsülni, hogy egy adott vételár mellett mekkora önerőre és hitelösszegre lehet szükség. A cél nem banki előminősítés, hanem egy reálisabb első kép kialakítása.",
  "A vételár és a választott önerőarány alapján az oldal külön mutatja a szükséges saját forrást és a fennmaradó becsült hitelrészt. Ez nem banki előminősítés: arra jó, hogy még ingatlankeresés vagy hitelajánlat előtt lásd a két összeg nagyságrendjét."
);
fs.writeFileSync(mortgagePath, mortgage, "utf8");

console.log(`Updated ${Object.keys(methods).length} calculator method blocks and the mortgage generic copy.`);
