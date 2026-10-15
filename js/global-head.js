const kbLanguageStorageKey = "kalkulatorbazis-language";
const kbSupportedLanguages = new Set(["hu", "en", "de"]);
const readSiteLanguage = () => {
  try {
    const stored = localStorage.getItem(kbLanguageStorageKey);
    return kbSupportedLanguages.has(stored) ? stored : "hu";
  } catch (_) {
    return "hu";
  }
};
window.KB_SITE_LANGUAGE = {
  get: readSiteLanguage,
  set(language) {
    if (!kbSupportedLanguages.has(language)) return false;
    try {
      localStorage.setItem(kbLanguageStorageKey, language);
    } catch (_) {
      return false;
    }
    return true;
  },
  supported: ["hu", "en", "de"],
};
// A preference is not a translation: leave <html lang="hu"> intact on untranslated pages.
if (!new URLSearchParams(window.location.search).has("__kb_static_export")) {
  document.documentElement.dataset.kbPreferredLanguage = readSiteLanguage();
}

const themeStorageKey = "kalkulatorbazis-theme";
let initialTheme = "light";

try {
  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    initialTheme = storedTheme;
  } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    initialTheme = "dark";
  }
} catch (error) {
  initialTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;

const headConfig = window.KB_GLOBAL_HEAD_CONFIG;
if (!headConfig) {
  throw new Error("A global-head-config.js nem töltődött be a global-head.js előtt.");
}

const pathParts = window.location.pathname.split("/").filter(Boolean);
const sectionIndex = ["kalkulatorok", "landing-pages"].reduce((found, section) => {
  const index = pathParts.indexOf(section);
  return found === -1 || (index !== -1 && index < found) ? index : found;
}, -1);
const fallbackRootParts = sectionIndex > -1 ? pathParts.slice(0, sectionIndex) : [];
let scriptProjectRoot = null;
try {
  const scriptUrl = new URL(document.currentScript?.src || "", window.location.href);
  const marker = "/js/global-head.js";
  const markerIndex = scriptUrl.pathname.lastIndexOf(marker);
  if (markerIndex !== -1) scriptProjectRoot = scriptUrl.pathname.slice(0, markerIndex).replace(/\/+$/, "");
} catch (error) {
  scriptProjectRoot = null;
}
const projectRoot = scriptProjectRoot ?? (fallbackRootParts.length ? `/${fallbackRootParts.join("/")}` : "");
const basePath = `${projectRoot}/favicon`;
const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const currentPathPart = pathParts.at(-1) || "index.html";
const currentSlug = currentPathPart.replace(/\.html?$/i, "").toLowerCase();
const currentFile = currentSlug === "index" ? "index.html" : `${currentSlug}.html`;
const isCalculatorPage = pathParts.includes("kalkulatorok") && currentSlug !== "kalkulatorok";
const isHomePage =
  normalizedPath === projectRoot ||
  normalizedPath === `${projectRoot}/` ||
  normalizedPath === `${projectRoot}/index.html`;

const resolveAsset = (assetPath) => {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(assetPath)) return assetPath;
  return `${projectRoot}/${assetPath.replace(/^\/+/, "")}`;
};

const appendElement = (tagName, attributes) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  document.head.appendChild(element);
};

const appendStyles = (paths = []) => {
  paths.forEach((assetPath) => appendElement("link", { rel: "stylesheet", href: resolveAsset(assetPath) }));
};

const appendScripts = (paths = []) => {
  paths.forEach((assetPath) => appendElement("script", { src: resolveAsset(assetPath), defer: "" }));
};

const appendParsedDomScripts = (paths = []) => {
  paths.forEach((assetPath) => {
    const script = document.createElement("script");
    script.src = resolveAsset(assetPath);
    script.async = false;
    document.head.appendChild(script);
  });
};

const hasMainStylesheet = () => [...document.querySelectorAll('link[rel~="stylesheet"][href]')].some((link) => {
  const rawHref = link.getAttribute("href") || "";
  const resolvedHref = link.href || "";
  return /(^|\/)css\/style\.css(?:[?#].*)?$/i.test(rawHref) || /\/css\/style\.css(?:[?#].*)?$/i.test(resolvedHref);
});

const activeFeatures = headConfig.features.filter((feature) => {
  const currentValue = feature.match === "file" ? currentFile : currentSlug;
  return feature.pages.includes(currentValue);
});
const fileFeatures = activeFeatures.filter((feature) => feature.match === "file");
const slugFeatures = activeFeatures.filter((feature) => feature.match !== "file");

window.KB_PROJECT_ROOT = projectRoot;
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
});
window.gtag("set", "ads_data_redaction", true);

