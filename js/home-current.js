(() => {
  "use strict";
  if (!document.body.classList.contains("home-page")) return;

  const root = document.documentElement;
  const base = String(window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
  const url = (path) => `${base}/${String(path).replace(/^\//, "")}`.replace(/^\/$/, "./");

  // Approved V17 defaults: Hungarian, automatic season, OS theme on every load.
  try { localStorage.removeItem("kalkulatorbazis-theme"); } catch (_) {}
  const month = new Date().getMonth() + 1;
  root.lang = "hu";
  root.dataset.language = "hu";
  root.dataset.season = month >= 3 && month <= 5 ? "spring" : month >= 6 && month <= 8 ? "summer" : month >= 9 && month <= 11 ? "autumn" : "winter";
  root.dataset.theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.style.colorScheme = root.dataset.theme;
  document.body.classList.add("home-redesign-v17");

  // Remove legacy homepage-only visual layers; global cookie/PWA/site data stay intact.
  document.querySelectorAll('link[data-home-professional-style],link[data-kb-seasonal-theme],script[data-kb-home-ia]').forEach((node) => node.remove());

  const css = [
    "css/pages/home-redesign-v17.css?v=20260920-2",
    "css/pages/home-redesign-seasons.css?v=20260920-2",
    "css/pages/home-redesign-categories.css?v=20260920-2",
    "css/pages/home-redesign-season-spring.css?v=20260920-2",
    "css/pages/home-redesign-season-summer.css?v=20260920-2",
    "css/pages/home-redesign-season-autumn.css?v=20260920-2",
    "css/pages/home-redesign-season-winter.css?v=20260920-2",
    "css/pages/home-redesign-category-finance.css?v=20260920-2",
    "css/pages/home-redesign-category-home.css?v=20260920-2",
    "css/pages/home-redesign-category-auto.css?v=20260920-2",
    "css/pages/home-redesign-category-health.css?v=20260920-2",
    "css/pages/home-redesign-category-everyday.css?v=20260920-2",
    "css/pages/home-redesign-category-convert.css?v=20260920-2",
  ];
  css.forEach((href) => {
    if (document.querySelector(`link[href*="${href.split("?")[0]}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url(href);
    document.head.appendChild(link);
  });

  const fetchText = async (path) => {
    const response = await fetch(url(path), { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.text();
  };

  const replace = (selector, html) => {
    const current = document.querySelector(selector);
    if (!current) return;
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    current.replaceWith(template.content);
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url(src);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  Promise.all([
    fetchText("fragments/home-redesign-v17-header.html"),
    fetchText("fragments/home-redesign-v17-main.html"),
    fetchText("fragments/home-redesign-v17-footer.html"),
  ]).then(async ([header, main, footer]) => {
    document.querySelectorAll(".kb-help-launcher,.kb-help-panel,[data-kb-backdrop]").forEach((node) => node.remove());
    replace("#header", header);
    replace("main", main);
    replace("#footer", footer);
    await loadScript("js/home-redesign-i18n.js?v=20260920-2");
    await loadScript("js/home-redesign-v17.js?v=20260920-2");
    document.dispatchEvent(new CustomEvent("kb:home-redesign-ready"));
  }).catch((error) => {
    console.error("Kalkulátor Bázis homepage redesign could not initialize.", error);
    document.body.classList.remove("home-redesign-v17");
  });
})();
