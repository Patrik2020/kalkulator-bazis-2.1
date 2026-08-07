# Segítség widget háttérszolgáltatás

A `src/index.js` egy Cloudflare Worker, amely a widget bejelentéseit e-mailben továbbítja.

Szükséges környezeti változók:

- `RESEND_API_KEY`: a levelezési szolgáltató API-kulcsa
- `FROM_EMAIL`: ellenőrzött feladó, például `Kalkulátor Bázis <noreply@kalkulatorbazis.hu>`
- `TO_EMAIL`: célcím, alapértelmezés szerint `kalkulatorbazis@gmail.com`

A Worker végpontja: `/report`.

Telepítés után a `js/global-head.js` fájl elején állítsd be a Worker nyilvános végpontját:

```js
window.KB_HELP_API_URL = "https://pelda.workers.dev/report";
```

Ha ez nincs beállítva, a widget a jelenlegi Formspree-végpontot használja. A Worker csak e-mailben továbbítja a bejelentést; nem hoz létre nyilvános vagy privát GitHub-hibajegyet.

Élesítéskor állíts be Cloudflare oldali sebességkorlátot a `/report` végpontra. Az eredetellenőrzés és a CORS önmagában nem helyettesíti a visszaélés elleni forgalmi korlátozást.
