(function (global, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) module.exports = api;
  if (!global || !global.document) return;
  if (global.KB_CALCULATOR_SUITE_LOADED) return;

  global.KB_CALCULATOR_SUITE_LOADED = true;
  global.KB_CALCULATOR_SUITE_CORE = api;
  api.init(global.document, global);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const format = (value) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 12 }).format(value)
      : "Hiba";

  const factorial = (value) => {
    if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error("factorial");
    let result = 1;
    for (let current = 2; current <= value; current += 1) result *= current;
    return result;
  };

  const evaluate = (raw, mode = "deg") => {
    if (mode !== "deg" && mode !== "rad") throw new Error("mode");

    let expression = String(raw || "")
      .replace(/,/g, ".")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/π/g, "pi")
      .replace(/√/g, "sqrt")
      .replace(/\^/g, "**");

    if (/!!/.test(expression)) throw new Error("factorial");
    while (/(\d+(?:\.\d+)?|\([^()]+\))!/.test(expression)) {
      expression = expression.replace(/(\d+(?:\.\d+)?|\([^()]+\))!/g, "factorial($1)");
    }

    const angle = (value) => (mode === "deg" ? (value * Math.PI) / 180 : value);
    const replacements = {
      sin: "SIN",
      cos: "COS",
      tan: "TAN",
      asin: "ASIN",
      acos: "ACOS",
      atan: "ATAN",
      sqrt: "SQRT",
      log: "LOG",
      ln: "LN",
      abs: "ABS",
      factorial: "FACT",
      pi: "PI",
      e: "E",
    };

    Object.entries(replacements).forEach(([token, safeToken]) => {
      expression = expression.replace(new RegExp(`\\b${token}\\b`, "gi"), safeToken);
    });

    const allowed = /^(?:[0-9+\-*/().\s]|\*\*|SIN|COS|TAN|ASIN|ACOS|ATAN|SQRT|LOG|LN|ABS|FACT|PI|E)+$/;
    if (!allowed.test(expression)) throw new Error("invalid");

    const calculate = Function(
      "SIN",
      "COS",
      "TAN",
      "ASIN",
      "ACOS",
      "ATAN",
      "SQRT",
      "LOG",
      "LN",
      "ABS",
      "FACT",
      "PI",
      "E",
      `"use strict";return (${expression});`
    );

    const result = calculate(
      (value) => Math.sin(angle(value)),
      (value) => Math.cos(angle(value)),
      (value) => Math.tan(angle(value)),
      (value) => (mode === "deg" ? (Math.asin(value) * 180) / Math.PI : Math.asin(value)),
      (value) => (mode === "deg" ? (Math.acos(value) * 180) / Math.PI : Math.acos(value)),
      (value) => (mode === "deg" ? (Math.atan(value) * 180) / Math.PI : Math.atan(value)),
      Math.sqrt,
      Math.log10,
      Math.log,
      Math.abs,
      factorial,
      Math.PI,
      Math.E
    );

    if (!Number.isFinite(result)) throw new Error("non-finite");
    return result;
  };

  const bindCalculator = (shell, documentRef) => {
    if (!shell || shell.dataset.bound === "true") return;

    const display = shell.querySelector("[data-calc-display]");
    if (!display) return;

    shell.dataset.bound = "true";
    const status = shell.querySelector("[data-calc-status]");
    const history = shell.closest(".scientific-layout")?.querySelector("[data-calc-history]");
    let mode = "deg";

    const announce = (message) => {
      if (status) status.textContent = message;
    };

    const addHistory = (expression, result) => {
      if (!history) return;
      const item = documentRef.createElement("li");
      item.textContent = `${expression} = ${format(result)}`;
      history.prepend(item);
      while (history.children.length > 10) history.lastElementChild.remove();
    };

    shell.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value],button[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      if (action === "clear") {
        display.value = "";
        announce("A kijelző törölve.");
      } else if (action === "backspace") {
        display.value = display.value.slice(0, -1);
        announce("Az utolsó karakter törölve.");
      } else if (action === "equals") {
        try {
          const original = display.value;
          const result = evaluate(original, mode);
          const formatted = format(result);
          display.value = formatted.replace(/\s/g, "").replace(",", ".");
          addHistory(original, result);
          announce(`Eredmény: ${formatted}`);
        } catch (error) {
          display.value = "Hiba";
          announce("A kifejezés nem számolható ki. Ellenőrizd a bevitelt és a zárójeleket.");
        }
      } else if (action === "mode") {
        mode = button.dataset.mode === "rad" ? "rad" : "deg";
        shell.querySelectorAll('[data-action="mode"]').forEach((item) => {
          const active = item.dataset.mode === mode;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        announce(mode === "deg" ? "Fok mód kiválasztva." : "Radián mód kiválasztva.");
      } else {
        if (display.value === "Hiba") display.value = "";
        display.value += button.dataset.value || "";
      }

      display.focus();
    });

    display.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        shell.querySelector('[data-action="equals"]')?.click();
      } else if (event.key === "Escape") {
        shell.querySelector('[data-action="clear"]')?.click();
      }
    });
  };

  const quickMarkup = (projectRoot) => `<section class="container quick-calculator-section" aria-labelledby="quickCalculatorTitle"><details class="quick-calculator-disclosure"><summary><span>Gyors számológép</span><small>Megnyitás</small></summary><div class="quick-calculator-card"><div class="quick-calculator-copy"><span class="section-label">Gyors számolás</span><h2 id="quickCalculatorTitle">Egyszerű számológép</h2><p>Végezd el a leggyakoribb alapműveleteket közvetlenül a főoldalon.</p><div class="calculator-note">Összetettebb művelethez, gyökvonáshoz, hatványozáshoz és trigonometriai számításokhoz <a href="${projectRoot}/kalkulatorok/multifunkcios-szamologep">nyisd meg a multifunkciós számológépet</a>.</div></div><div class="calculator-shell" data-calculator><input class="calculator-display" data-calc-display inputmode="decimal" autocomplete="off" aria-label="Számológép kijelző"><output class="visually-hidden" data-calc-status aria-live="polite" aria-atomic="true"></output><div class="calculator-keys"><button type="button" class="danger" data-action="clear">C</button><button type="button" data-action="backspace">⌫</button><button type="button" class="operator" data-value="/100">%</button><button type="button" class="operator" data-value="÷">÷</button><button type="button" data-value="7">7</button><button type="button" data-value="8">8</button><button type="button" data-value="9">9</button><button type="button" class="operator" data-value="×">×</button><button type="button" data-value="4">4</button><button type="button" data-value="5">5</button><button type="button" data-value="6">6</button><button type="button" class="operator" data-value="−">−</button><button type="button" data-value="1">1</button><button type="button" data-value="2">2</button><button type="button" data-value="3">3</button><button type="button" class="operator" data-value="+">+</button><button type="button" data-value="0">0</button><button type="button" data-value=".">,</button><button type="button" data-value="(">(</button><button type="button" class="equals" data-action="equals">=</button></div></div></div></details></section>`;

  const syncQuickCalculatorVisibility = (documentRef, windowRef) => {
    const disclosure = documentRef.querySelector(".quick-calculator-disclosure");
    if (!disclosure) return;
    if (windowRef.matchMedia("(max-width: 640px)").matches) disclosure.removeAttribute("open");
    else disclosure.setAttribute("open", "");
  };

  const init = (documentRef, windowRef) => {
    const start = () => {
      const hero = documentRef.querySelector(".home-hero");
      if (hero && !documentRef.querySelector(".quick-calculator-section")) {
        hero.insertAdjacentHTML("afterend", quickMarkup(windowRef.KB_PROJECT_ROOT || ""));
      }
      syncQuickCalculatorVisibility(documentRef, windowRef);
      documentRef.querySelectorAll("[data-calculator]").forEach((shell) => bindCalculator(shell, documentRef));
    };

    if (documentRef.readyState === "loading") documentRef.addEventListener("DOMContentLoaded", start);
    else start();
  };

  return { bindCalculator, evaluate, factorial, format, init };
});
