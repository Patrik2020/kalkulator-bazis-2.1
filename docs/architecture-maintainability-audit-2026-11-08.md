# Kalkulátor Bázis 2.1 – fenntarthatósági audit, 1. kör

**Dátum:** 2026-11-08  
**Forrás:** `main`, a felmérés megkezdésekor `84b35db56f98eb069922f47312263046f1d86549`  
**Státusz:** első, **csak olvasásos / statikus** felmérés. Nem teljes körű audit, nem produkciós tanúsítvány.  
**Kapcsolódó szabályzat:** [AGENTS.md](../AGENTS.md), [docs/engineering-development-contract.md](engineering-development-contract.md).

## Cél és módszer

Nem új weboldalt építünk. A meglévő 2.1-es statikus-first rendszert tesszük biztonságosan továbbfejleszthetővé. E felmérés során a GitHubon ellenőriztük a belépőpontokat, kiválasztott főoldalt és kalkulátorokat, a JS/CSS-kötéseket, a `package.json` tesztparancsait, a statikus buildet, a korábbi takarítási dokumentációt és az aktív pull requesteket. Nem futtattunk helyi `npm ci`-t, buildet, böngészőteszteket vagy élő oldali end-to-end teszteket; az itt leírt ellenőrzések nem jelentenek zöld CI-állapotot.

## Ellenőrzött tények

1. **Van érdemi minőségbiztosítási alap.** A `package.json` tartalmaz matematikai/invariáns teszteket, kalkulátorteszteket, böngészős ellenőrzéseket, `quality` láncot, `static:build` és `static:verify` parancsot. Az `AGENTS.md` már ma is külön PR-t, célzott tesztelést és felhasználói merge-jóváhagyást vár el. Ezt **meg kell tartani**, nem újra feltalálni.
2. **Korábban már történt takarítás.** A `docs/cleanup-closeout-2026-10.md` szerint 2026-10-19-én a nyolcrészes rendezés 21 fájlt és 5287 sort távolított el. A visszamaradt rétegek léte tehát nem bizonyítja, hogy soha nem volt takarítás.
3. **Konkrét, megmaradt kompatibilitási kódrészlet.** A `js/penzugyi/netto-brutto.js` meghívja az `upgradeFamilyFields()` függvényt, amely kizárólag akkor alakítja át a `.family-box` elemet, ha létezik `#family`. A `kalkulatorok/netto-brutto-kalkulator.html` vizsgált aktuális változatában már `#family-dependants` és `#family-eligible` mezők vannak, `#family` nincs. **Következtetés:** az itt vizsgált útvonalon a legacy átalakító korán visszatér; erős *eltávolíthatósági jelölt*, de törlés előtt az összes felhasználást és buildforrást ellenőrizni kell.
4. **Az API-kliens nem duplikált számítási motor.** A `js/penzugyi/netto-brutto.js` betölti a `netto-brutto-shadow.js` fájlt; utóbbi végzi az API-hívást, a beküldés megszakítását, az eredménymegjelenítést és hibakezelést. A `shadow` fájlnév félrevezető lehet, de **nem szabad használaton kívülinek nevezni vagy törölni**: az aktuális adatfolyam része.
5. **A kanonikus build sok transzformációt láncol.** A `scripts/static-build-pipeline.js` forrás-, render- és finalize-fázisai 37 meghívott szkriptlépést definiálnak. A `scripts/apply-finance-deep-upgrades.js` forráskódot és kalkulátor-HTML-t is szöveges `replaceExact` transzformációkkal módosíthat. Ez ma dokumentált buildminta, és a build idempotenciát is ellenőriz. Ugyanakkor az egymástól függő forrás/anyagiasított HTML változtatások sérülékenyek lehetnek. **Nem bizonyított buildhiba**, hanem elsőrendű architekturális felülvizsgálati téma.
6. **Kiegészítő JavaScript-rétegek élnek.** `js/finance-quality-upgrades.js`, `js/construction-quality-upgrades.js`, `js/priority-upgrades.js` további UI-elemeket és eseményeket adnak bizonyos oldalakhoz. Ez lehet szándékos moduláris működés is. Egyetlen fájlnevet sem szabad önmagában „szemétnek” minősíteni. A szükséges vizsgálat: betöltési lánc, funkciógazda, DOM-hatás, eseménykezelők és annak eldöntése, hogy a kiegészítés forrásba olvasztható-e.
7. **Főoldal: jelentős, de nem önmagában hibás betöltési felület.** A `index.html` statikus állapotában 16 külső script-hivatkozás, 5 CSS-link, 1 inline style és 2 JSON-LD script található. A JSON-LD átfedést a strukturáltadat-teszttel és generáló forrással kell ellenőrizni; a két blokk önmagában nem jelent hibát. A lokalizáció HU/EN/DE és a képernyőolvasó-viselkedés sértetlenül megtartandó.
8. **Párhuzamos fejlesztések miatt izoláció szükséges.** A felmérés során nyitott #360 (lokalizáció), #351/#340 (hírek), #349 (híres előellenőrzés) és #343 (kategória UI) PR-eket találtunk. Az audit dokumentációs PR-je nem nyúl ezek kódjához.

