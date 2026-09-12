(() => {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

  const root = (window.KB_PROJECT_ROOT || "").replace(/\/$/, "");
  const href = (path) => `${root}/${path.replace(/^\//, "")}`.replace(/^\/$/, "./");
  const currentHref = href("aktualis");
  const inflationHref = href("aktualis/ksh-inflacio-2026-augusztus");
  const fuelHref = href("aktualis/nav-uzemanyag-elszamolasi-arak-2026-szeptember");
  const professionalCss = href("css/pages/home-professional.css?v=20260912-2");

  if (!document.querySelector('link[data-home-professional-style]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = professionalCss;
    stylesheet.dataset.homeProfessionalStyle = "2027";
    document.head.appendChild(stylesheet);
  }

  document.body.classList.add("home-professional", "home-portfolio-2027");

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
  if (hero && hero.dataset.homeProfessional !== "2027") {
    const search = hero.querySelector(".home-search");
    const quickLinks = hero.querySelector(".home-quick-links");

    if (search) {
      search.querySelector("label").textContent = "Mit szeretnél kiszámolni?";
      const input = search.querySelector("#calculatorSearch");
      if (input) input.placeholder = "Nettó bér, ETF, BMI, festék, százalék…";
    }

    hero.dataset.homeProfessional = "2027";
    hero.innerHTML = "";

    const shell = document.createElement("div");
    shell.className = "container kb27-hero-shell";
    shell.innerHTML = `
      <div class="kb27-topline" aria-hidden="true">
        <span><strong>KB / 2027</strong> · utility interface</span>
        <span>100+ kalkulátor · magyarul · ingyen</span>
      </div>
      <div class="kb27-hero-grid">
        <div class="kb27-hero-copy">
          <span class="home-eyebrow"><span class="home-eyebrow-dot" aria-hidden="true"></span>Számításból érthető döntés</span>
          <h1 id="homeHeroTitle">Számolj.<span class="kb27-serif">Láss tisztán.</span></h1>
          <p class="home-hero-lead">Egy hely, ahol a számítás nem egy névtelen mező és egy gomb. Gyors kalkulátorok, érthető módszertan és a döntéshez szükséges kontextus.</p>
        </div>
        <aside class="kb27-signal" aria-label="Példák a számítási területekre">
          <div class="kb27-signal-line"><b>01</b><span><strong>Ft ↔ nettó</strong><small>jövedelem és pénzügy</small></span></div>
          <div class="kb27-signal-line"><b>02</b><span><strong>% ↔ arány</strong><small>százalék és változás</small></span></div>
          <div class="kb27-signal-line"><b>03</b><span><strong>m² ↔ anyag</strong><small>otthon és felújítás</small></span></div>
          <span class="kb27-signal-mark" aria-hidden="true">=</span>
        </aside>
      </div>
      <div class="kb27-search-stage">
        <div class="kb27-search-meta">01 / kereső<span>Írd le, mire szeretnél számolni.</span></div>
        <div class="kb27-search-slot"></div>
      </div>
      <ul class="kb27-trustline" aria-label="A Kalkulátor Bázis fő előnyei">
        <li>regisztráció nélkül</li>
        <li>magyar fejlesztés</li>
        <li>forrásokkal</li>
        <li>mobilon is gyors</li>
      </ul>`;

    hero.appendChild(shell);
    const slot = shell.querySelector(".kb27-search-slot");
    if (search) slot.appendChild(search);
    if (quickLinks) slot.appendChild(quickLinks);
  }

  const categoryMeta = [
    { selector: 'a[href="mindennapi"], a[href="./mindennapi"], a[href$="/mindennapi"]', key: "everyday" },
    { selector: 'a[href="penzugyi"], a[href="./penzugyi"], a[href$="/penzugyi"]', key: "finance" },
    { selector: 'a[href="epitoipari"], a[href="./epitoipari"], a[href$="/epitoipari"]', key: "home" },
    { selector: 'a[href="auto"], a[href="./auto"], a[href$="/auto"]', key: "auto" },
    { selector: 'a[href="egeszseg"], a[href="./egeszseg"], a[href$="/egeszseg"]', key: "health" },
    { selector: 'a[href="atvaltok"], a[href="./atvaltok"], a[href$="/atvaltok"]', key: "convert" },
  ];

  const categoryGrid = document.querySelector(".home-category-grid");
  if (categoryGrid) {
    categoryMeta.forEach(({ selector, key }, index) => {
      const card = categoryGrid.querySelector(selector);
      if (!card) return;
      card.dataset.homeCategory = key;
      card.dataset.index = String(index + 1).padStart(2, "0");
      card.querySelector(".home-category-symbol")?.remove();
    });
  }

  const popularGrid = document.querySelector(".popular-grid");
  if (popularGrid) {
    [...popularGrid.querySelectorAll(":scope > a")].forEach((card, index) => {
      let marker = card.querySelector(".home-popular-index");
      if (!marker) {
        marker = document.createElement("span");
        marker.className = "home-popular-index";
        marker.setAttribute("aria-hidden", "true");
        card.prepend(marker);
      }
      marker.textContent = `${String(index + 1).padStart(2, "0")} / gyakori`;
    });
  }

  const sections = document.querySelector(".home-sections");
  if (!sections) return;

  let currentPanel = sections.querySelector(".home-current-panel");
  const oldCurrent = sections.querySelector("[data-home-current]");
  if (oldCurrent && oldCurrent !== currentPanel) oldCurrent.remove();

  if (!currentPanel) {
    currentPanel = document.createElement("section");
    const before = sections.querySelector(".new-tools");
    if (before) sections.insertBefore(currentPanel, before);
    else sections.appendChild(currentPanel);
  }

  currentPanel.className = "home-current-panel";
  currentPanel.dataset.homeCurrent = "2026-09-12";
  currentPanel.setAttribute("aria-labelledby", "currentUpdatesTitle");
  currentPanel.innerHTML = `
    <div class="home-current-head">
      <div>
        <span class="home-current-kicker">Hivatalos adatokból · frissítve</span>
        <h2 id="currentUpdatesTitle">Aktuális.</h2>
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
          <strong>Üzemanyag-elszámolási árak</strong>
        </span>
        <span class="home-current-prices">
          <span class="home-current-price"><strong>604 Ft/l</strong><span>Benzin</span></span>
          <span class="home-current-price"><strong>667 Ft/l</strong><span>Gázolaj</span></span>
        </span>
        <p>Az augusztusi értékekhez képest a benzin 24, a gázolaj 75 forinttal emelkedett literenként.</p>
      </a>
    </div>`;

  const featured = sections.querySelector(".new-tools");
  if (featured) {
    featured.dataset.homeProfessional = "2027";
    featured.classList.add("home-featured-tool");
    featured.innerHTML = `
      <div class="home-featured-copy">
        <span class="section-label">02 / kiemelt eszköz</span>
        <h2 id="newTitle">A havi pénzed, egyetlen képen.</h2>
        <p>A költségvetés kalkulátor összerendezi a bevételeket, fix és változó kiadásokat, majd megmutatja, mennyi valódi mozgástered marad.</p>
        <div class="home-featured-actions">
          <a class="home-featured-primary" href="${href("kalkulatorok/havi-koltsegvetes-kalkulator")}">Kipróbálom</a>
          <a class="home-featured-secondary" href="${href("penzugyi")}">Pénzügyi eszközök</a>
        </div>
      </div>
      <div class="home-budget-preview" aria-hidden="true">
        <div class="home-budget-preview-head"><strong>Havi keret / minta</strong><span>01—04</span></div>
        <div class="home-budget-row"><span>Bevételek</span><i style="--bar: 94%"></i></div>
        <div class="home-budget-row"><span>Fix kiadások</span><i style="--bar: 68%"></i></div>
        <div class="home-budget-row"><span>Változó</span><i style="--bar: 49%"></i></div>
        <div class="home-budget-row"><span>Megtakarítás</span><i style="--bar: 31%"></i></div>
      </div>`;
  }

  let lifeSection = sections.querySelector(".home-life-section");
  if (!lifeSection) {
    lifeSection = document.createElement("section");
    if (featured?.nextSibling) featured.parentNode.insertBefore(lifeSection, featured.nextSibling);
    else sections.appendChild(lifeSection);
  }

  lifeSection.className = "home-life-section";
  lifeSection.setAttribute("aria-labelledby", "lifeSituationsTitle");
  lifeSection.innerHTML = `
    <div class="home-life-head">
      <div>
        <span class="section-label">03 / döntési térkép</span>
        <h2 id="lifeSituationsTitle">Ne kalkulátort keress. Indulj a kérdésből.</h2>
      </div>
      <p>A legtöbben nem tudják a kalkulátor nevét. Azt tudják, mit szeretnének eldönteni. Innen ezért élethelyzetből indulsz.</p>
    </div>
    <div class="home-life-grid">
      <a class="home-life-card" href="${href("kalkulatorok/netto-brutto-kalkulator")}"><span class="home-life-icon">Ft</span><span><strong>Fizetés és munka</strong><small>Nettó, bruttó, órabér, munkaidő</small></span><span class="home-life-arrow">↗</span></a>
      <a class="home-life-card" href="${href("kalkulatorok/havi-koltsegvetes-kalkulator")}"><span class="home-life-icon">%</span><span><strong>Háztartási pénzügyek</strong><small>Keret, kiadás, megtakarítás</small></span><span class="home-life-arrow">↗</span></a>
      <a class="home-life-card" href="${href("epitoipari")}"><span class="home-life-icon">m²</span><span><strong>Lakás és felújítás</strong><small>Anyagigény, burkolás, festés</small></span><span class="home-life-arrow">↗</span></a>
      <a class="home-life-card" href="${href("auto")}"><span class="home-life-icon">km</span><span><strong>Autó és utazás</strong><small>Üzemanyag, út, fenntartás</small></span><span class="home-life-arrow">↗</span></a>
      <a class="home-life-card" href="${href("egeszseg")}"><span class="home-life-icon">+</span><span><strong>Egészség és életmód</strong><small>BMI, energiaigény, edzés, alvás</small></span><span class="home-life-arrow">↗</span></a>
      <a class="home-life-card" href="${href("elethelyzetek")}"><span class="home-life-icon">••</span><span><strong>Minden élethelyzet</strong><small>Tematikus kiindulópontok egy helyen</small></span><span class="home-life-arrow">↗</span></a>
    </div>`;

  const learning = sections.querySelector(".learning-highlight");
  if (learning) learning.classList.add("home-learning-pro");

  const method = sections.querySelector(".method-foundation");
  if (method) {
    method.dataset.homeProfessional = "2027";
    method.classList.add("home-method-pro");
    method.innerHTML = `
      <div>
        <span class="section-label">04 / átláthatóság</span>
        <h2 id="methodTitle">A számítás ne legyen fekete doboz.</h2>
        <p>A fontosabb kalkulátoroknál megmutatjuk a módszert, a feltételezéseket, a korlátokat és – ahol számít – a hivatalos forrást is.</p>
        <a class="home-method-link" href="${href("miert-bizhatsz-bennunk")}">Hogyan dolgozunk?</a>
      </div>
      <div class="home-proof-grid">
        <div class="home-proof-item"><strong>100+</strong><span>magyar nyelvű kalkulátor több témában</span></div>
        <div class="home-proof-item"><strong>0 Ft</strong><span>használati díj, kötelező fiók nélkül</span></div>
        <div class="home-proof-item"><strong>Forrás</strong><span>ahol szabály vagy hivatalos érték szükséges</span></div>
        <div class="home-proof-item"><strong>Érthető</strong><span>módszertan, korlátok és gyakorlati értelmezés</span></div>
      </div>`;
  }

  const about = sections.querySelector(".about-home");
  if (about) about.classList.add("home-about-pro");

  const faq = sections.querySelector(".home-faq");
  if (faq) faq.classList.add("home-faq-pro");

  const qualityFinal = document.querySelector(".site-quality-final");
  if (qualityFinal) qualityFinal.classList.add("home-quality-closing");
})();