# Kalkulátor Bázis – záró teljes oldalas audit (2026-08)

Ez a fájl a #99 záró QA célját és merge-feltételeit rögzíti. Nem helyettesíti az automatikus ellenőrzéseket; a merge csak a legfrissebb HEAD teljes zöld CI-állapota után tekinthető jóváhagyottnak.

## Ellenőrzött állomány

- 100 katalogizált kalkulátor a fő registryben és a kötelező tesztmanifestben.
- 1 különálló multifunkciós / tudományos számológép.
- Összesen 101 `kalkulatorok/*.html` oldal.
- A 100 katalogizált kalkulátor registry ↔ HTML ↔ tesztmanifest halmaza pontosan egyezik.
- A 101 kalkulátoroldal sitemap- és canonical-konzisztenciája kötelező zárókapu.
- A különálló tudományos számológépet 22 logikai és validációs referenciaeset védi.

## Kötelező záró ellenőrzések

- teljes `npm run quality` regressziós lánc;
- 29 kiemelt böngészős referenciaeset;
- 100 katalogizált kalkulátor mobil + desktop smoke tesztje;
- mobil + desktop browser UI QA;
- static-first materializáció és idempotencia;
- crawler-visible HTML, structured data, canonical és sitemap audit;
- HTML/JavaScript validáció;
- runtime/console, `NaN`, `Infinity`, duplikált ID és vízszintes overflow ellenőrzés;
- `scripts/final-fullsite-audit.js` 100+1 készletkonzisztencia-gate.

## A fináléban lezárt regressziós rések

A #99 a #98 után lemaradt egészségmodell-materializációt is felszínre hozta. A static build fizikailag alkalmazta az auditált health transformokat, a régi math/property referenciák pedig az új, nem előíró eredménycímkékhez lettek igazítva. A materializált quality körben a simple math tesztek 49/49 eredménnyel futottak, majd a további invariáns-hivatkozások is frissítésre kerültek.

## Merge gate

A #99 csak akkor merge-érett, ha ugyanazon **legfrissebb kézi HEAD-en**:

1. a Site quality validate része sikeres;
2. a 29 browser referencia sikeres;
3. a 100-kalkulátoros mobil + desktop smoke sikeres;
4. a browser UI QA sikeres;
5. a Materialize static-first HTML teljes folyamata sikeres, beleértve az idempotenciát, quality-t, final inventory gate-et, sitemapot és whitespace ellenőrzést.

A végleges audit lezárását a #99 merge-je jelenti.
