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
  initialTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;

const pathParts = window.location.pathname.split("/").filter(Boolean);
const sectionIndex = ["kalkulatorok", "landing-pages"].reduce((found, section) => {
  const index = pathParts.indexOf(section);
  return found === -1 || (index !== -1 && index < found) ? index : found;
}, -1);
const isFilePath = (value) =>
  /\.(?:html?|css|js|json|xml|txt|png|jpe?g|webp|svg|ico|webmanifest)$/i.test(
    value
  );
const rootParts =
  sectionIndex > -1
    ? pathParts.slice(0, sectionIndex)
    : pathParts.length === 1 && !isFilePath(pathParts[0])
      ? pathParts
      : pathParts.length > 1
      ? pathParts.slice(0, 1)
      : [];
const projectRoot = rootParts.length ? `/${rootParts.join("/")}` : "";
const basePath = `${projectRoot}/favicon`;
const themeCssPath = `${projectRoot}/css/theme.css`;
const footerCssPath = `${projectRoot}/css/layout/footer.css`;
const cookieCssPath = `${projectRoot}/css/components/cookie.css`;
const themeScriptPath = `${projectRoot}/js/theme.js`;

window.dataLayer = window.dataLayer || [];
window.gtag =
  window.gtag ||
  function () {
    window.dataLayer.push(arguments);
  };

window.gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
});

const appendElement = (tagName, attributes) => {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  document.head.appendChild(element);
};

const hasMainStylesheet = () =>
  [...document.querySelectorAll('link[rel~="stylesheet"][href]')].some((link) => {
    const rawHref = link.getAttribute("href") || "";
    const resolvedHref = link.href || "";

    return (
      /(^|\/)css\/style\.css(?:[?#].*)?$/i.test(rawHref) ||
      /\/css\/style\.css(?:[?#].*)?$/i.test(resolvedHref)
    );
  });

[
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-16x16.png`, sizes: "16x16" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-32x32.png`, sizes: "32x32" },
  { rel: "icon", type: "image/png", href: `${basePath}/favicon-96x96.png`, sizes: "96x96" },
  { rel: "icon", type: "image/svg+xml", href: `${basePath}/favicon.svg` },
  { rel: "shortcut icon", href: `${basePath}/favicon.ico` },
  { rel: "apple-touch-icon", sizes: "180x180", href: `${basePath}/apple-touch-icon.png` },
  { rel: "manifest", href: `${basePath}/site.webmanifest` },
].forEach((attributes) => appendElement("link", attributes));

appendElement("link", { rel: "stylesheet", href: themeCssPath });

if (!hasMainStylesheet()) {
  appendElement("link", { rel: "stylesheet", href: footerCssPath });
  appendElement("link", { rel: "stylesheet", href: cookieCssPath });
}

appendElement("script", { src: themeScriptPath, defer: "" });

[
  { name: "application-name", content: "KalkulátorBázis" },
  { name: "apple-mobile-web-app-title", content: "KalkulátorBázis" },
  { name: "referrer", content: "strict-origin-when-cross-origin" },
  { name: "theme-color", content: initialTheme === "dark" ? "#111827" : "#ffffff" },
  {
    "http-equiv": "Content-Security-Policy",
    content: "object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  },
].forEach((attributes) => appendElement("meta", attributes));
