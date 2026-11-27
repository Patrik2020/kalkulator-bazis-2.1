# Kalkulátor Bázis 2.1

A [kalkulatorbazis.hu](https://kalkulatorbazis.hu/) statikus-first, magyar–angol–német kalkulátoroldalának forrása. A böngészős felület HTML/CSS/JavaScript alapú; a build és a minőségellenőrzés Node.js-sel fut. A bérkalkulátor külön API-szolgáltatást használ, amelynek szerveroldali implementációja nem ebben a tárolóban található.

## Első indítás

Szükséges: Git és Node.js **24.8.0 vagy újabb** (npm-mel).

```sh
git clone https://github.com/Patrik2020/kalkulator-bazis-2.1.git
cd kalkulator-bazis-2.1
npm ci
npm run dev
```

Nyisd meg: http://127.0.0.1:4173/. A helyi szerver a követett statikus állományokat szolgálja ki; nem emulálja a külső API-t, a Cloudflare-t vagy az éles hirdetési környezetet. Az indítás önmagában nem generálja újra a fájlokat.

## Hol található az egyes funkciók forrása?

| Hely | Felelősség |
| --- | --- |
| `index.html` | Kanonikus, materializált főoldal |
| Gyökérbeli HTML-ek, `kalkulatorok/`, `landing-pages/` | Kategória-, kalkulátor- és tematikus oldalak |
| `components/` | Közös HTML-elemek |
| `fragments/` | A főoldalból származtatott recovery-fragmentumok; nem második kézi forrás |
| `css/base/`, `css/layout/`, `css/components/`, `css/pages/` | Alapstílus, elrendezés, komponens- és oldalspecifikus CSS |
| `js/` | Böngészős runtime, közös UI, témánkénti kalkulátorlogika és fordítások |
| `js/global-head-config.js`, `js/global-head.js` | Központi, feltételes erőforrás-betöltés |
| `js/site-data.js`, `js/expansion-batch-*-data.js` | Kalkulátorkatalógus és kapcsolódó adatok |
| `js/penzugyi/netto-brutto*.js` | Bérkalkulátor felülete, aktív API-kliens és lokalizáció |
| `data/` | Közös adatállományok |
| `scripts/` | Build, tartalmi transzformációk, tesztek, auditok |
| `sw.js`, `js/pwa.js`, `manifest.webmanifest` | Service worker, cache és PWA |
| `worker/` | Külön worker, saját [leírással](worker/README.md) |
| `.github/workflows/` | CI, minőségkapuk, üzemeltetési automatizmusok |
| `docs/` | Fejlesztői, SEO-, lokalizációs és üzemeltetési dokumentáció |

### Hogyan épül fel a weboldal?

A böngésző a statikus HTML-t és a közös stílusokat tölti be. A globális head konfiguráció az oldalhoz tartozó erőforrásokat is betöltheti; ezért a HTML script listája önmagában nem teljes függőségtérkép.

A kanonikus [build](scripts/static-build-pipeline.js) három fázisa: forrás- és tartalmi transzformációk, böngészős materializálás, majd normalizálás és véglegesítés (fragmentumok, asset-verziózás, sitemap). Egy változtatás előtt azonosítani kell a kanonikus szerkesztési helyet és az esetleges generátort, amely ugyanazt a fájlt írja. A főoldal fragmentumai például az index.html-ből származnak.

## Fejlesztési munkafolyamat

1. Friss main ágból indulj, és ellenőrizd a kapcsolódó nyitott PR-eket.
2. Olvasd el az [AGENTS.md](AGENTS.md) és a [fenntarthatósági fejlesztési szerződés](docs/engineering-development-contract.md) előírásait.
3. Azonosítsd a funkció jelenlegi gazdáját, a betöltőket, a generátorokat és a teszteket. Az eredeti implementációt javítsd; ne adj hozzá újabb felülíró réteget.
4. Külön ágon, célzott diffben módosíts. Törlés előtt ellenőrizd a dinamikus, generált, fallback és tesztfüggőségeket is.
5. Futtasd a célzott ellenőrzéseket, majd a releváns CI-kapukat. A PR-ben külön jelöld a helyi teszteket, CI-t, merge-et és éles verifikációt. Merge és deploy csak jóváhagyással.

Új kalkulátornál keresd meg a meglévő hasonló kategóriaoldal és kalkulátor megoldását; a felület, a számítási modell, a katalógus, a head-konfiguráció, a fordítás, a referencia- és böngészőteszt, valamint a generált kimenet kapcsolatait együttesen ellenőrizd. A meglévő URL-ek, képletek, API-sémák, nyelvi viselkedés, akadálymentesség és jóváhagyott hirdetési helyek nem változhatnak véletlenül.

## Ellenőrző parancsok

A teljes lista a [package.json](package.json) scripts mezőjében található.

| Parancs | Cél |
| --- | --- |
| `npm run lint:js`, `npm run lint:html` | Szintaxis és lint |
| `npm run audit:dependencies` | Csak olvasó függőségleltár |
| `npm run test:dependency-map` | A függőségi audit tesztjei |
| `node scripts/js-css-maintainability-audit.js` | Csak olvasó JS/CSS felmérés |
| `npm run test:math`, `npm run test:invariants` | Matematikai referencia és invariánsok |
| `npm run test:calculator-suite` | Kalkulátormodellek ellenőrzése |
| `npm run test:browser:ui` | Böngészős UI-ellenőrzés |
| `npm run quality` | Összetett minőségkapu |
| `npm run static:build` | Statikus build (módosíthat követett fájlokat) |
| `npm run static:verify` | Build idempotenciájának ellenőrzése |
| `npm run test:build-pipeline` | Buildfolyamat regressziótesztjei |

Build után ellenőrizd a diffet; csak az indokolt, forrással összhangban álló generált változtatásokat commitold. Dokumentációs változtatás miatt önmagában ne generáld újra az oldalt. A statikus audit jelöltje nem automatikus törlési engedély.

## Fontos további leírások

- [Kanonikus fejlesztési szabályok](AGENTS.md) és [fenntarthatósági szerződés](docs/engineering-development-contract.md)
- [Függőségtérkép (korábbi audit, történeti állapot)](docs/dependency-map-2026-11-08.md)
- [HU/EN/DE lokalizáció](docs/localization-workflow.md)
- [CI változásérzékeny ellenőrzések](docs/ci-change-scope.md)
- [AdSense elhelyezések](docs/adsense-manual-placement.md)
- [Biztonsági üzemeltetés](docs/security-operations-checklist.md)
- [Élesítés és visszaállítás](docs/p4-release-and-rollback.md)
- [Korábbi fenntarthatósági audit](docs/architecture-maintainability-audit-2026-11-08.md) és [záró bizonyítékok](docs/audit-closeout-evidence-2026-11-09.md)

Az élesítés a jóváhagyott main változatból történik. A sikeres PR CI nem azonos a tényleges éles működés ellenőrzésével.
