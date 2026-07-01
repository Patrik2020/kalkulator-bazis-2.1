const TAX_RULES_2026 = Object.freeze({
  szjaRate: 0.15,
  tbRate: 0.185,
  employerSzochoRate: 0.13,
  under25MonthlyBaseCap: 715_765,
  firstMarriedMonthlyTaxSaving: 5_000,
});

function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

function parseNumber(value) {
  const normalized = (value || "").replace(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInput(input) {
  input?.addEventListener("input", (event) => {
    const raw = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
    event.target.value = raw ? new Intl.NumberFormat("hu-HU").format(raw) : "";
  });
}

const grossInput = document.getElementById("gross");
const netInput = document.getElementById("net-input");
const under25 = document.getElementById("under25");
const firstMarried = document.getElementById("first-married");
const family = document.getElementById("family");
const grossWrapper = document.getElementById("gross-wrapper");
const netWrapper = document.getElementById("net-wrapper");
const resultTitle = document.getElementById("result-title");
const resultNet = document.getElementById("result-net");
const resultGross = document.getElementById("result-gross");
const resultSzja = document.getElementById("result-szja");
const resultTb = document.getElementById("result-tb");
const resultFamily = document.getElementById("result-family");
const resultMarried = document.getElementById("result-married");
const resultUnder25 = document.getElementById("result-under25");
const resultEmployer = document.getElementById("result-employer");
const resultDiff = document.getElementById("result-diff");

formatInput(grossInput);
formatInput(netInput);

function getFamilyMaxTaxSaving(children) {
  const count = Math.max(0, Math.floor(Number(children) || 0));
  if (count === 1) return 20_000;
  if (count === 2) return 80_000;
  if (count >= 3) return count * 66_000;
  return 0;
}

function calculateFromGross(gross, options = {}) {
  const safeGross = Math.max(0, Number(gross) || 0);
  const baseSzja = safeGross * TAX_RULES_2026.szjaRate;
  const baseTb = safeGross * TAX_RULES_2026.tbRate;

  const under25Saving = options.under25
    ? Math.min(baseSzja, TAX_RULES_2026.under25MonthlyBaseCap * TAX_RULES_2026.szjaRate)
    : 0;

  let remainingSzja = Math.max(0, baseSzja - under25Saving);
  const marriedSaving = options.firstMarried
    ? Math.min(remainingSzja, TAX_RULES_2026.firstMarriedMonthlyTaxSaving)
    : 0;
  remainingSzja -= marriedSaving;

  const familyMaximum = getFamilyMaxTaxSaving(options.children);
  const familyFromSzja = Math.min(remainingSzja, familyMaximum);
  remainingSzja -= familyFromSzja;
  const familyFromTb = Math.min(baseTb, Math.max(0, familyMaximum - familyFromSzja));
  const finalTb = Math.max(0, baseTb - familyFromTb);
  const familyUsed = familyFromSzja + familyFromTb;

  return {
    gross: safeGross,
    net: safeGross - remainingSzja - finalTb,
    szja: remainingSzja,
    tb: finalTb,
    baseSzja,
    baseTb,
    under25Saving,
    marriedSaving,
    familyMaximum,
    familyUsed,
    familyUnused: Math.max(0, familyMaximum - familyUsed),
    employerCost: safeGross * (1 + TAX_RULES_2026.employerSzochoRate),
  };
}

function grossForDesiredNet(desiredNet, options) {
  const target = Math.max(0, Number(desiredNet) || 0);
  if (target === 0) return calculateFromGross(0, options);

  let low = 0;
  let high = Math.max(target * 2, 100_000);
  while (calculateFromGross(high, options).net < target && high < 1_000_000_000) {
    high *= 2;
  }

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const middle = (low + high) / 2;
    if (calculateFromGross(middle, options).net < target) low = middle;
    else high = middle;
  }
  return calculateFromGross(high, options);
}

function clearResults() {
  resultNet.textContent = "–";
  [resultGross, resultSzja, resultTb, resultFamily, resultMarried, resultUnder25, resultEmployer, resultDiff]
    .forEach((element) => { element.textContent = ""; });
}

function render(model, type, desiredNet = null) {
  resultNet.textContent = `${format(type === "gross-to-net" ? model.net : model.gross)} Ft`;
  resultGross.textContent = type === "gross-to-net"
    ? `Bruttó fizetés: ${format(model.gross)} Ft`
    : `Becsült nettó: ${format(model.net)} Ft${desiredNet !== null ? ` (cél: ${format(desiredNet)} Ft)` : ""}`;
  resultSzja.textContent = `Fizetendő SZJA: ${format(model.szja)} Ft`;
  resultTb.textContent = `Fizetendő TB-járulék: ${format(model.tb)} Ft`;
  resultFamily.textContent = model.familyMaximum > 0
    ? `Felhasznált családi kedvezmény: ${format(model.familyUsed)} Ft`
    : "";
  resultMarried.textContent = firstMarried.checked
    ? `Felhasznált első házas kedvezmény: ${format(model.marriedSaving)} Ft`
    : "";
  resultUnder25.textContent = under25.checked
    ? `25 év alatti kedvezményből felhasználva: ${format(model.under25Saving)} Ft`
    : "";
  resultEmployer.textContent = `Becsült teljes munkáltatói költség: ${format(model.employerCost)} Ft`;

  const notes = [];
  if (model.familyUnused > 0) {
    notes.push(`A megadott bérből a családi kedvezmény ${format(model.familyUnused)} Ft-os része nem használható ki ebben az egyszerűsített modellben.`);
  }
  if (under25.checked && firstMarried.checked) {
    notes.push("A 25 év alatti és az első házas kedvezmény együttes jogosultsága az egyéni körülményektől is függ.");
  }
  resultDiff.textContent = notes.join(" ");
}

function calc() {
  const type = document.querySelector("input[name='calc-type']:checked")?.value || "gross-to-net";
  const options = {
    under25: Boolean(under25.checked),
    firstMarried: Boolean(firstMarried.checked),
    children: Number.parseInt(family.value, 10) || 0,
  };

  if (type === "gross-to-net") {
    const gross = parseNumber(grossInput.value);
    if (gross <= 0) return clearResults();
    render(calculateFromGross(gross, options), type);
  } else {
    const desiredNet = parseNumber(netInput.value);
    if (desiredNet <= 0) return clearResults();
    render(grossForDesiredNet(desiredNet, options), type, desiredNet);
  }
}

document.querySelectorAll("input[name='calc-type']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const type = document.querySelector("input[name='calc-type']:checked")?.value;
    const grossToNet = type === "gross-to-net";
    grossWrapper.classList.toggle("hidden", !grossToNet);
    netWrapper.classList.toggle("hidden", grossToNet);
    resultTitle.textContent = grossToNet ? "Nettó fizetés:" : "Bruttó fizetés:";
    calc();
  });
});

[grossInput, netInput, under25, firstMarried, family].forEach((input) => {
  input?.addEventListener("input", calc);
  input?.addEventListener("change", calc);
});

calc();
