# Kalkulátor Bázis 2.1 – buildfolyamat és architektúra audit (4/8)

**Dátum:** 2026-11-08  
**Vizsgált alap:** GitHub main – 9f4e8be45b28ed7eb6d2f38f9bd06242d3504d0c  
**Státusz:** forrás- és workflow-alapú, **módosításmentes** műszaki audit. A kockázatok nem jelentenek automatikusan éles hibát vagy törlési engedélyt.  
**Előzmények:** [#362 – függőségtérkép](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/362) és [#363 – JS/CSS-audit](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/363) mergelve.

## Vezetői összefoglaló

A 2.1-es rendszernek **létezik egyetlen, sorrendben meghatározott kanonikus buildfolyamata**, tesztekkel, ismételhetőségi ellenőrzéssel, drift-felismeréssel és visszaállítási próbákkal. Ez értékes alap, ezért **nem szükséges 3.0-ás újraírás**.

A fő karbantarthatósági probléma nem feltétlenül a buildhibák gyakorisága, hanem hogy a kanonikus build **30 egymás utáni, forrásfájlokat módosító apply-átalakítással** kezdődik. Több lépés ugyanazt a követett JS/HTML-fájlt írja, és a későbbi lépések részben a korábbiak által módosított karakterláncokra támaszkodnak. Ezt a megközelítést kontrolláltan **vissza kell egyszerűsíteni a végleges forráskódba**, nem újabb, ráépített javítószkriptekkel továbbvinni.

A jelenlegi CI-kapu **megakadályozhatja a kimeneti driftet**, de az anyagiasítási workflow nem minden, a renderelt DOM-ra ható futásidejű JS-változásra indul automatikusan. Ez lefedettségi kockázat, nem bizonyított prod-incidens.

## 1. Kanonikus build: 37 lépés

Hivatkozás: scripts/static-build-pipeline.js. A sorrend kötött, a static-build-pipeline.test.js ellenőrzi a fázisok sorrendjét, az egyszeri materializálást, a létező scripts fájlokat és a megismételt lefutás drift-felismerésének szerződését.

| Fázis | Lépések | Feladat | Kritikus megállapítás |
| --- | ---: | --- | --- |
| **source** | **30** | Katalógus, SEO, kalkulátorlogika, információs blokkok, AdSense, regiszterek, oldalak és minőségi szabályok forrásátalakításai | Az apply-*.js fájlok **követett JS/HTML vagy auditfájlokba írnak**; több fájlnak több szerkesztője van |
| **render** | **1** | materialize-static-first.js: oldalnyilvántartásból Chrome DOM → statikus tartalomba olvasztás | Az eredeti HTML és a materializált runtime UI együttesen határozza meg a végső forrást |
| **finalize** | **6** | normalize-static-html, normalize-a11y-html, normalize-retention-static, sync-home-fragments, cache-bust-assets, generate-sitemap | A tartalom után további normalizálás, levezetett fragmentum és asset-verzió frissítés történik |

**A 30 source lépés sorrendje:**

1–6: apply-global-head-config; apply-category-taxonomy; apply-seo-overrides; apply-speed-intent-handoff; apply-beton-intent-upgrade; apply-periodic-settlement-upgrade.

7–12: apply-finance-deep-upgrades; apply-health-model-upgrades; apply-auto-model-upgrades; apply-auto-financial-edge-upgrades; apply-auto-content-consistency; apply-construction-model-upgrades.

13–18: apply-construction-manufacturer-guards; apply-plaster-consumption-mode; apply-roof-purchase-mode; apply-insulation-package-guidance; apply-drywall-system-guidance; apply-construction-confirmation-ux.

19–24: apply-adsense-template-fingerprint-v2; apply-adsense-domain-method-copy-v2; apply-construction-manufacturer-first-v2; apply-adsense-ymyl-trust-v2; apply-adsense-source-notes-v2; apply-adsense-current-moat-v2.

25–30: apply-adsense-phase2-consolidation; apply-adsense-phase2-batch2; apply-average-hub-quality-blocks; apply-average-hub-runtime-guard; apply-adsense-eligibility-v2; apply-adsense-audit-policy-v2.

**Nem szabad e fázisokat vakon átrendezni**. A későbbi lépés több esetben a korábbi transzformációra támaszkodik. A jelenlegi folyamatot megtartjuk addig, amíg egy célzott konszolidációs PR igazoltan meg nem őrzi a kimenetet.

## 2. Forrás-/kimenet-tulajdonossági térkép

| Fájl vagy feladat | Tényleges/valószínű tulajdonosok | Védendő szerződés |
| --- | --- | --- |
| js/construction-upgrades.js | **Legalább 9 apply lépés:** construction-model; construction-manufacturer-guards; plaster-consumption; roof-purchase; insulation-package; drywall-system; construction-confirmation-ux; adsense-domain-method-copy-v2; construction-manufacturer-first-v2 | A számítási modell, gyártói biztonsági feltételek, form és runtime eredmény maradjon ugyanaz |
| js/auto-converter-upgrades.js | auto-model; auto-financial-edge; adsense-domain-method-copy-v2 (és ezeknek egymásra épülő szöveges elvárásai) | Autós/költség számítások, CO₂, PHEV, input validation, locale |
| js/priority-upgrades.js | health-model és a közvetlenül szerkesztett forrás | A kiegészített kalkulátor-feladatok ne írják egymást felül |
| js/penzugyi/netto-brutto-shadow.js | finance-deep-upgrades és a kézi/runtime API kliens | Salary API, egész értékű családi mezők és hibakezelés |
| kalkulatorok/atlag-kalkulator.html | adsense-phase2-batch2, average-hub-quality-blocks, a materializáló és normalize lépések | Átlagfajták, kalkulátor-regiszter, kanonikus URL, szerzői fallback és SEO |
| js/site-data.js; js/expansion-batch-02-data.js; js/expansion-batch-03-data.js; _redirects | category-taxonomy és adsense-phase2-batch2 kapcsolódó részei | Katalógusazonosság, kivezetett kalkulátor URL-ek, 301-redirectek |
| scripts/adsense-quality-v2-audit.js | **apply-adsense-audit-policy-v2.js maga módosítja a minőségi audit forráskódját** | A minőségellenőrzés politikáját ne maga a buildfolyamat állítsa elő rejtett utólagos kódcserével |
| index.html; fragments/home-redesign-v17-*.inc | index.html a kanonikus főoldal; sync-home-fragments kizárólag abból állítja elő a helyreállító fragmentumokat | A fragmentum **származtatott** kimenet, nem egyenrangú kézi szerkesztési forrás |
| HTML-kimenetek és sitemap | site-page-inventory → materialize-static-first → normalizers → generate-sitemap | SEO, URL-ek, statikus minőségi fallback, canonical, structured data |
| CSS/JS assetverziók és SW | asset-versions + cache-bust-assets | Az importált assetek content-hash referenciája és SW-fingerprint egyezzen |

A fenti táblázat **kiemelt konfliktus-/tulajdonossági térkép**, nem minden egyes script minden célfájljának kimerítő listája. Kódeltávolítás előtt egyedi, géppel ellenőrizhető referenciagráf szükséges.

## 3. Konkrét kockázatok

### BUILD-01 – Sok transzformáció ugyanarra a JS-forrásra (magas karbantarthatósági prioritás)

A construction-upgrades.js legalább kilenc egymás után futó source transzformáció célpontja. Az apply-construction-confirmation-ux például régi forráskarakterláncot cserél egy új, részletes megerősítési kapura; az új kód megléténél már nem ír újra. Ez **idempotens, ellenőrzött átmeneti technika**, de a végleges alkalmazásnak elég volna a kanonikus forrásban élnie, a transzformáció nélkül.

**Javaslat:** a 7. lépés javítási szakaszában egy-egy modulra korlátozott PR-ben a már végleges változatot forrásnak tekinteni, a hozzá tartozó apply-átalakítást kivezetni, csak akkor, ha a teljes materializált diff és a számítási tesztek változatlan eredményt igazolnak. Egy újabb „patch a patch tetejére” tilos.

### BUILD-02 – A build a minőségellenőrző saját forrását is módosíthatja (magas prioritás)

Az apply-adsense-audit-policy-v2.js szövegesen módosítja a scripts/adsense-quality-v2-audit.js fájlt, ha a KB_ADSENSE_AUDIT_POLICY_V2 jelölő hiányzik. A jelenlegi auditfájlban a jelölő már szerepel, tehát **nem állítunk jelenlegi felülírást vagy tesztmegkerülést**.

**Javaslat:** az auditpolitika közvetlenül a kanonikus auditfájlban legyen tesztelt, verziókövetett szabály. A forrásátalakító csak külön PR-ben, a végleges állapot és tesztek egyezésével vezethető ki.

### BUILD-03 – Nem egységes önálló ellenőrzési felület (közepes prioritás)

A 30 source scriptből **17 tartalmaz explicit --check kapcsolófelismerést, 13 nem**. Ez statikus megfigyelés, **nem jelenti**, hogy a többi 13 script nem idempotens vagy hibás; a teljes buildnek van külön idempotencia-ellenőrzése.

**Javaslat:** egységes transform(source) / check-only / apply szerződés az új és a megtartott transzformációknál, valamint explicit „ha már teljesen beolvadt, hagyjuk el a transzformációt” életciklus. Ne készítsünk 13 új burkoló szkriptet.

### BUILD-04 – A teljes Chrome-materializálás PR-es path-filtere szűk (magas vizsgálati prioritás)

A .github/workflows/materialize-static-first.yml pull_request paths szűrője lefedi a scripts/apply-*.js, materializáló és normalizáló állományokat, valamint néhány közös JS-t (például js/global-head.js), **de nem terjed ki általánosan a js/** fájlokra**. Például js/finance-quality-upgrades.js és js/priority-upgrades.js nincs explicit a triggerlistán. Ezek a kalkulátorok egyes statikus fallback szekcióinak előállítását befolyásolhatják.

A minden PR-n futó Site quality és a feltételes Browser regression jó védelem, de nem azonos a teljes source→Chrome→finalize generálás + committed-output diff lefuttatásával.

**Következtetés:** megfelelő CI-lefedettséghez azokra a runtime fájlokra is külön fel kell venni a materializációs kötelezettséget, amelyek a renderelt HTML tartalmat érdemben változtathatják. Ez **lefedettségi rés kockázata, nem bizonyítottan hibás kiadás**. Nem javasolt egyszerűen minden dokumentációs PR-re kiterjeszteni a drága Chrome futást; a kimenetre ható útvonalakat kell osztályozni.

### BUILD-05 – A végső kimenet előállítása többszörösen származtatott (közepes)

A materialize-static-first.js saját fallbackszabályokkal és KB_STATIC blokkokkal illeszt; az authored, élő API-s kalkulátor állapotot nem szabad összekeverni a runtime-ból képezett állapottal. A normalize és a cache-bust a materializálás után fut, így a kézzel szerkesztett generált HTML nem feltétlenül tartós.

**Javaslat:** minden érintett fájlnál szerepeljen kézzel karbantartott kanonikus forrás és derivált kimenet, és a PR-leírás mindig tisztázza, melyiket szabad módosítani.

## 4. Meglévő, valóban hasznos védelem (megtartandó)

1. **Egyetlen pipeline-sorrend és egy render fázis**: a static-build-pipeline.test.js több invariánst ellenőriz.
2. **Idempotencia:** npm run static:build után npm run static:verify egy újabb teljes builden ellenőrzi, hogy nincs további, nem determinisztikus git working-tree diff.
3. **Generated output drift:** Materialize static-first HTML CI a build/verify után elbukik, ha a követett kimenet eltérne a commitolt állapottól; a PR-t nem módosítja vagy pusholja automatikusan.
4. **Független Site quality és Browser regression:** vannak kalkulátor-, asset-, SEO-, schema-, URL-, HU/EN/DE- és mobil QA ellenőrzések. A Browser regression az érintettséget külön osztályozza.
5. **Főoldali kanonikus forrás:** index.html → származtatott fragments. A sync-home-fragments --check ezt összehasonlítja.
6. **Kimeneti identitás és rollback:** release-identity, rollback-drill, staging rollback ellenőrzések a CI-ban.

**Korlát:** a meglévő védelmek csak akkor tudnak mind lefutni, ha a releváns workflow ténylegesen elindul és sikeres; egy zöld, különálló Site quality nem bizonyítja önmagában a teljes újragenerálás egyezőségét.

## 5. Kötelező beavatkozási sorrend a 6–7. lépéshez

| Sorrend | Módosítás külön PR-ben | Miért először? | Minimális ellenőrzés |
| --- | --- | --- | --- |
| 1 | A kimenetet módosító runtime JS-k materializációs érintettségének osztályozása + célzott workflow path kiegészítése | Ne maradhasson észrevétlenül elavult materializált fallback | Synthetic PR path-scope tesztek, CI lefutás, static:build, static:verify és nulla drift |
| 2 | Auditkódot patch-elve módosító apply-adsense-audit-policy-v2 kivezetésének megtervezése | A minőségi szabály forrása legyen önálló és közvetlen | AdSense quality és biztonsági politikatesztek; az auditfájl szövege ne változzon |
| 3 | Egy, közösen írt JS-forrás proof-of-concept konszolidációja (pl. construction-upgrades.js), **egy-két transzformációval kezdve** | A kódrétegezés csökkentése anélkül, hogy új rendszert építünk | Input/eredmény invariánsok, gyártói guard, AST/snapshot diff, build + browser |
| 4 | A véglegesen alkalmazott régi apply lépések kivezetése, egyesével | Ne maradjon „biztonságból” vég nélkül régi javító script | Egyszeri pipeline sorrend, 0 új diff, kalkulátor-referencia és rollback |
| 5 | Forrás-of-truth és ownership rövid fejlesztői checklist megerősítése | Új fejlesztéseknél ne épüljenek újra ugyanilyen rétegek | PR review és dokumentált regresszió |

**Fontos:** a 4. lépés auditja maga **nem** végez kódtörlést, nem írja át a buildet, nem módosítja a számításokat vagy az éles oldalt. A javítás csak az összes releváns külső és belső függőség feltárása és teszt után, külön PR-ekben történhet.

## 6. Ténybeli korlátok

A forrást a GitHub csatlakozóval olvastuk, és a fő forrás-/workflow-lánc 37 lépését, valamint kiemelt apply célpontokat áttekintettük. **Nem futott e körben új helyi npm ci, npm run static:build, static:verify, Chrome QA vagy produkciós smoke teszt.** A build működéséről szóló állítások a meglévő implementáció és CI-szerződés tényleges jelenlétét írják le; a mostani commit alatt valamennyi teszt sikerességét külön, futtatással kell igazolni. A „legalább 9 apply” és a tulajdonosi tábla célzott, nem teljes AST-alapú gráf.

**Következő lépés a 8-as tervben:** 5/8 funkcionális és biztonsági audit; a fenti BUILD-01…05 megállapítások a 6/8 rangsorolás és a 7/8 biztonságos tisztítás bemenetei.
