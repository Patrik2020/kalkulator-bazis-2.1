const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található autós tartalmi cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi autós tartalmi cél: ${label}`);
  return source.replace(oldText, newText);
}
function replaceAllExact(source, oldText, newText, label) {
  if (!source.includes(oldText)) {
    if (source.includes(newText)) return source;
    throw new Error(`Nem található autós tartalmi cél: ${label}`);
  }
  return source.split(oldText).join(newText);
}

const transforms = {
  "kalkulatorok/auto-ertekvesztes-kalkulator.html": (source) => {
    let out = source;
    out = replaceExact(out,
      '<p>Az értékvesztés azt mutatja, mennyivel lehet kevesebbet érni egy autónak néhány év múlva a vételárhoz képest. A kalkulátor a vételárból, az éves százalékos értékcsökkenésből és a használati időből becsül maradványértéket.</p>',
      '<p>Az értékvesztés azt mutatja, mennyivel lehet kevesebbet érni egy autónak a jelenlegi értékéhez képest egy választott időtáv végén. A kalkulátor három szerkeszthető forgatókönyvet kezel: külön rátát adhatsz meg az első vizsgált évre és a további évekre, majd az infláció vagy defláció feltételezésével mai vásárlóértéket is becsül.</p>',
      "értékvesztés bevezető");
    out = replaceExact(out,
      '<p>A kalkulátor kamatos jellegű értékcsökkenést használ: <strong>maradványérték = vételár × (1 − éves ráta)<sup>évek</sup></strong>. Ez azért fontos, mert ugyanaz a százalék minden évben az aktuális, már csökkent értékre vonatkozik.</p>',
      '<p>A számítás évről évre az aktuális, már csökkent értékre alkalmazza a rátát. Az első vizsgált évhez az első éves ráta tartozik, a további évekhez pedig a későbbi éves ráta. Ha a két ráta azonos, a modell a szokásos <strong>jelenlegi érték × (1 − ráta)<sup>évek</sup></strong> képletre egyszerűsödik.</p>',
      "értékvesztés képletleírás");
    out = replaceExact(out,
      '<div class="example-box"><h3>Példa</h3><p>8 000 000 Ft vételár, 12% éves értékvesztés és 3 év mellett a becsült maradványérték körülbelül 5,45 millió Ft. Ez nagyjából 2,55 millió Ft összes értékvesztést jelent.</p></div>',
      '<div class="example-box"><h3>Példa</h3><p>8 000 000 Ft jelenlegi érték, 15% első vizsgált éves és 8% további éves értékvesztés mellett 3 év után a nominális becslés körülbelül 5,76 millió Ft. Ha 3,5% éves inflációval számolsz, a kalkulátor ennek mai vásárlóértékét is külön megmutatja.</p></div>',
      "értékvesztés példa");
    out = replaceExact(out,
      '<p>A kalkulátor nominális forintértéket mutat. Ha az általános árszint közben jelentősen emelkedik, ugyanaz a forintösszeg reálértéken kevesebbet érhet. Ezért hosszú távú tulajdonlási költség összehasonlításakor az inflációt külön is érdemes figyelembe venni.</p>',
      '<p>A kalkulátor a nominális becslés mellett a megadott infláció vagy defláció alapján <strong>mai vásárlóértéken</strong> is megmutatja a forgatókönyvet. Ez nem autópiaci előrejelzés: az inflációs mező csak a pénz vásárlóerejének változását választja külön a jármű feltételezett piaci értékvesztésétől.</p>',
      "értékvesztés reálérték");
    out = replaceAllExact(out,
      'Nem, azt külön kell figyelembe venni.',
      'Igen. A szerkeszthető infláció/defláció mezőből a nominális becslés mai vásárlóértékét is kiszámolja; ez külön feltételezés, nem autópiaci árgarancia.',
      "értékvesztés infláció FAQ");
    out = replaceExact(out,
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-08">2026. augusztus 8.</time></p>',
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-26">2026. augusztus 26.</time></p>',
      "értékvesztés felülvizsgálati dátum");
    return out;
  },

  "kalkulatorok/eves-auto-koltseg-kalkulator.html": (source) => {
    let out = source;
    out = replaceExact(out,
      '<p>A kalkulátor összeadja az éves üzemanyag-, biztosítási, szerviz-, adó- és egyéb költségeket, majd havi átlagot készít. Így láthatóvá válnak azok a tételek is, amelyek nem minden hónapban jelentkeznek.</p>\n<p>Az „egyéb” mezőbe kerülhet parkolás, autópályamatrica, gumi, műszaki vizsga, mosás, finanszírozási költség vagy értékvesztés. Összehasonlításnál minden autónál azonos költségkört használj.</p>',
      '<p>A kalkulátor az éves futásból, fogyasztásból és üzemanyagárból kiszámolja az éves üzemanyagköltséget, majd ehhez külön mezőkből hozzáadja a biztosítás, adó és matrica, szerviz és javítás, gumi, parkolás és értékvesztés becslését.</p>\n<p>Összehasonlításnál minden autónál azonos költségkört használj. Az értékvesztés gazdasági költség, de nem feltétlenül az adott évben kifizetett készpénz; finanszírozási kamatot vagy más, külön nem szereplő tételt csak akkor hasonlíts össze, ha mindkét autónál ugyanúgy kezeled.</p>',
      "éves autóköltség mezőleírás");
    out = replaceExact(out,
      '<p>A program összeadja a megadott éves tételeket, majd tizenkettővel osztja az összeget. A havi átlag nem azt jelenti, hogy minden hónapban pontosan ennyit fizetsz, hanem hogy ennyit érdemes átlagosan félretenni.</p>',
      '<p>A program összeadja az üzemanyag- és egyéb éves tételeket, majd tizenkettővel osztja az összeget. A kapott havi szám <strong>gazdasági havi átlag</strong>: ha értékvesztést is megadsz, nem azonos a tényleges havi cashflow-val vagy a bankszámláról félreteendő összeggel.</p>',
      "éves autóköltség havi átlag");
    out = replaceExact(out,
      '<div class="example-box"><h3>Példa</h3><p>Évi 600 000 Ft üzemanyag, 100 000 Ft biztosítás, 180 000 Ft szerviz, 50 000 Ft adó és díj, valamint 120 000 Ft egyéb költség összesen 1 050 000 Ft/év, azaz 87 500 Ft/hó.</p></div>',
      '<div class="example-box"><h3>Példa</h3><p>Ha az éves üzemanyag 600 000 Ft, a biztosítás 100 000 Ft, a szerviz 180 000 Ft, az adó és matrica 50 000 Ft, a gumi és parkolás együtt 120 000 Ft, az értékvesztés pedig 300 000 Ft, akkor a teljes gazdasági költség 1 350 000 Ft/év, azaz 112 500 Ft/hó. Ebből 300 000 Ft nem közvetlen éves készpénzkiadás, hanem becsült vagyonvesztés.</p></div>',
      "éves autóköltség példa");
    out = replaceExact(out,
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-07-05">2026. július 5.</time></p>',
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-26">2026. augusztus 26.</time></p>',
      "éves autóköltség felülvizsgálati dátum");
    return out;
  },

  "kalkulatorok/kilometerdij-kalkulator.html": (source) => {
    let out = source;
    out = replaceExact(out,
      '<p>Számold ki, mennyibe kerül egy kilométer a saját autóddal a teljes havi fenntartási költség alapján.</p>',
      '<p>Számold ki, mennyibe kerül egy kilométer a saját autóddal az éves teljes autóköltség és az éves futás alapján.</p>',
      "kilométerdíj hero");
    out = replaceExact(out,
      '<p>A kilométerdíj kalkulátor a havi összes autóköltséget elosztja a hónapban megtett kilométerrel. Így nemcsak a tankolást, hanem biztosítást, szervizt, adókat, parkolást, értékvesztést és más rendszeres tételeket is egyetlen Ft/km értékben lehet összefoglalni.</p>\n<p>Az eredmény annál pontosabb, minél teljesebb a havi költségadat. Ritkább kiadásokat érdemes éves összegből tizenkettedre bontani.</p>',
      '<p>A kilométerdíj kalkulátor az éves teljes autóköltséget osztja el az éves futással. Így nemcsak a tankolást, hanem biztosítást, szervizt, adókat, parkolást, értékvesztést és más tételeket is egyetlen Ft/km értékben lehet összefoglalni.</p>\n<p>Az eredmény annál pontosabb, minél teljesebb és azonos időszakra vonatkozó az éves költség- és futásadat. A kalkulátor a kapott Ft/km értékből egy választott út teljes költségét és a fizető utasokra jutó összeget is megbecsüli.</p>',
      "kilométerdíj időszak és mezők");
    out = replaceExact(out,
      '<p><strong>Kilométerenkénti költség = havi autóköltség ÷ havi megtett kilométer.</strong> Ha a havi kilométer nagyon alacsony, a fix költségek miatt az egy kilométerre jutó összeg magas lesz.</p>',
      '<p><strong>Kilométerenkénti költség = éves teljes autóköltség ÷ éves futás.</strong> Ha az éves futás alacsony, a fix és gazdasági költségek miatt az egy kilométerre jutó összeg magas lesz.</p>',
      "kilométerdíj képlet");
    out = replaceExact(out,
      '<div class="example-box"><h3>Példa</h3><p>Ha az autó teljes havi költsége 135 000 Ft, és 1 500 km-t teszel meg, akkor 135 000 ÷ 1 500 = 90 Ft/km. Egy 240 km-es út így nagyjából 21 600 Ft teljes autóköltséget képviselhet.</p></div>',
      '<div class="example-box"><h3>Példa</h3><p>Ha az autó teljes éves költsége 1 200 000 Ft, és évente 15 000 km-t teszel meg, akkor 1 200 000 ÷ 15 000 = 80 Ft/km. Egy 200 km-es út így körülbelül 16 000 Ft teljes autóköltséget képvisel; két fizető utasnál ez 8 000 Ft/fő.</p></div>',
      "kilométerdíj példa");
    out = replaceExact(out,
      '<ul><li>Csak az üzemanyagot számítják költségnek.</li><li>Az éves biztosítást teljes egészében egy hónaphoz adják.</li><li>A ritka javításokat és gumicserét kihagyják.</li><li>Az értékvesztést nem veszik figyelembe.</li></ul>',
      '<ul><li>Csak az üzemanyagot számítják költségnek.</li><li>Nem azonos időszakból származó költséget és futást osztanak el egymással.</li><li>A ritka javításokat és gumicserét kihagyják.</li><li>Az értékvesztést nem veszik figyelembe.</li></ul>',
      "kilométerdíj gyakori hibák");
    out = replaceAllExact(out,
      'Az éves becsült értékvesztést oszd tizenkettővel, és add a havi költséghez.',
      'Az éves becsült értékvesztést add hozzá az éves teljes autóköltséghez. Ez gazdasági költség, nem feltétlenül ugyanabban az évben kifizetett készpénz.',
      "kilométerdíj értékvesztés FAQ");
    out = replaceExact(out,
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-07-05">2026. július 5.</time></p>',
      '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-26">2026. augusztus 26.</time></p>',
      "kilométerdíj felülvizsgálati dátum");
    return out;
  },

  "kalkulatorok/auto-fogyasztas-kalkulator.html": (source) => {
    let out = source;
    const oldCalculation = '<h3>Hogyan működik a számítás?</h3>\n      <p>A képlet: tankolt liter ÷ megtett kilométer × 100. A pontosabb méréshez nullázd a napi kilométer-számlálót, majd lehetőleg tele tanktól tele tankig mérj.</p>\n      <div class="example-box"><h3>Konkrét példaszámítás</h3><p>Ha 42 litert tankoltál, és 650 km-t mentél, akkor a fogyasztás 42 ÷ 650 × 100 = 6,46 liter/100 km.</p></div>';
    const queryCalculation = '<!-- KB_P4:auto-fuel-query:START -->\n      <h3>Átlagfogyasztás kiszámítása: képlet és gyors példák</h3>\n      <p>Az autó átlagfogyasztásának kiszámításához két adat kell: a tankolt üzemanyag literben és az ugyanazzal az üzemanyaggal megtett távolság kilométerben. Az üzemanyag-fogyasztás kalkulátor ugyanezt a számítást végzi el automatikusan.</p>\n      <p><strong>Átlagfogyasztás = tankolt liter ÷ megtett kilométer × 100.</strong> A pontosabb méréshez nullázd a napi kilométer-számlálót, majd lehetőleg tele tanktól tele tankig mérj.</p>\n      <div class="example-box"><h3>Gyors példák</h3><p>35 liter és 500 km esetén 7,00 l/100 km; 42 liter és 650 km esetén 6,46 l/100 km; 50 liter és 800 km esetén 6,25 l/100 km az átlagfogyasztás.</p></div>\n      <!-- KB_P4:auto-fuel-query:END -->';
    if (/<!--\s*KB_P4:auto-fuel-query:START\s*-->[\s\S]*?<!--\s*KB_P4:auto-fuel-query:END\s*-->/.test(out)) {
      out = out.replace(/<!--\s*KB_P4:auto-fuel-query:START\s*-->[\s\S]*?<!--\s*KB_P4:auto-fuel-query:END\s*-->/, queryCalculation);
    } else {
      out = replaceExact(out, oldCalculation, queryCalculation, "P4 átlagfogyasztás query-blokk");
    }

    const faqAnchor = '<details><summary>Mi növelheti a fogyasztást?</summary><p>Gyors tempó, hideg motor, rövid utak, klíma, tetőcsomagtartó, alacsony guminyomás és nagy terhelés.</p></details>';
    const faqExtended = `${faqAnchor}\n        <details><summary>Hogyan számolom ki az autó átlagfogyasztását?</summary><p>Oszd el a tankolt litert a megtett kilométerrel, majd szorozd meg százzal. Például 42 liter és 650 km esetén 6,46 l/100 km az átlagfogyasztás.</p></details>\n        <details><summary>Mennyi üzemanyagot fogyaszt az autó 100 km-en?</summary><p>A l/100 km eredmény közvetlenül ezt mutatja meg. Például 6,5 l/100 km azt jelenti, hogy az autó átlagosan 6,5 liter üzemanyagot használ 100 kilométeren.</p></details>`;
    if (!out.includes("Hogyan számolom ki az autó átlagfogyasztását?")) {
      out = replaceExact(out, faqAnchor, faqExtended, "P4 látható FAQ");
    }

    const scriptPattern = /<script\b([^>]*)\bid=(["'])kb-structured-data\2([^>]*)>([\s\S]*?)<\/script>/i;
    const match = out.match(scriptPattern);
    if (!match) throw new Error("P4: hiányzó #kb-structured-data az autó fogyasztás oldalon");
    let data;
    try { data = JSON.parse(match[4]); }
    catch (error) { throw new Error(`P4: hibás JSON-LD (${error.message})`); }
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [];
    const faq = nodes.find((node) => node?.["@type"] === "FAQPage");
    if (!faq || !Array.isArray(faq.mainEntity)) throw new Error("P4: hiányzó FAQPage séma");
    const additions = [
      ["Hogyan számolom ki az autó átlagfogyasztását?", "Oszd el a tankolt litert a megtett kilométerrel, majd szorozd meg százzal. Például 42 liter és 650 km esetén 6,46 l/100 km az átlagfogyasztás."],
      ["Mennyi üzemanyagot fogyaszt az autó 100 km-en?", "A l/100 km eredmény közvetlenül ezt mutatja meg. Például 6,5 l/100 km azt jelenti, hogy az autó átlagosan 6,5 liter üzemanyagot használ 100 kilométeren."],
    ];
    for (const [name, text] of additions) {
      const existing = faq.mainEntity.find((item) => item?.name === name);
      const node = { "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } };
      if (existing) Object.assign(existing, node);
      else faq.mainEntity.push(node);
    }
    const replacement = `<script${match[1]}id="kb-structured-data"${match[3]}>${JSON.stringify(data)}</script>`;
    out = out.replace(scriptPattern, replacement);
    return out;
  },
};

function run() {
  let changed = 0;
  for (const [relativePath, transform] of Object.entries(transforms)) {
    const filePath = path.join(root, relativePath);
    const source = fs.readFileSync(filePath, "utf8");
    const expected = transform(source);
    if (transform(expected) !== expected) throw new Error(`Nem idempotens autós tartalmi upgrade: ${relativePath}`);
    if (!checkOnly && expected !== source) { fs.writeFileSync(filePath, expected, "utf8"); changed += 1; }
  }
  console.log(checkOnly
    ? `Autós tartalmi konzisztencia audit OK: ${Object.keys(transforms).length} oldal, idempotens.`
    : `Autós tartalmi konzisztencia alkalmazva: ${changed}/${Object.keys(transforms).length} oldal.`);
}
if (require.main === module) run();
module.exports = { transforms, run };
