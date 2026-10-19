# Kalkulátor Bázis – a nyolcrészes kódrendezés lezárása

Dátum: 2026-10-19. Kiinduló főág: `61f5dec7256aa4fc498601186f552497216e11f5` (7/8).

## A 8. csomag tartalma

21 fájl, 305 819 bájt és 5287 korábbi sor eltávolítása. A törlések Git-előzményből visszaállíthatók.

| Törölt fájlok | Bizonyíték / indok |
| --- | --- |
| `.asset-chunks/season-00.txt`, `season-01.txt`, `season-02.txt` | Nem hivatkozott darabolt assetmaradványok; az aktív évszaktémát a `js/theme.js` a verziózott CSS/JS fájlokból tölti be. |
| `css/pages/home-ia.css`, `home-portfolio-2027-polish.css`, `home-professional.css`, `mobile-hero.css` | Egyik HTML, CSS-import, runtime betöltő, manifest, service worker vagy buildlépés sem hivatkozik rájuk. Az aktuális főoldali CSS szerződését a meglévő audit ellenőrzi. |
| `scripts/rebuild-site.js`, `refine-content.js`, `refine-metadata.js`, `normalize-adsense.js`, `normalize-heads.js`, `normalize-form-labels.js` | Leváltott buildlánc: a belső hivatkozások kizárólag a régi belépőpontból jöttek. A kanonikus `static:build` nem használja. A régi szöveg-, metaadat- és head-generálók visszaírhatnák a későbbi javítások előtti állapotot. |
| `scripts/add-category-calculators.js`, `quarantine-legacy-category-generator.js` | A korábban karanténba tett generátor már leváltott képleteket is tartalmazott. A generátorral együtt annak karanténlépése, npm-parancsai és workflow-hivatkozása is megszűnt. |
| `scripts/add-calculator-expansion-batch2.js`, `fix-expansion-html-entities.js`, `fix-wise-legal-pages.js` | Nem hivatkozott, már alkalmazott egyszeri generáló/javító eszközök. Az elkészült oldalak, runtime és jelenlegi tesztek megmaradtak. |
| `scripts/browser-math-audit.py`, `browser-math-audit-results.json`, `http-audit-results.json` | A régi Python-audit géphez kötött `/mnt/data/kb_math_fixed` kimeneti útvonalat használt, nem futott a buildben vagy CI-ben. A két eredményfájlt egyetlen aktív fogyasztó sem olvasta. A jelenlegi Node matematikai és böngészős referenciaellenőrzések megmaradtak. |

A hivatkozásvizsgálat a Gitben követett forrásokat, npm-parancsokat, workflow-kat, dokumentációt, dinamikus betöltőket és a kanonikus build lépéseit is lefedte. A külön futtatható diagnosztikai eszközöket nem töröltük pusztán azért, mert nincs hozzájuk npm-alias vagy CI-lépés. A `math-audit-results.json` továbbra is a `test:math:update` támogatott kimenete.

## Átadás és ellenőrzés

- `npm run static:build`: egyetlen, 132 oldalas materializálás, végső normalizálás, assetverziózás és sitemap.
- `npm run static:verify`: az újabb teljes futás után változatlan munkafa.
- `npm run quality`: HTML/JS, asset-, főoldali CSS-, betöltési, URL-, séma-, kalkulátor- és tartalmi ellenőrzések.
- `node --test scripts/*.test.js`: AdSense policy, assetverziózás, kalkulátorszkópok, runtime/inicializálás, böngészőszabályok és buildtesztek.
- `npm run test:reference:browser`: 30 kalkulátor helyes eredmény-, határérték- és hibásbemenet-esetei.
- A GitHub PR- és főági kapuk ellenőrzik a materializált kimenetet és a reszponzív böngészős működést; a főágon a részletes mobil/asztali UI QA is lefut.

Az aktív kalkulátorok, hirdetési jogosultsági szabályok, CMP-hozzájárulás, nyilvános URL-ek és átirányítások nem változnak. A service worker buildazonosítója a csökkentett assetkészlet alapján frissül.

## A nyolc csomag eredménye

1. A piros ellenőrzés javítása és a tesztalap rendezése.
2. Tartalomalapú assetverziózás és ellenőrzése.
3. Közös AdSense jogosultsági szabályok és a hozzájárulás utáni betöltés ellenőrzése.
4. A főoldali CSS javítórétegeinek összevezetése és szerződésauditja.
5. A kalkulátorok JavaScript-szkópjainak izolálása.
6. Komponensbetöltés és egyszeri inicializálás rendezése.
7. Egy kanonikus buildlánc, külön idempotencia-ellenőrzéssel.
8. Igazoltan használaton kívüli maradványok eltávolítása és záróellenőrzés.

A Cloudflare által korlátozott production audit külön folytatási feladat; az átállítás és a védelem módosítása nem része ennek a kódrendezésnek. A sikeres telepítés és a kihagyott élő audit külön állapotként értelmezendő.
