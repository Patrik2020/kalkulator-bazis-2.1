const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reviewedIso = "2026-09-16";
const reviewedHu = "2026. szeptember 16.";

const autoMethods = {
  "eves-auto-koltseg-kalkulator": {
    title: "Mit tartalmaz az éves autóköltség-becslés?",
    body: "Az éves futásból, fogyasztásból és literárból külön számolja az üzemanyagot, majd hozzáadja a biztosítás, adók és matrica, szerviz, gumi, parkolás és értékvesztés megadott éves összegét. Az értékvesztés gazdasági költség, ezért a havi átlag nem feltétlenül azonos a tényleges havi készpénzkiadással.",
    source: "A saját autódhoz biztosítói, szerviz-, adó-, útdíj- és üzemanyagadataidat használd. Az alapértékek csak szerkeszthető példák; az aktuális költségeket a szolgáltatói és hivatalos díjtáblák alapján ellenőrizd."
  },
  "auto-ertekvesztes-kalkulator": {
    title: "Hogyan modellezi az autó értékvesztését?",
    body: "A modell az első vizsgált évre és a további évekre külön százalékos értékvesztési rátát enged meg, ezért nem feltételezi, hogy minden év azonos. A nominális maradványérték mellett a megadott infláció vagy defláció alapján mai vásárlóértéket is számol.",
    source: "A jövőbeli használtpiaci ár nem előrejelezhető biztosan. A rátákat saját piaci összehasonlításból vagy megbízható értékbecslési adatokból add meg; a kalkulátor a felhasználói feltételezést számolja tovább."
  },
  "kilometerdij-kalkulator": {
    title: "Mit jelent a teljes Ft/km érték?",
    body: "Az éves teljes autóköltséget osztja az éves futással, majd ebből becsüli egy választott út és a fizető utasokra jutó rész költségét. Ez a megközelítés a tankoláson túl a fix, időszakos és gazdasági költségeket is egy közös kilométerértékbe rendezi.",
    source: "Csak azonos időszakból származó éves költséget és futást hasonlíts össze. Céges vagy adózási kilométer-elszámoláshoz ne ezt az eredményt tekintsd hivatalos díjnak; ott az aktuális jogszabály és NAV-szabály az irányadó."
  },
  "co2-kibocsatas-kalkulator": {
    title: "Milyen kibocsátást számol a modell?",
    body: "A belső égésű hajtásnál külön kezeli a közvetlen kipufogó- és az energiaellátási tényezőt, elektromos hajtásnál pedig a fogyasztást, töltési többletet és a megadott árammixot. Plug-in hibridnél a folyékony üzemanyag és az elektromos rész külön ágon fut össze.",
    source: "A kibocsátási faktorokat az adott üzemanyaghoz és árammixhoz illő, aktuális hivatalos vagy szakmai forrásból add meg. A jármű- és akkumulátorgyártás nincs a modellben, ezért az eredmény nem teljes életciklus-elemzés."
  },
  "gumi-meret-kalkulator": {
    title: "Hogyan hasonlítja össze a két gumiméretet?",
    body: "A szélességből, oldalfal-arányból és felniátmérőből kiszámolja mindkét kerék közelítő külső átmérőjét és gördülési kerületét, majd százalékosan összeveti őket. A megadott műszer szerinti sebességből a geometriai eltérés alapján korrigált értéket is becsül.",
    source: "A geometriai egyezés nem jelent automatikus műszaki megfelelőséget. Csak a jármű gyártója, jóváhagyási dokumentuma vagy hiteles műszaki adat alapján engedélyezett méretet használj."
  },
  "uzemanyag-koltseg-kalkulator": {
    title: "Miből áll össze az út üzemanyagköltsége?",
    body: "A távolság és a l/100 km fogyasztás alapján kiszámolja a szükséges üzemanyagmennyiséget, majd ezt megszorozza a megadott literárral. Az eredmény ezért közvetlenül a saját út-, fogyasztás- és áradataidra reagál, nem országos átlagból becsül.",
    source: "A tényleges fogyasztást befolyásolja a forgalom, hőmérséklet, terhelés és vezetési mód. Aktuális költséghez a tényleges tankolási árat, elszámolási célra pedig az adott szabály szerint alkalmazható hivatalos értéket használd."
  },
  "adatmeret-atvalto-kalkulator": {
    title: "Miért kell külön figyelni a bináris és decimális adatméretre?",
    body: "Az átváltásnál nem mindegy, hogy 1000-es vagy 1024-es lépcsőt használsz. A kalkulátor a választott egységkapcsolat szerint számol, ezért tárolókapacitás és operációs rendszer által jelzett méret összevetésekor ugyanazt a szabványt kell követned.",
    source: "Műszaki dokumentációban ellenőrizd, hogy az adott szolgáltató vagy eszköz SI/decimális vagy IEC/bináris jelölést használ-e. A jelölések összekeverése önmagában több százalékos eltérést okozhat."
  },
  "energia-atvalto-kalkulator": {
    title: "Mit jelent az energiaegységek közti átváltás?",
    body: "A kalkulátor rögzített fizikai átváltási arányokkal viszi át a megadott energiát a kiválasztott egységek között. Az energia mennyiségét váltja át, nem teljesítményt és nem időtartamhoz kötött fogyasztási költséget.",
    source: "Mérési vagy számlázási felhasználásnál ellenőrizd a forrásadat egységét és a szükséges kerekítést. Villamosenergia-költséghez az átváltott kWh mellé külön aktuális tarifára van szükség."
  },
  "teljesitmeny-atvalto-kalkulator": {
    title: "Mit vált át a teljesítménykalkulátor?",
    body: "A teljesítmény pillanatnyi energiaátadási rátát fejez ki. A kalkulátor watt, kilowatt, megawatt és más támogatott teljesítményegységek között vált; önmagában nem mondja meg, mennyi energia fogy el egy időszak alatt.",
    source: "Energiafogyasztás becsléséhez a teljesítmény mellett az üzemidőt és a terhelési profilt is ismerni kell. Eszközméretezésnél a gyártói névleges és csúcsteljesítmény-adat az elsődleges."
  },
  "hosszusag-atvalto-kalkulator": {
    title: "Hogyan működik a hosszúságátváltás?",
    body: "A megadott hosszúságot előbb egy közös alapegységre vezeti vissza, majd abból számítja a célmértéket. Így ugyanaz a logika kezeli a metrikus és támogatott angolszász egységeket.",
    source: "A szabványos hosszúságegységek rögzített arányúak, de műszaki rajznál a kerekítési pontosság számít. Gyártási vagy kivitelezési méretnél őrizd meg az eredeti dokumentum előírt tűrését."
  },
  "tomeg-atvalto-kalkulator": {
    title: "Mit vált át a tömegkalkulátor?",
    body: "A kalkulátor tömegegységeket hasonlít össze közös alapegységen keresztül. A kilogramm, gramm, tonna, font és uncia közti arányokat kezeli; a fizikai tömeget nem keveri össze az erőként értelmezett súllyal.",
    source: "Kereskedelmi vagy műszaki felhasználásnál ellenőrizd, hogy a megadott font/uncia valóban a támogatott avoirdupois rendszerre vonatkozik-e. Erő átváltásához külön newton-alapú számítás szükséges."
  },
  "terulet-atvalto-kalkulator": {
    title: "Miért négyzetesen változnak a területegységek?",
    body: "A terület két hosszméret szorzata, ezért például a méter és centiméter közti százas hosszarány a négyzetméter és négyzetcentiméter között tízezres területarányt jelent. A kalkulátor ezeket a négyzetes kapcsolatokat kezeli.",
    source: "Ingatlan- vagy földterületnél a matematikai átváltás nem helyettesíti a tulajdoni lap, földmérési vagy hatósági területadatot. Hivatalos ügyben mindig a nyilvántartott érték az elsődleges."
  },
  "terfogat-atvalto-kalkulator": {
    title: "Hogyan kezeli a térfogat különböző rendszereit?",
    body: "A térfogategységeket közös alapra váltja, így liter és köbméter mellett a támogatott gallon-egységek is összevethetők. Különösen fontos, hogy az amerikai és az imperial gallon nem azonos térfogat.",
    source: "Recept, tartály vagy műszaki adatlap esetén az eredeti gallonrendszert mindig azonosítsd. Sűrűség nélkül térfogatból nem lehet automatikusan tömeget számolni."
  },
  "ido-atvalto-kalkulator": {
    title: "Mikor egyszerű és mikor naptárfüggő az időátváltás?",
    body: "Másodperc, perc, óra és nap között rögzített arányok használhatók, de hónap és év már naptárfüggő lehet. A kalkulátor csak azokat a kapcsolatokat kezeli közvetlenül, amelyekhez egyértelmű számítási szabály tartozik.",
    source: "Határidő, munkanap vagy naptári hónap számításához ne egyszerű időegység-átváltást használj; azokhoz külön dátum- és munkanaplogika szükséges."
  },
  "sebesseg-atvalto-kalkulator": {
    title: "Mit jelent a sebességegységek átváltása?",
    body: "A sebesség megtett út és eltelt idő hányadosa, ezért a kalkulátor a számláló és nevező egységeinek rögzített arányából számít km/h, m/s, mph és a támogatott további egységek között.",
    source: "Közlekedési vagy műszaki döntésnél az átváltott szám nem írja felül a helyi sebességkorlátozást, műszerpontosságot vagy gyártói specifikációt."
  }
};

