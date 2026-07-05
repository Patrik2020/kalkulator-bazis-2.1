(() => {
  if (window.KB_WISE_PROMO_LOADED) return;
  window.KB_WISE_PROMO_LOADED = true;

  const projectRoot = window.KB_PROJECT_ROOT || "";
  const landingUrl = new URL(
    `${projectRoot}/landing-pages/wise/wise.html`,
    window.location.origin
  );
  const currentPath = window.location.pathname.toLowerCase();

  if (currentPath.endsWith("/landing-pages/wise/wise.html")) return;

  const variants = [
    {
      match: ["deviza", "atvalto", "arfolyam"],
      key: "currency",
      eyebrow: "Devizás helyzethez",
      title: "Külföldi pénzt váltanál vagy utalnál?",
      text: "Nézd meg, hogyan működik a Wise több pénznem, nemzetközi utalás és devizás költés esetén.",
      action: "Wise bemutatása",
      hash: "#use-cases",
    },
    {
      match: ["netto-brutto", "havi-koltsegvetes", "megtakaritas", "kamatos-kamat", "etf", "inflacio"],
      key: "finance",
      eyebrow: "Pénzügyi tervezéshez",
      title: "Külföldről kapsz fizetést vagy több pénznemben kezelnéd a pénzed?",
      text: "Ismerd meg a Wise használati helyzeteit, díjait és korlátait, mielőtt döntesz.",
      action: "Részletek és tudnivalók",
      hash: "#features",
    },
    {
      match: ["auto", "utazas", "uzemanyag", "hatotav", "autopalya"],
      key: "travel",
      eyebrow: "Külföldi utazáshoz",
      title: "Utazást tervezel és devizában fizetnél?",
      text: "Nézd meg, mire használható a Wise kártyás fizetésnél, pénzváltásnál és külföldi költésnél.",
      action: "Wise utazáshoz",
      hash: "#use-cases",
    },
  ];

  const selected =
    variants.find((variant) => variant.match.some((term) => currentPath.includes(term))) || {
      key: "general",
      eyebrow: "Nemzetközi pénzügyekhez",
      title: "Deviza, utalás vagy külföldi költés?",
      text: "Nézd meg közérthetően, mikor lehet hasznos a Wise, és mire érdemes figyelni előtte.",
      action: "Wise bemutatása",
      hash: "",
    };

  const track = (location) => {
    if (typeof window.KB_TRACK_EVENT === "function") {
      window.KB_TRACK_EVENT("wise_intro_click", {
        promo_variant: selected.key,
        promo_location: location,
        page_path: window.location.pathname,
      });
    }
  };

  const enhance = (root = document) => {
    root.querySelectorAll(".wise-banner").forEach((link, index) => {
      if (link.dataset.wisePromoEnhanced === "true") return;

      const targetUrl = new URL(landingUrl.href);
      targetUrl.hash = selected.hash;

      link.dataset.wisePromoEnhanced = "true";
      link.className = "wise-context-card";
      link.href = targetUrl.href;
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.setAttribute("aria-label", `${selected.title} – ${selected.action}`);
      link.innerHTML = `
        <span>
          <span class="wise-context-card__eyebrow">${selected.eyebrow}</span>
          <strong>${selected.title}</strong>
          <small>${selected.text}</small>
        </span>
        <span class="wise-context-card__action">${selected.action} →</span>
        <span class="wise-context-card__disclosure">Saját Wise-bemutató oldal. A partnerlink csak ott, külön jelölve jelenik meg.</span>
      `;
      link.addEventListener("click", () => track(index === 0 ? "primary" : "secondary"));
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.(".wise-banner") || node.querySelector?.(".wise-banner")) {
          enhance(node.matches?.(".wise-banner") ? node.parentElement || document : node);
        }
      });
    });
  });

  const init = () => {
    enhance(document);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();