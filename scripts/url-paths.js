const SITE_ORIGIN = "https://kalkulatorbazis.hu";
const SITE_HOSTS = new Set(["kalkulatorbazis.hu", "www.kalkulatorbazis.hu"]);

function normalizeSourceFile(value) {
  return String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
}

function sourceFileToPublicPath(sourceFile) {
  const normalized = normalizeSourceFile(sourceFile) || "index.html";

  if (normalized === "index.html") return "/";
  if (/\/index\.html$/i.test(normalized)) {
    return `/${normalized.replace(/index\.html$/i, "")}`;
  }
  if (/\.html$/i.test(normalized)) {
    return `/${normalized.replace(/\.html$/i, "")}`;
  }

  return `/${normalized}`;
}

function publicPathToSourceFile(publicPath) {
  let pathname = publicPath instanceof URL ? publicPath.pathname : String(publicPath || "");
  pathname = decodeURIComponent(pathname.split(/[?#]/, 1)[0])
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  if (!pathname) return "index.html";
  if (pathname.endsWith("/")) return `${pathname}index.html`;
  if (/\.html$/i.test(pathname)) return pathname;
  return `${pathname}.html`;
}

function publicUrlForSource(sourceFile, siteOrigin = SITE_ORIGIN) {
  return `${siteOrigin.replace(/\/+$/, "")}${sourceFileToPublicPath(sourceFile)}`;
}

function stripHtmlFromPath(pathname) {
  if (!/\.html$/i.test(pathname)) return pathname;
  if (/\/index\.html$/i.test(pathname)) return pathname.replace(/index\.html$/i, "");
  if (/^index\.html$/i.test(pathname)) return "./";
  return pathname.replace(/\.html$/i, "");
}

function toExtensionlessHref(value) {
  const original = String(value || "");
  if (!original || /^(?:mailto:|tel:|javascript:|data:|#)/i.test(original)) return original;

  if (/^https?:\/\//i.test(original)) {
    try {
      const url = new URL(original);
      if (!SITE_HOSTS.has(url.hostname.toLowerCase())) return original;
      url.pathname = stripHtmlFromPath(url.pathname);
      return url.href;
    } catch {
      return original;
    }
  }

  if (/^\/\//.test(original)) {
    try {
      const url = new URL(`https:${original}`);
      if (!SITE_HOSTS.has(url.hostname.toLowerCase())) return original;
      url.pathname = stripHtmlFromPath(url.pathname);
      return url.href.replace(/^https:/, "");
    } catch {
      return original;
    }
  }

  const match = original.match(/^([^?#]*)([?#][\s\S]*)?$/);
  if (!match) return original;
  return `${stripHtmlFromPath(match[1])}${match[2] || ""}`;
}

module.exports = {
  SITE_HOSTS,
  SITE_ORIGIN,
  publicPathToSourceFile,
  publicUrlForSource,
  sourceFileToPublicPath,
  toExtensionlessHref,
};
