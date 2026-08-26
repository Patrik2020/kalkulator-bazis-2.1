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
