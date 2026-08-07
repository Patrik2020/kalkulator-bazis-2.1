(() => {
  "use strict";

  const root = window.KB_PROJECT_ROOT || "";
  const href = (path) => `${root}${path}` || "/";

  const revealWhenReady = () => {
    window.KB_CALCULATOR_ENHANCEMENTS_READY = true;
    if (window.KB_SITE_ENHANCEMENTS_READY) {
      document.documentElement.classList.add("kb-calculator-ready");
    }
  };

  const init = () => {
    const main = document.querySelector("main");
    const hero = main?.querySelector(":scope > .hero");
    const heading = hero?.querySelector("h1") || main?.querySelector("h1");
    if (!main || !heading) {
      revealWhenReady();
      return;
    }

    main.classList.add("kb-calculator-main");

    if (hero && !main.querySelector(":scope > .breadcrumb, :scope > .kb-breadcrumb")) {
      const breadcrumb = document.createElement("nav");
      breadcrumb.className = "kb-breadcrumb";
      breadcrumb.setAttribute("aria-label", "Morzsamenü");
      breadcrumb.innerHTML = `
        <ol>
          <li><a href="${href("/")}">Főoldal</a></li>
          <li><a href="${href("/kalkulatorok.html")}">Kalkulátorok</a></li>
          <li aria-current="page">${escapeHtml(heading.textContent.trim())}</li>
        </ol>`;
      hero.before(breadcrumb);
    }

    if (hero && !main.querySelector(":scope > .kb-page-meta")) {
      const meta = document.createElement("aside");
      meta.className = "kb-page-meta";
      meta.setAttribute("aria-label", "Az oldal megbízhatósági információi");
      meta.innerHTML = `
        <span><strong>Helyben számol</strong><small>A bevitt kalkulátoradatok a böngészőben maradnak</small></span>
        <span><strong>Független magyar fejlesztés</strong><small>Készítette: Kovács Patrik</small></span>
        <span><strong>Technikailag frissítve</strong><small><time datetime="2026-08-07">2026. augusztus 7.</time></small></span>
        <span class="kb-page-meta__links">
          <a href="${href("/szamitasi-modszertan.html")}">Módszertan</a>
          <a href="${href("/kapcsolat.html?tema=hiba")}">Hibát jelzek</a>
        </span>`;
      hero.after(meta);
    }

    main.querySelectorAll(".card-calculator").forEach((card) => {
      card.classList.add("kb-calculator-shell");
    });

    revealWhenReady();
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
