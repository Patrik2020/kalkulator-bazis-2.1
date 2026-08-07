# Biztonsági fejlécek élesítése

Frissítve: 2026. augusztus 7.

## Miért kell külön beállítás?

A webhely GitHub Pagesen fut. A gyökérben lévő `_headers` fájlt a GitHub Pages nem alkalmazza HTTP-válaszfejlécként, ezért ugyanazokat a fejléceket az oldal elé helyezett Cloudflare-proxyban kell beállítani.

## Cloudflare-beállítás

1. Kapcsold be a proxyt a `kalkulatorbazis.hu` és – ha használatban van – a `www.kalkulatorbazis.hu` rekordján.
2. Nyisd meg a **Rules → Transform Rules → Modify Response Header** részt.
3. Hozz létre egy szabályt az összes `kalkulatorbazis.hu` és `www.kalkulatorbazis.hu` válaszra.
4. Állítsd be az alábbi fejléceket:

| Fejléc | Érték |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `X-Permitted-Cross-Domain-Policies` | `none` |
| `Origin-Agent-Cluster` | `?1` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | `object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` |

A HSTS-fejlécet csak akkor kapcsold be, amikor minden érintett aldomain tartósan HTTPS-en működik. A beállítás egy évre vonatkozó böngészőutasítást ad.

## Miért csak biztonságos CSP-alapérték van itt?

Az oldal Google taget és AdSense-t használ. A Google jelenlegi útmutatója szigorú CSP esetén válaszonként generált nonce-ot kér; ezt egy változatlan GitHub Pages-fájl nem tudja előállítani. Egy statikus, kézzel karbantartott teljes domainlista idővel és észrevétlenül letilthatja a hirdetéseket.

Ezért az élesíthető alapérték már tiltja a beágyazást, az objektumokat, a `<base>` elemet és a nem saját domainre küldött hagyományos űrlapokat, de nem tesz úgy, mintha teljes XSS-védelmet adna. Teljes `script-src` szabályhoz Cloudflare Workerrel válaszonként nonce-ot kell generálni, hozzáadni minden scripthez, majd CSP-jelentési módban ellenőrizni az AdSense-t, a Google taget, a Formspree-t és a Frankfurter deviza-API-t.

Google útmutató: <https://developers.google.com/tag-platform/security/guides/csp>

## Ellenőrzés

Élesítés után:

```bash
curl -sI https://kalkulatorbazis.hu/ | grep -Ei 'content-security-policy|strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy'
```

Ellenőrizd külön a főoldalt, egy kalkulátort, a devizaátváltót, a segítségküldést és egy hirdetést tartalmazó oldalt. A böngésző konzoljában ne maradjon CSP-sértés vagy blokkolt kérés.
