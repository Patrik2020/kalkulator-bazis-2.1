(() => {
  "use strict";

  if (window.KB_CURRENT_IMPACT_LOADED) return;
  window.KB_CURRENT_IMPACT_LOADED = true;

  const cleanPath = window.location.pathname.replace(/\.html$/i, "").replace(/\/$/, "");
  const configs = {
    "/aktualis/ksh-inflacio-2026-augusztus": {
      intro: "Az országos átlag önmagában nem mondja meg, hogyan változott a te pénzed értéke. Innen rögtön tovább tudsz számolni a saját összegeddel vagy megtakarítási terveddel.",
      cards: [
        {
          href: "/kalkulatorok/inflacio-kalkulator",
          title: "Mennyit ér ma ugyanaz az összeg?",
          text: "Számold ki egy konkrét pénzösszeg vásárlóerejének változását.",
        },
        {
          href: "/dontesek",
          title: "Mit csinál ez a megtakarításoddal?",
          text: "Nézd meg hozam és infláció mellett a becsült jövőbeli és mai pénzen számolt értéket.",
        },
      ],
    },
    "/aktualis/nav-uzemanyag-elszamolasi-arak-2026-szeptember": {
      intro: "A NAV-ár nem benzinkúti átlagár, de konkrét költségelszámolási vagy autós tervezési helyzetben azonnal továbbviheted a számot egy saját számításba.",
      cards: [
        {
          href: "/kalkulatorok/auto-kalkulator",
          title: "Mennyi egy konkrét út költsége?",
          text: "Add meg a távolságot, fogyasztást és a megfelelő NAV-elszámolási árat.",
        },
        {
          href: "/osszehasonlitas",
          title: "Két autó vagy költséghelyzet között vacillálsz?",
          text: "Az A/B módban éves futás, fogyasztás, fix költség és értékvesztés is összevethető.",
        },
      ],
    },
  };

  const config = configs[cleanPath];
  if (!config) return;

  const articleCard = document.querySelector(".current-article-card");
  if (!articleCard || articleCard.querySelector(".current-impact")) return;

  const impact = document.createElement("section");
  impact.className = "current-impact";
  impact.setAttribute("aria-labelledby", "currentImpactTitle");
  impact.innerHTML = `
    <p class="current-impact-kicker">Mit jelent ez neked?</p>
    <h2 id="currentImpactTitle">Vidd tovább a hírt a saját számaidra</h2>
    <p>${config.intro}</p>
    <div class="current-impact-grid">
      ${config.cards
        .map(
          (card) => `
            <a class="current-impact-card" href="${card.href}">
              <strong>${card.title}</strong>
              <span>${card.text}</span>
            </a>`
        )
        .join("")}
    </div>`;

  const sourceBox = articleCard.querySelector(".current-source-box");
  if (sourceBox) sourceBox.before(impact);
  else articleCard.appendChild(impact);
})();
