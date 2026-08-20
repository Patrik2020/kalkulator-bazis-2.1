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

  let cleanupQueued = false;

  const hasLiveMatch = (selector, fallback, fallbackAttribute) =>
    [...document.querySelectorAll(selector)].some(
      (node) => node !== fallback && !node.hasAttribute(fallbackAttribute)
    );

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
  };

  const queueCleanup = () => {
    if (cleanupQueued) return;
    cleanupQueued = true;
    queueMicrotask(cleanup);
  };

  const start = () => {
    cleanup();

    const observer = new MutationObserver(queueCleanup);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("pageshow", queueCleanup);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
