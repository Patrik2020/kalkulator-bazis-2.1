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

/* P2: compact sitewide language preference on inner pages.
 * Do not change document.lang until the page content is translated.
 * Keep runtime UI out of deterministic static export.
 */
if (!isHomePage && !new URLSearchParams(window.location.search).has("__kb_static_export")) {
  const labels = {
    hu: { name: "Nyelv", note: "" },
    en: { name: "Language", note: "Calculator content is currently available in Hungarian. Your language preference has been saved." },
    de: { name: "Sprache", note: "Der Rechnerinhalt ist derzeit auf Ungarisch verfügbar. Ihre Sprachauswahl wurde gespeichert." },
  };
  const mountLanguagePicker = () => {
    const actions = document.querySelector(".header-actions");
    if (!actions) return;
    let select = actions.querySelector("[data-kb-site-language]");
    if (!select) {
      select = document.createElement("select");
      select.dataset.kbSiteLanguage = "";
      select.className = "kb-site-language-select";
      for (const [code, name] of Object.entries({ hu: "HU", en: "EN", de: "DE" })) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        select.appendChild(option);
      }
      select.addEventListener("change", () => {
        window.KB_SITE_LANGUAGE?.set(select.value);
        document.documentElement.dataset.kbPreferredLanguage = select.value;
        mountLanguagePicker();
      });
      actions.insertBefore(select, actions.querySelector(".menu-toggle") || null);
    }
    const language = window.KB_SITE_LANGUAGE?.get() || "hu";
    select.value = language;
    select.setAttribute("aria-label", labels[language].name);
    let notice = document.querySelector("[data-kb-language-notice]");
    if (!notice) {
      notice = document.createElement("p");
      notice.dataset.kbLanguageNotice = "";
      notice.className = "kb-site-language-notice";
      notice.setAttribute("role", "status");
      document.querySelector("main")?.prepend(notice);
    }
    notice.textContent = labels[language].note;
    notice.hidden = language === "hu";
  };
  const style = document.createElement("style");
  style.textContent = ".kb-site-language-select{box-sizing:border-box;flex:0 0 49px;width:49px;min-width:0;max-width:49px;min-height:34px;padding:2px 0;border-radius:6px;border:1px solid #9ca3af;background:var(--surface,#fff);color:var(--text,#111827);font-size:12px}.kb-site-language-select:focus-visible{outline:2px solid #2563eb;outline-offset:2px}.kb-site-language-notice{max-width:1100px;margin:8px auto;padding:8px 12px;border-left:3px solid #2563eb;font-size:13px}.kb-site-language-notice[hidden]{display:none}";
  document.head.appendChild(style);
  document.addEventListener("kb:component-loaded", mountLanguagePicker);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountLanguagePicker, { once: true });
  else mountLanguagePicker();
}
