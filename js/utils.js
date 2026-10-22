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
// BIZTONSÁGI SEGÉDFÜGGVÉNYEK
// =========================
const ALLOWED_COMPONENT_PATHS = new Set([
  "components/header.html",
  "components/footer.html",
]);

function getSafeSameOriginUrl(path) {
  try {
    const url = new URL(path, window.location.href);
    return url.origin === window.location.origin ? url : null;
  } catch (error) {
    return null;
  }
}

function isAllowedComponentUrl(url) {
  if (!url) return false;

  const normalizedPath = url.pathname.replace(/^\/+/, "");
  return [...ALLOWED_COMPONENT_PATHS].some((allowedPath) =>
    normalizedPath.endsWith(allowedPath)
  );
}

function sanitizeComponentHtml(html) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");

  parsed.querySelectorAll("script, iframe, object, embed, base, meta[http-equiv]").forEach((node) => {
    node.remove();
  });

  parsed.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (name.startsWith("on")) {
        element.removeAttribute(attribute.name);
        return;
      }

      if ((name === "href" || name === "src") && /^javascript:/i.test(value)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  const fragment = document.createDocumentFragment();
  [...parsed.body.childNodes].forEach((node) => fragment.appendChild(node));
  return fragment;
}

function hardenExternalLinks(container = document) {
  container.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const relValues = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    relValues.add("noopener");
    relValues.add("noreferrer");
    link.setAttribute("rel", [...relValues].join(" "));
  });
}

function normalizeRoutePath(value) {
  return decodeURIComponent(String(value || "").split(/[?#]/, 1)[0])
    .replace(/\\/g, "/")
    .replace(/\.html$/i, "")
    .replace(/^\/+|\/+$/g, "");
}

function normalizeInternalPublicLinks(container = document) {
  const links = [];
  if (container instanceof HTMLAnchorElement) links.push(container);
  if (typeof container.querySelectorAll === "function") {
    links.push(...container.querySelectorAll("a[href]"));
  }

  links.forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || /^(?:mailto:|tel:|javascript:|data:|#)/i.test(rawHref)) return;

    try {
      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin || !/\.html$/i.test(url.pathname)) return;
      url.pathname = /\/index\.html$/i.test(url.pathname)
        ? url.pathname.replace(/index\.html$/i, "")
        : url.pathname.replace(/\.html$/i, "");
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      // A hibás URL-t a böngésző eredeti formájában hagyjuk.
    }
  });
}

window.KB_NORMALIZE_INTERNAL_LINKS = normalizeInternalPublicLinks;

const siteRuntimeState = {
  scripts: new Map(),
  components: new WeakMap(),
  initialized: new WeakMap(),
  menus: new WeakSet(),
  homeInitializers: new Map(),
  started: false,
  sitePromise: null,
  dataPromise: null,
};

function claimInitialization(element, name) {
  if (!element) return false;
  let claims = siteRuntimeState.initialized.get(element);
  if (!claims) siteRuntimeState.initialized.set(element, claims = new Set());
  if (claims.has(name)) return false;
  claims.add(name);
  return true;
}

function registerHomeInitializer(name, initialize) {
  siteRuntimeState.homeInitializers.set(name, initialize);
  initialize();
}

function initializeHome() {
  siteRuntimeState.homeInitializers.forEach((initialize) => initialize());
}

function isMaterializedHome() {
  return Boolean(document.body?.classList.contains("home-page")
    && document.body.classList.contains("home-redesign-v17")
    && document.querySelector(".kb-header-wrap > #header.kb-header")
    && document.querySelector("main .hero"));
}

function loadHomeRedesign() {
  if (!document.body?.classList.contains("home-page") || isMaterializedHome()) return Promise.resolve(null);
  const base = String(window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
  return loadScriptOnce(`${base}/js/home-ia.js?v=655a33ddd0cc`);
}

// =========================
// HEADER és FOOTER betöltése
// =========================
function initializeSite() {
  if (siteRuntimeState.sitePromise) return siteRuntimeState.sitePromise;
  siteRuntimeState.sitePromise = Promise.resolve().then(() => {
    const base = typeof window.KB_PROJECT_ROOT === "string"
      ? `${window.KB_PROJECT_ROOT.replace(/\/$/, "")}/`
      : window.location.pathname.toLowerCase().includes("/kalkulatorok/") ? "../" : "./";
    if (!siteRuntimeState.started) {
      siteRuntimeState.started = true;
      hardenExternalLinks(document);
      normalizeInternalPublicLinks(document);
      repairDecisionSwitchers();
      const linkObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) normalizeInternalPublicLinks(node);
          });
        });
      });
      linkObserver.observe(document.body, { childList: true, subtree: true });
    }
    return Promise.all([
      loadComponent("header", base + "components/header.html"),
      loadComponent("footer", base + "components/footer.html"),
      ensureCookieBanner(base).then(() => loadSiteScripts(base)),
    ]);
  });
  const pending = siteRuntimeState.sitePromise;
  pending.catch(() => { if (siteRuntimeState.sitePromise === pending) siteRuntimeState.sitePromise = null; });
  return siteRuntimeState.sitePromise;
}

