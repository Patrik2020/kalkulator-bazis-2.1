# Kalkulátor Bázis 2.1 – funkcionális és biztonsági audit (5/8)

**Dátum:** 2026-11-08  
**Vizsgált alap:** a #364 egyesítése utáni GitHub \`main\`, SHA: \`d53fa11545006c77589e7b0172ac2442d514c505\`.  
**Módszer:** GitHub-forrás és CI-konfiguráció statikus vizsgálata; két publikus weboldal HTML-tartalmának elérése; **valódi éles és DEV MCP-toolhívások**; a kapcsolódó Salary API külön repójának forrásellenőrzése. Nem teljes körű penetrációs teszt, akadálymentességi tanúsítvány vagy éles böngészős teljeskörű QA.

**Előzmények:** [#361 fejlesztési szabályok](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/361), [#362 függőségtérkép](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/362), [#363 JS/CSS](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/363), [#364 buildarchitektúra](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/364).

## Rövid eredmény

A projekt **jó alapvédelemmel rendelkezik** a kalkulátor-leltár, matematikai referenciák, hozzájárulás-kapu, SEO, mobilos tesztmátrix, forrásbiztonság és release-ellenőrzés terén. Az audit során azonban **egy valóban reprodukált, felhasználót érintő integrációs hibát** találtunk a különálló ChatGPT-bővítménynél. A többi alábbi tétel jellemzően kockázat vagy fennmaradó ellenőrzési feladat, nem bizonyítottan hibás éles működés.

### FSEC-01 – Reprodukált ChatGPT MCP–Salary API sémadrift (KRITIKUS a bővítményre, weboldali API-hiba nem bizonyított)

**Tényleges próba 2026-11-08:**
- Az éles \`Kalkulátor Bázis\` MCP \`get_salary_rules({})\`, \`calculate_gross_to_net({gross:650000,taxYear:2026})\`, \`calculate_net_to_gross({desiredNet:432250,taxYear:2026})\` hívásai **egyaránt** a „A Kalkulátor Bázis API válaszformátuma nem felel meg a várt sémának.” hibával zárultak.
- A \`Kalkulátor Bázis DEV\` MCP \`get_salary_rules({})\` és \`calculate_gross_to_net({gross:650000,taxYear:2026})\` hívása ugyanezt a hibát adta.

**Konkrét gyökérokra mutató kódeltérések a külön repóban:** \`Patrik2020/kalkulator-bazis-api-dev\`
- \`src/modules/salary/salary.constants.ts\`: \`SALARY_RULESET.selectableSzjaRatesPercent: [15,9]\`. A \`chatgpt-plugin/src/index.ts\` szigorú \`salaryRulesetSchema\` **nem tartalmazza ezt a mezőt**.
- \`src/modules/salary/salary.types.ts\`: \`SalaryCalculation.calculationMode\` és \`taxes.szjaRatePercent\` szerepelnek; a plugin szigorú \`salaryCalculationSchema\` **nem tartalmazza** őket.
- A plugin \`salaryOptionsShape\` nem fogadja el a \`szjaRatePercent\` bemeneti mezőt, pedig a Salary API 15%-os és 9%-os számítási forgatókönyvet is támogat.
- A plugin \`parseApiPayload\` a \`.strict()\` elutasítást ugyanazzal a visszakapott hibaüzenettel kezeli.

**Besorolás:** éles és DEV MCP-funkció valós próbahívásokban hibázott, ez tényleges integrációs regresszió. Nem következik belőle, hogy a \`https://api.kalkulatorbazis.hu\` közvetlen bérszámítása vagy az oldal JS API-kliensének minden hívása hibás. Az éles API teljes nyers válaszát a tesztkörben nem tudtuk kiolvasni, ezért a fenti mezők produkciós jelenlétét **forrás- és hibaviselkedési alapon** azonosítottuk.

**Külön nyitott hibajegy:** [API repo #44 – MCP Salary sémadrift](https://github.com/Patrik2020/kalkulator-bazis-api-dev/issues/44). A **jövőbeli javítás** a plugin kanonikus input/output Zod sémájának a Salary API hiteles sémájához történő illesztése és közös szerződésteszt. **Nem** \`passthrough\`, \`any\`, tesztkikapcsolás vagy újabb átmeneti overlay. Javítás után mindhárom MCP-eszköz tényleges próbahívása és deployment-verifikáció kötelező.

### FSEC-02 – Főoldali Salary API-hiba: egyszerűsített, nem kedvezményérzékeny becslés (MAGAS)

A \`js/home-redesign-salary.js\` \`fallback(amount)\` a 2026-os 15%-os alapútvonalon egyszerű \`gross*0.665\` / \`net/0.665\` becslésre vált API-hiba esetén. Az UI külön \`salaryPreviewFallback\` státuszt jelenít meg. Ez **nem modellálja** a választható kedvezményeket vagy a teljes API számítási szabályait; a főoldali widget egyébként is csak kedvezmény nélküli gyorsszámoló. 9%-os szimulációban a kliens **nem** számol 66,5%-os fallbacket, hanem elérhetetlenséget jelez: ez helyes fail-closed viselkedés.

**Javaslat:** a status és az eredmény szemantikai, képernyőolvasós és mobil ellenőrzése, az API-kimaradás szimulációja; egyértelmű figyelmeztetés, hogy a 66,5%-os képlet csak nagyon korlátozott, kedvezmény nélküli példa. Igény esetén „nincs hiteles eredmény” állapot vagy dedikált szerződés-szerinti fallback. Egyelőre **nem változtatunk a képleten**.

### FSEC-03 – API-függőség és end-to-end szerződésteszt határa (MAGAS)

A részletes bérkalkulátor \`js/penzugyi/netto-brutto-shadow.js\` a külön API domaint hívja, 6000 ms timeouttal, abortálással, inputvalidálással, 400/422, 429 és nem megfelelő API-válasz kezelésével. A főoldali kliens szintén API-t hív. A weboldali CI főként helyi forrás-, számítási és böngészős ellenőrzéseket végez; a külön API és MCP éles működése **nem igazolható pusztán egy zöld weboldali PR-ból**.

**Javaslat:** közös verziózott API contract: 2026/15%, 9% szimuláció, kedvezményes és kedvezmény nélküli esetek, nettóból bruttó irány, váratlan mezők, HTTP 400/422/429 és timeout; megfelelő staging tesztek a két repó között. A 2027-es adószabályokra vonatkozó szimulációt nem szabad a hatályos végleges szabályként kommunikálni.

### FSEC-04 – Nyelvi teljesség még nem igazolt (KÖZEPES)

A \`docs/localization-progress.md\` 2026-11-08-i main nyilvántartása: **89 aktív kalkulátorból 76 detail-reviewed, 13 hátralévő**, továbbá 13 kivezetett és 56 egyéb oldal. A \`detail-reviewed\` nem jelenti a teljes SEO-, akadálymentes vagy interakciós tartalom fordítását. A külön \`#360\` lokalizációs PR a felmérés idején még nyitott volt.

**Javaslat:** a meglévő fordítási folyamatot elkülönítve folytatni, majd mindhárom nyelven dinamikus hibákat, mértékegységeket, metaadatokat, űrlapokat, kalkulátor-komponenseket és sérült layoutot ellenőrizni. A folyamatot ne állítsuk le a takarítás miatt.

### FSEC-05 – Biztonsági HTTP-fejlécek: repóban deklarálva, éles alkalmazás külön igazolandó (KÖZEPES–MAGAS)

A gyökér \`_headers\` fájl HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy és X-Frame-Options értékeket tartalmaz. Ugyanakkor a \`docs/cloudflare-security-headers.md\` rögzíti: **GitHub Pages nem alkalmazza az \`_headers\` fájlt**; a valódi fejléceket a Cloudflare-proxy Response Header Transform Rule-jában kell beállítani. A jelen audit **nem olvasott valós HTTP válaszfejléceket**, ezért az éles állapot **nem igazolt**.

A deklarált CSP tudatosan **nem tartalmaz \`script-src\` és \`default-src\` korlátozást**, Google Tag/AdSense-kompatibilitási okból; ez részleges biztonsági alap, nem teljes XSS-védelem. **Nem igazolt sebezhetőség**, de függőségi és biztonsági kockázat.

**Javaslat:** biztonságos, csak olvasó, valódi header lekérés a főoldal, a bérkalkulátor és fontos endpointok alól; Cloudflare beállítások és dokumentáció egyezése; CSP Report-Only / Worker nonce bevezetésének külön, gondosan tesztelt terve.

### FSEC-06 – AdSense és TCF: tesztelt kapuk, éles hirdetésszám nem igazolt (KÖZEPES)

A \`scripts/adsense-policy.js\`, \`scripts/adsense-runtime-policy-audit.js\`, \`scripts/adsense-cmp-wait.test.js\` és \`scripts/publisher-ads.test.js\` ellenőrzik a közös engedélyezési policyt, a **fail-closed** TCF-ready kaput, az ismételt eventekre történő duplikációmentes betöltést és a maximum 3 manuálisan létrehozott slotot. A böngészőtesztekben a Google hálózati végpontok blokkoltak, ezért ezek **nem** a valós AdSense fill és az éles oldali összes ténylegesen megjelenő hirdetés bizonyítékai.

**Javaslat:** külön mobile/desktop production vizsgálat hozzájárulással és anélkül, több magasságnál, főoldal, hírek, kalkulátor; tényleges ad slot és request szám ellenőrzése. A cél **legfeljebb 3 kézzel tervezett hirdetési elhelyezés**, de külön kell mérni minden platform- és Auto Ads viselkedést.

### FSEC-07 – SEO, canonical, strukturáltadat és redirect-védelem (ALAPVETŐEN JÓ; éles státusz külön)

A \`scripts/final-fullsite-audit.js\` 101 registry-bejegyzést, **88 nyilvános + 13 kivezetett** kalkulátort és egy különálló oldalt vár; a \`scripts/reference-coverage-audit.js\` a mind a 101 registry-kalkulátorra vonatkozó tesztmanifestet őrzi. A \`scripts/structured-data-audit.js\` canonical, WebPage, SoftwareApplication, BreadcrumbList és látható GYIK / FAQPage összhangot ellenőriz. A \`robots.txt\` két sitemapet jelöl. A \`scripts/production-smoke-audit.js\` release SW-fingerprintet, fontos oldalakat, sitemapet és 301-eket vizsgál, **ha az éles ellenőrzés végrehajtható**.

**Javaslat:** a kivezetett URL-ek 301 és sitemap összevetését a záróaudit során éles szerveren is bizonyítani; a hír- és kalkulátoroldalak canonical/SEO és HTML tartalom hasonlóságát ellenőrizni a generálás után.

### FSEC-08 – Mobil és akadálymentesség: automatizált mátrix van, nem teljes tanúsítás (KÖZEPES)

A \`scripts/responsive-contract-audit.js\` 320, 768, 1440 és 1920 pixel szélességet is követel a konfigurációtól. A \`scripts/all-calculator-browser-smoke.js\` a kalkulátoroknál a kontrollok méretét, vízszintes túlcsordulást, duplikált ID-ket, NaN/Infinity értéket és konzolhibát vizsgálja. A \`scripts/browser-qa-consent.js\` TCF/consent állapotmátrixot ír elő.

**Korlát:** a jelen körben nem futott külön teljes, valós telefonos vagy billentyűzetes/képernyőolvasós teszt. Nem állítható, hogy az oldal minden nézetben WCAG-kompatibilis.

### FSEC-09 – Éles monitorozás „inconclusive” állapotának kezelése (KÖZEPES–MAGAS)

A \`.github/workflows/production-smoke.yml\` külön kezeli a Cloudflare 403 által blokkolt GitHub runner esetét, \`inconclusive\` státuszt és deduplikált incidenst ad; az ellenőrzést **nem tekinti zöldnek**, ha a valós audit kimarad. Ez helyes irány.

A [#256 nyitott monitoring issue](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/256) tartalma szerint **2026-10-28-i utolsó frissítésekor** a Cloudflare blokkolta a Github Actions futtatót HTTP 403-mal. Ez **nem bizonyít leállást**, és nem bizonyítja, hogy a 2026-11-08-i állapot is ugyanez. A jelen felmérésben az aktuális workflow utolsó sikeres élő futásának részletes naplója nem állt rendelkezésre.

**Javaslat:** a valóban sikeres production-verifikáció legyen elkülönítve a build/CI státusztól; a Cloudflare miatt kimaradó ellenőrzéshez megfelelő jogosított monitoring útvonal, illetve független második hálózati próba.

## Ellenőrzési összefoglaló

| Terület | Bizonyíték típusa | Auditállapot |
| --- | --- | --- |
| Főoldal + bérkalkulátor HTML | Nyilvános webes tartalom elérhető | **Elérhető HTML**, nem élő JS-form teszt |
| 101 kalkulátor tesztlefedettsége | Manifest, CI-konfiguráció, korábbi tesztek | **Szerződés létezik**, nem új teljes futtatás |
| Éles/DEV MCP számítás | Valódi eszközhívások | **HIBÁS** – FSEC-01 |
| Bérkalkulátor 15%/9% | Forrásban 2026-os normál és összehasonlító opció | A külön website API live eredmény **nincs igazolva** |
| Lokalizáció | Generált progress, HU/EN/DE tesztek | **76/89 részletesen átnézett**, 13 még nem |
| AdSense / TCF | Forrás + unit + browser probe | **Védelmek vannak**, élő ad fill nincs igazolva |
| Biztonsági fejlécek | _headers + Cloudflare dokumentáció | Éles konfiguráció **nem igazolt** |
| SEO / sitemap / redirects | Forrás, CI-szerződés | Statikusan erős, élő tartalomverzió külön |
| Mobil + akadálymentesség | Scriptelt tesztmátrix és CI | Nem teljes valós eszközös audit |
| Production monitoring | Workflow + issue #256 | **Nyitott korábbi inconclusive issue**, aktuális élő státusz ellenőrzendő |

## Mit csináljunk a 6. és 7. lépésben?

**Sorrendjavaslat:** (1) a valóban reprodukált MCP sémadrift javításának külön, biztonságos API repo PR-je; (2) produkciós monitorozás és éles header/verzió állapot tisztázása; (3) 15%/9% bér API–weboldal szerződések és fallback UX tesztelése; (4) CSS/JS/build rétegezés fokozatos konszolidációja; (5) teljes HU/EN/DE záróteszt; (6) mobil, akadálymentesség, SEO és éles hirdetésszám valós auditja.

A sorrend **nem** egyenértékű automatikus javítási engedéllyel. A korábbi 1–4. lépés és a jelen 5. lépés dokumentációs és felderítési eredményeit a 6. lépésben egyetlen priorizált munkajegyzékké kell összevonni. A 7. lépés kis, célzott PR-ekben és explicit felhasználói jóváhagyással hajtható végre.

**Változtatás a jelen PR-ben:** csak ez a dokumentáció. Nincs runtime kód-, API-, MCP-, AdSense-, fordítás-, CI-kapumódosítás, merge vagy éles deploy. Minden itt közölt teszteredményhez a tényleges bizonyítás határát is feltüntettük.
