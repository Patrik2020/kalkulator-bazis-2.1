(() => {
  "use strict";

  const API_URL = "https://formspree.io/f/xgojpond";
  const SUPPORT_EMAIL = "kalkulatorbazis@gmail.com";
  const openedAt = Date.now();

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const rootPath = () => {
    const depth = location.pathname.split("/").filter(Boolean).length;
    return depth > 1 ? "../".repeat(depth - 1) : "";
  };

  const widget = document.createElement("div");
  widget.innerHTML = `
    <div class="kb-help-backdrop" data-kb-backdrop></div>
    <button class="kb-help-launcher" type="button" aria-expanded="false" aria-controls="kbHelpPanel">
      <span class="kb-help-launcher__icon" aria-hidden="true">?</span>
      <span>Segítség</span>
    </button>
    <aside class="kb-help-panel" id="kbHelpPanel" role="dialog" aria-modal="true" aria-labelledby="kbHelpTitle">
      <div class="kb-help-panel__header">
        <div>
          <h2 id="kbHelpTitle">Miben segíthetünk?</h2>
          <p>Gyors segítség, hibabejelentés vagy javaslatküldés.</p>
        </div>
        <button class="kb-help-close" type="button" aria-label="Bezárás">×</button>
      </div>
      <div class="kb-help-panel__body">
        <section class="kb-help-view" data-view="menu">
          <div class="kb-help-actions">
            <button class="kb-help-action" type="button" data-open-view="search">🔎 Kalkulátort keresek</button>
            <button class="kb-help-action" type="button" data-open-view="question">💬 Kérdésem van a működésről</button>
            <button class="kb-help-action" type="button" data-open-view="bug">🐞 Hibát találtam</button>
            <button class="kb-help-action" type="button" data-open-view="suggestion">💡 Javaslatot küldenék</button>
          </div>
        </section>
        <section class="kb-help-view" data-view="search" hidden>
          <button class="kb-help-back" type="button">← Vissza</button>
          <div class="kb-help-links">
            <a href="${rootPath()}kalkulatorok.html">Összes kalkulátor megnyitása</a>
            <a href="${rootPath()}penzugyi.html">Pénzügyi kalkulátorok</a>
            <a href="${rootPath()}auto.html">Autós kalkulátorok</a>
            <a href="${rootPath()}egeszseg.html">Egészség kalkulátorok</a>
            <a href="${rootPath()}epitoipari.html">Építőipari kalkulátorok</a>
            <a href="${rootPath()}atvaltok.html">Átváltók</a>
          </div>
        </section>
        <section class="kb-help-view" data-view="question" hidden>
          <button class="kb-help-back" type="button">← Vissza</button>
          <p>Az első verzió még nem AI-chat. A működéssel kapcsolatos kérdésedet elküldheted, és e-mailben válaszolunk.</p>
          <button class="kb-help-action" type="button" data-open-view="question-form">Kérdés elküldése</button>
        </section>
        ${formView("question-form", "Kérdés", "Írd le a kérdésed", false)}
        ${formView("bug", "Hibabejelentés", "Mi történt?", true)}
        ${formView("suggestion", "Javaslat", "Mit változtatnál vagy milyen kalkulátort látnál szívesen?", false)}
      </div>
    </aside>`;

  function formView(view, type, mainLabel, bugFields) {
    return `<section class="kb-help-view" data-view="${view}" hidden>
      <button class="kb-help-back" type="button">← Vissza</button>
      <form class="kb-help-form" data-report-form data-type="${type}">
        <label>${mainLabel}
          <textarea name="description" maxlength="2000" required></textarea>
        </label>
        ${bugFields ? `<label>Mit vártál helyette?
          <textarea name="expected" maxlength="1000"></textarea>
        </label>
        <label>Milyen adatokat adtál meg? <span class="kb-help-note">Ne írj be érzékeny személyes vagy pénzügyi adatot.</span>
          <textarea name="inputData" maxlength="1000"></textarea>
        </label>` : ""}
        <label>E-mail-cím a válaszhoz (nem kötelező)
          <input type="email" name="email" maxlength="200" autocomplete="email" />
        </label>
        <label class="kb-help-honeypot" aria-hidden="true">Weboldal
          <input type="text" name="website" tabindex="-1" autocomplete="off" />
        </label>
        <label>
          <span><input type="checkbox" name="consent" required /> Hozzájárulok, hogy a bejelentés adatait a kivizsgálás és válaszadás céljából kezeljék.</span>
        </label>
        <p class="kb-help-note">A beküldéshez automatikusan csatoljuk az oldal címét, URL-jét, az eszköz és böngésző alapvető technikai adatait. Részletek az <a href="${rootPath()}adatvedelem.html">adatvédelmi tájékoztatóban</a>.</p>
        <button class="kb-help-submit" type="submit">Beküldés</button>
        <p class="kb-help-status" data-form-status hidden></p>
      </form>
    </section>`;
  }

  document.body.appendChild(widget);
  const launcher = widget.querySelector(".kb-help-launcher");
  const panel = widget.querySelector(".kb-help-panel");
  const backdrop = widget.querySelector("[data-kb-backdrop]");
  const closeBtn = widget.querySelector(".kb-help-close");
  let lastFocus = null;

  const setOpen = (open) => {
    panel.dataset.open = String(open);
    backdrop.dataset.open = String(open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      lastFocus = document.activeElement;
      closeBtn.focus();
    } else if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  const showView = (name) => {
    widget.querySelectorAll("[data-view]").forEach((el) => {
      el.hidden = el.dataset.view !== name;
    });
  };

  launcher.addEventListener("click", () => setOpen(panel.dataset.open !== "true"));
  closeBtn.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.dataset.open === "true") setOpen(false);
  });
  widget.addEventListener("click", (event) => {
    const target = event.target.closest("[data-open-view]");
    if (target) showView(target.dataset.openView);
    if (event.target.closest(".kb-help-back")) showView("menu");
  });

  widget.querySelectorAll("[data-report-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector("button[type=submit]");
      const data = new FormData(form);

      submit.disabled = true;
      status.hidden = false;
      status.dataset.kind = "";
      status.textContent = "Küldés folyamatban…";

      const payload = {
        _subject: `[Kalkulátor Bázis] ${form.dataset.type}`,
        type: form.dataset.type,
        description: String(data.get("description") || "").trim(),
        expected: String(data.get("expected") || "").trim(),
        inputData: String(data.get("inputData") || "").trim(),
        email: String(data.get("email") || "").trim(),
        website: String(data.get("website") || ""),
        consent: data.get("consent") === "on" ? "igen" : "nem",
        pageUrl: location.href,
        pageTitle: document.title,
        referrer: document.referrer || "nincs",
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        sentAt: new Date().toISOString(),
        elapsedMs: Date.now() - openedAt
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = result?.errors?.[0]?.message || result?.error || "A küldés nem sikerült.";
          throw new Error(message);
        }
        status.dataset.kind = "success";
        status.textContent = "Köszönjük! Az üzenet sikeresen megérkezett.";
        form.reset();
      } catch (error) {
        status.dataset.kind = "error";
        status.innerHTML = `Nem sikerült elküldeni. Írj nekünk közvetlenül: <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}">${escapeHtml(SUPPORT_EMAIL)}</a>`;
      } finally {
        submit.disabled = false;
      }
    });
  });
})();