function ensureCookieBanner(base, onReady) {
  if (window.KB_CONSENT_MANAGER?.isReady) {
    if (onReady) onReady();
    return Promise.resolve();
  }

  return loadScriptOnce(base + "js/cookie.js?v=406f40c6a5eb", () => {
    if (onReady) onReady();
  });
}

function loadScriptOnce(src, onLoad) {
  const safeUrl = getSafeSameOriginUrl(src);
  if (!safeUrl) {
    console.error("Nem engedélyezett scriptforrás:", src);
    return Promise.reject(new Error("Nem engedélyezett scriptforrás: " + src));
  }

  // Versions identify a response; one page must execute a given script only once.
  const key = safeUrl.origin + safeUrl.pathname;
  if (!siteRuntimeState.scripts.has(key)) {
    const pending = new Promise((resolve, reject) => {
      const existing = [...document.querySelectorAll("script[src]")].find((script) => {
        const url = getSafeSameOriginUrl(script.src);
        return url && url.origin + url.pathname === key;
      });
      const file = safeUrl.pathname.split("/").pop();
      const batch = file.match(/^expansion-batch-(\d+)-data\.js$/)?.[1];
      const alreadyReady = (file === "cookie.js" && window.KB_CONSENT_MANAGER?.isReady)
        || (file === "site-data.js" && window.KB_DATA)
        || (batch && window[`KB_EXPANSION_BATCH_${batch}`])
        || (file === "site-ui.js" && window.KB_SITE_UI_LOADED)
        || (file === "retention-cta.js" && window.KB_RETENTION_CTA_LOADED)
        || siteRuntimeState.homeInitializers.has(file)
        || (file.match(/^home-redesign-i18n-(hu|en|de)\.js$/) && window.KB_HOME_I18N?.[file.match(/-(hu|en|de)\.js$/)[1]])
        || (file.match(/^home-redesign-help-i18n-(hu|en|de)\.js$/) && window.KB_HELP_I18N?.[file.match(/-(hu|en|de)\.js$/)[1]]);
      if (alreadyReady || existing?.dataset.loaded === "true") return resolve(existing || null);

      const script = existing || document.createElement("script");
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => {
        script.remove();
        reject(new Error("Nem sikerült betölteni: " + safeUrl.pathname));
      }, { once: true });
      if (!existing) {
        script.src = safeUrl.href;
        script.async = false;
        document.body.appendChild(script);
      }
    });
    siteRuntimeState.scripts.set(key, pending);
    pending.catch(() => { if (siteRuntimeState.scripts.get(key) === pending) siteRuntimeState.scripts.delete(key); });
  }
  return siteRuntimeState.scripts.get(key).then((script) => {
    if (onLoad) onLoad();
    return script;
  });
}

