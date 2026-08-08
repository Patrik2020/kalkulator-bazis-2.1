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

const pathParts = window.location.pathname.split("/").filter(Boolean);
const sectionIndex = ["kalkulatorok", "landing-pages"].reduce((found, section) => {
  const index = pathParts.indexOf(section);
  return found === -1 || (index !== -1 && index < found) ? index : found;
}, -1);
const isFilePath = (value) => /\.(?:html?|css|js|json|xml|txt|png|jpe?g|webp|svg|ico|webmanifest)$/i.test(value);
const rootParts = sectionIndex > -1 ? pathParts.slice(0, sectionIndex) : pathParts.length === 1 && !isFilePath(pathParts[0]) ? pathParts : pathParts.length > 1 ? pathParts.slice(0, 1) : [];
const projectRoot = rootParts.length ? `/${rootParts.join("/")}` : "";
const basePath = `${projectRoot}/favicon`;
const themeCssPath = `${projectRoot}/css/theme.css`;
const footerCssPath = `${projectRoot}/css/layout/footer.css`;
const cookieCssPath = `${projectRoot}/css/components/cookie.css`;
const accessibilityCssPath = `${projectRoot}/css/components/accessibility.css`;
const wiseBannerCssPath = `${projectRoot}/css/components/wise-banner-enhancer.css`;
const calculatorPageCssPath = `${projectRoot}/css/pages/calculator-page-v2.css`;
const priorityUpgradeCssPath = `${projectRoot}/css/pages/priority-upgrades.css`;
const constructionUpgradeCssPath = `${projectRoot}/css/pages/construction-upgrades.css`;
const everydayUpgradeCssPath = `${projectRoot}/css/pages/everyday-upgrades.css`;
const autoConverterUpgradeCssPath = `${projectRoot}/css/pages/auto-converter-upgrades.css`;
const themeScriptPath = `${projectRoot}/js/theme.js`;
const pwaScriptPath = `${projectRoot}/js/pwa.js`;
const wiseBannerScriptPath = `${projectRoot}/js/wise-banner-enhancer.js`;
const accessibilityScriptPath = `${projectRoot}/js/site-accessibility.js`;
const calculatorPageScriptPath = `${projectRoot}/js/calculator-page.js`;
const priorityUpgradeScriptPath = `${projectRoot}/js/priority-upgrades.js`;
const constructionUpgradeScriptPath = `${projectRoot}/js/construction-upgrades.js`;
const everydayUpgradeScriptPath = `${projectRoot}/js/everyday-upgrades.js`;
const autoConverterUpgradeScriptPath = `${projectRoot}/js/auto-converter-upgrades.js`;
const calculatorCssPath = `${projectRoot}/css/pages/calculator-suite.css`;
const calculatorScriptPath = `${projectRoot}/js/calculator-suite.js`;
const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const currentPathPart = pathParts.at(-1) || "index.html";
const currentFile = (isFilePath(currentPathPart) ? currentPathPart : "index.html").toLowerCase();
const currentSlug = currentFile.replace(/\.html?$/, "");
const isCalculatorPage = pathParts.includes("kalkulatorok") && /\.html?$/i.test(currentFile);
const isHomePage =
  normalizedPath === projectRoot ||
  normalizedPath === `${projectRoot}/` ||
  normalizedPath === `${projectRoot}/index.html`;

const priorityUpgradePages = new Set([
  "hitelkepesseg-kalkulator", "lakas-hitel-onero-kalkulator", "hitel-torleszto-kalkulator",
  "milliomos-kalkulator", "inflacio-kalkulator", "kamatos-kamat-kalkulator",
  "havi-koltsegvetes-kalkulator", "fizetesi-hatarido-kalkulator", "szamla-teljesites-kalkulator",
  "afa-kalkulator", "terhessegi-kalkulator", "pulzus-zona-kalkulator", "vizfogyasztas-kalkulator",
  "testzsir-kalkulator", "derek-csipo-kalkulator", "alvasciklus-kalkulator",
  "idealis-testsuly-kalkulator", "bmi-kalkulator", "kaloria-kalkulator", "bmr-kalkulator",
  "makro-kalkulator", "feherje-szukseglet-kalkulator",
]);
const constructionUpgradePages = new Set([
  "gipszkarton-kalkulator", "tapeta-kalkulator", "vakolat-kalkulator", "hoszigeteles-kalkulator",
  "terkovezes-kalkulator", "tetocserep-kalkulator", "fuga-kalkulator", "padlo-burkolat-kalkulator",
]);
const everydayUpgradePages = new Set([
  "atlag-kalkulator", "munkaido-kalkulator", "oraber-kalkulator", "egysegar-kalkulator",
  "rezsi-megosztas-kalkulator", "ar-kedvezmeny-kalkulator", "borravalo-kalkulator",
  "eletkor-kalkulator", "datum-kulonbseg-kalkulator",
]);
const autoConverterUpgradePages = new Set([
  "eves-auto-koltseg-kalkulator", "auto-ertekvesztes-kalkulator", "kilometerdij-kalkulator",
  "co2-kibocsatas-kalkulator", "gumi-meret-kalkulator", "uzemanyag-koltseg-kalkulator",
  "adatmeret-atvalto-kalkulator", "energia-atvalto-kalkulator",
  "teljesitmeny-atvalto-kalkulator", "hosszusag-atvalto-kalkulator", "tomeg-atvalto-kalkulator",
  "terulet-atvalto-kalkulator", "terfogat-atvalto-kalkulator", "ido-atvalto-kalkulator",
  "sebesseg-atvalto-kalkulator",
]);
const wiseBannerPages = new Set(["index.html", "penzugyi.html", "atvaltok.html", "wise.html"]);

