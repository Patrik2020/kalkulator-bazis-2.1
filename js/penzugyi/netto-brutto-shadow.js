(() => {
  "use strict";

  const API_BASE = "https://kalkulator-bazis-api-dev.onrender.com";
  const TIMEOUT_MS = 6000;
  const DEBOUNCE_MS = 300;

  let timer = null;
  let sequence = 0;
  let activeController = null;

  const resultNet = document.getElementById("result-net");
  const resultGross = document.getElementById("result-gross");
  const resultSzja = document.getElementById("result-szja");
  const resultTb = document.getElementById("result-tb");
  const resultFamily = document.getElementById("result-family");
  const resultMarried = document.getElementById("result-married");
  const resultUnder25 = document.getElementById("result-under25");
  const resultEmployer = document.getElementById("result-employer");
  const resultDiff = document.getElementById("result-diff");

  function format(value) {
    return new Intl.NumberFormat("hu-HU").format(Math.round(Number(value) || 0));
  }

  function parseAmount(value) {
    const digits = String(value || "").replace(/[^0-9]/g, "");
    const parsed = Number.parseInt(digits, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function familyPayload(children) {
    const count = Math.max(0, Math.floor(Number(children) || 0));
    if (count === 0) return undefined;
    return {
      dependants: count,
      eligibleDependants: count,
      disabledEligibleDependants: 0,
      claimPercent: 100,
    };
  }

  function currentJob() {
    const direction = document.querySelector("input[name='calc-type']:checked")?.value || "gross-to-net";
    const amountElement = direction === "gross-to-net"
      ? document.getElementById("gross")
      : document.getElementById("net-input");
    const amount = parseAmount(amountElement?.value);
    if (amount <= 0) return null;

    const children = Number.parseInt(document.getElementById("family")?.value, 10) || 0;
    const common = {
      under25: Boolean(document.getElementById("under25")?.checked),
      firstMarried: Boolean(document.getElementById("first-married")?.checked),
      motherBenefit: "none",
      personalAllowance: false,
    };
    const family = familyPayload(children);
    if (family) common.family = family;

    return {
      direction,
      amount,
      children,
      payload: direction === "gross-to-net"
        ? { gross: amount, ...common }
        : { desiredNet: amount, ...common },
    };
  }

  function renderApiResult(job, data) {
    if (!data || !data.taxes || !data.benefits || !data.employer) return false;

    resultNet.textContent = `${format(job.direction === "gross-to-net" ? data.net : data.gross)} Ft`;
    resultGross.textContent = job.direction === "gross-to-net"
      ? `Bruttó fizetés: ${format(data.gross)} Ft`
      : `Becsült nettó: ${format(data.net)} Ft (cél: ${format(job.amount)} Ft)`;
    resultSzja.textContent = `Fizetendő SZJA: ${format(data.taxes.szja)} Ft`;
    resultTb.textContent = `Fizetendő TB-járulék: ${format(data.taxes.tb)} Ft`;

    const family = data.benefits.family;
    resultFamily.textContent = job.children > 0
      ? `Felhasznált családi kedvezmény: ${format(family.used)} Ft`
      : "";
    resultMarried.textContent = document.getElementById("first-married")?.checked
      ? `Felhasznált első házas kedvezmény: ${format(data.benefits.firstMarriedSaving)} Ft`
      : "";
    resultUnder25.textContent = document.getElementById("under25")?.checked
      ? `25 év alatti kedvezményből felhasználva: ${format(data.benefits.under25Saving)} Ft`
      : "";
    resultEmployer.textContent = `Becsült teljes munkáltatói költség: ${format(data.employer.totalCost)} Ft`;

    const notes = Array.isArray(data.warnings) ? [...data.warnings] : [];
    if (family?.unusedTaxEffect > 0) {
      notes.push(`A megadott bérből a családi kedvezmény ${format(family.unusedTaxEffect)} Ft-os része nem használható ki ebben a modellben.`);
    }
    if (document.getElementById("under25")?.checked && document.getElementById("first-married")?.checked) {
      notes.push("A 25 év alatti és az első házas kedvezmény együttes jogosultsága az egyéni körülményektől is függ.");
    }
    resultDiff.textContent = [...new Set(notes)].join(" ");
    return true;
  }

  function endpoint(direction) {
    return `${API_BASE}/api/v1/calculators/salary/${direction}`;
  }

  async function run(job, jobSequence) {
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(endpoint(job.direction), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(job.payload),
        signal: controller.signal,
        credentials: "omit",
        cache: "no-store",
      });

      if (jobSequence !== sequence || !response.ok) return;
      const payload = await response.json();
      if (jobSequence !== sequence) return;

      if (renderApiResult(job, payload?.data)) {
        window.dispatchEvent(new CustomEvent("kb:salary-api", {
          detail: { status: "success", direction: job.direction, ruleset: payload?.data?.ruleset || null },
        }));
      }
    } catch {
      // A helyi kalkuláció már megjelent, ezért API-hiba vagy timeout esetén
      // nincs felhasználói hibaállapot: a böngészőben futó számítás marad látható.
    } finally {
      window.clearTimeout(timeout);
      if (activeController === controller) activeController = null;
    }
  }

  function cancel() {
    sequence += 1;
    window.clearTimeout(timer);
    activeController?.abort();
    activeController = null;
  }

  function scheduleFromUi() {
    const job = currentJob();
    if (!job) return cancel();

    sequence += 1;
    const jobSequence = sequence;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => run(job, jobSequence), DEBOUNCE_MS);
  }

  ["gross", "net-input", "under25", "first-married", "family"].forEach((id) => {
    const element = document.getElementById(id);
    element?.addEventListener("input", scheduleFromUi);
    element?.addEventListener("change", scheduleFromUi);
  });

  document.querySelectorAll("input[name='calc-type']").forEach((radio) => {
    radio.addEventListener("change", scheduleFromUi);
  });

  window.KBSalaryApi = Object.freeze({ scheduleFromUi, cancel });
  scheduleFromUi();
})();
