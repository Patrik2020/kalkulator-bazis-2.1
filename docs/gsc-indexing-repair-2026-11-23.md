# GSC indexelési javítás – 2026-11-23

## Ellenőrzött kiindulás

- Főág: `995584ed8b2027ece73f1c9390552851c5f27f40`; nyitott #414 függőségfrissítés és félretett #415 lokalizáció, nincs kapcsolódó indexelési PR.
- Search Console Oldalak, utolsó frissítés 2026-11-16: 128 indexelt, 161 kizárt URL. Ebből 133 átirányított URL; ezek nem automatikusan hibák.
- Sitemap: 2026-11-23-án sikeresen beolvasva, 118 URL. A hat felfedezési jelölt mind szerepel a repository sitemapjében.
- A CO₂-kalkulátor kiterjesztés nélküli címe indexelt, Google és deklarált canonical egyezik (legutóbbi feltérképezés: november 18.). A régi `.html` jelentés nem indokol új canonicalt.
- A receptkalkulátor élő Google-tesztje november 23-án sikeres: feltérképezés és indexelés engedélyezett, önmagára mutató canonical. Az indexelési kérelem elfogadása nem garantál indexelést.

## Változás és tulajdonos

- A négy kategória meglévő Kapcsolódó témák blokkjában statikus linkek segítik a döntéstervező, féktáv, receptadag és három élethelyzet-oldal felfedezését. Az új feliratok a meglévő kategórialokalizációs szótárban kaptak EN/DE fordítást.
- A meglévő `_redirects` forrásba négy történelmi Wise/ETF szabály került; a meglévő Cloudflare-generátor készíti a CSV-t. Nincs új futásidejű átirányítási réteg.
- A tapéta régi `.html` címe már szerepel a sitemapből generált közvetlen 301-listában. A hőmérséklet-átváltó két régi címe már az összevont mértékegység-átváltóra mutat; ezekhez nem adtunk párhuzamos szabályt.
- Nincs eltávolított runtime; a régi URL-ek kompatibilitása szándékosan megmarad. A megszüntetett hírek, API/MCP végpontok és indokolt noindex kizárások nem változtak.
- Számítás, bemenet, adózási szabály, hirdetés és beleegyezés változatlan.

## Ellenőrzések és élesítés

- `node --test scripts/gsc-indexing-regression.test.js`: 2 sikeres teszt, a teljes generált listán ellenőrzi a láncmentességet, egyedi forrásokat és sitemapben szereplő kanonikus célokat; a hat új kategórialinket és fordításaikat is ellenőrzi. Bekötve az URL consolidation CI-ba.
- `node --test scripts/static-build-pipeline.test.js`: 15 sikeres teszt.
- `npm run quality`: sikeres a végleges helyi változásokon.
- `npm run static:build`: helyben sikertelen, Chromium `socket() failed: Operation not permitted`; a részleges generálás nem került a változásba. A teljes render/idempotencia és böngészős regresszió GitHub CI-eredményét külön kell ellenőrizni.
- GitHub CI, merge és deployment: a PR állapota a mérvadó, nem ez a helyi tesztjegyzék.
- Cloudflare: a generált CSV aktiválása külön infrastruktúra-művelet; a GitHub Pages nem dolgozza fel a `_redirects` fájlt. A szabályok éles működése csak külön HTTP-ellenőrzés után állítható. A korábbi közvetlen HTTP-próbák 403-at kaptak; ez nem bizonyít Googlebot-tiltást.
- Visszaállítás: e célzott commit revertje; a Cloudflare-lista módosítása esetén annak külön visszaállítása is szükséges.
