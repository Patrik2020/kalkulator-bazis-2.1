(function () {
  if (window.KB_THEME_LOADED) return;
  window.KB_THEME_LOADED = true;

  const storageKey = "kalkulatorbazis-theme";
  const root = document.documentElement;
  const colors = { light: "#ffffff", dark: "#111827" };

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
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      const label = dark ? "Váltás világos módra" : "Váltás sötét módra";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(dark));
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
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
