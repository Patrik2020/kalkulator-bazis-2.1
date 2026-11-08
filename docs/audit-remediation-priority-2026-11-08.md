# Kalkulátor Bázis 2.1 – közös javítási és kódtisztítási terv (6/8)

**Dátum:** 2026-11-08  
**Baseline:** `main` `67fce6d8b78fef7350c6cfb799e0a774d6a75d93`, a #365 merge után.  
**Műfaj:** auditokból összevont **végrehajtási terv**, nem elvégzett javítás. **Ebben a PR-ben nincs működési, build-, CSS-, JS-, API- vagy CI-módosítás.**

## 0. Alapelv

**Nem a minél több fájl eltávolítása a cél.** Olyan lépések következnek, amelyeknek van bizonyított ok-okozati magyarázata, egyetlen kanonikus tulajdonosa, előre megadott elfogadási feltétele és rollbackje. Egy rész puszta vizsgálati feladat, és nem garantálható előre, hogy törlési javaslattal zárul. A jövőbeli fejlesztésekre az [AGENTS.md](../AGENTS.md) és a [kötelező szerződés](engineering-development-contract.md) marad érvényes.

A javítási sorrend alapja: **felhasználói hatás > adat/számítási és adatvédelmi kockázat > publikálási megbízhatóság > regresszió lehetősége > összetettség/teljesítmény > puszta esztétikai kódtisztaság**. A „bizonyított hiba”, a „bizonyított technikai adósság” és a „tesztelésre váró hipotézis” **nem ugyanaz**.

## 1. Összevont prioritási nyilvántartás

