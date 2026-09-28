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

const appendDomReadyScripts = (paths = []) => {
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

const loadDomReadyFeatures = () => {
  fileFeatures.forEach((feature) => appendDomReadyScripts(feature.scripts));
  slugFeatures.forEach((feature) => appendDomReadyScripts(feature.scripts));
  if (isHomePage) appendDomReadyScripts(headConfig.home.scriptsAfterFeatures);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadDomReadyFeatures, { once: true });
} else {
  loadDomReadyFeatures();
}

[
  { name: "application-name", content: "Kalkulátor Bázis" },
  { name: "apple-mobile-web-app-title", content: "Kalkulátor Bázis" },
  { name: "referrer", content: "strict-origin-when-cross-origin" },
  { name: "theme-color", content: initialTheme === "dark" ? "#111827" : "#ffffff" },
  { "http-equiv": "Content-Security-Policy", content: "object-src 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests" },
].forEach((attributes) => appendElement("meta", attributes));
