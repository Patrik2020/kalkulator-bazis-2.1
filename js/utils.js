// ===== SEGÉD FÜGGVÉNYEK =====

// Szám formázás
function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

// Vissza gomb
function goBack() {
  window.history.back();
}

// CTA megjelenítés
function showLinks() {
  const calcLinks = document.querySelector(".calc-links");
  if (calcLinks) {
    calcLinks.style.display = "flex";
  }
}

// =========================
// SZÁM INPUT FORMÁZÁS
// =========================
function formatInputNumber(input) {
  let isFormatting = false;

  input.addEventListener("input", () => {
    if (isFormatting) return;

    isFormatting = true;

    let value = input.value.replace(/\s/g, "");
    value = value.replace(/\D/g, "");

    if (value === "") {
      input.value = "";
      isFormatting = false;
      return;
    }

    input.value = new Intl.NumberFormat("hu-HU").format(Number(value));

    isFormatting = false;
  });
}

// =========================
// PARSE SZÁM
// =========================
function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, ""));
}

// =========================
// HEADER és FOOTER betöltése
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const isCalculatorPage = window.location.pathname
    .toLowerCase()
    .includes("/kalkulatorok/");

  const base = isCalculatorPage ? "../" : "./";

  loadComponent("header", base + "components/header.html");
  loadComponent("footer", base + "components/footer.html");
  ensureCookieBanner(base, () => loadSiteScripts(base));
});

function ensureCookieBanner(base, onReady) {
  if (window.KB_CONSENT_MANAGER?.isReady) {
    if (onReady) onReady();
    return;
  }

  loadScriptOnce(base + "js/cookie.js", () => {
    if (onReady) onReady();
  });
}

function loadScriptOnce(src, onLoad) {
  const targetUrl = new URL(src, window.location.href).href;
  const existing = [...document.querySelectorAll("script[src]")].find(
    (script) => script.src === targetUrl
  );

  if (existing) {
    if (onLoad) {
      if (existing.dataset.loaded === "true") {
        onLoad();
      } else {
        existing.addEventListener("load", onLoad, { once: true });
      }
    }
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;

  if (onLoad) {
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        onLoad();
      },
      { once: true }
    );
  } else {
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
      },
      { once: true }
    );
  }

  document.body.appendChild(script);
}

function loadSiteScripts(base) {
  const loadUi = () => {
    document.dispatchEvent(new CustomEvent("kb:site-data-loaded"));
    markActiveNavigation(document.getElementById("header"));
    loadScriptOnce(base + "js/site-ui.js");
    if (window.location.pathname.toLowerCase().includes("/kalkulatorok/")) {
      loadScriptOnce(base + "js/retention-cta.js");
    }
  };

  if (window.KB_DATA) {
    loadUi();
    return;
  }

  loadScriptOnce(base + "js/site-data.js", loadUi);
}

function loadComponent(id, path) {
  fetch(path)
    .then((res) => {
      if (!res.ok) throw new Error("Hiba: " + path);
      return res.text();
    })
    .then((data) => {
      const target = document.getElementById(id);
      target.innerHTML = data;
      normalizeRootLinks(target, path.includes("../") ? "../" : "./");

      if (id === "header") {
        initMobileMenu();
        markActiveNavigation(target);
      }

      document.dispatchEvent(
        new CustomEvent("kb:component-loaded", { detail: { id } })
      );
    })
    .catch((err) => console.error(err));
}

function normalizeRootLinks(container, base) {
  container.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("//")) return;

    link.setAttribute("href", base + href.replace(/^\/+/, ""));
  });
}

function getActiveNavTarget() {
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");

  if (path.includes("/kalkulatorok/")) {
    const calculator = window.KB_DATA?.calculators?.find((item) =>
      path.endsWith(`/${item.url}`) || path.endsWith(item.url)
    );
    const category = calculator
      ? window.KB_DATA?.categories?.find((item) => item.id === calculator.category)
      : null;

    return category?.url || "kalkulatorok.html";
  }

  const fileName = path.split("/").filter(Boolean).pop() || "index.html";
  const knownTargets = new Set([
    "index.html",
    "penzugyi.html",
    "epitoipari.html",
    "egeszseg.html",
    "mindennapi.html",
    "auto.html",
    "atvaltok.html",
    "kalkulatorok.html",
    "rolunk.html",
    "szamitasi-modszertan.html",
    "atlathatosag-es-minoseg.html",
    "kapcsolat.html",
  ]);

  return knownTargets.has(fileName) ? fileName : "";
}

function linkMatchesTarget(link, target) {
  if (!target) return false;

  try {
    const href = new URL(link.getAttribute("href"), window.location.href);
    const path = decodeURIComponent(href.pathname).replace(/\\/g, "/");

    if (target === "index.html") {
      return /\/(?:index\.html)?$/.test(path);
    }

    return path.endsWith(`/${target}`) || path.endsWith(target);
  } catch (error) {
    return false;
  }
}

function markActiveNavigation(container) {
  if (!container) return;

  const target = getActiveNavTarget();
  let activeInfoLink = false;

  container.querySelectorAll("#menu a").forEach((link) => {
    const isActive = linkMatchesTarget(link, target);

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
      if (link.closest(".nav-more")) activeInfoLink = true;
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const infoMenu = container.querySelector(".nav-more");
  if (infoMenu) {
    infoMenu.classList.toggle("has-active", activeInfoLink);
    if (activeInfoLink && window.matchMedia("(max-width: 1199px)").matches) {
      infoMenu.open = true;
    }
  }
}

// =========================
// MOBIL NAVIGÁCIÓ
// =========================
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const infoMenu = menu?.querySelector(".nav-more");
  const desktopQuery = window.matchMedia("(min-width: 1200px)");

  if (!toggle || !menu) return;

  const closeInfoMenu = () => {
    if (infoMenu) infoMenu.open = false;
  };

  const setMenuState = (isOpen) => {
    menu.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menü bezárása" : "Menü megnyitása");

    if (!isOpen && !desktopQuery.matches) closeInfoMenu();
  };

  toggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("active"));
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      setMenuState(false);
      closeInfoMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (infoMenu?.open) {
      closeInfoMenu();
      infoMenu.querySelector("summary")?.focus();
      return;
    }

    if (menu.classList.contains("active")) {
      setMenuState(false);
      toggle.focus();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
      closeInfoMenu();
    });
  });

  const handleBreakpoint = () => {
    if (desktopQuery.matches) {
      setMenuState(false);
      closeInfoMenu();
    }
  };

  desktopQuery.addEventListener?.("change", handleBreakpoint);
}
