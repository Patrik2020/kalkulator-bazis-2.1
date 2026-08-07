# Segítség- és hibabejelentő beállítása

A webhely alapértelmezés szerint a meglévő Formspree-végpontot használja. A repóban található Cloudflare Worker választható alternatíva: a bejelentést Resenden keresztül e-mailben továbbítja, és nem készít GitHub-hibajegyet.

## Jelenlegi Formspree-beállítás

Kódmódosítás nélkül működik. Az üzemeltető feladata:

1. Ellenőrizni, hogy a `https://formspree.io/f/xgojpond` végpont a saját Formspree-fiókhoz tartozik.
2. Bekapcsolni a fiókhoz elérhető spamvédelmet és hozzáférés-védelmet.
3. A bejelentéseket és az e-mailes másolatokat az adatvédelmi tájékoztató szerinti időn belül törölni.

## Átállás Cloudflare Workerre

1. Hozz létre Resend-fiókot, és hitelesítsd a `kalkulatorbazis.hu` feladói domaint.
2. A `worker/` könyvtárban állítsd be a Worker secretet:

   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```

3. Szükség esetén módosítsd a `worker/wrangler.toml` `TO_EMAIL` és `FROM_EMAIL` értékeit.
4. Telepítsd a Workert:

   ```bash
   cd worker
   npx wrangler deploy
   ```

5. A `js/global-head.js` fájl elején add meg a végpontot, így minden oldalon elérhető lesz:

   ```js
   window.KB_HELP_API_URL = "https://SAJAT-WORKER.workers.dev/report";
   ```

6. Küldj tesztbejelentést, ellenőrizd az e-mailt, majd töröld a tesztadatokat.
7. Frissítsd az adatvédelmi tájékoztatót: Formspree helyett Cloudflare-t és Resendet kell megnevezni.

## Biztonság

- API-kulcs soha ne kerüljön a repóba vagy böngészőben futó JavaScriptbe.
- A Worker csak a két éles eredetről fogad kérést, korlátozza a kérésméretet, ellenőrzi a hozzájárulást, és HTML-kódolást alkalmaz az e-mail törzsén.
- A részletes külső élesítési feladatokat a [`docs/elesitesi-ellenorzolista.md`](docs/elesitesi-ellenorzolista.md) tartalmazza.
