# Production smoke – Kalkulátor Bázis

A `scripts/production-smoke-audit.js` az éles `https://kalkulatorbazis.hu` állapotát ellenőrzi a repóban rögzített elvárásokhoz képest.

## Automatikus futás

A `.github/workflows/production-smoke.yml` fut:

- minden `main` push után;
- naponta egyszer;
- kézi `workflow_dispatch` indítással.

A workflow kétlépcsős:

1. **Production reachability** – először ellenőrzi, hogy a GitHub-hosted runner egyáltalán eléri-e az éles domaint.
2. **Production audit** – csak akkor indul el, ha az éles domain a runner számára ténylegesen elérhető.

Ha a Cloudflare kifejezetten a GitHub-hosted runnert blokkolja HTTP 403-mal, a futás ezt **inconclusive / nem ellenőrizhető** állapotként kezeli: a valódi production audit kimarad, ezért nem kap hamis piros hibát, de a rendszer nem is állítja, hogy az éles audit sikeresen lefutott. A workflow warningot és GitHub Step Summary bejegyzést készít, benne a `server` és `cf-ray` diagnosztikai adatokkal.

Más hálózati hiba vagy nem Cloudflare-eredetű váratlan HTTP státusz továbbra is valódi hibának számít.

Ha a reachability rendben van, a production audit kontrollált retry-t használ, hogy egy rövid deploy/CDN propagáció ne okozzon azonnal fals hibát. A production probe böngészőszerű kérésprofilt használ, és HTTP-hibánál a log a `server` és `cf-ray` diagnosztikai adatokat is kiírja.

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
