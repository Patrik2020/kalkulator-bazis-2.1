function formatInput(input) {
  input?.addEventListener("input", (event) => {
    const raw = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
    event.target.value = raw ? new Intl.NumberFormat("hu-HU").format(raw) : "";
  });
}

function upgradeFamilyFields() {
  const familyBox = document.querySelector(".family-box");
  const legacyInput = document.getElementById("family");
  if (!familyBox || !legacyInput) return;

  familyBox.innerHTML = `
    <div class="family-heading">Családi kedvezmény</div>
    <div class="family-fields">
      <div>
        <label for="family-dependants">Eltartottak száma</label>
        <input type="number" id="family-dependants" min="0" max="20" value="0" inputmode="numeric" />
        <small>Az eltartottak teljes száma, ez határozza meg az egy főre jutó kedvezmény mértékét.</small>
      </div>
      <div>
        <label for="family-eligible">Kedvezményezett eltartottak száma</label>
        <input type="number" id="family-eligible" min="0" max="20" value="0" inputmode="numeric" />
        <small>Azok száma, akik után a családi kedvezmény ténylegesen érvényesíthető.</small>
      </div>
    </div>
  `;
}

upgradeFamilyFields();

const grossInput = document.getElementById("gross");
const netInput = document.getElementById("net-input");
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

function clearResults() {
  resultNet.textContent = "–";
  [resultGross, resultSzja, resultTb, resultFamily, resultMarried, resultUnder25, resultEmployer, resultDiff]
    .forEach((element) => { element.textContent = ""; });
}

document.querySelectorAll("input[name='calc-type']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const type = document.querySelector("input[name='calc-type']:checked")?.value;
    const grossToNet = type === "gross-to-net";
    grossWrapper.classList.toggle("hidden", !grossToNet);
    netWrapper.classList.toggle("hidden", grossToNet);
    resultTitle.textContent = grossToNet ? "Nettó fizetés:" : "Bruttó fizetés:";
    clearResults();
  });
});

[grossInput, netInput].forEach((input) => {
  input?.addEventListener("input", () => {
    if (!String(input.value || "").trim()) clearResults();
  });
});

clearResults();

// API-only production mode: a böngésző csak a felületet kezeli.
// A nettó–bruttó üzleti számítás kizárólag a Kalkulátor Bázis API-ban fut.
const salaryApiClientScript = document.createElement("script");
salaryApiClientScript.src = "../js/penzugyi/netto-brutto-shadow.js";
salaryApiClientScript.async = true;
document.head.appendChild(salaryApiClientScript);
