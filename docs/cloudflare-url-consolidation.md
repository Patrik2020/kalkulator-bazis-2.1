# Cloudflare URL-konszolidáció

## Cél

A Kalkulátor Bázis kanonikus URL-jei kiterjesztés nélküliek, például:

- `https://kalkulatorbazis.hu/kalkulatorok/netto-brutto-kalkulator`

A történelmi fizikai `.html` URL-eket közvetlen 301-es átirányítással ugyanennek az oldalnak a kanonikus URL-jére kell irányítani:

- `kalkulatorbazis.hu/kalkulatorok/netto-brutto-kalkulator.html`
- → `https://kalkulatorbazis.hu/kalkulatorok/netto-brutto-kalkulator`

A cél az, hogy a Google Search Console-ban idővel megszűnjön a `.html` és extensionless URL-ek közötti jelmegosztás.

## Forrásigazság

A redirect-lista nem kézzel karbantartott URL-jegyzékből készül.

A generátor két forrást használ:

1. `sitemap.xml` – az aktuális kanonikus oldalakhoz létrehozza a történelmi `.html` → extensionless 301-et.
2. `_redirects` – a megszüntetett vagy összevont oldalak már rögzített 301-es szabályait közvetlenül a végleges célra viszi át.

Ez elkerüli a redirect chain-eket, és csökkenti annak kockázatát, hogy egy új kalkulátor URL-je kimaradjon a takarításból.

## CSV generálása

A repository gyökeréből:

```bash
node scripts/generate-cloudflare-bulk-redirects.js
```

Alapértelmezett kimenet:

```text
cloudflare-bulk-redirects.csv
```

Egyedi célfájl:

```bash
node scripts/generate-cloudflare-bulk-redirects.js --output /tmp/kb-cloudflare-redirects.csv
```

Standard output:

```bash
node scripts/generate-cloudflare-bulk-redirects.js --stdout
```

## Cloudflare-beállítás

A generált fájl a Cloudflare Bulk Redirect CSV formátumát használja, fejléc nélkül.

Beállítások minden sornál:

- státusz: `301`
- query string megőrzése: `TRUE`
- subdomain-egyezés: `FALSE`
- subpath matching: `FALSE`
- path suffix megőrzése: `FALSE`

A source URL-ből szándékosan hiányzik a séma (`http://` vagy `https://`), így ugyanaz a szabály mindkét sémára alkalmazható.

A lista feltöltése után külön **Bulk Redirect Rule** szükséges, amely aktiválja a listát.

## Ellenőrzés élesítés előtt

Legalább ezeket kell manuálisan ellenőrizni:

```text
/kalkulatorok/netto-brutto-kalkulator.html
/kalkulatorok/etf-kalkulator.html
/kalkulatorok/beton-kalkulator.html
/index.html
```

Elvárt eredmény:

1. az első válasz közvetlen `301`;
2. a `Location` fejléc már a végleges extensionless kanonikus URL;
3. nincs köztes második redirect;
4. az extensionless céloldal `200` választ ad;
5. a céloldal canonical eleme önmagára mutat.

## GSC utókövetés

A Cloudflare szabály aktiválása után a régi `.html` URL-ek még hetekig megjelenhetnek a Search Console történeti adataiban. Ez önmagában nem hiba.

Figyelendő trend:

- `.html` URL-ek megjelenései és kattintásai csökkennek;
- extensionless URL-ek részesedése nő;
- nincs új `.html` URL a sitemapben vagy belső linkekben;
- a `quality:urls` ellenőrzés továbbra is sikeres.
