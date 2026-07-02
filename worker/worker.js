const ALLOWED_ORIGINS = new Set([
  "https://kalkulatorbazis.hu",
  "https://www.kalkulatorbazis.hu"
]);

const json = (body, status = 200, origin = "") => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://kalkulatorbazis.hu",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  }
});

const clean = (value, max) => String(value || "").trim().slice(0, max);
const escapeMd = (value) => clean(value, 4000).replaceAll("```", "` ` `");

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Tiltott eredet." }, 403, origin);
      return json({ ok: true }, 204, origin);
    }
    if (request.method !== "POST") return json({ error: "Nem támogatott kérés." }, 405, origin);
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Tiltott eredet." }, 403, origin);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Hibás kérés." }, 400, origin); }

    // Egyszerű botvédelem
    if (clean(body.website, 100)) return json({ ok: true }, 200, origin);
    if (Number(body.elapsedMs || 0) < 2500) return json({ error: "Túl gyors beküldés." }, 429, origin);
    if (body.consent !== true) return json({ error: "A hozzájárulás kötelező." }, 400, origin);

    const type = clean(body.type, 60);
    const description = clean(body.description, 2000);
    const expected = clean(body.expected, 1000);
    const inputData = clean(body.inputData, 1000);
    const email = clean(body.email, 200);
    const pageUrl = clean(body.pageUrl, 1000);
    const pageTitle = clean(body.pageTitle, 300);

    if (!type || description.length < 8) return json({ error: "A leírás túl rövid." }, 400, origin);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Hibás e-mail-cím." }, 400, origin);

    const ip = request.headers.get("CF-Connecting-IP") || "ismeretlen";
    const issueTitle = `[Felhasználói ${type}] ${pageTitle || "Kalkulátor Bázis"}`.slice(0, 240);
    const issueBody = [
      `## ${escapeMd(type)}`,
      `**Oldal:** ${escapeMd(pageTitle)}`,
      `**URL:** ${escapeMd(pageUrl)}`,
      `**Időpont:** ${escapeMd(body.sentAt)}`,
      `**Kapcsolati e-mail:** ${email ? escapeMd(email) : "nem adott meg"}`,
      "",
      "### Leírás",
      escapeMd(description),
      expected ? `\n### Elvárt működés\n${escapeMd(expected)}` : "",
      inputData ? `\n### Megadott adatok\n${escapeMd(inputData)}` : "",
      "",
      "### Technikai adatok",
      `- Böngésző: ${escapeMd(body.userAgent)}`,
      `- Nyelv: ${escapeMd(body.language)}`,
      `- Képernyő: ${escapeMd(body.screen)}`,
      `- Nézet: ${escapeMd(body.viewport)}`,
      `- Hivatkozó oldal: ${escapeMd(body.referrer)}`,
      "",
      "_Automatikusan létrehozva a Kalkulátor Bázis segítség widgetjéből._"
    ].filter(Boolean).join("\n");

    const githubResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "kalkulatorbazis-support-worker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: [env.GITHUB_LABEL || "felhasználói-hibajegy"]
      })
    });

    if (!githubResponse.ok) {
      const detail = await githubResponse.text();
      console.error("GitHub error", githubResponse.status, detail);
      return json({ error: "A hibajegy létrehozása nem sikerült." }, 502, origin);
    }
    const issue = await githubResponse.json();

    const emailHtml = `
      <h2>${type.replace(/[<>]/g, "")}</h2>
      <p><strong>Oldal:</strong> ${pageTitle.replace(/[<>]/g, "")}</p>
      <p><strong>URL:</strong> ${pageUrl.replace(/[<>]/g, "")}</p>
      <p><strong>Leírás:</strong><br>${description.replace(/[<>]/g, "").replaceAll("\n", "<br>")}</p>
      ${expected ? `<p><strong>Elvárt működés:</strong><br>${expected.replace(/[<>]/g, "").replaceAll("\n", "<br>")}</p>` : ""}
      ${inputData ? `<p><strong>Megadott adatok:</strong><br>${inputData.replace(/[<>]/g, "").replaceAll("\n", "<br>")}</p>` : ""}
      <p><strong>Felhasználói e-mail:</strong> ${email || "nem adott meg"}</p>
      <p><a href="${issue.html_url}">GitHub hibajegy megnyitása (#${issue.number})</a></p>`;

    const mailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.EMAIL_TO || "kalkulatorbazis@gmail.com"],
        reply_to: email || undefined,
        subject: `${issueTitle} (#${issue.number})`,
        html: emailHtml
      })
    });

    if (!mailResponse.ok) {
      console.error("Resend error", mailResponse.status, await mailResponse.text());
      // A hibajegy már létrejött, ezért ettől még sikeres választ adunk.
    }

    return json({ ok: true, issueNumber: issue.number }, 201, origin);
  }
};