const constructionMethods = {
  "gipszkarton-kalkulator": {
    title: "Mitől lesz reálisabb a gipszkarton anyagterv?",
    body: "A nettó falfelület mellett külön kezeli a burkolt oldalak és rétegek számát, a lapméretet, a vágási ráhagyást, valamint opcionálisan a profil-, csavar-, szalag- és glettfajlagos adatokat. A váz és a laprétegek ezért nem egyszerűen ugyanazzal a szorzóval nőnek.",
    source: "A profilkiosztás, csavartávolság, rétegrend, tűz- és hanggátlási követelmény rendszerfüggő. Rendelés előtt a választott minősített gipszkarton rendszer gyártói dokumentációját használd.",
    limits: ["Nem méretez tartószerkezetet vagy függesztést.", "A nyílások körüli erősítéseket és egyedi csomópontokat nem tervezi.", "A fajlagos segédanyag-adatok csak akkor rendelési alapok, ha az adott rendszerhez ellenőrizted őket."]
  },
  "tapeta-kalkulator": {
    title: "Miért nem elég csak a fal négyzetmétere tapétánál?",
    body: "A nettó felület mellett a fal kerületéből csíkszámot számol, figyelembe veszi a tekercs szélességét és hosszát, a csíkonkénti vágási tartalékot, valamint a mintaismétlést. Mintás tapétánál emiatt ugyanakkora felülethez több tekercs is kellhet.",
    source: "A tekercsméretet és mintaismétlést a kiválasztott tapéta címkéjéről vagy műszaki adatából add meg. A gyártási tétel, illesztési mód és felületi hibák további tartalékot indokolhatnak.",
    limits: ["Nem optimalizálja egyenként a nyílásokból megmaradó csíkdarabokat.", "Eltolt illesztésnél a gyártói mintaillesztési szabály az elsődleges.", "A fal előkészítésének és ragasztóigényének mennyiségét nem számolja."]
  },
  "vakolat-kalkulator": {
    title: "Mitől függ igazán a vakolat anyagigénye?",
    body: "A nettó felületet megszorozza a rétegvastagsággal és a megadott kg/m²/mm fogyással, majd külön ráhagyást és zsákméretet alkalmaz. Minimum–maximum fogyási tartományt is tud kezelni, ezért nem kényszerít egyetlen univerzális kiadósságot minden termékre.",
    source: "A fogyási értéket, megengedett rétegvastagságot és kiszerelést a konkrét vakolat gyártói adatlapjából írd be. Ezek termékenként jelentősen eltérhetnek.",
    limits: ["Nem méri fel a fal egyenetlenségéből adódó helyi többletvastagságot.", "Nem választ alapozót, hálót vagy rétegrendet.", "A rendelési becslés csak ellenőrzött gyártói fajlagos adatokkal értelmezhető."]
  },
  "hoszigeteles-kalkulator": {
    title: "Hogyan választja szét a szigetelési felületet és a csomagigényt?",
    body: "A nettó szigetelendő felületből, a választott vastagságból, csomagfedésből és ráhagyásból készít beszerzési becslést. Így a matematikai m²-igény és az egész csomagokra kerekített vásárlási mennyiség külön látható.",
    source: "A csomagfedést, táblaméretet, deklarált hővezetési tényezőt és alkalmazási területet a konkrét szigetelőanyag adatlapjából ellenőrizd. A szükséges vastagságot nem ez a kalkulátor méretezi energetikailag.",
    limits: ["Nem készít hőtechnikai vagy páratechnikai méretezést.", "Nem számol dübel-, ragasztó-, háló- és élvédő rendszerrel, ha nincs külön megadva.", "Geometriai veszteségek és bonyolult csomópontok további ráhagyást igényelhetnek."]
  },
  "terkovezes-kalkulator": {
    title: "Miből áll össze a térkövezés anyagbecslése?",
    body: "A burkolandó nettó felülethez külön ráhagyást ad, majd a választott térkő csomag- vagy raklapfedése alapján kerekít vásárlási mennyiségre. A felület és a tényleges csomagszám ezért külön eredményként jelenik meg.",
    source: "A térkő fedési adatát, rétegrendet, ágyazatot és fugázóanyag-javaslatot a kiválasztott rendszer gyártói/kivitelezési dokumentációjából ellenőrizd.",
    limits: ["Nem méretezi a teherbíró alapréteget vagy vízelvezetést.", "Ívek, szegélyek és sok vágás növelheti a veszteséget.", "Raklap- és csomagkerekítésnél a kereskedő tényleges kiszerelése az irányadó."]
  },
  "tetocserep-kalkulator": {
    title: "Miért gyártói adat a tetőcserép fajlagos igénye?",
    body: "A tetőfelületből és a megadott db/m² cserépigényből számol, majd ráhagyást és csomagolási kerekítést alkalmaz. A fajlagos darabszámot nem vezeti le pusztán a cserép névleges méretéből, mert a fedési hossz és oldalirányú átfedés termékfüggő.",
    source: "A db/m² értéket, minimális hajlásszöget, léctávolságot és kiegészítő elemeket a konkrét tetőcserép gyártói alkalmazástechnikai útmutatójából add meg.",
    limits: ["Nem készít tetőszerkezeti vagy statikai tervet.", "Vápa, élgerinc, áttörés és szegély környezetében külön vágási veszteség lehet.", "Kiegészítő cserepek és rögzítők nem vezethetők le megbízhatóan egyetlen db/m² értékből."]
  },
  "fuga-kalkulator": {
    title: "Mitől változik a fugázóanyag mennyisége?",
    body: "A burkolat felülete mellett a lap méretét, fugaszélességet, fugamélységet és a megadott anyagjellemzőt használja. Ezért ugyanazon m² mellett a kisebb lap és szélesebb/mélyebb fuga több anyagot igényelhet.",
    source: "A fugázó sűrűségét vagy gyártói fogyási képletét a kiválasztott termék adatlapja alapján ellenőrizd. Speciális epoxi vagy más rendszer eltérő számítási alapot használhat.",
    limits: ["Nem méri a tényleges fugamélység helyszíni változását.", "Nem számol külön dilatációs és rugalmas hézagkitöltő anyaggal.", "A mosási és kivitelezési veszteség termék- és munkamódszerfüggő."]
  },
  "padlo-burkolat-kalkulator": {
    title: "Hogyan lesz a nettó padlófelületből vásárolandó csomagszám?",
    body: "A helyiség nettó burkolandó felületéhez a választott vágási ráhagyást adja, majd a csomagonkénti fedés alapján egész csomagra kerekít. Ez különösen fontos laminált, vinyl és más csomagolt burkolatoknál.",
    source: "A csomagfedést, fektetési mintát, dilatációt és aljzati követelményeket a kiválasztott burkolat gyártói dokumentációjából ellenőrizd. Mintás vagy átlós fektetéshez nagyobb ráhagyás lehet indokolt.",
    limits: ["Nem optimalizálja automatikusan a szabási kiosztást helyiségenként.", "Nem számolja az alátét, párazáró vagy ragasztó mennyiségét, ha az nincs külön modellezve.", "Több helyiség eltérő irányú fektetését célszerű külön számolni."]
  }
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const autoBlock = (method) => `<h2>${escapeHtml(method.title)}</h2><p>${escapeHtml(method.body)}</p><p><strong>Ellenőrzési alap:</strong> ${escapeHtml(method.source)}</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time></p>`;
const constructionBlock = (method, examples = ["", ""]) => `<h2>${escapeHtml(method.title)}</h2><p>${escapeHtml(method.body)}</p><div class="construction-scenarios"><div><strong>5%</strong><span>egyszerű, kevés vágás</span></div><div><strong>8%</strong><span>általános kiindulás</span></div><div><strong>12%</strong><span>sok vágás vagy minta</span></div><div><strong>15%</strong><span>összetett felület</span></div></div><div class="notice-box"><strong>Ellenőrzési alap:</strong> ${escapeHtml(method.source)}</div><h2>Két példaszámítás</h2><div class="construction-example-grid"><article><h3>1. példa</h3><p>${examples[0]}</p></article><article><h3>2. példa</h3><p>${examples[1]}</p></article></div><h2>A kalkulátor korlátai</h2><ul>${method.limits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><p class="last-reviewed">Módszertani ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time>.</p>`;

function patchAutoSource() {
  const file = path.join(root, "js", "auto-converter-upgrades.js");
  let source = fs.readFileSync(file, "utf8");
  if (!source.includes("KB_ADSENSE_DOMAIN_METHOD_V2")) {
    const needle = '  const cfg=configs[slug]; if(!cfg) return;';
    if (!source.includes(needle)) throw new Error("Az auto-converter-upgrades.js beszúrási pontja nem található.");
    const data = JSON.stringify(autoMethods, null, 2).replace(/^/gm, "  ");
    source = source.replace(needle, `  // KB_ADSENSE_DOMAIN_METHOD_V2\n  const methodCopy = ${data.trimStart()};\n${needle}`);
    const oldNote = '  const note=document.createElement("section");note.className="adsense-content ac-note";note.innerHTML=`<h2>Módszertan és korlátok</h2><p>A számítás a megadott adatokból matematikai becslést készít. Az autós költségek, értékvesztés, kibocsátási tényezők, árfolyamok és gyártói mérethatárok időben és szolgáltatónként változhatnak.</p><p><strong>Forráskezelés:</strong> az oldalon szereplő alapértékeket ellenőrizd az aktuális gyártói dokumentációban, hivatalos árfolyamforrásban vagy közzétett kibocsátási faktorokban. A CO₂-oldal a közvetlen használati kibocsátást elkülöníti a felhasználó által megadott upstream/árammix becsléstől.</p><p>Utolsó módszertani frissítés: 2026. július 15.</p>`;card.insertAdjacentElement("afterend",note);window.KB_AUTO_CONVERTER_UPGRADE_READY=slug;';
    if (!source.includes(oldNote)) throw new Error("A közös autós módszertani blokk nem található.");
    const newNote = `  const method=methodCopy[slug];\n  const note=document.createElement("section");note.className="adsense-content ac-note";note.innerHTML=\`<h2>\${method.title}</h2><p>\${method.body}</p><p><strong>Ellenőrzési alap:</strong> \${method.source}</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time></p>\`;card.insertAdjacentElement("afterend",note);window.KB_AUTO_CONVERTER_UPGRADE_READY=slug;`;
    source = source.replace(oldNote, newNote);
    fs.writeFileSync(file, source, "utf8");
    console.log("Updated auto/converter runtime methodology copy.");
  }
}

function patchConstructionSource() {
  const file = path.join(root, "js", "construction-upgrades.js");
  let source = fs.readFileSync(file, "utf8");
  if (!source.includes("KB_ADSENSE_CONSTRUCTION_METHOD_V2")) {
    const needle = '  const card = document.querySelector(".card-calculator");';
    if (!source.includes(needle)) throw new Error("A construction-upgrades.js beszúrási pontja nem található.");
    const data = JSON.stringify(constructionMethods, null, 2).replace(/^/gm, "  ");
    source = source.replace(needle, `  // KB_ADSENSE_CONSTRUCTION_METHOD_V2\n  const methodCopy = ${data.trimStart()};\n\n${needle}`);
    const start = '  const guide = document.createElement("section"); guide.className = "article construction-methodology";';
    const end = '  const existingGuide = card.nextElementSibling; if (existingGuide) existingGuide.before(guide); else card.after(guide);';
    const startIndex = source.indexOf(start);
    const endIndex = source.indexOf(end, startIndex);
    if (startIndex === -1 || endIndex === -1) throw new Error("A közös építőipari módszertani blokk nem található.");
    const afterEnd = endIndex + end.length;
    const replacement = `  const method = methodCopy[slug];\n  const guide = document.createElement("section"); guide.className = "article construction-methodology";\n  guide.innerHTML = \`<h2>\${method.title}</h2><p>\${method.body}</p><div class="construction-scenarios"><div><strong>5%</strong><span>egyszerű, kevés vágás</span></div><div><strong>8%</strong><span>általános kiindulás</span></div><div><strong>12%</strong><span>sok vágás vagy minta</span></div><div><strong>15%</strong><span>összetett felület</span></div></div><div class="notice-box"><strong>Ellenőrzési alap:</strong> \${method.source}</div><h2>Két példaszámítás</h2><div class="construction-example-grid"><article><h3>1. példa</h3><p>\${config.examples[0]}</p></article><article><h3>2. példa</h3><p>\${config.examples[1]}</p></article></div><h2>A kalkulátor korlátai</h2><ul>\${method.limits.map((item) => \`<li>\${item}</li>\`).join("")}</ul><p class="last-reviewed">Módszertani ellenőrzés: <time datetime="${reviewedIso}">${reviewedHu}</time>.</p>\`;\n${end}`;
    source = source.slice(0, startIndex) + replacement + source.slice(afterEnd);
    fs.writeFileSync(file, source, "utf8");
    console.log("Updated construction runtime methodology copy.");
  }
}

function patchMaterializedHtml() {
  let autoCount = 0;
  for (const [slug, method] of Object.entries(autoMethods)) {
    const file = path.join(root, "kalkulatorok", `${slug}.html`);
    if (!fs.existsSync(file)) throw new Error(`Hiányzó autós/átváltó oldal: ${slug}`);
    let html = fs.readFileSync(file, "utf8");
    const pattern = /<!-- KB_STATIC:auto-converter-note:START -->[\s\S]*?<!-- KB_STATIC:auto-converter-note:END -->/;
    if (!pattern.test(html)) throw new Error(`Hiányzó auto-converter-note marker: ${slug}`);
    html = html.replace(pattern, `<!-- KB_STATIC:auto-converter-note:START -->\n<section data-static-runtime-fallback="auto-converter-note" class="adsense-content ac-note">${autoBlock(method)}</section>\n<!-- KB_STATIC:auto-converter-note:END -->`);
    fs.writeFileSync(file, html, "utf8");
    autoCount += 1;
  }

  let constructionCount = 0;
  for (const [slug, method] of Object.entries(constructionMethods)) {
    const file = path.join(root, "kalkulatorok", `${slug}.html`);
    if (!fs.existsSync(file)) throw new Error(`Hiányzó építőipari oldal: ${slug}`);
    let html = fs.readFileSync(file, "utf8");
    const pattern = /<!-- KB_STATIC:construction-methodology:START -->[\s\S]*?<!-- KB_STATIC:construction-methodology:END -->/;
    const match = html.match(pattern);
    if (!match) throw new Error(`Hiányzó construction-methodology marker: ${slug}`);
    const examples = [...match[0].matchAll(/<article><h3>\d\. példa<\/h3><p>([\s\S]*?)<\/p><\/article>/g)].map((item) => item[1]);
    if (examples.length < 2) throw new Error(`Nem olvasható a két példaszámítás: ${slug}`);
    html = html.replace(pattern, `<!-- KB_STATIC:construction-methodology:START -->\n<section data-static-runtime-fallback="construction-methodology" class="article construction-methodology">${constructionBlock(method, examples)}</section>\n<!-- KB_STATIC:construction-methodology:END -->`);
    fs.writeFileSync(file, html, "utf8");
    constructionCount += 1;
  }
  console.log(`Updated materialized methodology: ${autoCount} auto/converter + ${constructionCount} construction pages.`);
}

patchAutoSource();
patchConstructionSource();
patchMaterializedHtml();
