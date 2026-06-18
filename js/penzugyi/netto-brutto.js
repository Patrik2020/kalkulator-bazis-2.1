function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function formatInput(input) {

  input?.addEventListener("input", (e) => {

    let raw = e.target.value
      .replace(/\s/g, "")
      .replace(/\D/g, "");

    if (!raw) {
      e.target.value = "";
      return;
    }

    e.target.value =
      new Intl.NumberFormat("hu-HU").format(raw);
  });
}

// INPUTOK
const grossInput =
  document.getElementById("gross");

const netInput =
  document.getElementById("net-input");

const under25 =
  document.getElementById("under25");

const firstMarried =
  document.getElementById("first-married");

const family =
  document.getElementById("family");

// WRAPPEREK
const grossWrapper =
  document.getElementById("gross-wrapper");

const netWrapper =
  document.getElementById("net-wrapper");

// RESULTOK
const resultTitle =
  document.getElementById("result-title");

const resultNet =
  document.getElementById("result-net");

const resultGross =
  document.getElementById("result-gross");

const resultSzja =
  document.getElementById("result-szja");

const resultTb =
  document.getElementById("result-tb");

const resultFamily =
  document.getElementById("result-family");

const resultMarried =
  document.getElementById("result-married");

const resultUnder25 =
  document.getElementById("result-under25");

const resultEmployer =
  document.getElementById("result-employer");

const resultDiff =
  document.getElementById("result-diff");

// INPUT FORMÁZÁS
formatInput(grossInput);
formatInput(netInput);

// MÓDVÁLTÁS
document.querySelectorAll("input[name='calc-type']")
  .forEach(radio => {

    radio.addEventListener("change", () => {

      const type =
        document.querySelector("input[name='calc-type']:checked").value;

      if (type === "gross-to-net") {

        grossWrapper.classList.remove("hidden");
        netWrapper.classList.add("hidden");

        resultTitle.textContent =
          "Nettó fizetés:";

      } else {

        grossWrapper.classList.add("hidden");
        netWrapper.classList.remove("hidden");

        resultTitle.textContent =
          "Bruttó fizetés:";
      }

      calc();
    });

  });

// CSALÁDI KEDVEZMÉNY
function getFamilyDiscount(children) {

  children = parseInt(children) || 0;

  // 1 gyerek
  if (children === 1) {
    return 20000;
  }

  // 2 gyerek
  if (children === 2) {
    return 80000;
  }

  // 3 vagy több
  if (children >= 3) {
    return children * 66000;
  }

  return 0;
}

// EREDMÉNYEK TÖRLÉSE
function clearResults() {

  resultNet.textContent = "–";

  resultGross.textContent = "";

  resultSzja.textContent = "";

  resultTb.textContent = "";

  resultFamily.textContent = "";

  resultMarried.textContent = "";

  resultUnder25.textContent = "";

  resultEmployer.textContent = "";

  resultDiff.textContent = "";
}

// SZÁMOLÁS
function calc() {

  const type =
    document.querySelector("input[name='calc-type']:checked").value;

  const mode =
    document.querySelector("input[name='mode']:checked").value;

  // SZJA
  let szjaRate =
    mode === "current"
      ? 0.15
      : 0.09;

  // 25 év alatti
  if (under25.checked) {
    szjaRate = 0;
  }

  const tbRate = 0.185;

  const familyDiscount =
    getFamilyDiscount(family.value);

  const marriedDiscount =
    firstMarried.checked
      ? 5000
      : 0;

  // BRUTTÓ -> NETTÓ
  if (type === "gross-to-net") {

    const gross =
      parseNumber(grossInput.value);

    if (!gross) {

      clearResults();

      return;
    }

    let szja =
  gross * szjaRate;

szja -= marriedDiscount;

if (szja < 0) {
  szja = 0;
}

    const tb =
      gross * tbRate;

    const net =
  gross - szja - tb + familyDiscount;

    const employerCost =
      gross * 1.13;

    // KIÍRÁS
    resultNet.textContent =
      format(net) + " Ft";

    resultGross.textContent =
      "Bruttó fizetés: " +
      format(gross) + " Ft";

    resultSzja.textContent =
      "SZJA: " +
      format(szja) + " Ft";

    resultTb.textContent =
      "TB járulék: " +
      format(tb) + " Ft";

    resultFamily.textContent =
      familyDiscount > 0
        ? "Családi kedvezmény: +" +
          format(familyDiscount) + " Ft"
        : "";

    resultMarried.textContent =
      firstMarried.checked
        ? "Első házas kedvezmény: +5 000 Ft"
        : "";

    resultUnder25.textContent =
      under25.checked
        ? "25 év alatti SZJA kedvezmény aktív"
        : "";

    resultEmployer.textContent =
      "Teljes munkáltatói költség: " +
      format(employerCost) + " Ft";
  }

  // NETTÓ -> BRUTTÓ
  else {

    const desiredNet =
      parseNumber(netInput.value);

    if (!desiredNet) {

      clearResults();

      return;
    }

    const totalRate =
      1 - szjaRate - tbRate;

    let gross =
      desiredNet / totalRate;

    let szja =
  gross * szjaRate;

szja -= marriedDiscount;

if (szja < 0) {
  szja = 0;
}

    const tb =
      gross * tbRate;

    const correctedNet =
  gross - szja - tb + familyDiscount;

    const employerCost =
      gross * 1.13;

    // KIÍRÁS
    resultNet.textContent =
      format(gross) + " Ft";

    resultGross.textContent =
      "Becsült nettó: " +
      format(correctedNet) + " Ft";

    resultSzja.textContent =
      "SZJA: " +
      format(szja) + " Ft";

    resultTb.textContent =
      "TB járulék: " +
      format(tb) + " Ft";

    resultFamily.textContent =
      familyDiscount > 0
        ? "Családi kedvezmény: +" +
          format(familyDiscount) + " Ft"
        : "";

    resultMarried.textContent =
      firstMarried.checked
        ? "Első házas kedvezmény: +5 000 Ft"
        : "";

    resultUnder25.textContent =
      under25.checked
        ? "25 év alatti SZJA kedvezmény aktív"
        : "";

    resultEmployer.textContent =
      "Teljes munkáltatói költség: " +
      format(employerCost) + " Ft";
  }

  // ALTERNATÍV MÓD
  if (mode === "alt") {

    resultDiff.textContent =
      "Alternatív 9%-os SZJA modell alapján számolva.";

  } else {

    resultDiff.textContent = "";
  }
}

// AUTO SZÁMOLÁS
[
  grossInput,
  netInput,
  under25,
  firstMarried,
  family
].forEach(input => {

  input?.addEventListener("input", calc);

  input?.addEventListener("change", calc);

});

document.querySelectorAll("input[name='mode']")
  .forEach(radio => {

    radio.addEventListener("change", calc);

  });

// INDÍTÁS
calc();