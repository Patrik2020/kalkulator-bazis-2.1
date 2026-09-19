# Production smoke – Kalkulátor Bázis

A `scripts/production-smoke-audit.js` az éles `https://kalkulatorbazis.hu` állapotát ellenőrzi a repóban rögzített elvárásokhoz képest.

## Automatikus futás

A `.github/workflows/production-smoke.yml` fut:

- minden `main` push után;
- naponta egyszer;
- kézi `workflow_dispatch` indítással.

A workflow kontrollált retry-t használ, hogy egy rövid deploy/CDN propagáció ne okozzon azonnal fals hibát. A production probe böngészőszerű kérésprofilt használ, mert a Cloudflare a nyíltan automatizáltnak jelölt GitHub-hosted runner kéréseket blokkolhatja. HTTP-hibánál a log a `server` és `cf-ray` diagnosztikai adatokat is kiírja.

## Kézi futtatás

Node.js 24+ környezetben:

```bash
node scripts/production-smoke-audit.js
```

Szükség esetén a cél és a retry beállítások környezeti változókkal felülírhatók:

- `KB_PRODUCTION_BASE_URL`
- `KB_PRODUCTION_ATTEMPTS`
- `KB_PRODUCTION_RETRY_DELAY_MS`
- `KB_PRODUCTION_REQUEST_TIMEOUT_MS`

## Mit ellenőriz?

- kulcsoldalak production markerei;
- a régi darabszám-marketing visszacsúszásának hiánya;
- az Átlag-központ és a Mértékegység-központ éles állapota;
- a production sitemap URL-készlet egyezése a repóval;
- `robots.txt` és `ads.txt` egyezés;
- az `_redirects` valamennyi 301 szabályának tényleges HTTP működése;
- a kivezetett redirect-források hiánya a production sitemapből.

Ez a teszt deploy/regresszió-ellenőrzés. Nem minősíti és nem jósolja meg a Google AdSense jóváhagyását.
