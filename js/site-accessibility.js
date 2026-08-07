(() => {
  "use strict";

  const resultSelectors = [
    ".result-box",
    ".everyday-result",
    ".ac-result",
    ".construction-results",
    ".priority-results",
  ].join(",");

  const setResultSemantics = (element) => {
    if (!(element instanceof Element) || !element.matches(resultSelectors)) return;
    if (!element.hasAttribute("role")) element.setAttribute("role", "status");
    if (!element.hasAttribute("aria-live")) element.setAttribute("aria-live", "polite");
    if (!element.hasAttribute("aria-atomic")) {
      const isComplex = element.matches(".etf-result, .dividend-result, .priority-results");
      element.setAttribute("aria-atomic", isComplex ? "false" : "true");
    }
  };

  const setInputHints = (input) => {
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "number") {
      if (!input.hasAttribute("step")) input.setAttribute("step", "any");
      if (!input.hasAttribute("inputmode")) input.setAttribute("inputmode", "decimal");
      return;
    }

    if (input.type !== "text" || input.hasAttribute("inputmode")) return;
    if (!input.closest(".card-calculator, [data-simple-calc], .priority-upgrade")) return;

    const label = input.id
      ? document.querySelector(`label[for="${CSS.escape(input.id)}"]`)?.textContent || ""
      : input.closest("label")?.textContent || "";
    const numericHint = `${input.id} ${input.name} ${input.placeholder} ${label}`;
    if (/(ft|forint|százalék|%|kg|cm|mm|m²|m3|m³|liter|óra|nap|év|hónap|km|fogyasztás|ár|összeg|hozam|kamat|érték|darab|mennyiség|tőke|bér|fizetés)/i.test(numericHint)) {
      input.setAttribute("inputmode", "decimal");
    }
  };

  const enhanceTree = (root) => {
    if (!(root instanceof Element || root instanceof Document)) return;

    if (root instanceof Element) {
      setResultSemantics(root);
      if (root.matches("button:not([type])") && !root.closest("form")) root.setAttribute("type", "button");
      if (root.matches("thead th:not([scope])")) root.setAttribute("scope", "col");
      if (root.matches("tbody th:not([scope])")) root.setAttribute("scope", "row");
      setInputHints(root);
    }

    root.querySelectorAll(resultSelectors).forEach(setResultSemantics);
    root.querySelectorAll("button:not([type])").forEach((button) => {
      if (!button.closest("form")) button.setAttribute("type", "button");
    });
    root.querySelectorAll("thead th:not([scope])").forEach((header) => header.setAttribute("scope", "col"));
    root.querySelectorAll("tbody th:not([scope])").forEach((header) => header.setAttribute("scope", "row"));
    root.querySelectorAll("input").forEach(setInputHints);
  };

  const init = () => {
    const main = document.querySelector("main");
    if (main) {
      if (!main.id) main.id = "main-content";
      if (!document.querySelector(".kb-skip-link")) {
        const skipLink = document.createElement("a");
        skipLink.className = "kb-skip-link";
        skipLink.href = `#${main.id}`;
        skipLink.textContent = "Ugrás a tartalomhoz";
        document.body.prepend(skipLink);
      }
    }

    enhanceTree(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) enhanceTree(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
