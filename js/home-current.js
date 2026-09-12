(() => {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

  const root = (window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
  const href = (path) => `${root}/${path.replace(/^\//, "")}`.replace(/^\/$/, "./");

  const currentHref = href("aktualis");
  const inflationHref = href("aktualis/ksh-inflacio-2026-augusztus");
  const fuelHref = href("aktualis/nav-uzemanyag-elszamolasi-arak-2026-szeptember");
  const professionalCss = href("css/pages/home-professional.css?v=f820d7ad3f13");

  if (!document.querySelector('link[data-home-professional-style]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = professionalCss;
    stylesheet.dataset.homeProfessionalStyle = "2026-09";
    document.head.appendChild(stylesheet);
  }

  document.body.classList.add("home-professional");

  const knowledgeMenu = document.querySelector(".nav-knowledge .nav-submenu");
  if (knowledgeMenu && !knowledgeMenu.querySelector('a[href$="/aktualis"], a[href="./aktualis"], a[href="/aktualis"]')) {
    const link = document.createElement("a");
    link.href = currentHref;
    link.textContent = "Aktuális változások";
    knowledgeMenu.prepend(link);
  }

  const infoFooter = document.querySelector('nav[aria-label="Információ és bizalom"]');
  if (infoFooter && !infoFooter.querySelector('a[href$="/aktualis"], a[href="./aktualis"], a[href="/aktualis"]')) {
    const link = document.createElement("a");
    link.href = currentHref;
    link.textContent = "Aktuális változások";
    const heading = infoFooter.querySelector("h2");
    if (heading?.nextSibling) infoFooter.insertBefore(link, heading.nextSibling);
    else infoFooter.appendChild(link);
  }

  const hero = document.querySelector(".home-hero");
  if (hero && !hero.dataset.homeProfessional) {
    hero.dataset.homeProfessional = "2026-09";

    const eyebrow = hero.querySelector(".home-eyebrow");
    if (eyebrow) {
      eyebrow.innerHTML = '<span class="home-eyebrow-dot" aria-hidden="true"></span>100+ kalkulátor · magyarul · ingyen';
    }

    const title = hero.querySelector("#homeHeroTitle");
    if (title) title.innerHTML = 'Számolj egyszerűen.<br /><span>Lásd tisztán az eredményt.</span>';

    const lead = hero.querySelector(".home-hero-lead");
    if (lead) {
      lead.textContent = "Online kalkulátorok pénzügyhöz, otthonhoz, autózáshoz, egészséghez és a mindennapi döntésekhez – érthető magyarázatokkal, felesleges körök nélkül.";
    }
  }

  const categoryMeta = [
    { selector: 'a[href="mindennapi"], a[href="./mindennapi"], a[href$="/mindennapi"]', key: "everyday", symbol: "Σ" },
    { selector: 'a[href="penzugyi"], a[href="./penzugyi"], a[href$="/penzugyi"]', key: "finance", symbol: "Ft" },
    { selector: 'a[href="epitoipari"], a[href="./epitoipari"], a[href$="/epitoipari"]', key: "home", symbol: "⌂" },
    { selector: 'a[href="auto"], a[href="./auto"], a[href$="/auto"]', key: "auto", symbol: "↗" },
    { selector: 'a[href="egeszseg"], a[href="./egeszseg"], a[href$="/egeszseg"]', key: "health", symbol: "+" },
    { selector: 'a[href="atvaltok"], a[href="./atvaltok"], a[href$="/atvaltok"]', key: "convert", symbol: "⇄" },
  ];

  const categoryGrid = document.querySelector(".home-category-grid");
  if (categoryGrid) {
    categoryMeta.forEach(({ selector, key, symbol }) => {
      const card = categoryGrid.querySelector(selector);
      if (!card) return;
      card.dataset.homeCategory = key;
      if (!card.querySelector(".home-category-symbol")) {
        const icon = document.createElement("span");
        icon.className = "home-category-symbol";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = symbol;
        card.prepend(icon);
      }
    });
  }

  const popularGrid = document.querySelector(".popular-grid");
  if (popularGrid) {
    [...popularGrid.querySelectorAll(":scope > a")].forEach((card, index) => {
      if (card.querySelector(".home-popular-index")) return;
      const marker = document.createElement("span");
      marker.className = "home-popular-index";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = String(index + 1).padStart(2, "0");
      card.prepend(marker);
    });
  }

  const sections = document.querySelector(".home-sections");
  if (!sections) return;

  const oldCurrent = sections.querySelector("[data-home-current]");
  if (oldCurrent && !oldCurrent.classList.contains("home-current-panel")) oldCurrent.remove();

  let currentPanel = sections.querySelector(".home-current-panel");
  if (!currentPanel) {
    currentPanel = document.createElement("section");
    currentPanel.className = "home-current-panel";
    currentPanel.dataset.homeCurrent = "2026-09-12";
    currentPanel.setAttribute("aria-labelledby", "currentUpdatesTitle");
    currentPanel.innerHTML = `
      <div class="home-current-head">
        <div>
          <span class="home-current-kicker">Hivatalos adatokból</span>
          <h2 id="currentUpdatesTitle">Aktuális változások</h2>
        </div>
        <a class="home-current-all" href="${currentHref}">Minden közlemény</a>
      </div>
      <div class="home-current-layout">
        <a class="home-current-main" href="${inflationHref}">
          <strong class="home-current-metric">1,3%</strong>
          <span>
            <small>KSH · 2026. szeptember 8.</small>
            <h3>Ennyi volt az éves infláció 2026 augusztusában</h3>
            <p>Júliushoz képest 0,2%-kal emelkedtek az árak. Röviden megmutatjuk, mit jelent ez a vásárlóerő szempontjából.</p>
          </span>
        </a>
        <a class="home-current-side" href="${fuelHref}">
          <span>
            <small>NAV · 2026. szeptember</small>
            <strong>NAV üzemanyag-elszámolási árak</strong>
          </span>
          <span class="home-current-prices" aria-label="Szeptemberi NAV üzemanyag-elszámolási árak">
            <span class="home-current-price"><strong>604 Ft/l</strong><span>Benzin</span></span>
            <span class="home-current-price"><strong>667 Ft/l</strong><span>Gázolaj</span></span>
          </span>
          <p>Az augusztusi értékekhez képest a benzin 24, a gázolaj 75 forinttal emelkedett literenként.</p>
        </a>
      </div>`;

    const before = sections.querySelector(".new-tools");
    if (before) sections.insertBefore(currentPanel, before);
    else sections.appendChild(currentPanel);
  }

  const featured = sections.querySelector(".new-tools");
  if (featured && !featured.dataset.homeProfessional) {
    featured.dataset.homeProfessional = "2026-09";
    featured.classList.add("home-featured-tool");
    featured.innerHTML = `
      <div class="home-featured-copy">
        <span class="section-label">Kiemelt eszköz</span>
        <h2 id="newTitle">Havi költségvetés kalkulátor</h2>
        <p>Rendezd egy helyre a bevételeket, a fix és változó kiadásokat, majd nézd meg, mekkora mozgástered marad. Nem csak egy végösszeget kapsz: a saját havi keretedet látod át.</p>
        <div class="home-featured-actions">
          <a class="home-featured-primary" href="${href("kalkulatorok/havi-koltsegvetes-kalkulator")}">Kipróbálom</a>
          <a class="home-featured-secondary" href="${href("penzugyi")}">Pénzügyi kalkulátorok</a>
        </div>
      </div>
      <div class="home-budget-preview" aria-hidden="true">
        <div class="home-budget-preview-head"><strong>Havi keret áttekintése</strong><span>egyszerűen</span></div>
        <div class="home-budget-row"><span>Bevételek</span><i style="--bar: 132px"></i></div>
        <div class="home-budget-row"><span>Fix kiadások</span><i style="--bar: 102px"></i></div>
        <div class="home-budget-row"><span>Változó kiadások</span><i style="--bar: 76px"></i></div>
        <div class="home-budget-row"><span>Megtakarítási cél</span><i style="--bar: 58px"></i></div>
      </div>`;
  }

  let lifeSection = sections.querySelector(".home-life-section");
  if (!lifeSection) {
    lifeSection = document.createElement("section");
    lifeSection.className = "home-life-section";
    lifeSection.setAttribute("aria-labelledby", "lifeSituationsTitle");
    lifeSection.innerHTML = `
      <div class="home-life-head">
        <div>
          <span class="section-label">Indulj a helyzetből</span>
          <h2 id="lifeSituationsTitle">Nem tudod, melyik kalkulátor kell?</h2>
        </div>
        <p>Válaszd ki, mit szeretnél eldönteni vagy megtervezni. Innen egyből a leginkább releváns számításokhoz jutsz.</p>
      </div>
      <div class="home-life-grid">
        <a class="home-life-card" href="${href("kalkulatorok/netto-brutto-kalkulator")}"><span class="home-life-icon" aria-hidden="true">Ft</span><span><strong>Fizetés és munka</strong><small>Nettó, bruttó, órabér és munkaidő</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
        <a class="home-life-card" href="${href("kalkulatorok/havi-koltsegvetes-kalkulator")}"><span class="home-life-icon" aria-hidden="true">%</span><span><strong>Háztartási pénzügyek</strong><small>Keret, kiadások, megtakarítás</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
        <a class="home-life-card" href="${href("epitoipari")}"><span class="home-life-icon" aria-hidden="true">⌂</span><span><strong>Lakás és felújítás</strong><small>Anyagigény, burkolás, festés</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
        <a class="home-life-card" href="${href("auto")}"><span class="home-life-icon" aria-hidden="true">↗</span><span><strong>Autó és utazás</strong><small>Üzemanyag, út, fenntartási költség</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
        <a class="home-life-card" href="${href("egeszseg")}"><span class="home-life-icon" aria-hidden="true">+</span><span><strong>Egészség és életmód</strong><small>BMI, energiaigény, edzés, alvás</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
        <a class="home-life-card" href="${href("elethelyzetek")}"><span class="home-life-icon" aria-hidden="true">⋯</span><span><strong>Minden élethelyzet</strong><small>Tematikus kiindulópontok egy helyen</small></span><span class="home-life-arrow" aria-hidden="true">→</span></a>
      </div>`;

    if (featured?.nextSibling) featured.parentNode.insertBefore(lifeSection, featured.nextSibling);
    else sections.appendChild(lifeSection);
  }

  const learning = sections.querySelector(".learning-highlight");
  if (learning) learning.classList.add("home-learning-pro");

  const method = sections.querySelector(".method-foundation");
  if (method && !method.dataset.homeProfessional) {
    method.dataset.homeProfessional = "2026-09";
    method.classList.add("home-method-pro");
    method.innerHTML = `
      <div>
        <span class="section-label">Átláthatóság és minőség</span>
        <h2 id="methodTitle">Tudd, miből jön ki az eredmény</h2>
        <p>A jó kalkulátor nem fekete doboz. A fontosabb számításoknál megmutatjuk a módszert, a feltételezéseket, a korlátokat és – ahol számít – a hivatalos forrást is.</p>
        <a class="home-method-link" href="${href("miert-bizhatsz-bennunk")}">Hogyan dolgozunk?</a>
      </div>
      <div class="home-proof-grid">
        <div class="home-proof-item"><strong>100+</strong><span>magyar nyelvű kalkulátor több témában</span></div>
        <div class="home-proof-item"><strong>0 Ft</strong><span>használati díj és nincs kötelező regisztráció</span></div>
        <div class="home-proof-item"><strong>Források</strong><span>ahol szabály, adat vagy hivatalos érték szükséges</span></div>
        <div class="home-proof-item"><strong>Módszertan</strong><span>érthető magyarázatok és fontos korlátok</span></div>
      </div>`;
  }

  const about = sections.querySelector(".about-home");
  if (about) about.classList.add("home-about-pro");

  const faq = sections.querySelector(".home-faq");
  if (faq) faq.classList.add("home-faq-pro");

  const qualityFinal = document.querySelector(".site-quality-final");
  if (qualityFinal) qualityFinal.classList.add("home-quality-closing");
})();