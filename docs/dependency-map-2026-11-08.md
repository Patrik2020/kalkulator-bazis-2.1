# Kalkulátor Bázis 2.1 – fájl- és függőségtérkép (2. lépés)

**Dátum:** 2026-11-08  
**Forrásindulás:** GitHub main, commit f0589f988743deb83669adb693fd862f031e2e7a.  
**Státusz:** statikus felderítés és megismételhető függőségi ellenőrzés; nem teljes futásidejű bizonyítás.  
**Kapcsolódik:** [fejlesztési szabályzat](engineering-development-contract.md), [első audit](architecture-maintainability-audit-2026-11-08.md).

## 1. A teljes követettfájl-leltár

A GitHub Git tree válasza nem volt csonkolt: **857 követett fájl**, ebből **402 JavaScript**, **161 HTML**, **85 CSS** és **52 Markdown**. A scripts/ alatt **271**, a weboldali js/ alatt **139**, a css/ alatt **86** fájl található, a kalkulatorok/ alatt **102**.

A 402 JavaScript-fájlba a CI, a build, az adminisztráció és a tesztek is beleszámítanak; nem 402 böngészőben betöltött script.

## 2. Kanonikus rendszerek és kapcsolatok

| Terület | Belépőpont és forrás | Kapcsolat / hatás |
| --- | --- | --- |
| Főoldal | index.html | global-head-config.js + global-head.js, home-redesign-core.js, három főoldali szótár, style.css és oldalspecifikus CSS |
| Főoldali fragmentum | index.html -> scripts/sync-home-fragments.js | fragments/home-redesign-v17-*.inc származtatott recovery-adat, nem második kézi forrás |
| Kalkulátoroldalak | kalkulatorok/*.html | egyedi JS/CSS, közös utils, head által betöltött kiegészítések, HU/EN/DE fordítás |
| Nettó–bruttó | netto-brutto-kalkulator.html -> js/penzugyi/netto-brutto.js | a fájl betölti a **működő** netto-brutto-shadow.js API-klienst -> api.kalkulatorbazis.hu |
| Dinamikus head | js/global-head-config.js -> js/global-head.js | konfigurációalapú betöltés; közvetlen HTML-hivatkozás keresése önmagában elégtelen |
| Oldalnyilvántartás | scripts/site-page-inventory.js | js/site-data.js, js/expansion-batch-0*-data.js, aktualis/*.html -> materializálandó oldalak |
| Kanonikus build | scripts/static-build-pipeline.js | **37 lépés** három fázisban: forrás-transzformációk -> materialize-static-first -> normalizálás, fragmentum, cache hash, sitemap |
| Asset & PWA | scripts/asset-versions.js, scripts/cache-bust-assets.js | JS/CSS verziók és service worker fingerprint; js/pwa.js -> sw.js -> precache erőforrások |
| Weboldal CI | .github/workflows/quality.yml, browser-quality.yml, security-baseline.yml | package.json parancsok, kalkulátorregresszió, böngésző és security ellenőrzések |
| Facebook-automatizálás | .github/workflows/buffer-daily-facebook.yml | scripts/schedule-buffer-facebook.mjs + Buffer posztbank és assets/social/facebook mappa; külön GitHub workflow |

### Három fő adatfolyam

**Böngésző:** HTML oldal -> közös konfigurált head -> oldalspecifikus JS/CSS -> kalkulátor/fordítás -> szükség esetén API.

**Generálás:** site-data + oldalnyilvántartás -> static-build-pipeline -> alkalmazó transzformációk -> Chrome materializálás -> normalizálás + cache/sitemap -> publikált HTML.

**Offline/cache:** js/pwa.js -> sw.js -> precache + cache-stratégia; ezeket törlési döntésnél külön figyelembe kell venni.

## 3. Ismételhető automatikus felmérés

A csak olvasó scripts/dependency-map-audit.js minden Git által követett, számára releváns forrást ellenőriz és gyűjti a HTML script, CSS, belső link, CSS import, JavaScript import, build-stage, config, manifest és service-worker hivatkozásokat.

- npm run audit:dependencies: embernek olvasható, összesített kimenet.
- node scripts/dependency-map-audit.js --json: géppel feldolgozható összefoglaló.
- npm run test:dependency-map: izolált, célzott tesztek a pathfeloldásra és a téves törlési következtetés kizárására.
- A quality lánc elején az új unit teszt és az információs audit is fut. A korábbi teszteket nem gyengítjük.

**Figyelem:** a statikus hivatkozás hiánya csak további vizsgálatra alkalmas jelzés; nem bizonyítja, hogy egy fájl törölhető.

## 4. A statikus térkép korlátai

- A DOM-on keresztül létrehozott JS/CSS, összefűzött útvonal, dinamikus import, Cloudflare routing, külső API/CDN és a szkriptgenerált kimenet egy része nem deríthető fel puszta stringkereséssel.
- A build transzformációk forrás- és kimeneti tulajdonossága külön feladat: egy generált fájl attól még aktív, hogy kevés közvetlen statikus hivatkozása van.
- A nulla statikusan visszavezetett felhasználású kód lehet szándékos teszteszköz, adminisztráció, tartalék kompatibilitás vagy dinamikusan betöltött modul.
- Ez a dokumentum nem állít sikeres helyi buildet, teljes böngészős QA-t vagy élő éles API-ellenőrzést.

## 5. Első tényleges futtatás és kézzel ellenőrzött jelöltek

A GitHub Site quality job a 362-es PR frissített ellenőrzőjén végrehajtotta a diagnosztikát és a három új tesztet. **Mindhárom teszt sikeres**, a Site quality job is sikeresen zárult (auditfejlesztési commit: ec8546e73769d2e39df17130533ec20207607ac3). A diagnosztika a PR-ben követett 860 fájlt elemezte (857 eredeti + 3 új fájl; a package.json módosult, nem új).

- 11 571 felismert él / hivatkozásjelölt; 663 különböző feloldott célpont.
- 1038 HTML script-hivatkozás; 328 HTML stílus-hivatkozás; 16 CSS import; 37 buildfázis-lépés; 17 SW precache utalás.
- **0 erős, hiányzó, közvetlen HTML-script/CSS-import/manifest hivatkozás.** Ez nem jelent teljes működési bizonyítékot.
- **121 egyéb feloldatlan jelölt** a korrigált statikus futtatásban (a korábbi 226 helyett). A ./ és extensionless route feloldását külön regressziós teszt védte. A fennmaradó tételek között található 10 ténylegesen hiányzó, régi CSS-ben hivatkozott képfájl, valamint nem valódi fájlhivatkozások, például eslint globminták. A 121 darab nem 121 működési hiba.
- 3 közvetlen bejövő, statikusan felismert JS/CSS kapcsolat nélküli jelölt: css/components/site-compatibility.css, css/pages/site-quality-final.css, js/site-compatibility.js. **Egyik sem minősíthető törölhetőnek** a dinamikus és generált fogyasztók ellenőrzése nélkül.

**D-01: konkrét, rétegezett CSS és hiányzó régi képreferenciák.** A css/pages/home-redesign-v17.css 194–209. sorának korábbi szabályai 4 külön évszakos és 6 kategória-AVIF fájlra hivatkoznak, amelyek jelenleg nincsenek a Git tree-ben. A 251–268. sorban később két, ténylegesen létező season-atlas.avif és category-atlas.avif kerül beállításra, !important háttérkép-szabályokkal a home-redesign-v17 osztály alatt. A főoldal body eleme rendelkezik ezzel az osztállyal. Ez **igazoltan megmaradt régi/új réteg**, amely a felhasználó által kifogásolt módszerhez hasonlít; a CSS kaszkád és valamennyi képernyőméret tényleges viselkedése további vizsgálatot igényel. Törlés egyelőre nincs. **Prioritás: magas a CSS-auditban, nem igazolt produkciós incidens.**

Ezeket a számokat valódi GitHub Actions napló igazolja. Az audit továbbra is csak statikus heurisztika; az egyéb jelölteket források és runtime viselkedés alapján kell osztályozni. A CI státusz és az éles ellenőrzés két külön dolog.

## 6. Következő vizsgálati sorrend

1. A jelenlegi nettó–bruttó HTML mellett a js/penzugyi/netto-brutto.js legacy upgradeFamilyFields működése.
2. A finance-quality-upgrades.js, construction-quality-upgrades.js és priority-upgrades.js funkciógazda / DOM / event binding rétegei.
3. A 37 buildlépés és az alkalmazó transzformációk teljes forrás- és célállomány-mátrixa.
4. A CSS importlánc, felülírt szelektorok és a főoldali vizuális rétegek.
5. A global-head konfiguráció, theme.js, pwa.js és sw.js dinamikusan betöltött erőforrásai.

## 7. Egyesítés előtt ellenőrizendő

A PR valódi GitHub Actions kimenete (az új analyzer és unit teszt), a jelzett hiányzó hivatkozások téves pozitív / tényleges probléma osztályozása, továbbá a régi CI kapuk változatlansága. **Semmilyen futó weboldalkódot nem módosítunk és semmit nem törlünk ebben a lépésben.**
