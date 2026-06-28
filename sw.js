const KB_SW_VERSION = "2026-06-28-dividend-pro-v1";
const KB_CACHE_PREFIX = "kalkulatorbazis-static";
const KB_STATIC_CACHE = `${KB_CACHE_PREFIX}-${KB_SW_VERSION}`;
const KB_CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./css/theme.css",
  "./css/components/retention-cta.css",
  "./js/pwa.js",
  "./js/utils.js",
  "./js/site-data.js",
  "./js/site-ui.js",
  "./js/cookie.js",
  "./js/retention-cta.js",
  "./components/header.html",
  "./components/footer.html",
  "./components/retention-cta.html",
  "./favicon/favicon-32x32.png",
  "./favicon/apple-touch-icon.png",
  "./favicon/web-app-manifest-192x192.png",
  "./favicon/web-app-manifest-512x512.png",
];
const KB_STATIC_EXTENSION_PATTERN =
  /\.(?:png|jpe?g|webp|svg|ico|woff2?)$/i;
const KB_FRESH_EXTENSION_PATTERN = /\.(?:css|js|webmanifest)$/i;
const KB_EXTERNAL_BYPASS_HOSTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "googlesyndication.com",
  "doubleclick.net",
  "wise.prf.hn",
  "wise-creative.prf.hn",
  "frankfurter.dev",
];

const isBypassedExternal = (url) =>
  url.origin !== self.location.origin ||
  KB_EXTERNAL_BYPASS_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));

const cacheCoreAssets = async () => {
  const cache = await caches.open(KB_STATIC_CACHE);
  await Promise.allSettled(
    KB_CORE_ASSETS.map((asset) =>
      cache.add(new Request(new URL(asset, self.registration.scope), { cache: "reload" }))
    )
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(KB_CACHE_PREFIX) && key !== KB_STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const networkFirst = async (request) => {
  const cache = await caches.open(KB_STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response(
      "<!doctype html><html lang=\"hu\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Offline</title><body><main><h1>Offline vagy</h1><p>Ehhez az oldalhoz vagy aktuális külső adathoz internetkapcsolat szükséges.</p></main></body></html>",
      {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(KB_STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (isBypassedExternal(url)) return;

  const acceptsHtml = request.headers.get("accept")?.includes("text/html");

  if (request.mode === "navigate" || acceptsHtml) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (KB_FRESH_EXTENSION_PATTERN.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    KB_STATIC_EXTENSION_PATTERN.test(url.pathname) ||
    url.pathname.includes("/components/")
  ) {
    event.respondWith(cacheFirst(request));
  }
});
