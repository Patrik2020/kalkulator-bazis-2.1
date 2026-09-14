(() => {
  "use strict";

  if (window.KB_HOME_IA_LOADED) return;
  window.KB_HOME_IA_LOADED = true;

  const root = String(window.KB_PROJECT_ROOT || "").replace(/\/+$/, "");
  const href = (path) => `${root}/${String(path || "").replace(/^\/+/, "")}`.replace(/^\/$/, "./");
  const cssAsset = href("css/pages/home-ia.css?v=577fd9fff894");

  const ensureStyles = () => {
    if (document.querySelector('link[data-home-ia-style]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssAsset;
    link.dataset.homeIaStyle = "2026-09";
    document.head.appendChild(link);
  };

  const setText = (element, text) => {
    if (element && element.textContent !== text) element.textContent = text;
  };

  const buildGateway = () => {
    const sections = document.querySelector(".home-sections");
    if (!sections) return null;

    let gateway = sections.querySelector(".home-intent-gateway");
    if (gateway) return gateway;

    gateway = document.createElement("section");
    gateway.className = "home-intent-gateway";
    gateway.setAttribute("aria-labelledby", "homeIntentTitle");
    gateway.innerHTML = `
      <div class="home-intent-head">
        <span class="section-label">Egyértelmű kiindulópont</span>
        <h2 id="homeIntentTitle">Mit szeretnél csinálni?</h2>
        <p>Ne a teljes eszköztárból kelljen választanod. Indulj abból, milyen feladatot szeretnél megoldani.</p>
      </div>
      <div class="home-intent-grid">
        <a class="home-intent-card home-intent-card-calc" href="${href("kalkulatorok")}">
          <span class="home-intent-number" aria-hidden="true">01</span>
          <span class="home-intent-icon" aria-hidden="true">Σ</span>
          <span class="home-intent-copy">
            <strong>Számolni</strong>
            <small>Ha tudod, milyen eredményre van szükséged.</small>
          </span>
          <span class="home-intent-arrow" aria-hidden="true">→</span>
        </a>
        <a class="home-intent-card home-intent-card-decision" href="${href("dontesek")}">
          <span class="home-intent-number" aria-hidden="true">02</span>
          <span class="home-intent-icon" aria-hidden="true">◇</span>
          <span class="home-intent-copy">
            <strong>Dönteni</strong>
            <small>Ha egy élethelyzethez több számítást is össze kell raknod.</small>
          </span>
          <span class="home-intent-arrow" aria-hidden="true">→</span>
        </a>
        <a class="home-intent-card home-intent-card-compare" href="${href("osszehasonlitas")}">
          <span class="home-intent-number" aria-hidden="true">03</span>
          <span class="home-intent-icon" aria-hidden="true">A/B</span>
          <span class="home-intent-copy">
            <strong>Összehasonlítani</strong>
            <small>Ha két forgatókönyv közül szeretnél választani.</small>
          </span>
          <span class="home-intent-arrow" aria-hidden="true">→</span>
        </a>
      </div>`;

    sections.insertBefore(gateway, sections.firstElementChild);
    return gateway;
  };

  const simplifyHome = () => {
    if (!document.body.classList.contains("home-page")) return;
    ensureStyles();
    document.body.classList.add("home-information-architecture");

    const gateway = buildGateway();
    const sections = document.querySelector(".home-sections");
    if (!sections || !gateway) return;

    const categoryTitle = document.getElementById("categoriesTitle");
    const categorySection = categoryTitle?.closest("section");
    if (categorySection) {
      categorySection.classList.add("home-ia-categories");
      setText(categorySection.querySelector(".section-label"), "Számolni szeretnék");
      setText(categoryTitle, "Válassz témát");
      const intro = categorySection.querySelector(".section-intro > p, .section-intro p");
      if (intro) setText(intro, "Hat fő témakörből indulhatsz, az összes kalkulátor pedig külön katalógusban marad elérhető.");
    }

    const popularTitle = document.getElementById("popularTitle");
    const popularSection = popularTitle?.closest("section");
    if (popularSection) {
      popularSection.classList.add("home-ia-popular");
      setText(popularSection.querySelector(".section-label"), "Gyakori számítások");
      setText(popularTitle, "Amit a legtöbben keresnek");
    }

    const currentPanel = sections.querySelector(".home-current-panel");
    if (currentPanel) currentPanel.classList.add("home-ia-current");

    const featured = sections.querySelector(".new-tools");
    if (featured) featured.classList.add("home-ia-featured");

    const method = sections.querySelector(".method-foundation");
    if (method) method.classList.add("home-ia-method");

    const faq = sections.querySelector(".home-faq");
    if (faq) faq.classList.add("home-ia-faq");

    // Ezek a blokkok értékesek, de a főoldalon ugyanazt a szerepet ismételték,
    // amit az új Döntések/Tudástár útvonalak már tisztábban lefednek.
    [
      sections.querySelector(".home-life-section"),
      sections.querySelector(".learning-highlight"),
      sections.querySelector(".trust-band"),
      sections.querySelector(".about-home"),
    ].forEach((node) => {
      if (node) node.hidden = true;
    });

    const heroActions = document.querySelector(".home-hero-actions");
    if (heroActions) heroActions.hidden = true;

    // A fő tartalmi sorrend legyen rövid és kiszámítható. Csak akkor mozgatunk
    // DOM-elemet, ha a látható fő blokkok sorrendje ténylegesen eltér.
    const ordered = [
      gateway,
      categorySection,
      popularSection,
      currentPanel,
      featured,
      method,
      faq,
      sections.querySelector('[data-render="wise-banner"]'),
      sections.querySelector('[data-render="ad-slot"]'),
    ].filter(Boolean);

    const orderedSet = new Set(ordered);
    const currentOrder = [...sections.children].filter((node) => orderedSet.has(node));
    const isAlreadyOrdered =
      currentOrder.length === ordered.length &&
      currentOrder.every((node, index) => node === ordered[index]);

    if (!isAlreadyOrdered) {
      ordered.forEach((node) => sections.appendChild(node));
    }
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      simplifyHome();
    });
  };

  const start = () => {
    if (!document.body.classList.contains("home-page")) return;
    simplifyHome();

    // A főoldal több eleme futásidőben materializálódik; az observer csak az
    // információs architektúrát tartja stabilan, új tartalmat nem generál újra.
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(simplifyHome, 120);
    window.setTimeout(simplifyHome, 500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
