(() => {
  if (window.KB_WISE_BANNER_ENHANCER_LOADED) return;
  window.KB_WISE_BANNER_ENHANCER_LOADED = true;

  const path = window.location.pathname.toLowerCase();
  const pathParts = path.split("/").filter(Boolean);
  const slug = (pathParts.at(-1) || "index").replace(/\.html?$/i, "");
  const isCalculatorPage = pathParts.includes("kalkulatorok");

  // Csak olyan kalkulátorokon jelenjen meg partnerajánlat, ahol a Wise
  // közvetlenül kapcsolódik a felhasználó következő pénzügyi/utazási lépéséhez.
  const contextualTargets = new Set([
    "deviza-atvalto-kalkulator",
    "netto-brutto-kalkulator",
    "havi-koltsegvetes-kalkulator",
    "uzemanyag-koltseg-kalkulator",
    "autopalyadij-kalkulator",
  ]);

  const isContextualTarget = isCalculatorPage && contextualTargets.has(slug);

  const variants = [
    {
      terms: ["deviza", "atvalto", "arfolyam"],
      key: "currency",
      eyebrow: "Devizás helyzethez",
      title: "Külföldi pénzt váltanál vagy utalnál?",
      text: "Nézd meg a Wise aktuális lehetőségeit több pénznem, nemzetközi utalás és devizás költés esetén.",
      action: "Wise megnyitása",
    },
    {
      terms: ["netto-brutto", "havi-koltsegvetes", "kamatos-kamat", "etf", "inflacio"],
      key: "finance",
      eyebrow: "Pénzügyi tervezéshez",
      title: "Külföldről kapsz fizetést vagy több pénznemben kezelnéd a pénzed?",
      text: "Ellenőrizd a Wise aktuális díjait, feltételeit és elérhető funkcióit.",
      action: "Wise feltételek",
    },
    {
      terms: ["auto", "utazas", "uzemanyag", "hatotav", "autopalya"],
      key: "travel",
      eyebrow: "Külföldi utazáshoz",
      title: "Utazást tervezel és devizában fizetnél?",
      text: "Nézd meg a Wise kártyás fizetéshez, pénzváltáshoz és külföldi költéshez kapcsolódó aktuális feltételeit.",
      action: "Wise utazáshoz",
    },
  ];

  const selected =
    variants.find((variant) => variant.terms.some((term) => path.includes(term))) || {
      key: "general",
      eyebrow: "Nemzetközi pénzügyekhez",
      title: "Deviza, utalás vagy külföldi költés?",
      text: "Nézd meg a Wise aktuális lehetőségeit és feltételeit.",
      action: "Wise megnyitása",
    };

  const fallbackWiseUrl =
    "https://wise.prf.hn/click/camref:1100l5Km25/creativeref:1101l107482";

  const getWiseUrl = () => {
    const configured = window.KB_DATA?.wise?.url;
    try {
      const url = new URL(configured || fallbackWiseUrl);
      return url.hostname === "wise.prf.hn" ? url.href : fallbackWiseUrl;
    } catch (error) {
      return fallbackWiseUrl;
    }
  };

  const getCalculatorCard = () =>
    document.querySelector("#kalkulator, .kb-calculator-shell, .card-calculator");

  const getPlacementAnchor = () => {
    const calculator = getCalculatorCard();
    if (!calculator) return null;

    const nextStep = calculator.parentElement?.querySelector(":scope > .kb-next-step");
    return nextStep || calculator;
  };

  const createContextualSection = () => {
    const section = document.createElement("section");
    section.dataset.render = "calculator-wise-banner";
    section.dataset.wisePlacement = "contextual";
    section.className = "wise-banner-slot wise-banner-slot--contextual";

    const link = document.createElement("a");
    link.className = "wise-banner";
    link.href = getWiseUrl();
    link.target = "_blank";
    link.rel = "sponsored noopener noreferrer";
    link.setAttribute("aria-label", "Wise partnerajánlat megnyitása");
    link.innerHTML = `
      <span>
        <strong>Nemzetközi pénzügyekhez Wise</strong>
        <small>Deviza, utalás és külföldi pénzkezelés egyszerűbben.</small>
      </span>
    `;

    section.appendChild(link);
    return section;
  };

  const normalizeCalculatorWiseSections = () => {
    if (!isCalculatorPage) return;

    const sections = [
      ...document.querySelectorAll("[data-render='calculator-wise-banner']"),
    ];

    if (!isContextualTarget) {
      sections.forEach((section) => section.remove());
      return;
    }

    let section = sections[0] || null;
    sections.slice(1).forEach((duplicate) => duplicate.remove());

    if (!section) {
      section = createContextualSection();
    }

    section.classList.add("wise-banner-slot", "wise-banner-slot--contextual");
    section.dataset.wisePlacement = "contextual";

    if (!section.querySelector("a.wise-banner")) {
      const fallbackSection = createContextualSection();
      section.appendChild(fallbackSection.firstElementChild);
    }

    const anchor = getPlacementAnchor();
    if (anchor && anchor.nextElementSibling !== section) {
      anchor.after(section);
    }
  };

  const enhance = (root = document) => {
    root.querySelectorAll("a.wise-banner").forEach((link, index) => {
      if (isCalculatorPage && !isContextualTarget) {
        const section = link.closest("[data-render='calculator-wise-banner']");
        if (section) section.remove();
        return;
      }

      if (link.dataset.enhanced !== "true") {
        link.dataset.enhanced = "true";
        link.classList.add("wise-banner--enhanced");
        link.removeAttribute("aria-label");
        link.innerHTML = `
          <span class="wise-banner-copy">
            <span class="wise-banner-eyebrow">${selected.eyebrow}</span>
            <strong>${selected.title}</strong>
            <small>${selected.text}</small>
          </span>
          <span class="wise-banner-action">${selected.action} →</span>
          <span class="wise-banner-disclosure">Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.</span>
        `;

        link.dataset.wiseVariant = selected.key;
        link.dataset.wiseLocation = isCalculatorPage
          ? "calculator-after-result"
          : index === 0 ? "primary" : "secondary";
      }
    });

    normalizeCalculatorWiseSections();
  };

  const observer = new MutationObserver((mutations) => {
    let shouldSync = false;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        if (
          node.matches?.("a.wise-banner, .kb-next-step, [data-render='calculator-wise-banner']") ||
          node.querySelector?.("a.wise-banner, .kb-next-step, [data-render='calculator-wise-banner']")
        ) {
          shouldSync = true;
        }
      });
    });

    if (!shouldSync) return;
    enhance();
  });

  const init = () => {
    normalizeCalculatorWiseSections();
    enhance();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

