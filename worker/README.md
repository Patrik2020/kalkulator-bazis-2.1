# Segítség widget háttérszolgáltatás

A `src/index.js` egy Cloudflare Worker, amely a widget bejelentéseit e-mailben továbbítja.

Szükséges környezeti változók:

- `RESEND_API_KEY`: a levelezési szolgáltató API-kulcsa
- `FROM_EMAIL`: ellenőrzött feladó, például `Kalkulátor Bázis <noreply@kalkulatorbazis.hu>`
- `TO_EMAIL`: célcím, alapértelmezés szerint `kalkulatorbazis@gmail.com`

A Worker végpontja: `/report`.

Telepítés után a `js/help-widget.js` fájlban az `API_URL` értékét a Worker nyilvános címére kell állítani.