function loadSiteScripts(base) {
  if (siteRuntimeState.dataPromise) return siteRuntimeState.dataPromise;
  siteRuntimeState.dataPromise = (async () => {
    await loadScriptOnce(base + "js/site-data.js?v=3542e6c302df");
    for (const asset of [
      "js/expansion-batch-01-data.js?v=1ec41e199816",
      "js/expansion-batch-02-data.js?v=1ae83db6af10",
      "js/expansion-batch-03-data.js?v=49f7f172f263",
      "js/expansion-batch-04-data.js?v=33876b15f2f4",
      "js/expansion-batch-05-data.js?v=6dd98ee7d334",
    ]) await loadScriptOnce(base + asset);
    document.dispatchEvent(new CustomEvent("kb:site-data-loaded"));
    markActiveNavigation(document.getElementById("header"));
    await loadScriptOnce(base + "js/site-ui.js?v=2055e3f67005");
    if (window.location.pathname.toLowerCase().includes("/kalkulatorok/")) {
      await loadScriptOnce(base + "js/retention-cta.js?v=de234f7c946e");
    }
  })();
  const pending = siteRuntimeState.dataPromise;
  pending.catch(() => { if (siteRuntimeState.dataPromise === pending) siteRuntimeState.dataPromise = null; });
  return siteRuntimeState.dataPromise;
}

function initializeComponent(id, target, path) {
  const content = target.firstElementChild || target;
  if (!claimInitialization(content, "shared-component")) return;
  const base = typeof window.KB_PROJECT_ROOT === "string"
    ? `${window.KB_PROJECT_ROOT.replace(/\/$/, "")}/`
    : path.includes("../") ? "../" : "./";
  normalizeRootLinks(target, base);
  normalizeInternalPublicLinks(target);
  hardenExternalLinks(target);
  if (id === "header") {
    initMobileMenu();
    markActiveNavigation(target);
  }
  document.dispatchEvent(new CustomEvent("kb:component-loaded", { detail: { id } }));
}

function loadComponent(id, path) {
  const componentUrl = getSafeSameOriginUrl(path);
  if (!isAllowedComponentUrl(componentUrl)) {
    return Promise.reject(new Error("Nem engedélyezett komponensútvonal: " + path));
  }
  const target = document.getElementById(id);
  if (!target || ((id === "header" || id === "footer") && isMaterializedHome())) return Promise.resolve(target);
  const previous = siteRuntimeState.components.get(target);
  if (previous?.url === componentUrl.href) return previous.promise;

  const isExport = new URLSearchParams(window.location.search).has("__kb_static_export");
  const hasStaticComponent = id === "header"
    ? target.querySelector("header.header-shell") && target.querySelector("#menu") && target.querySelector("#menuToggle")
    : id === "footer" && target.querySelector(".footer-container.kb-footer");
  const promise = Promise.resolve().then(async () => {
    // Export refreshes canonical templates; ordinary visits retain the source DOM.
    if (!hasStaticComponent || isExport) {
      const response = await fetch(componentUrl.href, {
        credentials: "same-origin", cache: "no-cache", headers: { Accept: "text/html" },
      });
      if (!response.ok) throw new Error("Hiba: " + path);
      if (!(response.headers.get("content-type") || "").includes("text/html")) {
        throw new Error("Érvénytelen komponens tartalomtípus: " + path);
      }
      const html = await response.text();
      // A legacy homepage assembly may have replaced this placeholder meanwhile.
      if (document.getElementById(id) !== target) return document.getElementById(id);
      target.replaceChildren(sanitizeComponentHtml(html));
    }
    initializeComponent(id, target, path);
    return target;
  });
  siteRuntimeState.components.set(target, { url: componentUrl.href, promise });
  promise.catch(() => {
    if (siteRuntimeState.components.get(target)?.promise === promise) siteRuntimeState.components.delete(target);
  });
  return promise;
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
      normalizeRoutePath(path).endsWith(normalizeRoutePath(item.url))
    );
    const category = calculator
      ? window.KB_DATA?.categories?.find((item) => item.id === calculator.category)
      : null;

    return category?.url || "kalkulatorok.html";
  }

  const currentPart = path.split("/").filter(Boolean).pop() || "index";
  const fileName = /\.html$/i.test(currentPart) ? currentPart : `${currentPart}.html`;
  const knownTargets = new Set([
    "index.html",
    "penzugyi.html",
    "epitoipari.html",
    "egeszseg.html",
    "mindennapi.html",
    "auto.html",
    "atvaltok.html",
    "kalkulatorok.html",
    "penzugyi-tudatossag.html",
    "rolunk.html",
    "szamitasi-modszertan.html",
    "atlathatosag-es-minoseg.html",
    "miert-bizhatsz-bennunk.html",
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
      return !href.hash && /\/(?:index\.html)?$/.test(path);
    }

    const normalizedPath = normalizeRoutePath(path);
    const normalizedTarget = normalizeRoutePath(target);
    return normalizedPath === normalizedTarget || normalizedPath.endsWith(`/${normalizedTarget}`);
  } catch (error) {
    return false;
  }
}

