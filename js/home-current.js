(() => {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

  const currentHref = "./aktualis";
  const inflationHref = "./aktualis/ksh-inflacio-2026-augusztus";
  const fuelHref = "./aktualis/nav-uzemanyag-elszamolasi-arak-2026-szeptember";

  const knowledgeMenu = document.querySelector(".nav-knowledge .nav-submenu");
  if (knowledgeMenu && !knowledgeMenu.querySelector('a[href="./aktualis"]')) {
    const link = document.createElement("a");
    link.href = currentHref;
    link.textContent = "Aktuális változások";
    knowledgeMenu.prepend(link);
  }

  const sections = document.querySelector(".home-sections");
  if (sections && !sections.querySelector("[data-home-current]")) {
    const section = document.createElement("section");
    section.className = "home-section";
    section.dataset.homeCurrent = "2026-09-12";
    section.setAttribute("aria-labelledby", "currentUpdatesTitle");
    section.innerHTML = `
      <div class="section-intro">
        <div>
          <span class="section-label">Hivatalos forrásból, röviden</span>
          <h2 id="currentUpdatesTitle">Aktuális változások</h2>
        </div>
        <a class="text-link" href="${currentHref}">Minden aktuális közlemény</a>
      </div>
      <div class="category-grid new-grid" data-home-current-grid>
        <a class="card card-link calculator-card card-finance" href="${inflationHref}">
          <span class="section-label">2026. szeptember 12. · KSH</span>
          <h3>1,3% volt az éves infláció 2026 augusztusában</h3>
          <p>Júliushoz képest 0,2%-kal nőttek az árak; megmutatjuk, mit jelent ez a vásárlóerő szempontjából.</p>
        </a>
        <a class="card card-link calculator-card card-auto" href="${fuelHref}">
          <span class="section-label">2026. szeptember 11. · NAV</span>
          <h3>NAV üzemanyag-elszámolási árak: 604 Ft/l a benzin, 667 Ft/l a gázolaj</h3>
          <p>A szeptemberi költségelszámolási árak és az augusztushoz képesti változás, közvetlenül a hivatalos NAV-adatok alapján.</p>
        </a>
      </div>`;

    const before = sections.querySelector(".new-tools");
    if (before) sections.insertBefore(section, before);
    else sections.prepend(section);
  }

  const infoFooter = document.querySelector('nav[aria-label="Információ és bizalom"]');
  if (infoFooter && !infoFooter.querySelector('a[href="./aktualis"]')) {
    const link = document.createElement("a");
    link.href = currentHref;
    link.textContent = "Aktuális változások";
    const heading = infoFooter.querySelector("h2");
    if (heading?.nextSibling) infoFooter.insertBefore(link, heading.nextSibling);
    else infoFooter.appendChild(link);
  }
})();
