(() => {
  "use strict";

  const STORAGE_KEY = "kb-decision-summaries-v1";
  const MAX_SAVED = 10;
  const money = new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
  });
  const number = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 1 });

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const numeric = (form, name, fallback = 0) => {
    const field = form.elements[name];
    const value = field?.matches?.("[data-grouped-number]")
      ? Number(String(field.value).replace(/[^\d-]/g, ""))
      : Number(field?.value);
    return Number.isFinite(value) ? value : fallback;
  };

  const positive = (value) => Math.max(0, Number(value) || 0);
  const percent = (value) => `${number.format(value)}%`;

  const annuityPayment = (principal, annualRate, years) => {
    const months = Math.max(1, Math.round(years * 12));
    if (principal <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    if (Math.abs(monthlyRate) < 1e-12) return principal / months;
    return (
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const readInputs = (form) => ({
    price: positive(numeric(form, "price")),
    totalSavings: positive(numeric(form, "totalSavings")),
    ownFunds: positive(numeric(form, "ownFunds")),
    purchaseCosts: positive(numeric(form, "purchaseCosts")),
    income: positive(numeric(form, "income")),
    existingDebt: positive(numeric(form, "existingDebt")),
    livingCosts: positive(numeric(form, "livingCosts")),
    rate: positive(numeric(form, "rate")),
    years: positive(numeric(form, "years")),
  });

  const scenario = (inputs, overrides = {}) => {
    const data = { ...inputs, ...overrides };
    const loan = Math.max(0, data.price - data.ownFunds);
    const payment = annuityPayment(loan, data.rate, data.years);
    const totalRepayment = payment * data.years * 12;
    const monthlyOutflow = data.livingCosts + data.existingDebt + payment;
    const monthlyFree = data.income - monthlyOutflow;
    const debtRatio = data.income > 0 ? ((data.existingDebt + payment) / data.income) * 100 : 0;
    return {
      ...data,
      loan,
      payment,
      totalRepayment,
      monthlyOutflow,
      monthlyFree,
      debtRatio,
    };
  };

  const gradeDecision = ({ base, reserveMonths, cashGap, stress }) => {
    const freeRatio = base.income > 0 ? base.monthlyFree / base.income : -1;
    if (cashGap > 0 || base.monthlyFree < 0 || base.debtRatio > 50 || reserveMonths < 1) {
      return {
        key: "risk",
        label: "Kockázatosabb",
        text: "A megadott keretek között kevés a havi vagy készpénzes mozgástér. A vásárlás előtt érdemes az önerőt, a vételárat vagy a havi terheket újratervezni.",
      };
    }
    if (
      base.debtRatio <= 35 &&
      freeRatio >= 0.2 &&
      reserveMonths >= 6 &&
      stress.debtRatio <= 45
    ) {
      return {
        key: "comfortable",
        label: "Kényelmesebb",
        text: "A megadott adatok alapján marad havi mozgástér és érdemi tartalék is. A kamatstressz mellett is kezelhetőbbnek látszik a terv.",
      };
    }
    return {
      key: "tight",
      label: "Feszes",
      text: "A terv működhet, de a havi keret vagy a tartalék már érzékenyebb. Érdemes külön megnézni a magasabb kamat és a nagyobb önerő hatását.",
    };
  };

  const evaluateHomeDecisionV2 = (inputs) => {
    const base = scenario(inputs);
    const reserveAfter = inputs.totalSavings - inputs.ownFunds - inputs.purchaseCosts;
    const cashGap = Math.max(0, -reserveAfter);
    const usableReserve = Math.max(0, reserveAfter);
    const reserveMonths = base.monthlyOutflow > 0 ? usableReserve / base.monthlyOutflow : 0;
    const ownRatio = inputs.price > 0 ? (Math.min(inputs.ownFunds, inputs.price) / inputs.price) * 100 : 0;
    const financingCost = Math.max(0, base.totalRepayment - base.loan);

    const rateStress = scenario(inputs, { rate: inputs.rate + 2 });
    const shorterYears = inputs.years > 6 ? Math.max(5, inputs.years - 5) : inputs.years;
    const shorter = scenario(inputs, { years: shorterYears });
    const extraOwnAmount = Math.max(0, Math.min(inputs.price * 0.05, usableReserve));
    const extraOwn = scenario(inputs, { ownFunds: Math.min(inputs.price, inputs.ownFunds + extraOwnAmount) });

    const grade = gradeDecision({ base, reserveMonths, cashGap, stress: rateStress });
    const factors = [
      {
        label: "Kamat +2 százalékpont",
        delta: rateStress.payment - base.payment,
        text: `${money.format(rateStress.payment - base.payment)} havi változás`,
      },
      {
        label: shorterYears === inputs.years ? "Rövidebb futamidő" : `${shorterYears} éves futamidő`,
        delta: shorter.payment - base.payment,
        text: `${money.format(shorter.payment - base.payment)} havi változás`,
      },
      {
        label: extraOwnAmount > 0 ? `Önerő +${money.format(extraOwnAmount)}` : "Több önerő",
        delta: extraOwn.payment - base.payment,
        text: extraOwnAmount > 0
          ? `${money.format(extraOwn.payment - base.payment)} havi változás`
          : "A megadott megtakarításból most nincs plusz önerőre szabad tartalék.",
      },
    ].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    return {
      inputs,
      base,
      reserveAfter,
      cashGap,
      reserveMonths,
      ownRatio,
      financingCost,
      rateStress,
      shorter,
      shorterYears,
      extraOwn,
      extraOwnAmount,
      grade,
      factors,
    };
  };

  const validate = (inputs) => {
    const errors = [];
    if (inputs.price <= 0) errors.push("Adj meg pozitív ingatlanárat.");
    if (inputs.income <= 0) errors.push("Adj meg pozitív havi nettó háztartási jövedelmet.");
    if (inputs.years <= 0 || inputs.years > 40) errors.push("A futamidő 1 és 40 év közé essen.");
    if (inputs.ownFunds > inputs.price) errors.push("A vásárlásra szánt saját forrás nem lehet nagyobb az ingatlan áránál.");
    if (inputs.ownFunds > inputs.totalSavings) errors.push("A vásárlásra szánt saját forrás nem lehet nagyobb az összes rendelkezésre álló megtakarításnál.");
    return errors;
  };

  const metric = (label, value, note = "") => `
    <div class="home-v2-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${note ? `<small>${escapeHtml(note)}</small>` : ""}
    </div>`;

  const scenarioRow = (label, data, note = "") => `
    <tr>
      <th scope="row">${escapeHtml(label)}${note ? `<small>${escapeHtml(note)}</small>` : ""}</th>
      <td>${escapeHtml(money.format(data.payment))}</td>
      <td>${escapeHtml(money.format(data.monthlyFree))}</td>
      <td>${escapeHtml(percent(data.debtRatio))}</td>
      <td>${escapeHtml(money.format(data.totalRepayment))}</td>
    </tr>`;

  const resultMarkup = (result) => {
    const reserveText = result.cashGap > 0
      ? `Hiány: ${money.format(result.cashGap)}`
      : money.format(result.reserveAfter);
    const reserveNote = result.cashGap > 0
      ? "Az önerő + egyszeri költségek meghaladják a megadott megtakarítást."
      : `${number.format(result.reserveMonths)} hónapnyi teljes havi kiadás`;

    return `
      <div class="home-v2-result" data-grade="${result.grade.key}">
        <div class="home-v2-result-head">
          <div>
            <span class="section-label">Lakásvásárlási döntési mód v2</span>
            <h3>Megengedhetem magamnak ezt a lakást?</h3>
          </div>
          <span class="home-v2-grade">${escapeHtml(result.grade.label)}</span>
        </div>

        <p class="home-v2-grade-copy">${escapeHtml(result.grade.text)}</p>

        <div class="home-v2-metrics">
          ${metric("Szükséges hitel", money.format(result.base.loan))}
          ${metric("Becsült havi törlesztő", money.format(result.base.payment))}
          ${metric("Havi szabad keret", money.format(result.base.monthlyFree), "megélhetés + meglévő hitelek + új törlesztő után")}
          ${metric("Teljes havi hitelteher aránya", percent(result.base.debtRatio), "meglévő + új hiteltörlesztés / nettó jövedelem")}
          ${metric("Vásárlás után maradó tartalék", reserveText, reserveNote)}
          ${metric("Saját forrás aránya", percent(result.ownRatio))}
          ${metric("Becsült teljes visszafizetés", money.format(result.base.totalRepayment))}
          ${metric("Becsült finanszírozási többlet", money.format(result.financingCost), "tőke feletti összeg, egyszerű annuitásos becsléssel")}
        </div>

        <section class="home-v2-scenarios" aria-labelledby="homeV2ScenarioTitle">
          <div class="home-v2-section-head">
            <div>
              <span class="section-label">Mi történik, ha…?</span>
              <h4 id="homeV2ScenarioTitle">Három gyors stresszteszt</h4>
            </div>
            <p>Ugyanazt a helyzetet módosítjuk egyetlen változóval, hogy lásd, mi érzékeny a legjobban.</p>
          </div>
          <div class="home-v2-table-wrap">
            <table class="home-v2-scenario-table">
              <thead>
                <tr><th>Forgatókönyv</th><th>Havi törlesztő</th><th>Havi szabad keret</th><th>Hitelteher</th><th>Teljes visszafizetés</th></tr>
              </thead>
              <tbody>
                ${scenarioRow("Alaphelyzet", result.base)}
                ${scenarioRow(`Kamat ${number.format(result.inputs.rate + 2)}%`, result.rateStress, "+2 százalékpont")}
                ${scenarioRow(`${result.shorterYears} éves futamidő`, result.shorter, result.shorterYears === result.inputs.years ? "nincs rövidíthető 5 év" : "−5 év")}
                ${scenarioRow("Több önerő", result.extraOwn, result.extraOwnAmount > 0 ? `+${money.format(result.extraOwnAmount)}` : "nincs szabad plusz tartalék")}
              </tbody>
            </table>
          </div>
        </section>

        <section class="home-v2-factors" aria-labelledby="homeV2FactorTitle">
          <div>
            <span class="section-label">Kritikus változók</span>
            <h4 id="homeV2FactorTitle">Mi mozgatja legjobban a havi keretedet?</h4>
          </div>
          <ol>
            ${result.factors.map((factor) => `
              <li>
                <strong>${escapeHtml(factor.label)}</strong>
                <span>${escapeHtml(factor.text)}</span>
              </li>`).join("")}
          </ol>
        </section>

        <div class="home-v2-guidance">
          <strong>Fontos:</strong>
          <span>A „kényelmesebb / feszes / kockázatosabb” jelzés belső tervezési heurisztika, nem banki hitelbírálat, nem JTM- vagy HFM-megfelelőségi döntés. A járulékos költségeket te becsülöd meg, a konkrét banki ajánlat díjai és feltételei eltérhetnek.</span>
        </div>

        <div class="home-v2-actions">
          <button type="button" data-home-v2-save>Mentés ezen az eszközön</button>
          <button type="button" data-home-v2-share>Megosztás</button>
          <a href="kalkulatorok/lakas-hitel-onero-kalkulator">Önerő kalkulátor</a>
          <a href="kalkulatorok/hitelkepesseg-kalkulator">Hitelképesség</a>
          <a href="kalkulatorok/hitel-torleszto-kalkulator">Részletes törlesztő</a>
          <a href="kalkulatorok/havi-koltsegvetes-kalkulator">Havi költségvetés</a>
        </div>
        <p class="home-v2-status" data-home-v2-status role="status" aria-live="polite"></p>
      </div>`;
  };

  const safeStorageRead = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const safeStorageWrite = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_SAVED)));
      return true;
    } catch {
      return false;
    }
  };

  const buildPayload = (result) => ({
    title: "Lakásvásárlási döntési mód v2",
    metrics: [
      { label: "Szükséges hitel", value: money.format(result.base.loan) },
      { label: "Havi törlesztő", value: money.format(result.base.payment) },
      { label: "Havi szabad keret", value: money.format(result.base.monthlyFree) },
      { label: "Vásárlás után maradó tartalék", value: result.cashGap > 0 ? `Hiány: ${money.format(result.cashGap)}` : money.format(result.reserveAfter) },
    ],
    signal: `${result.grade.label}: ${result.grade.text}`,
  });

  const renderSavedResults = () => {
    qsa("[data-saved-results]").forEach((host) => {
      const items = safeStorageRead();
      if (!items.length) {
        host.innerHTML = '<p class="decision-saved-empty">Még nincs elmentett döntési vagy összehasonlítási eredmény ezen az eszközön.</p>';
        return;
      }
      host.innerHTML = items.map((item) => {
        const date = new Date(item.savedAt);
        const dateText = Number.isNaN(date.getTime())
          ? "Mentett eredmény"
          : date.toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" });
        const metrics = (item.metrics || []).slice(0, 4).map((entry) => `
          <span><strong>${escapeHtml(entry.label)}</strong>${escapeHtml(entry.value)}</span>`).join("");
        return `
          <article class="decision-saved-card">
            <div><span class="decision-saved-date">${escapeHtml(dateText)}</span><h3>${escapeHtml(item.title)}</h3></div>
            <div class="decision-saved-metrics">${metrics}</div>
            ${item.signal ? `<p>${escapeHtml(item.signal)}</p>` : ""}
            <button type="button" class="decision-saved-delete" data-saved-delete="${escapeHtml(item.id)}">Törlés</button>
          </article>`;
      }).join("");
    });
  };

  const saveResult = (result, statusNode) => {
    const payload = buildPayload(result);
    const items = safeStorageRead();
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      title: payload.title,
      metrics: payload.metrics,
      signal: payload.signal,
      source: window.location.pathname,
    };
    const ok = safeStorageWrite([entry, ...items]);
    statusNode.textContent = ok
      ? "A lakásvásárlási összefoglalót elmentettük ezen az eszközön."
      : "A böngésző nem engedte a helyi mentést.";
    if (ok) renderSavedResults();
  };

  const shareResult = async (result, statusNode) => {
    const payload = buildPayload(result);
    const text = [
      payload.title,
      "",
      ...payload.metrics.map((entry) => `${entry.label}: ${entry.value}`),
      "",
      payload.signal,
      "",
      "Kalkulátor Bázis – tájékoztató tervezési becslés",
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({ title: payload.title, text, url: window.location.href });
        statusNode.textContent = "Megosztási felület megnyitva.";
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        statusNode.textContent = "Az összefoglalót a vágólapra másoltuk.";
        return;
      }
      throw new Error("share-unavailable");
    } catch (error) {
      if (error?.name === "AbortError") return;
      statusNode.textContent = "A megosztás nem érhető el ebben a böngészőben.";
    }
  };

  const showErrors = (resultNode, errors) => {
    resultNode.hidden = false;
    resultNode.innerHTML = `
      <div class="home-v2-validation" role="alert">
        <strong>A döntési képhez még javítani kell néhány adatot:</strong>
        <ul>${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
      </div>`;
    resultNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const setup = () => {
    if (!document.body.classList.contains("decision-hub-page")) return;
    const form = qs('form[data-decision-form="home"]');
    const resultNode = qs("[data-decision-result]");
    if (!form || !resultNode || !form.matches("[data-home-decision-v2]")) return;

    let latestResult = null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const inputs = readInputs(form);
      const errors = validate(inputs);
      if (errors.length) {
        latestResult = null;
        showErrors(resultNode, errors);
        return;
      }

      latestResult = evaluateHomeDecisionV2(inputs);
      resultNode.innerHTML = resultMarkup(latestResult);
      resultNode.hidden = false;
      resultNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, true);

    resultNode.addEventListener("click", async (event) => {
      if (!latestResult) return;
      const saveButton = event.target.closest("[data-home-v2-save]");
      const shareButton = event.target.closest("[data-home-v2-share]");
      if (!saveButton && !shareButton) return;
      const statusNode = qs("[data-home-v2-status]", resultNode);
      if (!statusNode) return;
      if (saveButton) saveResult(latestResult, statusNode);
      if (shareButton) await shareResult(latestResult, statusNode);
    });
  };

  window.KB_HOME_DECISION_V2 = { evaluate: evaluateHomeDecisionV2 };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, { once: true });
  else setup();
})();