function markActiveNavigation(container) {
  if (!container) return;

  const target = getActiveNavTarget();
  const activeGroups = new Set();

  container.querySelectorAll("#menu a").forEach((link) => {
    const isActive = linkMatchesTarget(link, target);

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
      const group = link.closest(".nav-dropdown");
      if (group) activeGroups.add(group);
    } else {
      link.removeAttribute("aria-current");
    }
  });

  container.querySelectorAll(".nav-dropdown").forEach((group) => {
    const isActive = activeGroups.has(group);
    group.classList.toggle("has-active", isActive);
    if (isActive && window.matchMedia("(max-width: 1049px)").matches) group.open = true;
  });
}

// =========================
// MOBIL NAVIGÁCIÓ
// =========================
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const dropdowns = [...(menu?.querySelectorAll(".nav-dropdown") || [])];
  const desktopQuery = window.matchMedia("(min-width: 1050px)");

  if (!toggle || !menu || siteRuntimeState.menus.has(menu)) return;
  siteRuntimeState.menus.add(menu);

  const closeDropdowns = (except = null) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) dropdown.open = false;
    });
  };

  const setMenuState = (isOpen) => {
    menu.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menü bezárása" : "Menü megnyitása");

    if (!isOpen && !desktopQuery.matches) closeDropdowns();
  };

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (dropdown.open) closeDropdowns(dropdown);
    });
  });

  toggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("active"));
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      setMenuState(false);
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openDropdown = dropdowns.find((dropdown) => dropdown.open);
    if (openDropdown) {
      openDropdown.open = false;
      openDropdown.querySelector("summary")?.focus();
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
      closeDropdowns();
    });
  });

  const handleBreakpoint = () => {
    if (desktopQuery.matches) {
      setMenuState(false);
      closeDropdowns();
    }
  };

  desktopQuery.addEventListener?.("change", handleBreakpoint);
}

// =========================
// DÖNTÉS / ÖSSZEHASONLÍTÁS SWITCHER KOMPATIBILITÁS
// =========================
function repairDecisionSwitchers() {
  const configs = [
    {
      buttonSelector: "[data-decision-mode]",
      panelSelector: "form[data-decision-form]",
      buttonKey: "decisionMode",
      panelKey: "decisionForm",
    },
    {
      buttonSelector: "[data-comparison-mode]",
      panelSelector: "form[data-comparison-form]",
      buttonKey: "comparisonMode",
      panelKey: "comparisonForm",
    },
  ];

  configs.forEach(({ buttonSelector, panelSelector, buttonKey, panelKey }) => {
    const buttons = [...document.querySelectorAll(buttonSelector)];
    const panels = [...document.querySelectorAll(panelSelector)];
    if (!buttons.length || !panels.length) return;

    const activate = (value) => {
      buttons.forEach((button) => {
        const active = button.dataset[buttonKey] === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset[panelKey] !== value;
      });
    };

    buttons.forEach((button) => {
      if (button.dataset.kbSwitcherRepairBound === "true") return;
      button.dataset.kbSwitcherRepairBound = "true";
      button.addEventListener("click", () => activate(button.dataset[buttonKey]));
    });

    const initial = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
    activate(initial.dataset[buttonKey]);
  });
}

window.KB_SITE_RUNTIME = Object.freeze({
  initialize: initializeSite,
  loadScript: loadScriptOnce,
  loadComponent,
  loadHomeRedesign,
  isMaterializedHome,
  claimInitialization,
  registerHomeInitializer,
  initializeHome,
});

const startSite = () => initializeSite().catch((error) => console.error("A közös felület betöltése sikertelen:", error));
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSite, { once: true });
} else {
  startSite();
}
