const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "kalkulatorok", "szamla-teljesites-kalkulator.html");
const checkOnly = process.argv.includes("--check");

const section = `
<section class="card card-calculator" id="periodic-settlement-calculator" data-quality-upgrade="2026-08-25">
  <h2>Időszakos elszámolás teljesítési időpontja – Áfa tv. 58. §</h2>
  <p>Add meg az elszámolási időszak utolsó napját, a számla kibocsátását és a fizetési esedékességet. A kalkulátor a tipikus, Áfa tv. 58. § (1) és (1a) szerinti belföldi eset teljesítési időpontját számolja.</p>
  <div class="calc-grid">
    <div>
      <label for="periodEnd">Elszámolási időszak utolsó napja</label>
      <input type="date" id="periodEnd" />
    </div>
    <div>
      <label for="periodicIssueDate">Számla kibocsátásának napja</label>
      <input type="date" id="periodicIssueDate" />
    </div>
    <div>
      <label for="periodicDueDate">Fizetési esedékesség napja</label>
      <input type="date" id="periodicDueDate" />
    </div>
  </div>
  <div class="result-box" role="status" aria-live="polite" aria-atomic="true">
    <p>Áfa szerinti teljesítési időpont:</p>
    <p id="result-periodic-performance">–</p>
    <p id="result-periodic-rule"></p>
  </div>
  <p class="source-note">Jogszabályi alap: <a href="https://njt.hu/jogszabaly/2007-127-00-00.55" target="_blank" rel="noopener noreferrer">2007. évi CXXVII. törvény 58. §</a>.</p>
  <p class="input-help"><strong>Korlát:</strong> ez a rész a tipikus 58. § (1)–(1a) szerinti esetet modellezi. Nem helyettesíti a különleges, hosszú elszámolási időszakokra, Közösségen belüli ügyletekre, fordított adózásra, előlegre, részteljesítésre vagy módosító számlára vonatkozó szabályok vizsgálatát.</p>
</section>
`;

function apply(source) {
  if (source.includes('id="periodic-settlement-calculator"')) return source;
  const anchor = /<section\b[^>]*class=(['"])[^'"]*\barticle\b[^'"]*\bcalculator-guide\b[^'"]*\1/i;
  if (!anchor.test(source)) {
    throw new Error("Nem található a számla teljesítés útmutató szakasza a periódikus kalkulátor beszúrásához.");
  }
  return source.replace(anchor, `${section}\n$&`);
}

if (!fs.existsSync(target)) throw new Error("Hiányzik a számla teljesítés kalkulátor HTML.");
const source = fs.readFileSync(target, "utf8");
const expected = apply(source);
const secondPass = apply(expected);
if (secondPass !== expected) throw new Error("A periódikus elszámolás UI materializálása nem idempotens.");

if (!checkOnly && expected !== source) fs.writeFileSync(target, expected);

console.log(
  checkOnly
    ? "Időszakos elszámolás UI audit OK: idempotens és materializálható."
    : `Időszakos elszámolás UI materializálva: ${expected === source ? "nincs változás" : "frissítve"}.`
);

module.exports = { apply };
