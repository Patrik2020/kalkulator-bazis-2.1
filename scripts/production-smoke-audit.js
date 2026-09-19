const fs = require("fs").promises;

const baseUrl = new URL(process.env.KB_PRODUCTION_BASE_URL || "https://kalkulatorbazis.hu");
const attempts = Math.max(1, Number(process.env.KB_PRODUCTION_ATTEMPTS || 1));
const retryDelayMs = Math.max(0, Number(process.env.KB_PRODUCTION_RETRY_DELAY_MS || 15000));
const requestTimeoutMs = Math.max(1000, Number(process.env.KB_PRODUCTION_REQUEST_TIMEOUT_MS || 15000));
const userAgent = "KalkulatorBazis-Production-Smoke/1.0 (+https://kalkulatorbazis.hu/)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizePath = (value) => {
  const pathname = new URL(value, baseUrl).pathname;
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const fetchResponse = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(new URL(path, baseUrl), {
      redirect: options.redirect || "follow",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept: options.accept || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const fetchText = async (path, options = {}) => {
  const response = await fetchResponse(path, options);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status}`);
  }
  return { response, body };
};

const parseSitemapUrls = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .sort();

const parseRedirectRules = (source) =>
  source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 3 && parts[2] === "301")
    .map(([from, to, status]) => ({ from, to, status: Number(status) }));

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const assertExactSet = (actual, expected, label) => {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter((item) => !actualSet.has(item));
  const extra = actual.filter((item) => !expectedSet.has(item));

  if (missing.length || extra.length) {
    const details = [
      missing.length ? `missing: ${missing.join(", ")}` : "",
      extra.length ? `extra: ${extra.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
    throw new Error(`${label} mismatch (${details})`);
  }
};

const runAudit = async () => {
  const [localSitemap, localRobots, localAds, redirectSource] = await Promise.all([
    fs.readFile("sitemap.xml", "utf8"),
    fs.readFile("robots.txt", "utf8"),
    fs.readFile("ads.txt", "utf8"),
    fs.readFile("_redirects", "utf8"),
  ]);

  const pageChecks = [
    {
      path: "/",
      markers: [
        "Magyar nyelvű kalkulátorok és döntési segédletek",
        "A Kalkulátor Bázis már ChatGPT-bővítményként is elérhető",
      ],
      forbidden: [/Több mint\s+\d+\s+magyar nyelvű kalkulátor/i, /100\+\s*kalkulátor/i],
    },
    {
      path: "/kalkulatorok/atlag-kalkulator",
      markers: [
        "data-average-hub=\"true\"",
        "Számtani átlag + medián",
        "Súlyozott átlag",
        "Mértani átlag",
      ],
    },
    {
      path: "/kalkulatorok/mertekegyseg-atvalto-kalkulator",
      markers: [
        "Mértékegység átváltó – 11 kategória egy helyen",
        "id=\"measurementType\"",
      ],
    },
    {
      path: "/kalkulatorok/netto-brutto-kalkulator",
      markers: ["google-adsense-account", "Nettó"],
    },
    {
      path: "/aktualis",
      markers: ["Friss számok és változások", "Aktuális közlemények"],
    },
  ];

  for (const check of pageChecks) {
    const { response, body } = await fetchText(check.path);
    assert(response.url.startsWith(baseUrl.origin), `${check.path}: unexpected final host ${response.url}`);
    for (const marker of check.markers) {
      assert(body.includes(marker), `${check.path}: missing production marker: ${marker}`);
    }
    for (const pattern of check.forbidden || []) {
      assert(!pattern.test(body), `${check.path}: forbidden stale copy matched ${pattern}`);
    }
  }

  const { body: liveSitemap } = await fetchText("/sitemap.xml", { accept: "application/xml,text/xml,*/*" });
  const expectedSitemapUrls = parseSitemapUrls(localSitemap);
  const liveSitemapUrls = parseSitemapUrls(liveSitemap);
  assert(expectedSitemapUrls.length > 0, "Local sitemap has no URLs");
  assert(liveSitemapUrls.length > 0, "Production sitemap has no URLs");
  assertExactSet(liveSitemapUrls, expectedSitemapUrls, "Production sitemap URL set");
  assert(!liveSitemapUrls.some((url) => /\.html(?:$|[?#])/.test(url)), "Production sitemap contains .html URLs");

  const { body: liveRobots } = await fetchText("/robots.txt", { accept: "text/plain,*/*" });
  for (const line of localRobots.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    assert(liveRobots.includes(line), `robots.txt: production is missing local rule: ${line}`);
  }

  const { body: liveAds } = await fetchText("/ads.txt", { accept: "text/plain,*/*" });
  const expectedAdLines = localAds.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const liveAdLines = liveAds.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  for (const line of expectedAdLines) {
    assert(liveAdLines.includes(line), `ads.txt: production is missing: ${line}`);
  }

  const redirectRules = parseRedirectRules(redirectSource);
  assert(redirectRules.length >= 26, `Expected at least 26 permanent redirect rules, found ${redirectRules.length}`);

  const sitemapPathSet = new Set(liveSitemapUrls.map(normalizePath));
  for (const rule of redirectRules) {
    const response = await fetchResponse(rule.from, { redirect: "manual" });
    assert(response.status === rule.status, `${rule.from}: expected HTTP ${rule.status}, got ${response.status}`);
    const location = response.headers.get("location");
    assert(location, `${rule.from}: missing Location header`);
    assert(normalizePath(location) === normalizePath(rule.to), `${rule.from}: expected redirect to ${rule.to}, got ${location}`);
    assert(!sitemapPathSet.has(normalizePath(rule.from)), `${rule.from}: retired redirect source is still present in sitemap`);
  }

  return {
    pages: pageChecks.length,
    sitemapUrls: liveSitemapUrls.length,
    redirects: redirectRules.length,
  };
};

async function main() {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await runAudit();
      console.log(
        `Production smoke passed: ${result.pages} key pages, ${result.sitemapUrls} sitemap URLs, ${result.redirects} permanent redirects.`
      );
      return;
    } catch (error) {
      lastError = error;
      console.error(`Production smoke attempt ${attempt}/${attempts} failed: ${error.message}`);
      if (attempt < attempts) await sleep(retryDelayMs);
    }
  }

  throw lastError || new Error("Production smoke failed");
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
