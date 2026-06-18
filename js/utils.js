// ===== SEGÉD FÜGGVÉNYEK =====

// Szám formázás
function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

// Vissza gomb
function goBack() {
  window.history.back();
}

// CTA megjelenítés
function showLinks() {
  const calcLinks = document.querySelector(".calc-links");
  if (calcLinks) {
    calcLinks.style.display = "flex";
  }
}

// =========================
// SZÁM INPUT FORMÁZÁS
// =========================
function formatInputNumber(input) {
  let isFormatting = false;

  input.addEventListener("input", () => {
    if (isFormatting) return;

    isFormatting = true;

    let value = input.value.replace(/\s/g, "");
    value = value.replace(/\D/g, "");

    if (value === "") {
      input.value = "";
      isFormatting = false;
      return;
    }

    input.value = new Intl.NumberFormat("hu-HU").format(Number(value));

    isFormatting = false;
  });
}

// =========================
// PARSE SZÁM
// =========================
function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, ""));
}

// =========================
// HEADER és FOOTER betöltése
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const isCalculatorPage = window.location.pathname
    .toLowerCase()
    .includes("/kalkulatorok/");

  const base = isCalculatorPage ? "../" : "./";

  loadComponent("header", base + "components/header.html");
  loadComponent("footer", base + "components/footer.html");
  ensureCookieBanner(base);
  loadSiteScripts(base);
});

function ensureCookieBanner(base) {
  if (document.getElementById("cookie-banner")) {
    loadScriptOnce(base + "js/cookie.js");
    return;
  }

  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <p>
      Ez a weboldal sütiket használ.
      <a href="${base}adatvedelem.html">Részletek</a>
    </p>
    <div class="cookie-buttons">
      <button id="accept-cookies">Elfogadom</button>
      <button id="decline-cookies">Elutasítom</button>
    </div>
  `;

  document.body.appendChild(banner);
  loadScriptOnce(base + "js/cookie.js");
}

function loadScriptOnce(src, onLoad) {
  const existing = document.querySelector(`script[src="${src}"]`);

  if (existing) {
    if (onLoad) existing.addEventListener("load", onLoad, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;

  if (onLoad) {
    script.addEventListener("load", onLoad, { once: true });
  }

  document.body.appendChild(script);
}

function loadSiteScripts(base) {
  if (window.KB_DATA) {
    loadScriptOnce(base + "js/site-ui.js");
    return;
  }

  loadScriptOnce(base + "js/site-data.js", () => {
    loadScriptOnce(base + "js/site-ui.js");
  });
}

function loadComponent(id, path) {
  fetch(path)
    .then((res) => {
      if (!res.ok) throw new Error("Hiba: " + path);
      return res.text();
    })
    .then((data) => {
      const target = document.getElementById(id);
      target.innerHTML = data;
      normalizeRootLinks(target, path.includes("../") ? "../" : "./");

      if (id === "header") {
        initMobileMenu();
      }
    })
    .catch((err) => console.error(err));
}

function normalizeRootLinks(container, base) {
  container.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("//")) return;

    link.setAttribute("href", base + href.replace(/^\/+/, ""));
  });
}

// =========================
// MOBIL NAVIGÁCIÓ
// =========================
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // 💥 kattintás kívül = bezárás
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}
