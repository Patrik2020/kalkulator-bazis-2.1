# AdSense Gate v2 – 6 körös átalakítási terv

Cél: a Kalkulátor Bázis teljes domainjének minőségi profilját úgy átalakítani, hogy a működő kalkulátorok, a saját módszertan, az ellenőrizhető források és az egyedi felhasználói érték legyen domináns, miközben csökken a site-wide sablonujjlenyomat és a monetizáció csak megfelelő oldalakra kerülhet.

## 1. kör – Mérőrendszer és baseline

Érintett eredeti pontok: 1, 2, 3, 6, 7, 9, 10, 11.

- új `scripts/adsense-quality-v2-audit.js`;
- nincs minimális szószám-kapu;
- ismétlődő tartalmi blokkok és boilerplate-arány mérése;
- hasonló kalkulátorpárok keresése;
- duplikált title/meta description jelzése;
- YMYL Who / How / Why / forrás ellenőrzés;
- direkt AdSense-script, redirect/noindex és affiliate jelzések;
- kezdeti monetizációs allowlist / exclude lista;
- sitemap `lastmod` eloszlás figyelése;
- CMP/TCF állapot külön figyelmeztetésként.

Kapu: először riportként fut; csak a javítások után válik blokkoló CI-gate-té.

## 2. kör – Template Fingerprint Removal

Érintett pontok: 1, 2.

- tömegesen ismétlődő „Mit tud többet ez a változat?” és hasonló blokkok eltávolítása/egyediesítése;
- generikus „tervezési segédlet”, „gyors és egyszerű” és egyéb SEO-boilerplate visszavágása;
- egyszerű/commodity kalkulátorok tartalmi és funkcionális differenciálása;
- ahol nincs valódi egyedi érték, összevonási/noindex/törlési javaslat készül, automatikus törlés nélkül;
- átváltók és egyszerű matematikai oldalak külön csoportos auditja.

Kapu: boilerplate-arány és veszélyes oldalpár-hasonlóság a v2 audit határértékei alatt.

## 3. kör – Who / How / Why + YMYL bizalom

Érintett pontok: 3, 4.

- pénzügyi és egészségügyi kalkulátorokon látható szerkesztő/fejlesztő jelzés;
- módszertan, forrás, ellenőrzési dátum és korlátok egységes, de nem sablonos szerkezete;
- külön AI/automatizálási átláthatósági rész: mire használunk AI-t, és mit ellenőriz ember;
- külső szakértői lektorálás hiányának őszinte jelölése ott, ahol releváns;
- strukturált adatok összehangolása a látható tartalommal.

Kapu: minden YMYL-kalkulátor teljesíti a Who / How / Why / forrás minimumot.

## 4. kör – Saját tartalmi védőárok és affiliate-higiénia

Érintett pontok: 5, 8.

- `Aktuális` tartalmak: előző érték → új érték → különbség → kit érint → kapcsolódó kalkulátor → hivatalos forrás;
- csak kalkulátorhoz vagy pénzügyi döntéshez közvetlenül kapcsolódó változások;
- Wise oldal megtartása, affiliate-jelölések és saját tartalom arányának kontrollja;
- partneroldal külön monetizációs kizárása az induló AdSense-rendszerből;
- belső linkek erősítése az Aktuális → kalkulátor és kalkulátor → releváns Aktuális irányokban.

Kapu: minden új Aktuális-cikk saját feldolgozást és elsődleges forrást tartalmaz.

## 5. kör – AdSense elhelyezés és CMP

Érintett pontok: 7, 11.

- allowlist-alapú monetizáció: kalkulátorok + valódi tartalmi cikkek;
- kizárt: 404, kapcsolat, impresszum, adatvédelem, cookie, jogi/felhasználási oldalak, redirect oldalak és kezdetben Wise;
- központi helper dönti el, betölthető-e AdSense az adott oldalon;
- Google által elfogadott EEA CMP / IAB TCF megoldásra előkészítés vagy átállás;
- Consent Mode és AdSense betöltés regressziós tesztek.

Kapu: kizárt URL-en AdSense nem tölthető be; jogosult URL-en csak megfelelő consent után.

## 6. kör – Sitemap, crawl, végső QA és újraküldési kapu

Érintett pontok: 6, 9, 10 + az összes pont regressziója.

- `lastmod` csak érdemi tartalmi változásra frissüljön;
- régi Wise/jogi redirect stubok és más crawl-zaj ellenőrzése;
- canonical, noindex, sitemap és extensionless URL audit;
- teljes `npm run quality`, browser smoke és static-first ellenőrzés;
- AdSense Quality v2 audit blokkoló CI-gate-té emelése;
- új felülvizsgálat előtti checklist generálása.

Kapu: minden meglévő minőségi teszt zöld + AdSense v2 kritikus hibák száma 0.

## A 11 eredeti pont lefedése

1. generikus site-wide szövegek eltávolítása → 2. kör
2. commodity-tail audit → 2. kör
3. Who–How–Why → 3. kör
4. AI/szerkesztési folyamat publikálása → 3. kör
5. Aktuális mint saját tartalmi védőárok → 4. kör
6. AdSense-readiness CI audit → 1. és 6. kör
7. AdSense allowlist → 1. és 5. kör
8. Wise megtartása, de kontrollált affiliate státusz → 4. kör
9. ads.txt / ownership / crawl technikai kapcsolat megőrzése → 1. és 6. kör
10. sitemap lastmod higiénia → 1. és 6. kör
11. CMP külön kezelése → 1. és 5. kör

## Phase 2 – Batch 1 checkpoint (2026-09-18)

A commodity átváltók konszolidációja elkészült: 11 külön mértékegység-oldal egy közös átváltó központba került, a régi URL-ek 301/noindex/canonical fallback állapotban maradnak, a publikus registry 90 aktív + 11 kivezetett oldalt különböztet meg, és az új központ külön numerikus browser- és Quality 3.0-lefedettséget kapott.

A static-first pipeline teljes Phase 2 állapoton sikeresen lefutott: a 126 oldalas materializálás, stabilizálás, idempotencia, crawler-audit, teljes quality, AdSense runtime policy, Phase 2 audit, sitemap és inventory gate mind zöld lett. Az idempotencia utolsó ingadozását a header almenü-linkjeinek stabil alap-osztálya szüntette meg. Ez a végső emberi checkpoint a már materializált állapot teljes CI-ellenőrzését indítja el; új generált változásnak már nem kell keletkeznie.