[
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-16x16.png`, sizes: "16x16" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-32x32.png`, sizes: "32x32" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-96x96.png`, sizes: "96x96" },
  { rel: "shortcut icon", href: `${basePath}/favicon.ico` },
  { rel: "apple-touch-icon", sizes: "180x180", href: `${basePath}/apple-touch-icon.png` },
  { rel: "manifest", href: `${projectRoot}/manifest.webmanifest` },
].forEach((attributes) => appendElement("link", attributes));

appendStyles(headConfig.base.styles);
fileFeatures.forEach((feature) => appendStyles(feature.styles));
if (isCalculatorPage) appendStyles(headConfig.calculatorPage.styles);
slugFeatures.forEach((feature) => appendStyles(feature.styles));

if (!hasMainStylesheet()) appendStyles(headConfig.base.fallbackStyles);
if (isHomePage) appendStyles(headConfig.home.styles);

if (isHomePage) appendScripts(headConfig.home.scriptsBeforeBase);
appendScripts(headConfig.base.scripts);

if (isCalculatorPage) {
  document.documentElement.classList.add("kb-calculator-document");
  window.setTimeout(() => {
    document.documentElement.classList.add("kb-calculator-ready");
  }, 3000);
  appendScripts(headConfig.calculatorPage.scripts);
}

const loadParsedDomFeatures = () => {
  fileFeatures.forEach((feature) => appendParsedDomScripts(feature.scripts));
  slugFeatures.forEach((feature) => appendParsedDomScripts(feature.scripts));
  if (isHomePage) appendParsedDomScripts(headConfig.home.scriptsAfterFeatures);
};

if (document.readyState === "loading") {
  const onReadyStateChange = () => {
    if (document.readyState === "loading") return;
    document.removeEventListener("readystatechange", onReadyStateChange);
    loadParsedDomFeatures();
  };
  document.addEventListener("readystatechange", onReadyStateChange);
} else {
  loadParsedDomFeatures();
}

[
  { name: "application-name", content: "Kalkulátor Bázis" },
  { name: "apple-mobile-web-app-title", content: "Kalkulátor Bázis" },
  { name: "referrer", content: "strict-origin-when-cross-origin" },
  { name: "theme-color", content: initialTheme === "dark" ? "#111827" : "#ffffff" },
  { "http-equiv": "Content-Security-Policy", content: "object-src 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests" },
].forEach((attributes) => appendElement("meta", attributes));

/*
 * P2: a shared language preference is selectable on internal pages too.
 * Do not claim translated calculator content: full page translations follow in P3.
 */
if (!isHomePage && !new URLSearchParams(window.location.search).has("__kb_static_export")) {
  const languageNames = { hu: "Magyar", en: "English", de: "Deutsch" };
  const labels = {
    hu: { picker: "Oldal nyelve", notice: "" },
    en: { picker: "Preferred language", notice: "This page's calculator content is currently available in Hungarian. Your language preference is saved." },
    de: { picker: "Bevorzugte Sprache", notice: "Der Inhalt dieses Rechners ist derzeit auf Ungarisch verfügbar. Ihre Sprachauswahl wurde gespeichert." },
  };
  const applySharedLanguageControls = () => {
    const header = document.querySelector(".header-actions");
    if (!header) return;
    let control = header.querySelector("[data-kb-language-control]");
    if (!control) {
      control = document.createElement("label");
      control.dataset.kbLanguageControl = "";
      control.className = "kb-language-control";
      const select = document.createElement("select");
      select.setAttribute("aria-label", labels.hu.picker);
      for (const [code, name] of Object.entries(languageNames)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        select.appendChild(option);
      }
      select.addEventListener("change", () => {
        if (!window.KB_SITE_LANGUAGE?.set(select.value)) return;
        document.documentElement.dataset.kbPreferredLanguage = select.value;
        applySharedLanguageControls();
        document.dispatchEvent(new CustomEvent("kb:language-changed", { detail: { language: select.value } }));
      });
      control.appendChild(select);
      header.insertBefore(control, header.querySelector(".menu-toggle") || null);
    }
    const language = window.KB_SITE_LANGUAGE?.get() || "hu";
    const select = control.querySelector("select");
    select.value = language;
    select.setAttribute("aria-label", labels[language].picker);
    let note = document.querySelector("[data-kb-language-notice]");
    if (!note) {
      note = document.createElement("p");
      note.dataset.kbLanguageNotice = "";
      note.setAttribute("role", "status");
      note.className = "kb-language-notice";
      const main = document.querySelector("main");
      if (main) main.prepend(note);
    }
    if (note) {
      note.textContent = labels[language].notice;
      note.hidden = language === "hu";
    }
  };
  const languageStyle = document.createElement("style");
  languageStyle.textContent = [
    ".kb-language-control{display:inline-flex;align-items:center;max-width:100%}",
    ".kb-language-control select{background:var(--surface,#fff);color:var(--text,#111827);border:1px solid var(--border,#cbd5e1);border-radius:10px;min-height:40px;padding:5px 7px;font:inherit;font-size:.82rem;max-width:105px}",
    ".kb-language-control select:focus-visible{outline:3px solid var(--primary,#0b66f2);outline-offset:2px}",
    ".kb-language-notice{margin:12px auto;padding:10px 14px;max-width:1100px;border-inline-start:3px solid var(--primary,#0b66f2);background:var(--surface,#fff);color:var(--text,#111827);font-size:.875rem}",
    "@media(max-width:420px){.kb-language-control select{max-width:83px;font-size:.75rem;padding-inline:3px}}",
  ].join("");
  document.head.appendChild(languageStyle);
  document.addEventListener("kb:component-loaded", applySharedLanguageControls);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySharedLanguageControls, { once: true });
  } else {
    applySharedLanguageControls();
  }
}
