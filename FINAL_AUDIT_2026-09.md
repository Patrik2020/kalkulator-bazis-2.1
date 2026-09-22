# Kalkulátor Bázis – záró teljes oldalas audit (2026-09)

Ez a dokumentum a 2026-09-22-én lezárt ötödik javítási kör ellenőrzött állapotát és a kiadási kapukat rögzíti. Nem helyettesíti a legfrissebb HEAD-en futó CI-t, és nem állít production megfelelést olyan javításról, amelyet még nem telepítettek.

## Ellenőrzött állomány

- 102 bejegyzés a központi kalkulátor-registryben és a kötelező tesztmanifestben.
- Ebből 89 nyilvános, indexelhető kalkulátor és 13 kivezetett, `noindex` oldal.
- Összesen 102 `kalkulatorok/*.html` oldal; a tudományos számológép a központi registry része.
- A registry ↔ HTML ↔ tesztmanifest halmaza pontosan egyezik.
- A 89 nyilvános kalkulátoroldal sitemap- és self-canonical készlete pontosan egyezik.
- A 13 kivezetett oldal nincs a sitemapben, és élő céloldalra mutató canonicalt használ.
- A tudományos számológépet 22 logikai és validációs referenciaeset védi.

## 5. körben lefuttatott kapuk

- teljes `npm run quality` regressziós lánc: sikeres;
- `npm run static:check`: 123/123 indexelhető oldal crawler-látható forrással;
- `node scripts/final-fullsite-audit.js`: 102/102 registry-, HTML-, teszt-, sitemap- és canonical-konzisztencia;
- egyszerű kalkulátor-referenciák: 49/49;
- property/invariáns tesztek: 38/38;
- kalkulátor-registry: 89 nyilvános + 13 kivezetett, eltérés nélkül;
- Quality 3.0: 139 HTML oldal, 123 indexelhető oldal, 0 figyelmeztetés, 0 blokkoló hiba;
- reszponzív statikus kapu: a kötelező 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 és 1920 px szélesség, valamint telefonos fekvő nézetek lefedve;
- production böngészős smoke: főoldali keresés, Enter-navigáció, BMI normál és hibás határérték, kapcsolódó kalkulátorok, dark mode, Döntések, Összehasonlítás és helyi mentés ellenőrizve; `NaN`/`Infinity` nem jelent meg.

## CI-ben kötelező böngészős kapuk

- 30 kiemelt böngészős referenciaeset;
- 102 kalkulátoroldal × 5 kockázati viewport = 510 render;
- 20 kiemelt oldal × 14 viewport reszponzív UI-audit;
- konzolhiba, `NaN`, `Infinity`, vízszintes overflow, levágott vezérlő, header-átfedés és 44 px alatti tap target ellenőrzés;
- főoldali kereső, mobil menü, popupok, sütikezelés, fejlesztési modal, dark mode és nyomtatási téma interakciós ellenőrzése.

Ezek a böngészős kapuk a `.github/workflows/quality.yml` Chrome-os jobjában futnak. A jelenlegi munkakörnyezetben Chrome/Chromium nem érhető el, ezért lokálisan nem tekinthetők lefutottnak; a commit csak zöld CI után merge-érett.

## Production eltérés a vizsgálat időpontjában

A production még nem tartalmazza az összes lokális javítást:

- `/landing-pages/wise/kapcsolat.html` jelenleg 404 oldalra jut a várt `/kapcsolat` 301 helyett;
- `/landing-pages/wise/cookie-tajekoztato.html` jelenleg 404 oldalra jut a várt `/cookie` 301 helyett;
- a főoldali nyelv- és évszak-popupok production markupja még a régi komponenst használja, miközben a lokális verzió már `aria-controls`, konzisztens `aria-expanded`, `hidden` és Escape-kezelést tartalmaz;
- a fejlesztési és sütimodal productionben első látogatáskor egyszerre jelenhet meg, míg a lokális verzió már sorba rendezi őket.

Az `_redirects` mindkét régi Wise URL `.html` és extensionless változatát lefedi, a régi URL-ek nincsenek a sitemapben, a lokális a11y és modal regressziós tesztek pedig zöldek. Emiatt ezekhez ebben a körben nem készült újabb duplikált kódjavítás; deploy után a `production-smoke.yml` valamennyi 301 szabályt és a sitemap-készletet tényleges HTTP-kéréssel ellenőrzi.

## Kiadási sorrend

1. A commit pusholása és a teljes Site quality workflow lefuttatása.
2. A Chrome-os referencia-, 510-renderes kalkulátor- és 280-renderes UI-audit zöld eredménye.
3. Production deploy.
4. A production smoke sikeres lefutása, különösen a négy Wise redirect-forrásra.
5. Rövid kézi production ellenőrzés a modal-sorrendre, popup billentyűzetkezelésre és főoldali keresőre.

Képlet, adókulcs, egészségügyi értelmezés vagy kalkulációs logika az ötödik körben nem változott.