window.KB_PROJECT_ROOT = projectRoot;
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", functionality_storage: "granted", security_storage: "granted" });
window.gtag("set", "ads_data_redaction", true);

const appendElement = (tagName, attributes) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  document.head.appendChild(element);
};

// Google AdSense / Auto Ads: site-wide publisher identification and ad loader.
appendElement("meta", {
  name: "google-adsense-account",
  content: "ca-pub-2639795157074812",
});
appendElement("script", {
  async: "",
  src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812",
  crossorigin: "anonymous",
});

const hasMainStylesheet = () => [...document.querySelectorAll('link[rel~="stylesheet"][href]')].some((link) => {
  const rawHref = link.getAttribute("href") || "";
  const resolvedHref = link.href || "";
  return /(^|\/)css\/style\.css(?:[?#].*)?$/i.test(rawHref) || /\/css\/style\.css(?:[?#].*)?$/i.test(resolvedHref);
});

[
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-16x16.png`, sizes: "16x16" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-32x32.png`, sizes: "32x32" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-96x96.png`, sizes: "96x96" },
  { rel: "shortcut icon", href: `${basePath}/favicon.ico` },
  { rel: "apple-touch-icon", sizes: "180x180", href: `${basePath}/apple-touch-icon.png` },
  { rel: "manifest", href: `${projectRoot}/manifest.webmanifest` },
].forEach((attributes) => appendElement("link", attributes));

appendElement("link", { rel: "stylesheet", href: themeCssPath });
appendElement("link", { rel: "stylesheet", href: `${accessibilityCssPath}?v=20260807-1` });
if (wiseBannerPages.has(currentFile)) {
  appendElement("link", { rel: "stylesheet", href: `${wiseBannerCssPath}?v=20260807-1` });
}
if (isCalculatorPage) {
  appendElement("link", { rel: "stylesheet", href: `${calculatorPageCssPath}?v=20260807-1` });
}
if (priorityUpgradePages.has(currentSlug)) {
  appendElement("link", { rel: "stylesheet", href: `${priorityUpgradeCssPath}?v=20260807-1` });
}
if (constructionUpgradePages.has(currentSlug)) {
  appendElement("link", { rel: "stylesheet", href: `${constructionUpgradeCssPath}?v=20260807-1` });
}
if (everydayUpgradePages.has(currentSlug)) {
  appendElement("link", { rel: "stylesheet", href: `${everydayUpgradeCssPath}?v=20260807-1` });
}
if (autoConverterUpgradePages.has(currentSlug)) {
  appendElement("link", { rel: "stylesheet", href: `${autoConverterUpgradeCssPath}?v=20260807-1` });
}

if (!hasMainStylesheet()) {
  appendElement("link", { rel: "stylesheet", href: footerCssPath });
  appendElement("link", { rel: "stylesheet", href: cookieCssPath });
}

if (isHomePage) {
  appendElement("link", { rel: "stylesheet", href: `${calculatorCssPath}?v=20260703-2` });
  appendElement("script", { src: `${calculatorScriptPath}?v=20260703-2`, defer: "" });
}

appendElement("script", { src: themeScriptPath, defer: "" });
appendElement("script", { src: pwaScriptPath, defer: "" });
appendElement("script", { src: `${accessibilityScriptPath}?v=20260807-1`, defer: "" });
if (isCalculatorPage) {
  document.documentElement.classList.add("kb-calculator-document");
  window.setTimeout(() => {
    document.documentElement.classList.add("kb-calculator-ready");
  }, 3000);
  appendElement("script", { src: `${calculatorPageScriptPath}?v=20260807-1`, defer: "" });
}
if (wiseBannerPages.has(currentFile)) {
  appendElement("script", { src: `${wiseBannerScriptPath}?v=20260807-1`, defer: "" });
}
if (priorityUpgradePages.has(currentSlug)) {
  appendElement("script", { src: `${priorityUpgradeScriptPath}?v=20260807-1`, defer: "" });
}
if (constructionUpgradePages.has(currentSlug)) {
  appendElement("script", { src: `${constructionUpgradeScriptPath}?v=20260807-1`, defer: "" });
}
if (everydayUpgradePages.has(currentSlug)) {
  appendElement("script", { src: `${everydayUpgradeScriptPath}?v=20260807-1`, defer: "" });
}
if (autoConverterUpgradePages.has(currentSlug)) {
  appendElement("script", { src: `${autoConverterUpgradeScriptPath}?v=20260807-1`, defer: "" });
}

[
  { name: "application-name", content: "Kalkulátor Bázis" },
  { name: "apple-mobile-web-app-title", content: "Kalkulátor Bázis" },
  { name: "referrer", content: "strict-origin-when-cross-origin" },
  { name: "theme-color", content: initialTheme === "dark" ? "#111827" : "#ffffff" },
  { "http-equiv": "Content-Security-Policy", content: "object-src 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests" },
].forEach((attributes) => appendElement("meta", attributes));
