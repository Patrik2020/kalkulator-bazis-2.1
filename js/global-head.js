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
const wiseBannerCssPath = `${projectRoot}/css/components/wise-banner-enhancer.css`;
const priorityUpgradeCssPath = `${projectRoot}/css/pages/priority-upgrades.css`;
const constructionUpgradeCssPath = `${projectRoot}/css/pages/construction-upgrades.css`;
const everydayUpgradeCssPath = `${projectRoot}/css/pages/everyday-upgrades.css`;
const autoConverterUpgradeCssPath = `${projectRoot}/css/pages/auto-converter-upgrades.css`;
const themeScriptPath = `${projectRoot}/js/theme.js`;
const pwaScriptPath = `${projectRoot}/js/pwa.js`;
const wiseBannerScriptPath = `${projectRoot}/js/wise-banner-enhancer.js`;
const priorityUpgradeScriptPath = `${projectRoot}/js/priority-upgrades.js`;
const constructionUpgradeScriptPath = `${projectRoot}/js/construction-upgrades.js`;
const everydayUpgradeScriptPath = `${projectRoot}/js/everyday-upgrades.js`;
const autoConverterUpgradeScriptPath = `${projectRoot}/js/auto-converter-upgrades.js`;
const calculatorCssPath = `${projectRoot}/css/pages/calculator-suite.css`;
const calculatorScriptPath = `${projectRoot}/js/calculator-suite.js`;
const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const isHomePage = normalizedPath === projectRoot || normalizedPath === `${projectRoot}/index.html`;
const googleAnalyticsId = "G-4JBY0GDC4C";
const googleAdsId = "AW-18204925339";

window.KB_PROJECT_ROOT = projectRoot;
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

if (!window.KB_GOOGLE_TAG_INITIALIZED) {
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", functionality_storage: "granted", security_storage: "granted" });
  window.gtag("set", "ads_data_redaction", true);
}

const appendElement = (tagName, attributes) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  document.head.appendChild(element);
};

if (!window.KB_GOOGLE_TAG_INITIALIZED) {
  appendElement("script", { async: "", src: `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}` });
  window.gtag("js", new Date());
  window.gtag("config", googleAdsId);
  window.gtag("config", googleAnalyticsId, { anonymize_ip: true });
  window.KB_GOOGLE_TAG_INITIALIZED = true;
}
window.analyticsLoaded = true;

const hasMainStylesheet = () => [...document.querySelectorAll('link[rel~="stylesheet"][href]')].some((link) => {
  const rawHref = link.getAttribute("href") || "";
  const resolvedHref = link.href || "";
  return /(^|\/)css\/style\.css(?:[?#].*)?$/i.test(rawHref) || /\/css\/style\.css(?:[?#].*)?$/i.test(resolvedHref);
});

[
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-16x16.png`, sizes: "16x16" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-32x32.png`, sizes: "32x32" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-96x96.png`, sizes: "96x96" },
  { rel: "icon", type: "image/svg+xml", href: `${basePath}/favicon.svg` },
  { rel: "shortcut icon", href: `${basePath}/favicon.ico` },
  { rel: "apple-touch-icon", sizes: "180x180", href: `${basePath}/apple-touch-icon.png` },
  { rel: "manifest", href: `${projectRoot}/manifest.webmanifest` },
].forEach((attributes) => appendElement("link", attributes));

appendElement("link", { rel: "stylesheet", href: themeCssPath });
appendElement("link", { rel: "stylesheet", href: `${wiseBannerCssPath}?v=20260705-1` });
appendElement("link", { rel: "stylesheet", href: `${priorityUpgradeCssPath}?v=20260715-1` });
appendElement("link", { rel: "stylesheet", href: `${constructionUpgradeCssPath}?v=20260715-1` });
appendElement("link", { rel: "stylesheet", href: `${everydayUpgradeCssPath}?v=20260715-1` });
appendElement("link", { rel: "stylesheet", href: `${autoConverterUpgradeCssPath}?v=20260715-1` });

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
appendElement("script", { src: `${wiseBannerScriptPath}?v=20260705-1`, defer: "" });
appendElement("script", { src: `${priorityUpgradeScriptPath}?v=20260715-1`, defer: "" });
appendElement("script", { src: `${constructionUpgradeScriptPath}?v=20260715-1`, defer: "" });
appendElement("script", { src: `${everydayUpgradeScriptPath}?v=20260715-1`, defer: "" });
appendElement("script", { src: `${autoConverterUpgradeScriptPath}?v=20260715-1`, defer: "" });

[
  { name: "application-name", content: "KalkulátorBázis" },
  { name: "apple-mobile-web-app-title", content: "KalkulátorBázis" },
  { name: "referrer", content: "strict-origin-when-cross-origin" },
  { name: "theme-color", content: initialTheme === "dark" ? "#111827" : "#ffffff" },
  { "http-equiv": "Content-Security-Policy", content: "object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" },
].forEach((attributes) => appendElement("meta", attributes));
