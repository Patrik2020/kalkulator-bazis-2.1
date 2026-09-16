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
  const payloadByResult = new WeakMap();

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const parseGroupedNumber = (value) => Number(String(value ?? "").replace(/[^\d-]/g, ""));

  const numeric = (form, name, fallback = 0) => {
    const field = form.elements[name];
    const raw = field?.matches?.("[data-grouped-number]")
      ? parseGroupedNumber(field.value)
      : Number(field?.value);
    return Number.isFinite(raw) ? raw : fallback;
  };

  const positive = (value) => Math.max(0, Number(value) || 0);
  const percent = (value) => `${number.format(value)}%`;

  const setupGroupedNumberInputs = () => {
    const formatter = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 });

    qsa("[data-grouped-number]").forEach((input) => {
      const format = () => {
        const selectionStart = input.selectionStart ?? input.value.length;
        const digitsBeforeCaret = input.value.slice(0, selectionStart).replace(/\D/g, "").length;
        const digits = input.value.replace(/\D/g, "");

        input.value = digits ? formatter.format(Number(digits)) : "";

        if (document.activeElement !== input) return;
        let caret = 0;
        let seenDigits = 0;
        while (caret < input.value.length && seenDigits < digitsBeforeCaret) {
          if (/\d/.test(input.value[caret])) seenDigits += 1;
          caret += 1;
        }
        input.setSelectionRange(caret, caret);
      };

      input.addEventListener("input", format);
      input.addEventListener("blur", format);
      format();
    });
  };

  const futureValue = (initial, monthly, annualReturn, years) => {
    const months = Math.max(0, Math.round(years * 12));
    const monthlyRate = annualReturn / 100 / 12;
    if (!months) return initial;
    if (Math.abs(monthlyRate) < 1e-12) return initial + monthly * months;
    return (
      initial * Math.pow(1 + monthlyRate, months) +
      monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    );
  };

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

  const buildShareText = (payload) => {
    const lines = [payload.title, ""];
    payload.metrics.forEach((item) => lines.push(`${item.label}: ${item.value}`));
    if (payload.signal) lines.push("", payload.signal);
    lines.push("", "Kalkulátor Bázis – tájékoztató becslés");
    return lines.join("\n");
  };

  const sharePayload = async (payload, statusNode) => {
    const text = buildShareText(payload);
    try {
      if (navigator.share) {
        await navigator.share({ title: payload.title, text, url: window.location.href });
        if (statusNode) statusNode.textContent = "Megosztási felület megnyitva.";
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        if (statusNode) statusNode.textContent = "Az összefoglalót a vágólapra másoltuk.";
        return;
      }
      throw new Error("share-unavailable");
    } catch (error) {
      if (error?.name === "AbortError") return;
      if (statusNode) statusNode.textContent = "A megosztás nem érhető el ebben a böngészőben.";
    }
  };

  const savePayload = (payload, statusNode) => {
    const items = safeStorageRead();
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      title: payload.title,
      metrics: payload.metrics,
      signal: payload.signal || "",
      source: window.location.pathname,
    };
    const ok = safeStorageWrite([entry, ...items]);
    if (statusNode) {
      statusNode.textContent = ok
        ? "Összefoglaló elmentve ezen az eszközön."
        : "A böngésző nem engedte a helyi mentést.";
    }
    renderSavedResults();
  };

  const renderSavedResults = () => {
    qsa("[data-saved-results]").forEach((host) => {
      const items = safeStorageRead();
      if (!items.length) {
        host.innerHTML = '<p class="decision-saved-empty">Még nincs elmentett döntési vagy összehasonlítási eredmény ezen az eszközön.</p>';
        return;
      }

      host.innerHTML = items
        .map((item) => {
          const date = new Date(item.savedAt);
          const dateText = Number.isNaN(date.getTime())
            ? "Mentett eredmény"
            : date.toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" });
          const metrics = (item.metrics || [])
            .slice(0, 4)
            .map((metric) => `<span><strong>${metric.label}</strong>${metric.value}</span>`)
            .join("");
          return `
            <article class="decision-saved-card">
              <div>
                <span class="decision-saved-date">${dateText}</span>
                <h3>${item.title}</h3>
              </div>
              <div class="decision-saved-metrics">${metrics}</div>
              ${item.signal ? `<p>${item.signal}</p>` : ""}
              <button type="button" class="decision-saved-delete" data-saved-delete="${item.id}">Törlés</button>
            </article>`;
        })
        .join("");
    });
  };

  const resultMarkup = (payload) => {
    const metrics = payload.metrics
      .map(
        (metric) => `
          <div class="decision-result-metric">
            <span>${metric.label}</span>
            <strong>${metric.value}</strong>
            ${metric.note ? `<small>${metric.note}</small>` : ""}
          </div>`
      )
      .join("");

    return `
      <div class="decision-result-head">
        <div>
          <span class="section-label">Döntési összefoglaló</span>
          <h3>${payload.title}</h3>
        </div>
        ${payload.badge ? `<span class="decision-result-badge">${payload.badge}</span>` : ""}
      </div>
      <div class="decision-result-grid">${metrics}</div>
      ${payload.signal ? `<p class="decision-result-signal">${payload.signal}</p>` : ""}
      ${payload.note ? `<p class="decision-result-note">${payload.note}</p>` : ""}
      <div class="decision-result-actions">
        <button type="button" data-result-save>Mentés ezen az eszközön</button>
        <button type="button" data-result-share>Megosztás</button>
        ${payload.link ? `<a href="${payload.link.href}">${payload.link.label}</a>` : ""}
      </div>
      <p class="decision-result-status" data-result-status role="status" aria-live="polite"></p>`;
  };

  const renderResult = (resultNode, payload) => {
    if (!resultNode) return;
    resultNode.innerHTML = resultMarkup(payload);
    resultNode.hidden = false;
    payloadByResult.set(resultNode, payload);
    resultNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const decisionSavings = (form) => {
    const initial = positive(numeric(form, "initial"));
    const monthly = positive(numeric(form, "monthly"));
    const years = positive(numeric(form, "years"));
    const annualReturn = numeric(form, "annualReturn");
    const inflation = numeric(form, "inflation");
    const nominal = futureValue(initial, monthly, annualReturn, years);
    const contributed = initial + monthly * years * 12;
    const growth = nominal - contributed;
    const real = inflation > -100 ? nominal / Math.pow(1 + inflation / 100, years) : nominal;

    return {
      title: `${number.format(years)} éves megtakarítási terv`,
      badge: "Megtakarítás",
      metrics: [
        { label: "Becsült végösszeg", value: money.format(nominal) },
        { label: "Saját befizetés", value: money.format(contributed) },
        { label: "Becsült hozamrész", value: money.format(growth) },
        { label: "Mai pénzen", value: money.format(real), note: `${percent(inflation)} éves inflációs feltételezéssel` },
      ],
      signal:
        growth > contributed * 0.5
          ? "A hosszú időtáv miatt a feltételezett hozam már a végeredmény jelentős részét adja. A hozamfeltételezés kis változása is nagy eltérést okozhat."
          : "Ebben az időtávban még főleg a saját befizetésed mozgatja a végeredményt; a havi összeg emelése erős hatású változó.",
      note: "Ez nem hozamígéret. A számítás állandó éves hozammal és inflációval készült, költségek és adózás nélkül.",
      link: { href: "kalkulatorok/etf-kalkulator", label: "Részletes ETF kalkulátor →" },
    };
  };

  const decisionCar = (form) => {
    const annualKm = positive(numeric(form, "annualKm"));
    const consumption = positive(numeric(form, "consumption"));
    const fuelPrice = positive(numeric(form, "fuelPrice"));
    const fixed = positive(numeric(form, "fixed"));
    const depreciation = positive(numeric(form, "depreciation"));
    const fuel = (annualKm / 100) * consumption * fuelPrice;
    const annual = fuel + fixed + depreciation;
    const monthly = annual / 12;
    const perKm = annualKm > 0 ? annual / annualKm : 0;

    return {
      title: "Autó éves valós költségképe",
      badge: "Autó",
      metrics: [
        { label: "Üzemanyag / év", value: money.format(fuel) },
        { label: "Teljes éves költség", value: money.format(annual) },
        { label: "Havi átlag", value: money.format(monthly) },
        { label: "Költség kilométerenként", value: `${number.format(perKm)} Ft/km` },
      ],
      signal:
        depreciation > fuel
          ? "A megadott adatok alapján az értékvesztés nagyobb tétel, mint az éves üzemanyag. Autócserénél ezért a fogyasztáskülönbség önmagában félrevezető lehet."
          : "A megadott használat mellett az üzemanyag az egyik legerősebb költségtényező; fogyasztás- vagy üzemanyagár-változás érezhetően módosítja az éves összeget.",
      note: "A becslés csak a megadott költségekkel számol; finanszírozás, parkolás, váratlan javítás és egyéb egyedi tételek külön kezelendők.",
      link: { href: "kalkulatorok/eves-auto-koltseg-kalkulator", label: "Részletes autóköltség kalkulátor →" },
    };
  };

  const decisionHome = (form) => {
    const price = positive(numeric(form, "price"));
    const ownFunds = positive(numeric(form, "ownFunds"));
    const rate = positive(numeric(form, "rate"));
    const years = positive(numeric(form, "years"));
    const income = positive(numeric(form, "income"));
    const loan = Math.max(0, price - ownFunds);
    const payment = annuityPayment(loan, rate, years);
    const total = payment * years * 12;
    const ownRatio = price > 0 ? (Math.min(ownFunds, price) / price) * 100 : 0;
    const incomeRatio = income > 0 ? (payment / income) * 100 : 0;
    let signal = "Adj meg nettó havi jövedelmet is, hogy a törlesztő arányát meg tudjuk mutatni.";

    if (income > 0) {
      if (incomeRatio <= 30) {
        signal = `A becsült törlesztő a megadott nettó jövedelem kb. ${percent(incomeRatio)}-a. Tervezési szinten ez több mozgásteret hagyhat más kiadásoknak.`;
      } else if (incomeRatio <= 40) {
        signal = `A becsült törlesztő a megadott nettó jövedelem kb. ${percent(incomeRatio)}-a. Ez már feszesebb havi keretet jelezhet, ezért érdemes vésztartalékkal is számolni.`;
      } else {
        signal = `A becsült törlesztő a megadott nettó jövedelem kb. ${percent(incomeRatio)}-a. Ez magas arány, ezért különösen fontos a teljes háztartási költségvetés vizsgálata.`;
      }
    }

    return {
      title: "Lakásvásárlási gyorskép",
      badge: "Lakás",
      metrics: [
        { label: "Szükséges hitel", value: money.format(loan) },
        { label: "Becsült havi törlesztő", value: money.format(payment) },
        { label: "Saját forrás aránya", value: percent(ownRatio) },
        { label: "Becsült teljes visszafizetés", value: money.format(total) },
      ],
      signal,
      note: "Ez tervezési becslés, nem banki hitelbírálat vagy JTM/önerő-jogszabályi megfelelőségi vizsgálat. A konkrét ajánlat díjakat és eltérő feltételeket is tartalmazhat.",
      link: { href: "kalkulatorok/hitel-torleszto-kalkulator", label: "Részletes hitelkalkulátor →" },
    };
  };

  const decisionEvaluators = {
    savings: decisionSavings,
    car: decisionCar,
    home: decisionHome,
  };

  const comparisonLoan = (form, prefix) => {
    const principal = positive(numeric(form, `${prefix}Principal`));
    const rate = positive(numeric(form, `${prefix}Rate`));
    const years = positive(numeric(form, `${prefix}Years`));
    const monthly = annuityPayment(principal, rate, years);
    return { monthly, total: monthly * years * 12 };
  };

  const comparisonSavings = (form, prefix) => {
    const initial = positive(numeric(form, `${prefix}Initial`));
    const monthly = positive(numeric(form, `${prefix}Monthly`));
    const rate = numeric(form, `${prefix}Return`);
    const years = positive(numeric(form, `${prefix}Years`));
    return {
      final: futureValue(initial, monthly, rate, years),
      contributed: initial + monthly * years * 12,
    };
  };

  const comparisonCar = (form, prefix) => {
    const km = positive(numeric(form, `${prefix}Km`));
    const consumption = positive(numeric(form, `${prefix}Consumption`));
    const fuelPrice = positive(numeric(form, `${prefix}FuelPrice`));
    const fixed = positive(numeric(form, `${prefix}Fixed`));
    const depreciation = positive(numeric(form, `${prefix}Depreciation`));
    const fuel = (km / 100) * consumption * fuelPrice;
    return { annual: fuel + fixed + depreciation, fuel };
  };

  const comparisonJob = (form, prefix) => {
    const monthlyNet = positive(numeric(form, `${prefix}MonthlyNet`));
    const weeklyHours = positive(numeric(form, `${prefix}WeeklyHours`));
    const extras = positive(numeric(form, `${prefix}Extras`));
    const annual = (monthlyNet + extras) * 12;
    const annualHours = weeklyHours * 52;
    return { annual, hourly: annualHours > 0 ? annual / annualHours : 0 };
  };

  const compareDifferenceSignal = (labelA, valueA, labelB, valueB, unit = "Ft") => {
    const delta = valueB - valueA;
    if (Math.abs(delta) < 0.01) return `${labelA} és ${labelB} a megadott fő mutató alapján gyakorlatilag azonos.`;
    const better = delta > 0 ? labelB : labelA;
    const diff = Math.abs(delta);
    return `${better} előnye a fő mutatóban ${unit === "Ft" ? money.format(diff) : `${number.format(diff)} ${unit}`} a másik forgatókönyvhöz képest.`;
  };

  const comparisonEvaluators = {
    loan(form) {
      const a = comparisonLoan(form, "a");
      const b = comparisonLoan(form, "b");
      const monthlyDiff = Math.abs(b.monthly - a.monthly);
      const totalDiff = Math.abs(b.total - a.total);
      return {
        title: "Hitel A/B összehasonlítás",
        badge: "Hitel",
        metrics: [
          { label: "A havi törlesztő", value: money.format(a.monthly) },
          { label: "B havi törlesztő", value: money.format(b.monthly) },
          { label: "Havi eltérés", value: money.format(monthlyDiff) },
          { label: "Teljes visszafizetés eltérése", value: money.format(totalDiff) },
        ],
        signal: a.total === b.total
          ? "A két hitel teljes visszafizetése a megadott feltételekkel azonos."
          : `${a.total < b.total ? "A" : "B"} forgatókönyv becsült teljes visszafizetése alacsonyabb ${money.format(totalDiff)} összeggel.`,
        note: "Egyszerű annuitásos becslés, díjak, biztosítások és egyéb banki költségek nélkül.",
        link: { href: "kalkulatorok/hitel-torleszto-kalkulator", label: "Részletes hitelkalkulátor →" },
      };
    },
    savings(form) {
      const a = comparisonSavings(form, "a");
      const b = comparisonSavings(form, "b");
      const diff = Math.abs(b.final - a.final);
      return {
        title: "Megtakarítás A/B összehasonlítás",
        badge: "Megtakarítás",
        metrics: [
          { label: "A becsült végösszeg", value: money.format(a.final) },
          { label: "B becsült végösszeg", value: money.format(b.final) },
          { label: "Végösszeg eltérése", value: money.format(diff) },
          { label: "Saját befizetés eltérése", value: money.format(Math.abs(b.contributed - a.contributed)) },
        ],
        signal: compareDifferenceSignal("A", a.final, "B", b.final),
        note: "A számítás állandó éves hozammal dolgozik, nem hozamígéret; költségeket és adózást nem modellez.",
        link: { href: "kalkulatorok/etf-kalkulator", label: "Részletes ETF kalkulátor →" },
      };
    },
    car(form) {
      const a = comparisonCar(form, "a");
      const b = comparisonCar(form, "b");
      const diff = Math.abs(b.annual - a.annual);
      return {
        title: "Autó A/B összehasonlítás",
        badge: "Autó",
        metrics: [
          { label: "A éves költség", value: money.format(a.annual) },
          { label: "B éves költség", value: money.format(b.annual) },
          { label: "Éves eltérés", value: money.format(diff) },
          { label: "Havi eltérés", value: money.format(diff / 12) },
        ],
        signal: a.annual === b.annual
          ? "A két autó becsült éves költsége azonos."
          : `${a.annual < b.annual ? "A" : "B"} forgatókönyv becsült éves költsége alacsonyabb ${money.format(diff)} összeggel.`,
        note: "A modell csak a megadott üzemanyag-, fix és értékvesztési költségeket hasonlítja össze.",
        link: { href: "kalkulatorok/eves-auto-koltseg-kalkulator", label: "Részletes autóköltség kalkulátor →" },
      };
    },
    job(form) {
      const a = comparisonJob(form, "a");
      const b = comparisonJob(form, "b");
      const annualDiff = Math.abs(b.annual - a.annual);
      const hourlyDiff = Math.abs(b.hourly - a.hourly);
      return {
        title: "Állásajánlat A/B összehasonlítás",
        badge: "Munka",
        metrics: [
          { label: "A éves nettó", value: money.format(a.annual) },
          { label: "B éves nettó", value: money.format(b.annual) },
          { label: "Éves nettó eltérés", value: money.format(annualDiff) },
          { label: "Effektív órabér eltérése", value: `${number.format(hourlyDiff)} Ft/óra` },
        ],
        signal:
          a.hourly === b.hourly
            ? "A két ajánlat effektív nettó órabére a megadott adatokkal azonos."
            : `${a.hourly > b.hourly ? "A" : "B"} ajánlat effektív nettó órabére magasabb ${number.format(hourlyDiff)} Ft/órával.`,
        note: "Itt már nettó havi összegeket hasonlítunk, ezért adó- és kedvezményszabályokat ez a gyors A/B mód nem számol újra.",
        link: { href: "kalkulatorok/netto-brutto-kalkulator", label: "Nettó–bruttó kalkulátor →" },
      };
    },
  };

  const setupSwitcher = (buttonSelector, panelSelector, attribute) => {
    const buttons = qsa(buttonSelector);
    const panels = qsa(panelSelector);
    if (!buttons.length || !panels.length) return;

    const activate = (value) => {
      buttons.forEach((button) => {
        const active = button.dataset[attribute] === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset[attribute] !== value;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => activate(button.dataset[attribute]));
    });

    activate(buttons[0].dataset[attribute]);
  };

  const setupDecisionPage = () => {
    if (!document.body.classList.contains("decision-hub-page") || document.body.classList.contains("comparison-hub-page")) return;
    setupSwitcher("[data-decision-mode]", "[data-decision-form]", "decisionMode");

    qsa("form[data-decision-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const evaluator = decisionEvaluators[form.dataset.decisionForm];
        if (!evaluator) return;
        renderResult(qs("[data-decision-result]"), evaluator(form));
      });
    });
  };

  const setupComparisonPage = () => {
    if (!document.body.classList.contains("comparison-hub-page")) return;
    setupSwitcher("[data-comparison-mode]", "[data-comparison-form]", "comparisonMode");

    qsa("form[data-comparison-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const evaluator = comparisonEvaluators[form.dataset.comparisonForm];
        if (!evaluator) return;
        renderResult(qs("[data-comparison-result]"), evaluator(form));
      });
    });
  };

  document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-result-save]");
    const shareButton = event.target.closest("[data-result-share]");
    const deleteButton = event.target.closest("[data-saved-delete]");

    if (saveButton || shareButton) {
      const result = event.target.closest("[data-decision-result], [data-comparison-result]");
      const payload = result ? payloadByResult.get(result) : null;
      const status = result ? qs("[data-result-status]", result) : null;
      if (!payload) return;
      if (saveButton) savePayload(payload, status);
      if (shareButton) sharePayload(payload, status);
      return;
    }

    if (deleteButton) {
      const id = deleteButton.dataset.savedDelete;
      const filtered = safeStorageRead().filter((item) => item.id !== id);
      safeStorageWrite(filtered);
      renderSavedResults();
    }
  });

  setupGroupedNumberInputs();
  setupDecisionPage();
  setupComparisonPage();
  renderSavedResults();
})();
