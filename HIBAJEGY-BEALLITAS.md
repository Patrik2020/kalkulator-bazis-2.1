# Kalkulátor Bázis – 1. lépcső beállítása

A csomag tartalmazza a lebegő segítség/hibabejelentő widgetet és a Cloudflare Worker hátteret.

## 1. GitHub token

A GitHubon készíts Fine-grained personal access tokent kizárólag a `Patrik2020/kalkulator-bazis-2.1` repóhoz. A szükséges jogosultság: **Issues: Read and write**.

## 2. Resend e-mail

Hozz létre Resend-fiókot, add hozzá és hitelesítsd a `kalkulatorbazis.hu` domaint. A feladó lehet például: `Kalkulátor Bázis <hibajegy@kalkulatorbazis.hu>`. A címzett: `kalkulatorbazis@gmail.com`.

## 3. Cloudflare Worker

1. Cloudflare Dashboard → Workers & Pages → Create Worker.
2. Másold be a `worker/worker.js` tartalmát.
3. A Worker Settings → Variables and Secrets alatt add meg:
   - `GITHUB_TOKEN` – titkos változó
   - `RESEND_API_KEY` – titkos változó
   - `GITHUB_REPO` = `Patrik2020/kalkulator-bazis-2.1`
   - `GITHUB_LABEL` = `felhasználói-hibajegy`
   - `EMAIL_TO` = `kalkulatorbazis@gmail.com`
   - `EMAIL_FROM` = `Kalkulátor Bázis <hibajegy@kalkulatorbazis.hu>`
4. Deploy.

## 4. Worker URL beírása

A `js/help-widget.js` elején cseréld le ezt:

```js
const API_URL = "https://YOUR-WORKER-SUBDOMAIN.workers.dev/report";
```

a tényleges Worker URL-re.

## 5. Feltöltés

Commitold a teljes módosított projektet. A widget minden HTML-oldalon be van kötve.

## Biztonság

A GitHub- és Resend-kulcs soha ne kerüljön a GitHub repóba vagy a böngészőben futó JavaScriptbe. Csak Cloudflare secretként tárold.
