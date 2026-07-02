const ALLOWED_ORIGINS = new Set([
  "https://kalkulatorbazis.hu",
  "https://www.kalkulatorbazis.hu"
]);

const json = (data, status = 200, origin = "") => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://kalkulatorbazis.hu",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Cache-Control": "no-store"
  }
});

const clean = (value, maxLength) => String(value ?? "")
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
  .trim()
  .slice(0, maxLength);

const escapeHtml = (value) => clean(value, 5000)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const validEmail = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Tiltott eredet." }, 403, origin);
      return json({ ok: true }, 204, origin);
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/report") {
      return json({ error: "Az útvonal nem található." }, 404, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Tiltott eredet." }, 403, origin);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "A levelezési szolgáltatás nincs beállítva." }, 503, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Érvénytelen kérés." }, 400, origin);
    }

    const website = clean(body.website, 200);
    if (website) return json({ ok: true }, 200, origin);

    const type = clean(body.type, 80) || "Kapcsolatfelvétel";
    const description = clean(body.description, 2000);
    const expected = clean(body.expected, 1000);
    const inputData = clean(body.inputData, 1000);
    const email = clean(body.email, 200);
    const pageUrl = clean(body.pageUrl, 1000);
    const pageTitle = clean(body.pageTitle, 300);
    const referrer = clean(body.referrer, 1000);
    const userAgent = clean(body.userAgent, 1000);
    const language = clean(body.language, 50);
    const screen = clean(body.screen, 50);
    const viewport = clean(body.viewport, 50);
    const sentAt = clean(body.sentAt, 80);
    const elapsedMs = Number(body.elapsedMs) || 0;
    const consent = body.consent === true;

    if (!description) return json({ error: "A leírás megadása kötelező." }, 400, origin);
    if (!consent) return json({ error: "Az adatkezelési hozzájárulás kötelező." }, 400, origin);
    if (!validEmail(email)) return json({ error: "Az e-mail-cím formátuma hibás." }, 400, origin);

    const subject = `[Kalkulátor Bázis] ${type}`;
    const html = `
      <h2>${escapeHtml(type)}</h2>
      <p><strong>Leírás:</strong><br>${escapeHtml(description).replaceAll("\n", "<br>")}</p>
      ${expected ? `<p><strong>Elvárt működés:</strong><br>${escapeHtml(expected).replaceAll("\n", "<br>")}</p>` : ""}
      ${inputData ? `<p><strong>Megadott adatok:</strong><br>${escapeHtml(inputData).replaceAll("\n", "<br>")}</p>` : ""}
      <hr>
      <p><strong>Válasz e-mail:</strong> ${email ? escapeHtml(email) : "nincs megadva"}</p>
      <p><strong>Oldal:</strong> ${pageUrl ? `<a href="${escapeHtml(pageUrl)}">${escapeHtml(pageTitle || pageUrl)}</a>` : "nincs"}</p>
      <p><strong>Hivatkozó oldal:</strong> ${escapeHtml(referrer || "nincs")}</p>
      <p><strong>Nyelv:</strong> ${escapeHtml(language)}</p>
      <p><strong>Képernyő:</strong> ${escapeHtml(screen)}; viewport: ${escapeHtml(viewport)}</p>
      <p><strong>Böngésző:</strong> ${escapeHtml(userAgent)}</p>
      <p><strong>Küldés időpontja:</strong> ${escapeHtml(sentAt)}</p>
      <p><strong>Oldalon töltött idő:</strong> ${Math.max(0, Math.round(elapsedMs / 1000))} másodperc</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Kalkulátor Bázis <noreply@kalkulatorbazis.hu>",
        to: [env.TO_EMAIL || "kalkulatorbazis@gmail.com"],
        subject,
        html,
        reply_to: email || undefined
      })
    });

    const resendResult = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend error", resendResponse.status, resendResult);
      return json({ error: "A levél küldése nem sikerült." }, 502, origin);
    }

    return json({ ok: true, messageId: resendResult.id || null }, 200, origin);
  }
};
