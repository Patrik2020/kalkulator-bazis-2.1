(function () {
  // =========================
  // ELEMEK
  // =========================
  const amountInput = document.getElementById("amount");
  const vatInput = document.getElementById("vat");
  const resultEl = document.getElementById("result-value");

  // Ha nem ezen az oldalon vagyunk → kilép
  if (!amountInput || !vatInput || !resultEl) return;

  formatInputNumber(amountInput);

  // =========================
  // MÓD LEKÉRÉS
  // =========================
  function getMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : "netto";
  }

  function renderResult(rows) {
    resultEl.replaceChildren();

    rows.forEach(([label, value], index) => {
      if (index > 0) {
        resultEl.appendChild(document.createElement("br"));
      }

      if (index === rows.length - 1) {
        const strong = document.createElement("strong");
        strong.textContent = `${label}: ${value}`;
        resultEl.appendChild(strong);
        return;
      }

      resultEl.append(`${label}: ${value}`);
    });
  }

  // =========================
  // FŐ SZÁMOLÁS
  // =========================
  function calculate() {
    const amount = parseNumber(amountInput.value);
    const vat = parseFloat(vatInput.value);
    const mode = getMode();

    // VALIDÁCIÓ
    if (!amount || amount <= 0) {
      resultEl.textContent = "Kérjük, adjon meg egy érvényes összeget.";
      return;
    }

    if (isNaN(vat) || vat < 0) {
      resultEl.textContent = "Kérjük, adjon meg egy érvényes ÁFA kulcsot.";
      return;
    }

    let netto, brutto, vatAmount;

    if (mode === "netto") {
      netto = amount;
      brutto = netto * (1 + vat / 100);
      vatAmount = brutto - netto;

      renderResult([
        ["Nettó", `${format(netto)} Ft`],
        [`ÁFA (${vat}%)`, `${format(vatAmount)} Ft`],
        ["Bruttó", `${format(brutto)} Ft`],
      ]);
    } else {
      brutto = amount;
      netto = brutto / (1 + vat / 100);
      vatAmount = brutto - netto;

      renderResult([
        ["Bruttó", `${format(brutto)} Ft`],
        [`ÁFA (${vat}%)`, `${format(vatAmount)} Ft`],
        ["Nettó", `${format(netto)} Ft`],
      ]);
    }

    // CTA megjelenítés (ha van)
    if (typeof showLinks === "function") {
      showLinks();
    }
  }

  // =========================
  // EVENTEK
  // =========================
  // 2027-es lakóingatlan-forgatókönyvek: kizárólag választott kulcsot állítunk,
  // a jogszabályi jogosultságot nem vélelmezzük.
  const housingScenario = document.getElementById("housingVatScenario2027");
  const housingNote = document.getElementById("housingVatScenarioNote2027");
  if (housingScenario) {
    const descriptions = {
      manual: "A kiválasztott lehetőség számítási forgatókönyv, nem automatikus jogosultságvizsgálat. Az alkalmazandó kulcsot a konkrét ügylet és a hatályos jogszabály alapján ellenőrizni kell.",
      "housing-standard": "27%-os számítás: amikor az adott ügyletre nem alkalmazható az 5%-os kedvezmény.",
      "housing-transition": "5%-os átmeneti számítás: csak akkor válaszd, ha az adott ügylet a jogszabályi átmeneti feltételeknek megfelel.",
      "housing-rust": "5%-os rozsdaövezeti számítás: csak jogszabály szerint jogosult, kijelölt területet és ügyletet érintő esetben."
    };
    housingScenario.addEventListener("change", () => {
      const scenario = housingScenario.value;
      if (scenario !== "manual") vatInput.value = scenario === "housing-standard" ? "27" : "5";
      if (housingNote) housingNote.textContent = descriptions[scenario] || descriptions.manual;
      calculate();
    });
    vatInput.addEventListener("input", () => {
      if (housingScenario.value !== "manual") {
        housingScenario.value = "manual";
        if (housingNote) housingNote.textContent = descriptions.manual;
      }
    });
    document.querySelectorAll("[data-vat-value]").forEach((button) => {
      button.addEventListener("click", () => {
        housingScenario.value = "manual";
        if (housingNote) housingNote.textContent = descriptions.manual;
      });
    });
  }

  amountInput.addEventListener("input", calculate);
  vatInput.addEventListener("input", calculate);

  document.querySelectorAll("[data-vat-value]").forEach((button) => {
    button.addEventListener("click", () => {
      vatInput.value = button.dataset.vatValue;
      calculate();
    });
  });

  document
    .querySelectorAll('input[name="mode"]')
    .forEach((el) => el.addEventListener("change", calculate));

  document.addEventListener("DOMContentLoaded", calculate);
})();
