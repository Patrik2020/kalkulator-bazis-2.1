(() => {
  "use strict";

  if (!document.body?.classList.contains("home-page")) return;
  if (window.KB_HOME_CURRENT_LOADING) return;
  window.KB_HOME_CURRENT_LOADING = true;

  const root = document.documentElement;
  const base = String(window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
  const url = (path) => `${base}/${String(path).replace(/^\//, "")}`.replace(/^\/$/, "./");
  const scriptAssets = [
    "js/home-redesign-i18n-hu.js?v=e16382283760",
    "js/home-redesign-i18n-en.js?v=2afb10ea4b0e",
    "js/home-redesign-i18n-de.js?v=c7098ff2d797",
    "js/home-redesign-help-i18n-hu.js?v=c61429bad988",
    "js/home-redesign-help-i18n-en.js?v=1258bd945bfa",
    "js/home-redesign-help-i18n-de.js?v=dbfccc2f4617",
    "js/home-redesign-core.js?v=057eb4f37a53",
    "js/home-redesign-salary.js?v=94d69eb1d46d",
    "js/home-redesign-help.js?v=da196881f978",
  ];

  const month = new Date().getMonth() + 1;
  root.lang = "hu";
  root.dataset.language = "hu";
  root.dataset.season = month >= 3 && month <= 5
    ? "spring"
    : month >= 6 && month <= 8
      ? "summer"
      : month >= 9 && month <= 11
        ? "autumn"
        : "winter";
  root.dataset.theme = root.dataset.theme === "dark" ? "dark" : "light";
  root.style.colorScheme = root.dataset.theme;
  document.body.classList.add("home-redesign-v17");

  // A főoldal saját szezonális réteget használ; a globális változat itt csak
  // felesleges hálózati és újrarajzolási munkát okozna.
  document.querySelectorAll("link[data-kb-seasonal-theme]").forEach((node) => node.remove());

  if (!document.querySelector("link[data-home-redesign-v17]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url("css/pages/home-redesign-v17.css?v=00de6652c59d");
    link.dataset.homeRedesignV17 = "";
    document.head.appendChild(link);
  }

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

  const findScriptByPath = (src) => {
    const targetPath = new URL(url(src), window.location.href).pathname;
    return [...document.querySelectorAll("script[src]")].find((script) => {
      try {
        return new URL(script.src, window.location.href).pathname === targetPath;
      } catch (error) {
        return false;
      }
    });
  };

  const loadOnce = (src) => new Promise((resolve, reject) => {
    const existing = findScriptByPath(src);
    if (existing) {
      if (existing.dataset.kbLoaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = url(src);
    script.addEventListener("load", () => {
      script.dataset.kbLoaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.body.appendChild(script);
  });

  const preserveStaticQualityMarkers = (main) => {
    if (!main || main.querySelector("[data-kb-static-quality-final-start]")) return;
    const marker = (name, value) => {
      const element = document.createElement("span");
      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
      element.setAttribute(name, "");
      element.dataset.kbStaticMarker = value;
      return element;
    };
    const start = marker("data-kb-static-quality-final-start", "KB_STATIC:quality-final:START");
    const end = marker("data-kb-static-quality-final-end", "KB_STATIC:quality-final:END");
    const trust = main.querySelector("#trust") || main.lastElementChild;
    if (trust) {
      main.insertBefore(start, trust);
      trust.after(end);
    } else {
      main.prepend(start);
      main.append(end);
    }
  };

  const hasStaticShell = () =>
    document.body.dataset.homeRedesignStatic === "17" &&
    Boolean(document.querySelector(".kb-header-wrap #header")) &&
    Boolean(document.querySelector("main#main-content .hero-grid")) &&
    Boolean(document.querySelector("footer .footer-grid-v3")) &&
    Boolean(document.getElementById("langPop")) &&
    Boolean(document.getElementById("seasonPop"));

  const mountShell = async () => {
    if (!hasStaticShell()) {
      const [header, main, footer] = await Promise.all([
        fetchText("fragments/home-redesign-v17-header.inc"),
        fetchText("fragments/home-redesign-v17-main.inc"),
        fetchText("fragments/home-redesign-v17-footer.inc"),
      ]);

      document.querySelectorAll(".kb-help-launcher,.kb-help-panel,[data-kb-backdrop]").forEach((node) => node.remove());
      replace(".kb-header-wrap, #header", header);
      replace("main", main);
      replace("#footer, footer", footer);

      const redesignedMain = document.querySelector("main");
      if (redesignedMain) redesignedMain.id = "main-content";
      const hero = redesignedMain?.querySelector(".hero");
      if (hero) hero.id = "top";
    }

    preserveStaticQualityMarkers(document.querySelector("main"));
    for (const src of scriptAssets) await loadOnce(src);

    window.KB_HOME_CURRENT_READY = true;
    document.dispatchEvent(new CustomEvent("kb:home-redesign-ready"));
  };

  mountShell().catch((error) => {
    window.KB_HOME_CURRENT_LOADING = false;
    console.error("Kalkulátor Bázis homepage redesign could not initialize.", error);
    if (!hasStaticShell()) document.body.classList.remove("home-redesign-v17");
  });
})();
