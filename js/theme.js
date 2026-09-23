(function () {
  if (window.KB_THEME_LOADED) return;
  window.KB_THEME_LOADED = true;

  const storageKey = "kalkulatorbazis-theme";
  const root = document.documentElement;
  const colors = { light: "#ffffff", dark: "#111827" };
  const seasonalCssAsset = "css/seasonal-theme.css?v=17b028ddc6f1";
  const seasonalMotifCssAsset = "css/seasonal-autumn-motifs.css?v=5859aa36e632";
  const seasonalGlobalCssAsset = "css/seasonal-autumn-global.css?v=86603e3e382b";
  const seasonalScriptAsset = "js/seasonal-theme.js?v=b4dad1e9d097";
  const homeIaScriptAsset = "js/home-ia.js?v=9eaa42ea3d98";
  const currentImpactCssAsset = "css/pages/current-impact.css?v=2d495ca7efb7";
  const currentImpactScriptAsset = "js/current-impact.js?v=7926006eea55";

  const projectAssetUrl = (asset) => {
    const projectRoot = String(window.KB_PROJECT_ROOT || "").replace(/\/+$/, "");
    return `${projectRoot}/${asset}`.replace(/\/{2,}/g, "/");
  };

  const loadSeasonalTheme = () => {
    if (!document.querySelector('link[data-kb-seasonal-theme="style"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = projectAssetUrl(seasonalCssAsset);
      link.dataset.kbSeasonalTheme = "style";
      document.head.appendChild(link);
    }

    if (!document.querySelector('link[data-kb-seasonal-theme="motifs"]')) {
      const motifLink = document.createElement("link");
      motifLink.rel = "stylesheet";
      motifLink.href = projectAssetUrl(seasonalMotifCssAsset);
      motifLink.dataset.kbSeasonalTheme = "motifs";
      document.head.appendChild(motifLink);
    }

    if (!document.querySelector('link[data-kb-seasonal-theme="global"]')) {
      const globalLink = document.createElement("link");
      globalLink.rel = "stylesheet";
      globalLink.href = projectAssetUrl(seasonalGlobalCssAsset);
      globalLink.dataset.kbSeasonalTheme = "global";
      document.head.appendChild(globalLink);
    }

    if (!document.querySelector('script[data-kb-seasonal-theme="script"]')) {
      const script = document.createElement("script");
      script.src = projectAssetUrl(seasonalScriptAsset);
      script.async = false;
      script.dataset.kbSeasonalTheme = "script";
      document.head.appendChild(script);
    }
  };

  const loadHomeInformationArchitecture = () => {
    if (!document.body?.classList.contains("home-page")) return;
    if (document.querySelector("script[data-kb-home-ia]")) return;

    const script = document.createElement("script");
    script.src = projectAssetUrl(homeIaScriptAsset);
    script.async = false;
    script.dataset.kbHomeIa = "";
    document.body.appendChild(script);
  };

  const loadCurrentImpact = () => {
    if (!document.body?.classList.contains("current-page")) return;
    if (!/\/aktualis\/[^/]+(?:\.html)?\/?$/i.test(window.location.pathname)) return;

    if (!document.querySelector('link[data-kb-current-impact="style"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = projectAssetUrl(currentImpactCssAsset);
      link.dataset.kbCurrentImpact = "style";
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[data-kb-current-impact="script"]')) {
      const script = document.createElement("script");
      script.src = projectAssetUrl(currentImpactScriptAsset);
      script.async = false;
      script.dataset.kbCurrentImpact = "script";
      document.body.appendChild(script);
    }
  };

  if (!document.body?.classList.contains("home-page")) loadSeasonalTheme();

  const readStoredTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  };

  const updateThemeColor = (theme) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", colors[theme]);
  };

  const updateButtons = (theme) => {
    const dark = theme === "dark";
    document.querySelectorAll(".theme-toggle, #themeBtn").forEach((button) => {
      const label = dark ? "Váltás világos módra" : "Váltás sötét módra";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(dark));
      if (button.id === "themeBtn") {
        const emoji = button.querySelector("#themeEmoji");
        const text = button.querySelector("#themeLabel");
        if (emoji) emoji.textContent = dark ? "☀" : "☾";
        if (text) text.textContent = dark ? "Világos" : "Sötét";
        return;
      }
      button.innerHTML = `
        <span class="theme-toggle-icon" aria-hidden="true">${dark ? "☀" : "☾"}</span>
        <span class="theme-toggle-text">${dark ? "Világos" : "Sötét"}</span>
      `;
    });
  };

  const applyTheme = (theme, persist) => {
    const next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    updateThemeColor(next);
    updateButtons(next);

    if (persist) {
      try {
        localStorage.setItem(storageKey, next);
      } catch (error) {
        // A téma ettől még az aktuális oldalon működik.
      }
    }

    document.dispatchEvent(new CustomEvent("kb:theme-changed", { detail: { theme: next } }));
  };

  const createToggle = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeToggle = "";
    return button;
  };

  const ensureToggle = () => {
    if (document.getElementById("themeBtn")) {
      updateButtons(root.dataset.theme || "light");
      return;
    }

    if (document.querySelector(".theme-toggle")) {
      updateButtons(root.dataset.theme || "light");
      return;
    }

    const header = document.querySelector("header");
    const container = header?.querySelector(".header-inner, .navbar") || header;
    const button = createToggle();

    if (container) {
      const menuButton = container.querySelector(".menu-toggle");
      if (menuButton) menuButton.before(button);
      else container.appendChild(button);
    } else if (document.getElementById("header")) {
      return;
    } else {
      button.classList.add("theme-toggle-floating");
      document.body.appendChild(button);
    }

    updateButtons(root.dataset.theme || "light");
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".theme-toggle");
    if (!button) return;
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light", false);
  });

  document.addEventListener("kb:component-loaded", ensureToggle);

  const init = () => {
    ensureToggle();
    applyTheme(root.dataset.theme || "light", false);
    loadHomeInformationArchitecture();
    loadCurrentImpact();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
