(() => {
  if (window.KB_WISE_BANNER_ENHANCER_LOADED) return;
  window.KB_WISE_BANNER_ENHANCER_LOADED = true;

  const path = window.location.pathname.toLowerCase();
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

  const enhance = (root = document) => {
    root.querySelectorAll("a.wise-banner").forEach((link, index) => {
      if (link.dataset.enhanced === "true") return;

      link.dataset.enhanced = "true";
      link.classList.add("wise-banner--enhanced");
      link.setAttribute("aria-label", `${selected.title} – ${selected.action}`);
      link.innerHTML = `
        <span class="wise-banner-copy">
          <span class="wise-banner-eyebrow">${selected.eyebrow}</span>
          <strong>${selected.title}</strong>
          <small>${selected.text}</small>
        </span>
        <span class="wise-banner-action">${selected.action} →</span>
        <span class="wise-banner-disclosure">Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.</span>
      `;

      link.addEventListener("click", () => {
        if (typeof window.KB_TRACK_EVENT === "function") {
          window.KB_TRACK_EVENT("wise_partner_click", {
            promo_variant: selected.key,
            promo_location: index === 0 ? "primary" : "secondary",
            page_path: window.location.pathname,
          });
        }
      });
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.("a.wise-banner") || node.querySelector?.("a.wise-banner")) {
          enhance(node.matches?.("a.wise-banner") ? node.parentElement || document : node);
        }
      });
    });
  });

  const init = () => {
    enhance();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();