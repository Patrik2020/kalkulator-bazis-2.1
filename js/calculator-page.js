(() => {
  "use strict";

  const root = window.KB_PROJECT_ROOT || "";
  const href = (path) => {
    const value = `${root}${path}` || "/";
    return value
      .replace(/\/index\.html(?=([?#]|$))/i, "/")
      .replace(/\.html(?=([?#]|$))/i, "");
  };

  const nextStepJourneys = {
    "netto-brutto-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Most tedd kontextusba a nettó fizetésed",
      description: "A nettó összeg önmagában még nem mutatja meg, mennyi mozgástered marad. A következő lépés lehet a havi keret vagy a hitelteher ellenőrzése.",
      actions: [
        ["Havi költségvetés", "/kalkulatorok/havi-koltsegvetes-kalkulator.html", "Nézd meg, mennyi maradhat kiadások és megtakarítás után."],
        ["Hitelképesség", "/kalkulatorok/hitelkepesseg-kalkulator.html", "Becsüld meg, mekkora törlesztés férhet bele a jövedelmedbe."],
      ],
    },
    "etf-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Nézd meg, mennyire reális a befektetési terved",
      description: "A várható végösszeg csak feltételezésekkel értelmezhető. Érdemes összevetni a célidővel, az inflációval és a rendszeres megtakarítási képességgel.",
      actions: [
        ["Kamatos kamat", "/kalkulatorok/kamatos-kamat-kalkulator.html", "Hasonlítsd össze egyszerűbb hozamforgatókönyvvel."],
        ["Infláció", "/kalkulatorok/inflacio-kalkulator.html", "Nézd meg, mennyit érhet a célösszeg mai vásárlóerőn."],
      ],
    },
    "osztalek-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Ellenőrizd a szükséges tőkét más szemszögből is",
      description: "Az osztalékhozam nem garantált, ezért a céljövedelmet érdemes hosszabb távú növekedési és inflációs forgatókönyvvel is összevetni.",
      actions: [
        ["ETF kalkulátor", "/kalkulatorok/etf-kalkulator.html", "Hasonlítsd össze a teljes hozamra épülő megközelítéssel."],
        ["Infláció", "/kalkulatorok/inflacio-kalkulator.html", "Vizsgáld meg a céljövedelem jövőbeli vásárlóerejét."],
      ],
    },
    "hitel-torleszto-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "A havi törlesztő után nézd meg a teherbírásodat",
      description: "Egy törlesztőrészlet akkor értelmezhető igazán, ha a jövedelmedhez és a teljes havi költségvetésedhez is viszonyítod.",
      actions: [
        ["Hitelképesség", "/kalkulatorok/hitelkepesseg-kalkulator.html", "Becsüld meg, mennyire fér bele a törlesztő a jövedelmedbe."],
        ["Havi költségvetés", "/kalkulatorok/havi-koltsegvetes-kalkulator.html", "Ellenőrizd, mi maradna a törlesztés után."],
      ],
    },
    "hitelkepesseg-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Fordítsd át a becsült keretet konkrét hitelre",
      description: "A jövedelmi teherbírás csak az egyik korlát. A következő lépés a konkrét törlesztő és lakásvásárlásnál az önerő ellenőrzése.",
      actions: [
        ["Hitel törlesztő", "/kalkulatorok/hitel-torleszto-kalkulator.html", "Számolj konkrét összeggel, kamattal és futamidővel."],
        ["Lakáshitel önerő", "/kalkulatorok/lakas-hitel-onero-kalkulator.html", "Nézd meg, mekkora saját forrásra lehet szükség."],
      ],
    },
    "havi-koltsegvetes-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Használd fel a havi maradványt tudatosan",
      description: "Ha marad szabad összeg, érdemes megnézni, milyen hosszú távú célt tud támogatni. Ha szűk a keret, a hitelteher ellenőrzése lehet fontosabb.",
      actions: [
        ["ETF kalkulátor", "/kalkulatorok/etf-kalkulator.html", "Nézd meg, mit jelenthet hosszú távon a rendszeres megtakarítás."],
        ["Hitelképesség", "/kalkulatorok/hitelkepesseg-kalkulator.html", "Ellenőrizd, mekkora hitelteher férhet bele biztonságosabban."],
      ],
    },
    "fizetesi-hatarido-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "A határidő mellé ellenőrizd a teljesítési dátumot is",
      description: "Számlázásnál a fizetési határidő és a teljesítési időpont két külön adat. A következő lépésben érdemes a másikat is kiszámolni.",
      actions: [
        ["Számla teljesítés", "/kalkulatorok/szamla-teljesites-kalkulator.html", "Ellenőrizd a teljesítési időpont logikáját is."],
        ["ÁFA kalkulátor", "/kalkulatorok/afa-kalkulator.html", "Számold át a nettó, ÁFA és bruttó összegeket."],
      ],
    },
    "szamla-teljesites-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Egészítsd ki a számlázási dátumokat",
      description: "A teljesítési időpont mellett a fizetési határidő és az összeg nettó–bruttó bontása is gyakran szükséges a számla ellenőrzéséhez.",
      actions: [
        ["Fizetési határidő", "/kalkulatorok/fizetesi-hatarido-kalkulator.html", "Számold ki a kapcsolódó esedékességi dátumot."],
        ["ÁFA kalkulátor", "/kalkulatorok/afa-kalkulator.html", "Ellenőrizd a nettó, ÁFA és bruttó összeget."],
      ],
    },
    "auto-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Az út költségétől lépj tovább a teljes autóköltség felé",
      description: "Az üzemanyag csak egy része az autózás költségének. Érdemes külön megnézni a valós fogyasztást és az éves fenntartási terhet is.",
      actions: [
        ["Valós fogyasztás", "/kalkulatorok/auto-fogyasztas-kalkulator.html", "Tankolási adatokból ellenőrizd a tényleges fogyasztást."],
        ["Éves autóköltség", "/kalkulatorok/eves-auto-koltseg-kalkulator.html", "Becsüld meg az autó teljes éves fenntartását."],
      ],
    },
    "uzemanyag-koltseg-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Nézd meg, mit jelent az út a teljes autóhasználatban",
      description: "Az egy útra jutó üzemanyagköltség után hasznos lehet a valós fogyasztás és az éves fenntartási költség ellenőrzése.",
      actions: [
        ["Autó fogyasztás", "/kalkulatorok/auto-fogyasztas-kalkulator.html", "Számold ki tankolási adatokból a tényleges fogyasztást."],
        ["Éves autóköltség", "/kalkulatorok/eves-auto-koltseg-kalkulator.html", "Lásd a biztosítás, szerviz és egyéb tételek hatását is."],
      ],
    },
    "bmi-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "A BMI-t mindig több adattal együtt értelmezd",
      description: "A BMI tájékozódási pont, nem diagnózis. Ha életmódtervezéshez használod, érdemes az energiaigényt és a testösszetételt is külön megnézni.",
      actions: [
        ["Kalóriaszükséglet", "/kalkulatorok/kaloria-kalkulator.html", "Becsüld meg a napi energiaigényedet."],
        ["Testzsír kalkulátor", "/kalkulatorok/testzsir-kalkulator.html", "Egészítsd ki a BMI-t egy másik testösszetételi becsléssel."],
      ],
    },
    "kaloria-kalkulator": {
      eyebrow: "Az eredmény után",
      title: "Bontsd le a napi energiakeretet használható tervre",
      description: "A becsült kalóriaszükséglet kiindulópont. A következő lépés lehet a makrotápanyagok és a fehérjebevitel tájékozódó becslése.",
      actions: [
        ["Makró kalkulátor", "/kalkulatorok/makro-kalkulator.html", "Oszd fel a napi energiakeretet fehérjére, zsírra és szénhidrátra."],
        ["Fehérjeszükséglet", "/kalkulatorok/feherje-szukseglet-kalkulator.html", "Becsüld meg külön a napi fehérjecélt."],
      ],
    },
  };

  const revealWhenReady = () => {
    window.KB_CALCULATOR_ENHANCEMENTS_READY = true;
    if (window.KB_SITE_ENHANCEMENTS_READY) {
      document.documentElement.classList.add("kb-calculator-ready");
    }
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const currentSlug = () => {
    const file = window.location.pathname.split("/").filter(Boolean).at(-1) || "";
    return file.replace(/\.html?$/i, "").toLowerCase();
  };

  const ensureBreadcrumbStructuredData = (heading) => {
    const hasBreadcrumbSchema = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .some((script) => /"@type"\s*:\s*"BreadcrumbList"/.test(script.textContent || ""));
    const pageName = (heading?.textContent || "").replace(/\s+/g, " ").trim();
    if (hasBreadcrumbSchema || !pageName) return;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.kbBreadcrumbSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Főoldal",
          item: new URL(href("/"), window.location.origin).href,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kalkulátorok",
          item: new URL(href("/kalkulatorok.html"), window.location.origin).href,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: pageName,
        },
      ],
    });
    document.head.appendChild(schema);
  };

  const resultCandidates = (card) => [
    ...card.querySelectorAll(".result-box, .result, output, [id*='result'], [class*='result']"),
  ];

  const hasMeaningfulResult = (card, baseline) => {
    const candidates = resultCandidates(card);
    return candidates.some((node) => {
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      const initial = baseline.get(node) || "";
      return text !== initial && /\d/.test(text) && !/^[-–—\s]+$/.test(text);
    });
  };

  const renderNextStep = (card, journey) => {
    if (!journey || card.parentElement?.querySelector(":scope > .kb-next-step")) return;

    const block = document.createElement("section");
    block.className = "kb-next-step";
    block.hidden = true;
    block.setAttribute("aria-live", "polite");
    block.innerHTML = `
      <div class="kb-next-step__copy">
        <span class="kb-next-step__eyebrow">${escapeHtml(journey.eyebrow)}</span>
        <h2>${escapeHtml(journey.title)}</h2>
        <p>${escapeHtml(journey.description)}</p>
      </div>
      <div class="kb-next-step__actions">
        ${journey.actions.map(([label, path, description], index) => `
          <a class="kb-next-step__action${index === 0 ? " kb-next-step__action--primary" : ""}" href="${href(path)}" data-next-step-index="${index + 1}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(description)}</span>
            <em aria-hidden="true">→</em>
          </a>
        `).join("")}
      </div>`;

    card.after(block);

    const baseline = new Map(resultCandidates(card).map((node) => [
      node,
      (node.textContent || "").replace(/\s+/g, " ").trim(),
    ]));

    let revealed = false;
    const reveal = () => {
      if (revealed || !hasMeaningfulResult(card, baseline)) return;
      revealed = true;
      block.hidden = false;
      block.classList.add("is-visible");

      if (typeof window.KB_TRACK_EVENT === "function") {
        window.KB_TRACK_EVENT("calculator_next_step_shown", {
          calculator: currentSlug(),
        });
      }
    };

    const observer = new MutationObserver(() => window.requestAnimationFrame(reveal));
    observer.observe(card, { subtree: true, childList: true, characterData: true, attributes: true });

    card.addEventListener("input", () => window.setTimeout(reveal, 80));
    card.addEventListener("change", () => window.setTimeout(reveal, 80));
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, [type='submit']")) {
        window.setTimeout(reveal, 120);
      }
    });

    block.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-next-step-index]");
      if (!link || typeof window.KB_TRACK_EVENT !== "function") return;
      window.KB_TRACK_EVENT("calculator_next_step_click", {
        calculator: currentSlug(),
        destination: link.getAttribute("href"),
        position: Number(link.dataset.nextStepIndex || 0),
      });
    });
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
    ensureBreadcrumbStructuredData(heading);

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
        <span><strong>Független magyar oldal</strong><small>Közérthető, praktikus online kalkulátorok</small></span>
        <span><strong>Technikailag frissítve</strong><small><time datetime="2026-08-07">2026. augusztus 7.</time></small></span>
        <span class="kb-page-meta__links">
          <a href="${href("/szamitasi-modszertan.html")}">Módszertan</a>
          <a href="${href("/kapcsolat.html?tema=hiba")}">Hibát jelzek</a>
        </span>`;
      hero.after(meta);
    }

    const journey = nextStepJourneys[currentSlug()];
    main.querySelectorAll(".card-calculator").forEach((card, index) => {
      card.classList.add("kb-calculator-shell");
      if (index === 0 && journey) renderNextStep(card, journey);
    });

    revealWhenReady();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
