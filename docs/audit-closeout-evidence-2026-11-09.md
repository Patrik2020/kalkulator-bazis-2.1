# Kalkulátor Bázis 2.1 – 8/8 záróaudit: bizonyítékok és nyitott feltételek

**Felvétel:** 2026-11-09  
**Vizsgált verzió:** `main` – `70d3af67a7c66f52b2b34878db7971587bac32b6` (#379 merge).  
**Állapot:** **feltételes / nem teljesen verifikált**. A 7. lépés kódrendezése lezárt; a 8. lépés bizonyítékainak gyűjtése kész, de a teljes éles verifikáció hiányzik. Ez nem produkciós tanúsítvány.
**Hatókör:** kizárólag a `Patrik2020/kalkulator-bazis-2.1` weboldal-repozitórium, nem a külön üzemeltetett API- vagy ChatGPT-bővítmény szolgáltatás.

## 1. Változatlanul megtartandó szerződések

Az [AGENTS.md](../AGENTS.md) és a [fejlesztési szerződés](engineering-development-contract.md) továbbra is kötelező. Marad a 2.1-es statikus-first architektúra; nincs indokolatlan 3.0 újraírás, nincs egymásra épített gyorsjavítás, nem lazulhatnak a CI-kapuk.

A következő területek módosítása csak külön, igazolt és felhasználó által jóváhagyott PR-ben történhet: kalkulátorképletek és adójogi időállapotok; API-séma; HU/EN/DE fordítás; SEO/canonical/sitemap; billentyűzet és akadálymentesség; cookie/CMP és hirdetési jogosultság; az elfogadott maximum három tervezett hirdetéselhelyezés oldalanként; PWA/cache és asset-fingerprint; publikálási folyamat.

## 2. A build egyszerűsítésének bizonyítható eredménye

A 2026-11-08-i [első, csak olvasásos audit](architecture-maintainability-audit-2026-11-08.md) 37 meghívott buildlépést talált. A #379 után a [kanonikus pipeline](../scripts/static-build-pipeline.js) a verziókezelt `main`-ben **22 source + 1 render + 6 finalize = 29 lépésből** áll. A 7. fázis tíz kis PR-es tisztítása során nyolc, bizonyítottan beolvadt szkriptlépés kikerült; az új teszteknek továbbra is védeniük kell az érintett figyelmeztetéseket és képleteket.

A #379 végső PR commitján öt GitHub Actions-csomag **success**:
- [Site quality](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827253)
- [Repository security baseline](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827226)
- [Materialize static-first HTML](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827309)
- [Browser regression](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827170)
- [AdSense Quality v2](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827336)

**Fontos:** az előző pont CI-eredmény, nem helyettesíti az éles domainről végzett teljes auditot.

## 3. A `main` állapota a záróaudit-pillanatképben

| Ellenőrzés | Bizonyíték | Következtetés |
| --- | --- | --- |
| Site quality (teljes npm quality, szabályok, HTML/JS, képletek, sitemap, lokalizációs tesztek) | [Run 42581791011](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581791011): success | A tesztelt merge-commiton a meglévő CI-ellenőrzés sikeres. |
| Repository security baseline | [Run 42581790868](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790868): success | A beállított repository security és high/critical npm audit kapu zöld. Nem független penetrációs teszt. |
| Browser regression a `main`-en | [Run 42581790850](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790850): success (scope, smoke, deep UI QA és browser gate) | A tesztelt merge-commit teljes automatikus böngészős regressziója sikeres. |
| Oldalleltár, URL-ek, canonical és sitemap | [Final full-site audit](../scripts/final-fullsite-audit.js) a Site quality kapuban | 101 regisztrált kalkulátor (88 publikus, 13 kivezetett), +1 önálló HTML-eszköz; registry/tesztmanifest/sitemap/canonical kapcsolatot a CI vizsgálja. |
| Static materialization, drift, idempotencia | [PR #379 Materialize run](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827309): success | A PR-en az összes meglévő generálási és idempotencia-ellenőrzés zöld volt. |
| AdSense és CMP policy | [PR #379 AdSense quality](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42576827336): success; Site quality is success | Regressziós és policy tesztek sikeresek; valós, régiónkénti hirdetésmegjelenés vagy Google-fiókállapot ettől nem igazolt. |
| Release/deploy technikai futás | [pages build](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790769): success; [release source evidence](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581791009): success | A build/deploy infrastruktúra jelentett sikert; a `kalkulatorbazis.hu` domaint külön éles teszttel kell verifikálni. |
| GitHub Production smoke a `main`-en | [Run 42581790882](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790882): failure / INCONCLUSIVE | **Blokkoló bizonyítási hiány:** Cloudflare HTTP 403 a GitHub-futtató számára, így a Production audit ki lett hagyva. Nem bizonyított weboldal-kiesés. |

Az ellenőrzések ellenőrző futásainak időpontja és a státuszok idővel változhatnak. Ez **2026-11-09-i pillanatkép**; új merge után az új SHA saját eredményét kell ellenőrizni.

## 4. Funkciók szerinti bizonyíték és hiány

| Terület | Bizonyított automatizált védelem | Amit nem lehet ebből kijelenteni |
| --- | --- | --- |
| Pénzügyi, építőipari és egyéb kalkulátorképletek | `npm run quality`, matematikai/invariáns/modeltesztek, referencia- és browser smoke | Hogy minden elképzelhető bemenet vagy minden jövőbeli jogszabály lefedett |
| Mobil/asztali felület és a11y | `Browser regression`, responsive/a11y tesztkapuk, HTML lint | Valós készülékek és képernyőolvasók teljes kombinációja kipróbált |
| HU/EN/DE | Számos lokalizációs teszt és generált inventory ellenőrzése a Site quality workflow-ban | A részletes háromnyelvűsítés minden oldalán befejeződött; [#259](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/259), [#360](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/360) külön nyitott feladat |
| SEO, sitemap, canonical, kivezetett URL-ek | Final full-site audit, URL/séma/site quality audit | Keresőmotor-indexelés, keresési helyezés vagy organikus forgalom |
| AdSense, hozzájárulás, hirdetéshelyek | AdSense Quality v2, policy- és consent regresszió | Valós CMP-régiók, monetizáció vagy maximális tényleges hirdetésmegjelenés kézi ellenőrzés nélkül |
| PWA és offline működés | A projektben vannak static/cache/betöltési ellenőrzések | Külön telepített PWA teljes offline életciklusa; ehhez külön eszközös tesztjegyzőkönyv kell |
| Különálló API / ChatGPT-bővítmény | E webrepo egyes API-kliens és kalkulátorkötései teszteltek | A külön API szerver elérhetősége, SLA-ja, autentikációja és ChatGPT-eszközvégpontjai; ezt **külön integrációs audittal** kell igazolni |
| Hírek / publikálás | Tartalmi és sitemap ellenőrzések a webrepo CI-ban | Minden várt cikk publikált, vagy a szerkesztői jóváhagyás→éles megjelenés teljes lánca tesztelt |

## 5. Nyitott feladatok és döntési sorrend

1. **P0 – bizonyítható éles ellenőrzés:** [#256](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/256) nyitva. A 2026-11-09-i [Production smoke](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790882) naplója Cloudflare HTTP 403 választ és kihagyott auditot igazol. A korábban beállított UptimeRobot főoldali/nettó–bruttó monitor egy külön rendelkezésreállási jelzés, **nem** a GitHub teljes produkciós auditjának helyettesítője. A Cloudflare védelmet nem kapcsoljuk ki; célzott, hitelesített monitor-hozzáférés vagy megfelelő külön ellenőrző futtató kell, majd teljes éles audit.
2. **Megerősített `main` browser workflow:** a [Run 42581790850](https://github.com/Patrik2020/kalkulator-bazis-2.1/actions/runs/42581790850) végül **success** állapottal lezárult, beleértve a deep UI és browser gate ellenőrzéseket. Új merge után ismét az aktuális SHA-t kell vizsgálni.
3. **P1 – külön szolgáltatások E2E ellenőrzése:** nettó–bruttó API és ChatGPT-bővítmény saját tesztadatokkal; éles/auth biztonsági követelmények szerint, külön repóban és külön PR-ben.
4. **P2 – befejezetlen lokalizáció és tartalom:** [#259](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/259), [#360](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/360) fordítási munka; [#340](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/340), [#351](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/351), [#349](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/349) tartalom/folyamat PR-ek; [#343](https://github.com/Patrik2020/kalkulator-bazis-2.1/pull/343) kategória UI. Nem keverjük a záróaudit PR-jébe.
5. **P2 – nyitott CI-jegyek triázsa:** [#369](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/369), [#371](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/371) a korábbi PR-ek generated asset-fingerprint hibáihoz kötődnek. A kapcsolódó PR-ek merge-állapotát és a javítás bizonyítékát külön ellenőrizni kell, mielőtt ezeket lezárnánk.

## 6. A záróaudit elfogadási kritériumai

- [x] A #379-ig a kis, különálló 7. lépéses kódtisztító PR-ek beolvadtak; a #379 öt releváns CI-csomagja sikeres.
- [x] `main` rögzített SHA, lépésszám és tesztlefedettségi bizonyítékok dokumentálva.
- [x] A jelenlegi repository- és CI-védelem, a különválasztott átfedő PR-ek, valamint a produkciós monitoring hiányossága azonosítva.
- [x] A `main` adott SHA-ján a teljes Browser regression lezárult és sikeres.
- [ ] A `kalkulatorbazis.hu` éles, valós tartalmi és verzióellenőrzése teljes, nem Cloudflare által kihagyott.
- [ ] Külön API/bővítmény-kockázat külön integrációs bizonyítékkal rendelkezik, ha a teljes termékcsalád auditját is le akarjuk zárni.

**Döntési javaslat:** a 2.1-es webrepo technikai kódrendezése lezárható, de a *teljes, éles üzemre is kiterjedő záróaudit* csak a fenti, még üres ellenőrzési feltételek után nevezhető teljesen sikeresnek. A bizonyíték hiányát ne jelöljük zöldnek.

## 7. Változtatás és visszaállítás

Ez a záróaudit **csak dokumentáció**. Nem érint publikált HTML/JS/CSS állományt, nem változtat kalkulációt, verziózást, CI workflow-t, fordítást, API-t, AdSense-t vagy éles beállítást. A dokumentum PR-je külön review és felhasználói merge-jóváhagyás után egyesíthető. Hibás vagy elavult adat esetén az állítás javítása, vagy a dokumentációs PR revertje elegendő. Nem állítjuk, hogy helyi Node/npm, valós mobileszközös, UptimeRobot API- vagy éles browsertesztet futtattunk ebben a felvételben.