| Jegy | Prioritás | Bizonyosság | Érintett audit | Elkülönített munkacsomag / érintett forrás | Akkor kész, ha… |
| --- | --- | --- | --- | --- | --- |
| **KB-01** | **P0 – felhasználói hiba** | **Reprodukált éles és DEV MCP-híváson** | FSEC-01 | **Külön API repó:** [kalkulator-bazis-api-dev#44](https://github.com/Patrik2020/kalkulator-bazis-api-dev/issues/44). `chatgpt-plugin/src/index.ts` szigorú Zod input/output sémája vs. Salary API (`selectableSzjaRatesPercent`, `calculationMode`, `taxes.szjaRatePercent`, `szjaRatePercent` input). | A kanonikus szerződések egyeznek, új regressziós teszt lefut, **három élő MCP eszköz** visszaadja a várt eredményt; staging, deploy és production külön igazolt. Az API számítási matematikája változatlan. |
| **KB-02** | P1 – működés ellenőrizhetősége | Nyitott, **korábbi** inconclusive incidens; mai leállás nem bizonyított | FSEC-09 | [2.1 #256](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/256), `.github/workflows/production-smoke.yml`, Cloudflare monitor-hozzáférés. | Legalább egy tényleges **verified** éles audit új release fingerprinttel, oldal/redirect/sitemap egyezéssel; Cloudflare 403 nem számít sikernek; deduplikált issue megfelelően frissül. |
| **KB-03** | P1 – lehetséges CI-lefedettségi rés | Statikusan igazolt path-filter korlát; hibás éles kiadás nem bizonyított | BUILD-04 | `.github/workflows/materialize-static-first.yml`, `js/global-head-config.js`, DOM-ot módosító `js/**` modulok. | A teljes materializált HTML-t módosító források változtatása indítja a kötelező `static:build` / `static:verify` + drift kaput; releváns PR útvonalak teszttel igazoltak. Nincs általános tesztkikapcsolás vagy elhallgatott skip. |
| **KB-04** | P1 – biztonsági konfiguráció bizonyítása | Éles HTTP-fejlécek **nem igazoltak** | FSEC-05 | Cloudflare response header szabály, `_headers`, `docs/cloudflare-security-headers.md`. | Éles `curl -I` / tényleges HTTPS válasz header-mátrix a főoldalon, kalkulátoron, releváns végponton; egyezik a dokumentált követelményekkel. CSP-szűkítés csak Report-Only pilot és Google/űrlap/külső API regresszió után. |
| **KB-05** | P1 – számítási szerződés | API szerződésbeli védelmi hézag; nem igazolt számítási hiba | FSEC-02/03 | `js/home-redesign-salary.js`, `js/penzugyi/netto-brutto-shadow.js`, külön Salary API. | 2026 15%, 9% **csak szimuláció**, családi kedvezmény, hibás input, 400/422/429/timeout, két irány és fallback UI tesztek; a sima `0.665` esetleges használata egyértelműen **korlátozott becslésként** jelenik meg. Képletet nem módosítunk jóváhagyás és referencia nélkül. |
| **KB-06** | P2 – biztonságos első kódtisztítási pilot | A vizsgált HTML-ben korán visszatérő örökségadapter; más fogyasztók még ellenőrizendők | A-01, JCSS-05 | `js/penzugyi/netto-brutto.js`: `upgradeFamilyFields()`. | Hivatkozás/fallback/HTML generálási gráf teljes; ha valóban szükségtelen, **csak az adapter** kivezetve; `netto-brutto-shadow.js` API-kliens megmarad, HU/EN/DE + salary form + API-hiba regresszió zöld. Ha használat igazolódik, a pilot **változtatás nélkül** lezárható. |
| **KB-07** | P2 – igazolt CSS-technikai adósság | Régi, hiányzó képfájlok és későbbi atlaszos felülírás bizonyított | D-01, JCSS-01 | `css/pages/home-redesign-v17.css`, meglévő `season-atlas.avif` / `category-atlas.avif`. | Régi, felülírt képhivatkozások forrásban rendezve, **nincs** újabb `!important` elfedés; 4 évszak, kategóriacsempék, mobil/desktop, kontraszt, PWA-képek és 404-mentes betöltés visual diff szerint helyes. |
| **KB-08** | P2 – build és quality szerződés | A build az auditforrást képes átírni; jelenlegi drift nem bizonyított | BUILD-02 | `scripts/apply-adsense-audit-policy-v2.js` és `scripts/adsense-quality-v2-audit.js`. | Minőségpolitika az audit **egyetlen kanonikus forrásában** van, a beolvadt apply-lépés csak összehasonlító teszttel vezethető ki; buildfázis sorrend, AdSense policy és statikus kimenet változatlan. |
| **KB-09** | P2 – átfedő kalkulátormodulok | Két feature-család egy oldalon bizonyított; hibás dupla számítás nem bizonyított | JCSS-02 | `js/priority-upgrades.js`, `js/finance-quality-upgrades.js`, `js/global-head-config.js`; hitelképesség két JTM-panelje. | Oldalonként funkciógazda-, input-, DOM-, eredmény- és callback-mátrix; az üzletileg indokolt különböző számításokat **megőrizzük**, csak valódi duplikációt egyesítünk, matematikai és mobil regression mellett. |
| **KB-10** | P2 – hosszabb távú buildkonszolidáció | Legalább 9 build-átalakító közös építőipari JS-t ír; aktuális regresszió nem bizonyított | BUILD-01/03/05, A-02 | `scripts/static-build-pipeline.js`, `js/construction-upgrades.js`, `scripts/apply-*.js`; generált HTML/fragmentum. | **Egyetlen célfájl és legfeljebb egy-két apply** kivezetése PR-enként, a kanonikus implementáció megtartásával; számítások/gyártói guard, generált HTML és `static:verify` driftmentes. A 30 source lépés egyszerre történő eltávolítása tilos. |
| **KB-11** | P2 – vizuális és teljesítménybeli tisztaság | A főoldal több legacy CSS-t tölt; nem bizonyított, hogy minden szelektor felesleges | JCSS-03/04/07 | `css/pages/index.css`, `css/seasonal-theme.css`, `css/pages/home-redesign-v17.css`, `js/theme.js`. | Runtime/fallback DOM és tényleges CSS cascade vizsgált 320/768/1440/1920 pixelen, light/dark/4 szezon állapottal; csak bizonyítottan nem használt rétegek kivezetése; nincs képi vagy hozzáférhetőségi visszaesés. |
| **KB-12** | P2 – marketing és hozzájárulás | A 3 slotos és TCF kapu tesztelt, az éles hirdetésszám nem | FSEC-06 | `js/site-ui.js`, `js/cookie.js`, AdSense kézi elhelyezések. | Hozzájárulás nélkül nincs jogosulatlan request, előre elfogadott feltételekkel legfeljebb **3 tervezett hirdetéselhelyezés/oldal** mobilon és desktopon; a tényleges megjelenés és az Auto Ads hatása is ellenőrizve. |
| **KB-13** | P2 – fennmaradó termékminőség | Tesztek léteznek, de audit során nem futott teljes élő E2E | FSEC-07/08 | SEO, hreflang/canonical, 301, sitemap, mobil, WCAG, számítási referenciák, PWA. | Kiválasztott és teljes kalkulátor-mátrix, 320/768/1440/1920 viewport, billentyűzet/olvasó, structured data, élő SW-fingerprint és redirects tesztek sikeresek vagy a hiányok külön nyitottak. |
| **KB-14** | P2 – folyamatos lokalizáció | A `2026-11-08`-i nyilvántartás szerint 13 aktív kalkulátor részletes fordítása még hátra | FSEC-04 | `docs/localization-progress.md`, HU/EN/DE lexikon, a **külön #360 nyitott PR** és fordítási automatizmus. | A fordítás nem keveredik kódtisztítási PR-be; részletes 89/89 tartalom ellenőrzése **után is** marad külön meta, UI, accessibility, számformátum és runtime hiba audit. Az aktuális darabszámot minden PR előtt újra kell olvasni. |
| **KB-15** | P3 – bizonytalan „árva” fájlok | Nulla közvetlen statikus hivatkozás; **nem bizonyított holt kód** | JCSS-06 | `css/components/site-compatibility.css`, `css/pages/site-quality-final.css`, `js/site-compatibility.js` | Dinamikus terhelés, build, service worker, admin és teszt használat tételesen eldöntve; csak utána lehet egy fájlt törölni. |

## 2. Tényleges végrehajtási sorrend és függőségek

**Kritikus, külön szál:** `KB-01` javítása az API repóban saját PR és deploy-folyamatban, **nem** keverhető a 2.1 forrásában történő takarítással. A hiba addig **nyitott**, amíg az éles MCP három toolja újra sikeresen nem használható. A 7. lépés pilotja ettől függetlenül elvégezhető, ha a bérkalkulátor viselkedését a tesztek biztosan őrzik.

**Megfigyelhetőség/guard kapu:** `KB-02` + `KB-03` + `KB-04`. Ezt a magas kockázatú build-konszolidáció előtt indokolt rendezni; nélküle a „zöld PR” nem biztosítja, hogy a kimenet tényleg éles és helyes.

**Első kis, éles weboldalkódot érintő pilot:** `KB-06` (örökség béradapter). **Ennél először bizonyítunk, csak utána törlünk**; nem kötelező bármit eltávolítani, ha van még tényleges fogyasztó. A pilot sikere nem az eltávolított sorok száma, hanem a tesztelt és viselkedésazonos tulajdonosi rendezés.

**Második pilot:** `KB-07` (régi főoldali képreferenciák). A valós képatlaszok már megvannak. A négy évszak és több viewport képi ellenőrzése a változtatás feltétele.

**Utána:** `KB-08` (audit-forrást patch-elő buildlépés) → `KB-09` (JTM átfedés tisztázása) → `KB-10` (egy-két build-transzformáció konszolidálása) → `KB-11/15` (szélesebb CSS/JS és függőségi takarítás).

**Párhuzamos, külön PR-sáv:** `KB-05`, `KB-12`, `KB-13`, `KB-14`; a fordítás, hírek, API és kategória-UI nyitott PR-jeit nem olvasztjuk be automatikusan a takarító ágakba.

## 3. Kötelező minőségkapu **minden** 7. lépéses kódos PR-nél

1. **Friss alap:** aktuális `main` SHA; nyitott kapcsolódó PR-ek és konfliktusok; a kanonikus JS/CSS/build tulajdonos; legalább egy kézzelfogható előtte/utána követelmény.
2. **Konkrét bizonyíték:** a régi logika tényleges hívási/betöltési gráfja, a helyette működő megoldás pontos szerepe; tervezett törlés + szándékosan megőrzött kompatibilitás indoklása.
3. **Egy felelősség / PR:** nem tartalmazhat hírt, fordítást, redesign-t, API- és CI-módosítást együtt, ha nincs szigorú technikai ok.
4. **Kötelező célzott ellenőrzés:** kalkulátor esetén referencia-matematika + HU/EN/DE + API-állapot; CSS esetén vizuális és billentyűzetes használat; generátor esetén `npm run static:build`, `npm run static:verify`, idempotencia, output diff; reklámnál TCF és 3-slot.
5. **Összes releváns kapu:** Site quality, Browser regression (amikor ténylegesen lefut), Repository security baseline, és szükség esetén Materialize static-first, valamint éles release-azonosság. **Skipped nem pass.**
6. **Nincs eltakarás:** tilos a hibás teszt kivétele, `!important` vagy újabb `apply-*` pótréteg hozzáadása csak azért, hogy a régi hibás kód bent maradhasson.
7. **Visszaállítási pont:** minden PR-hez konkrét rollback és ellenőrzés (revert + újraépítés + production-összevetés), valamint a kockázat mérése.
8. **Állapot közlése:** „elkészült kód”, „PR létrejött”, „CI sikeres”, „mergelve”, „éles deploy sikeres” és „élő teszt sikeres” **külön tény**. A felhasználó jóváhagyása nélkül nincs merge vagy deploy.

## 4. Egységes, ellenőrizhető „kész” definíció

Egy kis javító PR csak akkor javasolható merge-re, ha:

- ismert a változtatás tulajdonosa és a kapcsolódó fogyasztók;
- nincs jogosulatlan funkcióvesztés vagy téves jogi/finanszírozási állítás;
- a célzott tesztek **ténylegesen lefutottak**, és a PR megjelöli, ha valamelyik teszt szándékosan nem futott;
- a statikus build kimenete és az ellenőrzött fallback nem változik, **kivéve** az előre rögzített, jóváhagyott különbséget;
- a regressziós védőteszt a jövőben is észlelni tudja ugyanennek a hibának a visszatérését;
- a PR tartalmazza az eltávolított kód **és** a megmaradó részek felsorolását, a rollbacket és a merge utáni éles ellenőrzés tervét.

**Nincs kötelező törlési kvóta.** Az a megállapítás, hogy egy régi fájl valójában szükséges, ugyanolyan értékes, mint a bizonyított biztonságos konszolidáció.

## 5. Auditok és nyitott párhuzamos munkák nyomon követése

**Auditforrások:** [1. kör](architecture-maintainability-audit-2026-11-08.md), [2. függőség](dependency-map-2026-11-08.md), [3. JS/CSS](js-css-maintainability-audit-2026-11-08.md), [4. build](build-architecture-audit-2026-11-08.md), [5. működés/biztonság](functional-security-audit-2026-11-08.md).

**Nyitott PR-ek a baseline pillanatában:** #360 lokalizáció, #351/#340 hírek, #349 hírpublikálási előellenőrzés, #343 kategória-UI. Ezek **nem** részei a takarító PR-nek; létükre minden módosítás előtt újra rá kell keresni.

**Nyitott hibajegyek:** az API repóban [#44 ChatGPT Salary MCP sémadrift](https://github.com/Patrik2020/kalkulator-bazis-api-dev/issues/44); weboldali [#256 production monitor, korábbi Cloudflare 403](https://github.com/Patrik2020/kalkulator-bazis-2.1/issues/256). A #256 utolsó szöveges frissítése **2026-10-28**, ezért ebből **nem** lehet a 2026-11-08-i éles állapotra következtetni.

## 6. Következő auditfázisok elhatárolása

- **6/8 – ez a PR:** priorizálás, bizonyítási szintek, javasolt önálló munkacsomagok, minőségkapuk. **Nincs működő kódmódosítás.**
- **7/8 – kódrendezés:** kis, célzott PR-ek, egyenként tesztelve, a fenti sorrenddel. A KB-01 külön API-s javítás. A sorrend igény szerint csak dokumentált kockázat alapján változhat.
- **8/8 – záróaudit:** teljes kalkulátor + HU/EN/DE + SEO + PWA + AdSense/TCF + mobil/a11y + materializáció/CI + monitoring ellenőrzés; nyitott kockázatok külön listázása. Nem nevezünk teljesen befejezettnek olyan feladatot, amely nem kapta meg a szükséges valós ellenőrzést.