## Kockázati nyilvántartás és következő vizsgálat

| ID | Prioritás | Megállapítás | Bizonyosság | Biztonságos következő lépés |
| --- | --- | --- | --- | --- |
| A-01 | Közepes | `upgradeFamilyFields()` legacy útvonal az aktuális nettó–bruttó HTML mellett várhatóan nem fut | Statikusan igazolt a vizsgált oldalon | Hivatkozásgráf és kalkulátor böngészőteszt; külön PR-ben minimális eltávolítás |
| A-02 | Magas vizsgálati prioritás | Sok, egymásra épülő buildtranszformáció, potenciális szöveges cserék miatti drift | A lánc léte igazolt; tényleges hiba nem bizonyított | Build idempotencia + bemeneti/kimeneti tulajdonosi mátrix, transzformációk kapcsolati gráfja |
| A-03 | Közepes | Külön `*-upgrades.js` rétegek és DOM-bővítések | A források léte igazolt; redundancia nem bizonyított | Oldalanként azonosítani az eredeti és kiegészítő modul feladatait, eseménykezelők számát |
| A-04 | Közepes | CSS-felülírások és megmaradt vizuális javítórétegek lehetősége | További vizsgálat szükséges | CSS cascade / selector diff és Chrome mobil–desktop összehasonlítás |
| A-05 | Alacsony-közepes | A `netto-brutto-shadow.js` név nem tükrözi az aktív API-kliens szerepét | Igazolt | Átnevezés csak hivatkozások és build/assetverziózás feltérképezése után |
| A-06 | Közepes | Generált HTML és inline blokkok forrása/tulajdonosa félreérthető lehet | Megléte igazolt, hiba nem | Forrás-of-truth mátrix: hol kell szerkeszteni; mely rész generált; mely rész kézi |

**Azonosított kritikus, bizonyított produkciós hiba ebben a felmérésben: nincs.** Ez nem jelenti a hibák hiányának igazolását.

## Kötelező sorrend

1. **0. fázis – baseline:** rögzített `main` SHA; nyitott PR-ek; elvárt SEO/URL, kalkulátor, fordítás, AdSense, API, PWA, akadálymentesség és mobil viselkedés; releváns tesztek és aktuális CI/production állapot.
2. **1. fázis – teljes referenciagráf:** HTML/JS/CSS importok, dinamikus szkriptbetöltések, npm parancsok, CI, service worker, manifest, generátorok, a transzformációk által hivatkozott fájlok és publikus URL-ek. Csak ezután szabad „halott kódot” minősíteni.
3. **2. fázis – prioritási lista:** `bizonyítottan redundáns`, `gondozandó összetettség`, `szándékos kompatibilitás`, `nem eldönthető`; minden tételhez bizonyíték, kockázat és teszt.
4. **3. fázis – kis, külön PR-es tisztítás:** először az A-01-hez hasonló kis, bizonyítható esetek; egy PR egy felelősségi kör, kizárólag szükséges törlés és konszolidáció. Függőben lévő lokalizációt vagy hírt nem érinthet.
5. **4. fázis – regresszió és éles verifikáció:** célzott tesztek + `npm run quality`, szükség szerint `static:build` / `static:verify`, böngészős, mobilos, akadálymentességi, SEO, API és hirdetési viselkedés. A zöld CI **nem azonos** az éles sikerrel.

## Törlési biztonsági szabály

**Csak akkor törlünk**, ha az adott elem minden statikus és dinamikus fogyasztóját, illetve a generált kimenetét feltártuk, az indoklást dokumentáltuk, és a releváns regressziós tesztek biztosítják a viselkedés változatlanságát. Ismeretlen használat esetén marad és vizsgálati tétel lesz. Hibásnak tűnő kódot nem javítunk újabb felülíró réteggel.

## Korlátok

Az első körhöz rendelkezésre álló GitHub-forrásolvasás **nem futtatott** böngészőt, lokális CI-t vagy produkciós smoke tesztet. Az auditot későbbi, eszközzel ténylegesen végrehajtott tesztfutásokkal kell kiegészíteni. A mostani dokumentáció nem változtat futó kódon, hirdetési szabályon, számítási képleten vagy publikált tartalmon.
