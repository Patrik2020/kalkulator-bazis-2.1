(() => {
  "use strict";

  const qualitySelectors = {
    finance: '[data-finance-quality="2026-08"]',
    construction: '[data-construction-quality="2026-08"]',
    lifestyle: '[data-lifestyle-quality="2026-08"]',
    auto: '[data-auto-converter-quality="2026-08"]',
    priority: '[data-priority-upgrade]',
  };

  const runtimeSelectors = {
    "construction-methodology": ".construction-methodology",
    "everyday-method": ".everyday-method",
    "auto-converter-note": ".ac-note",
  };

  const isStaticExport = new URLSearchParams(window.location.search).has("__kb_static_export");
  let cleanupQueued = false;

  const hasLiveMatch = (selector, fallback, fallbackAttribute) =>
    [...document.querySelectorAll(selector)].some(
      (node) => node !== fallback && !node.hasAttribute(fallbackAttribute)
    );

  const setAttributeIfNeeded = (node, name, value = "") => {
    if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
  };

  const setTextIfNeeded = (node, value) => {
    if (node && node.textContent !== value) node.textContent = value;
  };

  const canonicalizeStaticExportUi = () => {
    if (!isStaticExport) return;

    // Active navigation is runtime state and can race with the headless DOM dump.
    // Persist a neutral header; site-ui.js will restore the active item for users.
    document.querySelectorAll("#menu .is-active").forEach((node) => node.classList.remove("is-active"));
    document.querySelectorAll("#menu .has-active").forEach((node) => node.classList.remove("has-active"));
    document.querySelectorAll("#menu [aria-current]").forEach((node) => node.removeAttribute("aria-current"));
    document.querySelectorAll("#menu details[open]").forEach((node) => node.removeAttribute("open"));

    // The retention component is dynamic UI. During export keep exactly one
    // canonical hidden copy so repeated materialization cannot capture a
    // before/after-load state.
    const retentionNodes = [...document.querySelectorAll("[data-retention-cta]")];
    const canonical = retentionNodes.shift();
    retentionNodes.forEach((node) => node.remove());

    if (!canonical) return;

    setAttributeIfNeeded(canonical, "data-retention-cta", "runtime");
    if (!canonical.hasAttribute("hidden")) canonical.setAttribute("hidden", "");
    if (canonical.classList.contains("is-revealed")) canonical.classList.remove("is-revealed");

    canonical.querySelectorAll("[data-retention-guide]").forEach((node) => {
      if (!node.hasAttribute("hidden")) node.setAttribute("hidden", "");
    });
    canonical.querySelectorAll("[aria-expanded]").forEach((node) => {
      setAttributeIfNeeded(node, "aria-expanded", "false");
    });

    const installButton = canonical.querySelector('[data-retention-action="install"]');
    if (installButton) {
      if (!installButton.hasAttribute("hidden")) installButton.setAttribute("hidden", "");
      if (installButton.dataset.installMode) delete installButton.dataset.installMode;
      if (installButton.dataset.installMethod) delete installButton.dataset.installMethod;
    }

    setTextIfNeeded(canonical.querySelector("[data-retention-install-label]"), "Telepítem");
    setTextIfNeeded(canonical.querySelector("[data-retention-install-text]"), "");
    setTextIfNeeded(canonical.querySelector("[data-retention-status]"), "");
  };

  const cleanup = () => {
    cleanupQueued = false;

    document.querySelectorAll("[data-static-quality-fallback]").forEach((fallback) => {
      const type = fallback.getAttribute("data-static-quality-fallback");
      const selector = qualitySelectors[type];
      if (!selector) return;

      if (hasLiveMatch(selector, fallback, "data-static-quality-fallback")) {
        fallback.remove();
      }
    });

    document.querySelectorAll("[data-static-runtime-fallback]").forEach((fallback) => {
      const type = fallback.getAttribute("data-static-runtime-fallback");
      const selector = runtimeSelectors[type];
      if (!selector) return;

      if (hasLiveMatch(selector, fallback, "data-static-runtime-fallback")) {
        fallback.remove();
      }
    });

    canonicalizeStaticExportUi();
  };

  const removeTransientStaticEnhancements = () => {
    if (isStaticExport) {
      canonicalizeStaticExportUi();
      return;
    }

    // On a real page load, remove the materialized retention copy before
    // retention-cta.js initializes its fresh, event-bound component.
    document.querySelectorAll("[data-retention-cta]").forEach((node) => node.remove());
  };

  const queueCleanup = () => {
    if (cleanupQueued) return;
    cleanupQueued = true;
    queueMicrotask(cleanup);
  };

  const start = () => {
    removeTransientStaticEnhancements();
    cleanup();

    const observer = new MutationObserver(queueCleanup);
    observer.observe(
      document.documentElement,
      isStaticExport
        ? { childList: true, subtree: true, attributes: true }
        : { childList: true, subtree: true }
    );

    window.addEventListener("pageshow", queueCleanup);
  };

  const startHomeRedesign = () => {
    if (!document.body?.classList.contains("home-page")) return;

    // The production homepage is already materialized with the V17 markup and
    // its runtime scripts. Re-running home-ia/home-current after DOMContentLoaded
    // replaces the existing header a second time and can nest .kb-header-wrap
    // elements on reload. Only use the dynamic assembler as a legacy fallback
    // when the materialized redesign is genuinely absent.
    const hasMaterializedHome =
      document.body.classList.contains("home-redesign-v17") &&
      document.querySelector(".kb-header-wrap > #header.kb-header") &&
      document.querySelector("main .hero");
    if (hasMaterializedHome) return;

    if (document.querySelector('script[data-kb-home-ia]')) return;

    const base = String(window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
    const script = document.createElement("script");
    script.src = `${base}/js/home-ia.js?v=20260921-1`.replace(/^\/$/, "./");
    script.async = false;
    script.dataset.kbHomeIa = "";
    document.body.appendChild(script);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    document.addEventListener("DOMContentLoaded", startHomeRedesign, { once: true });
  } else {
    start();
    startHomeRedesign();
  }
})();
