# Kalkulátor Bázis – projekt-audit

Készült: 2026-06-21

## Hatókör és módszer

- 90 nyilvános HTML-oldal, 49 CSS-fájl és 43 JavaScript-fájl statikus vizsgálata.
- Ellenőrzés: metaadatok, címsorok, linkek, képek, ID-k, scriptbetöltések, AdSense, szó szerinti tartalmi ismétlések, sablonos SEO/GYIK és nagy erőforrások.
- A statikus audit a böngészős működési és vizuális tesztet nem helyettesíti; az a módosítások után külön következik.

## Vezetői összefoglaló

- Összes feltárt fájlszintű tétel: **369**.
- Generált/sablonos SEO-blokkot tartalmazó oldalak: **54**.
- A kért statikus AdSense-kódot nélkülöző nyilvános oldalak: **90**.
- Hibás helyi hivatkozással érintett oldalak: **0**.
- Egymással megegyező CSS-deklarációs csoportok: **101**; ezek közül csak komponensazonosság esetén javasolt összevonás.
- 500 KB-nál nagyobb helyi erőforrások: **6**.
- A legnagyobb tartalmi kockázat a tömegesen azonos generikus SEO/GYIK; a legfontosabb technikai eltérés az AdSense betöltési mód és a feladatban előírt statikus head-kód közötti különbség.

## Fájlonkénti audit

### `404.html`

1. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `adatvedelem.html`

1. **Probléma:** Hiányzik a meta description.
   **Szakasz:** <head>. **Javaslat:** Adj egyedi leírást. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
4. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `atvaltok.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Hőmérséklet átváltó”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `auto.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Autós kalkulátor”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `cookie.html`

1. **Probléma:** Hiányzik a meta description.
   **Szakasz:** <head>. **Javaslat:** Adj egyedi leírást. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
4. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `egeszseg.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „BMI kalkulátor”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 3 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/vizfogyasztas-kalkulator.html, kalkulatorok.html, kalkulatorok/testzsir-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `epitoipari.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Beton kalkulátor”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 3 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/padlo-burkolat-kalkulator.html, kalkulatorok.html, kalkulatorok/gipszkarton-kalkulator.html, kalkulatorok/vakolat-kalkulator.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `felhasznalasi-feltetelek.html`

1. **Probléma:** Hiányzik a meta description.
   **Szakasz:** <head>. **Javaslat:** Adj egyedi leírást. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
4. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `index.html`

1. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
2. **Probléma:** 1 hosszabb bekezdés más oldalon is szó szerint szerepel (penzugyi.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (egeszseg.html, kalkulatorok/vizfogyasztas-kalkulator.html, kalkulatorok/testzsir-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/adatmeret-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, kalkulatorok/atlag-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/afa-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/alvasciklus-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (egeszseg.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/ar-kedvezmeny-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/arany-kalkulator.html, kalkulatorok/atlag-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/arany-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/atlag-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/atlag-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/auto-ertekvesztes-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/auto-fogyasztas-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 2 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, kalkulatorok/atlag-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/auto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/autopalyadij-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/beton-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/bmi-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/bmr-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/borravalo-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/co2-kibocsatas-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/csempe-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/datum-kulonbseg-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/derek-csipo-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/deviza-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/egysegar-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/eletkor-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/energia-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/etf-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/eves-auto-koltseg-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/feherje-szukseglet-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/festek-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/fizetesi-hatarido-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/fuga-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 6 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/gipszkarton-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (epitoipari.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/gumi-meret-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/hatotav-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/havi-koltsegvetes-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 5 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/hitel-torleszto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/hitelkepesseg-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/homerseklet-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/hoszigeteles-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/hosszusag-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/idealis-testsuly-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/ido-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/inflacio-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/kaloria-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/kamatos-kamat-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/kilometerdij-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/lakas-hitel-onero-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/makro-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/milliomos-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/munkaido-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/netto-brutto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/nyomas-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/oraber-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/osztalek-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/padlo-burkolat-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (epitoipari.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/pulzus-zona-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 6 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/rezsi-megosztas-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/sebesseg-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/szamla-teljesites-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/szazalek-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `kalkulatorok/tankolas-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/tapeta-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 6 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/tegla-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 2 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/teljesitmeny-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/terfogat-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/terhessegi-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/terkovezes-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/terulet-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/testzsir-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (egeszseg.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/tetocserep-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/tomeg-atvalto-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 4 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/utazasi-ido-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 6 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/uzemanyag-koltseg-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 2 hosszabb bekezdés más oldalon is szó szerint szerepel (kalkulatorok/alvasciklus-kalkulator.html, kalkulatorok/ar-kedvezmeny-kalkulator.html, kalkulatorok/arany-kalkulator.html, kalkulatorok/atlag-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/vakolat-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (epitoipari.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `kalkulatorok/vizfogyasztas-kalkulator.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
3. **Probléma:** 5 sablonos SEO/GYIK fordulat található.
   **Szakasz:** Tartalmi és GYIK blokkok. **Javaslat:** Írd át az adott számítás félreértéseire, korlátaira és valós használatára. **Művelet:** Átírni. **Kockázat:** Alacsony.
4. **Probléma:** 7 hosszabb bekezdés más oldalon is szó szerint szerepel (egeszseg.html, kalkulatorok.html, kalkulatorok/adatmeret-atvalto-kalkulator.html, kalkulatorok/alvasciklus-kalkulator.html, …).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.
5. **Probléma:** Generált SEO-blokk maradt az oldalon.
   **Szakasz:** data-generated-seo szakasz. **Javaslat:** Cseréld számításspecifikus, tömör és egyedi tartalomra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html`

1. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
2. **Probléma:** Eltérő, szöveges KB fejlécjel látható a végleges logó helyett.
   **Szakasz:** Fejléc. **Javaslat:** Használd a favicon/kb-logo-mark.png fájlt helyes relatív útvonallal. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `landing-pages/wise/adatkezelesi-tajekoztato.html`

1. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 2 hosszabb bekezdés más oldalon is szó szerint szerepel (landing-pages/wise/jogi-nyilatkozat.html, landing-pages/wise/cookie-tajekoztato.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `landing-pages/wise/cookie-tajekoztato.html`

1. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 1 hosszabb bekezdés más oldalon is szó szerint szerepel (landing-pages/wise/adatkezelesi-tajekoztato.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `landing-pages/wise/jogi-nyilatkozat.html`

1. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 1 hosszabb bekezdés más oldalon is szó szerint szerepel (landing-pages/wise/adatkezelesi-tajekoztato.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

### `landing-pages/wise/kapcsolat.html`

1. **Probléma:** Hiányzik a canonical URL.
   **Szakasz:** <head>. **Javaslat:** Adj önmagára mutató canonical linket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `landing-pages/wise/wise.html`

1. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Információ”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
2. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `mindennapi.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Százalék kalkulátor”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.

### `penzugyi.html`

1. **Probléma:** Hiányos Open Graph metaadatok.
   **Szakasz:** <head>. **Javaslat:** Adj releváns og:title és og:description értékeket. **Művelet:** Hozzáadni. **Kockázat:** Alacsony.
2. **Probléma:** A címsorhierarchia szintet ugrik.
   **Szakasz:** „Nettó - bruttó kalkulátor”. **Javaslat:** Igazítsd a címsorszintet a tartalmi hierarchiához. **Művelet:** Átírni. **Kockázat:** Alacsony.
3. **Probléma:** A kért statikus AdSense betöltőkód hiányzik.
   **Szakasz:** <head>. **Javaslat:** Helyezd el pontosan egyszer a headben; a hozzájárulási működést külön ellenőrizd. **Művelet:** Hozzáadni. **Kockázat:** Közepes.
4. **Probléma:** 2 hosszabb bekezdés más oldalon is szó szerint szerepel (index.html, kalkulatorok/havi-koltsegvetes-kalkulator.html, kalkulatorok.html).
   **Szakasz:** Tartalmi blokkok. **Javaslat:** Tartsd meg a témaspecifikus részt, a közös sablont írd újra. **Művelet:** Átírni. **Kockázat:** Alacsony.

## CSS-megfigyelések

- `css/adatvedelem-sutik-felhasznalasi-feltetelek.css` (.article p); `landing-pages/wise/css/wise.css` (.security-card h3)
- `css/base/reset.css` (img, picture, video, canvas, svg); `landing-pages/wise/css/wise.css` (img)
- `css/components/buttons.css` (.radio-group); `css/components/buttons.css` (.button-group)
- `css/components/calculator.css` (.calculator h1); `css/pages/festek-kalkulator.css` (.page-festek .result-box)
- `css/components/calculator.css` (.article h2, .article h3); `css/pages/simple-calculator.css` (.page-simple-calculator #simpleCalcResults strong); `landing-pages/wise/css/wise.css` (.wise-caution strong)
- `css/components/calculator.css` (.calc-grid, .options-grid); `css/components/site-sections.css` (.related-links, .portal-grid); `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css` (.strip-grid, .principle-grid, .calculator-grid, .source-links, .footer-inner); `landing-pages/wise/css/wise.css` (.trust-grid, .features-grid, .calculator-links, .security-grid, .footer-inner)
- `css/components/cookie.css` (.cookie-banner); `css/components/site-sections.css` (.wise-banner)
- `css/components/forms.css` (.input-group); `css/components/site-sections.css` (.page-hero h1); `css/components/site-sections.css` (.section-heading); `css/components/site-sections.css` (.category-seo h2, .related-section h2); `css/pages/index.css` (.hero h1)
- `css/components/site-sections.css` (.section-block); `css/components/site-sections.css` (.category-seo, .related-section)
- `css/components/site-sections.css` (.calculator-card h3); `css/components/site-sections.css` (.adsense-content li, .portal-content li); `css/pages/simple-calculator.css` (.page-simple-calculator #simpleCalcResults p)
- `css/components/site-sections.css` (.search-results.is-visible); `css/components/site-sections.css` (.search-result strong, .search-result small); `css/components/site-sections.css` (.wise-banner strong, .wise-banner small)
- `css/components/site-sections.css` (.faq-list); `css/components/site-sections.css` (.related-links)
- `css/layout/grid.css` (.category-grid); `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css` (.principle-grid, .calculator-grid); `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css` (.timeline); `landing-pages/wise/css/wise.css` (.features-grid, .calculator-links, .security-grid)
- `css/layout/grid.css` (.category-grid); `css/pages/index.css` (.category-grid)
- `css/layout/grid.css` (.category-grid); `css/pages/index.css` (.category-grid)
- `css/layout/header.css` (#menu.active); `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css` (.main-nav.active); `landing-pages/wise/css/wise.css` (.main-nav.active)
- `css/layout/header.css` (.menu-toggle); `css/pages/tegla-kalkulator.css` (.page-tegla .faq-item summary::-webkit-details-marker); `css/style.css` (.seo-details summary::-webkit-details-marker); `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css` (.menu-toggle); `landing-pages/wise/css/wise.css` (.menu-toggle)
- `css/pages/adatmeret.css` (.page-adatmeret .hero); `css/pages/deviza.css` (.page-deviza .hero); `css/pages/homerseklet.css` (.page-homerseklet .hero); `css/pages/hosszusag.css` (.page-hosszusag .hero); `css/pages/ido.css` (.page-ido .hero); `css/pages/sebesseg.css` (.page-sebesseg .hero); `css/pages/tegla-kalkulator.css` (.page-tegla .hero); `css/pages/terfogat.css` (.page-terfogat .hero); `css/pages/terulet.css` (.page-terulet .hero); `css/pages/tomeg.css` (.page-tomeg .hero)
- `css/pages/adatmeret.css` (.page-adatmeret .hero p); `css/pages/deviza.css` (.page-deviza .hero p); `css/pages/homerseklet.css` (.page-homerseklet .hero p); `css/pages/hosszusag.css` (.page-hosszusag .hero p); `css/pages/ido.css` (.page-ido .hero p); `css/pages/sebesseg.css` (.page-sebesseg .hero p); `css/pages/tegla-kalkulator.css` (.page-tegla .hero p); `css/pages/terfogat.css` (.page-terfogat .hero p); `css/pages/terulet.css` (.page-terulet .hero p); `css/pages/tomeg.css` (.page-tomeg .hero p)
- `css/pages/adatmeret.css` (.card-calculator); `css/pages/deviza.css` (.card-calculator); `css/pages/homerseklet.css` (.card-calculator); `css/pages/hosszusag.css` (.card-calculator); `css/pages/ido.css` (.card-calculator); `css/pages/sebesseg.css` (.card-calculator); `css/pages/tegla-kalkulator.css` (.page-tegla .card-calculator); `css/pages/terfogat.css` (.card-calculator); `css/pages/terulet.css` (.card-calculator); `css/pages/tomeg.css` (.card-calculator)
- `css/pages/adatmeret.css` (.calc-grid); `css/pages/deviza.css` (.calc-grid); `css/pages/homerseklet.css` (.calc-grid); `css/pages/hosszusag.css` (.calc-grid); `css/pages/ido.css` (.calc-grid); `css/pages/sebesseg.css` (.calc-grid); `css/pages/terfogat.css` (.calc-grid); `css/pages/terulet.css` (.calc-grid); `css/pages/tomeg.css` (.calc-grid)
- `css/pages/adatmeret.css` (.calc-grid input, .calc-grid select); `css/pages/deviza.css` (.calc-grid input, .calc-grid select); `css/pages/hosszusag.css` (.calc-grid input, .calc-grid select); `css/pages/ido.css` (.calc-grid input, .calc-grid select); `css/pages/sebesseg.css` (.calc-grid input, .calc-grid select); `css/pages/terfogat.css` (.calc-grid input, .calc-grid select); `css/pages/terulet.css` (.calc-grid input, .calc-grid select); `css/pages/tomeg.css` (.calc-grid input, .calc-grid select)
- `css/pages/adatmeret.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/deviza.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/hosszusag.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/ido.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/sebesseg.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/terfogat.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/terulet.css` (.calc-grid input:focus, .calc-grid select:focus); `css/pages/tomeg.css` (.calc-grid input:focus, .calc-grid select:focus)
- `css/pages/adatmeret.css` (.result-box); `css/pages/deviza.css` (.result-box); `css/pages/homerseklet.css` (.result-box); `css/pages/hosszusag.css` (.result-box); `css/pages/ido.css` (.result-box); `css/pages/sebesseg.css` (.result-box); `css/pages/terfogat.css` (.result-box); `css/pages/terulet.css` (.result-box); `css/pages/tomeg.css` (.result-box)
- `css/pages/adatmeret.css` (.result-box p); `css/pages/deviza.css` (.result-box p); `css/pages/hosszusag.css` (.result-box p); `css/pages/ido.css` (.result-box p); `css/pages/sebesseg.css` (.result-box p); `css/pages/terfogat.css` (.result-box p); `css/pages/terulet.css` (.result-box p); `css/pages/tomeg.css` (.result-box p)
- `css/pages/adatmeret.css` (.article); `css/pages/deviza.css` (.article); `css/pages/homerseklet.css` (.article); `css/pages/hosszusag.css` (.article); `css/pages/ido.css` (.article); `css/pages/sebesseg.css` (.article); `css/pages/tegla-kalkulator.css` (.page-tegla .article); `css/pages/terfogat.css` (.article); `css/pages/terulet.css` (.article); `css/pages/tomeg.css` (.article)
- `css/pages/adatmeret.css` (.article h2); `css/pages/deviza.css` (.article h2); `css/pages/homerseklet.css` (.article h2); `css/pages/hosszusag.css` (.article h2); `css/pages/ido.css` (.article h2); `css/pages/sebesseg.css` (.article h2); `css/pages/tegla-kalkulator.css` (.page-tegla .article h2); `css/pages/terfogat.css` (.article h2); `css/pages/terulet.css` (.article h2); `css/pages/tomeg.css` (.article h2)
- `css/pages/adatmeret.css` (.article h3); `css/pages/deviza.css` (.article h3); `css/pages/homerseklet.css` (.article h3); `css/pages/hosszusag.css` (.article h3); `css/pages/ido.css` (.article h3); `css/pages/sebesseg.css` (.article h3); `css/pages/tegla-kalkulator.css` (.page-tegla .article h3); `css/pages/terfogat.css` (.article h3); `css/pages/terulet.css` (.article h3); `css/pages/tomeg.css` (.article h3)
- `css/pages/adatmeret.css` (.article p, .article li); `css/pages/deviza.css` (.article p, .article li); `css/pages/hosszusag.css` (.article p, .article li); `css/pages/ido.css` (.article p, .article li); `css/pages/sebesseg.css` (.article p, .article li); `css/pages/terfogat.css` (.article p, .article li); `css/pages/terulet.css` (.article p, .article li); `css/pages/tomeg.css` (.article p, .article li)
- `css/pages/adatmeret.css` (.article ul); `css/pages/deviza.css` (.article ul); `css/pages/homerseklet.css` (.article ul); `css/pages/hosszusag.css` (.article ul); `css/pages/ido.css` (.article ul); `css/pages/sebesseg.css` (.article ul); `css/pages/terfogat.css` (.article ul); `css/pages/terulet.css` (.article ul); `css/pages/tomeg.css` (.article ul)
- `css/pages/adatmeret.css` (.info-box); `css/pages/homerseklet.css` (.info-box); `css/pages/hosszusag.css` (.info-box); `css/pages/ido.css` (.info-box); `css/pages/sebesseg.css` (.info-box); `css/pages/terfogat.css` (.info-box); `css/pages/terulet.css` (.info-box); `css/pages/tomeg.css` (.info-box)
- `css/pages/adatmeret.css` (.conversion-table); `css/pages/deviza.css` (.conversion-table); `css/pages/hosszusag.css` (.conversion-table); `css/pages/ido.css` (.conversion-table); `css/pages/sebesseg.css` (.conversion-table); `css/pages/terfogat.css` (.conversion-table); `css/pages/terulet.css` (.conversion-table); `css/pages/tomeg.css` (.conversion-table)
- `css/pages/adatmeret.css` (.conversion-table th, .conversion-table td); `css/pages/deviza.css` (.conversion-table th, .conversion-table td); `css/pages/homerseklet.css` (.conversion-table th, .conversion-table td); `css/pages/hosszusag.css` (.conversion-table th, .conversion-table td); `css/pages/ido.css` (.conversion-table th, .conversion-table td); `css/pages/sebesseg.css` (.conversion-table th, .conversion-table td); `css/pages/terfogat.css` (.conversion-table th, .conversion-table td); `css/pages/terulet.css` (.conversion-table th, .conversion-table td); `css/pages/tomeg.css` (.conversion-table th, .conversion-table td)
- `css/pages/adatmeret.css` (.conversion-table th); `css/pages/deviza.css` (.conversion-table th); `css/pages/homerseklet.css` (.conversion-table th); `css/pages/hosszusag.css` (.conversion-table th); `css/pages/ido.css` (.conversion-table th); `css/pages/sebesseg.css` (.conversion-table th); `css/pages/tegla-kalkulator.css` (.page-tegla .result-box span); `css/pages/terfogat.css` (.conversion-table th); `css/pages/terulet.css` (.conversion-table th); `css/pages/tomeg.css` (.conversion-table th)
- `css/pages/adatmeret.css` (.conversion-table tbody tr:last-child td); `css/pages/deviza.css` (.conversion-table tbody tr:last-child td); `css/pages/homerseklet.css` (.conversion-table tr:last-child td); `css/pages/hosszusag.css` (.conversion-table tbody tr:last-child td); `css/pages/ido.css` (.conversion-table tbody tr:last-child td); `css/pages/sebesseg.css` (.conversion-table tbody tr:last-child td); `css/pages/tegla-kalkulator.css` (.page-tegla .result-box p:last-child); `css/pages/terfogat.css` (.conversion-table tbody tr:last-child td); `css/pages/terulet.css` (.conversion-table tbody tr:last-child td); `css/pages/tomeg.css` (.conversion-table tbody tr:last-child td)
- `css/pages/adatmeret.css` (.result-box p); `css/pages/deviza.css` (.result-box p); `css/pages/hosszusag.css` (.result-box p); `css/pages/ido.css` (.result-box p); `css/pages/sebesseg.css` (.result-box p); `css/pages/terfogat.css` (.result-box p); `css/pages/terulet.css` (.result-box p); `css/pages/tomeg.css` (.result-box p); `css/style.css` (.seo-content h3)
- `css/pages/adatmeret.css` (.conversion-table); `css/pages/deviza.css` (.conversion-table); `css/pages/homerseklet.css` (.conversion-table); `css/pages/hosszusag.css` (.conversion-table); `css/pages/ido.css` (.conversion-table); `css/pages/sebesseg.css` (.conversion-table); `css/pages/terfogat.css` (.conversion-table); `css/pages/terulet.css` (.conversion-table); `css/pages/tomeg.css` (.conversion-table)
- `css/pages/adatmeret.css` (.conversion-table th, .conversion-table td); `css/pages/deviza.css` (.conversion-table th, .conversion-table td); `css/pages/homerseklet.css` (.conversion-table th, .conversion-table td); `css/pages/hosszusag.css` (.conversion-table th, .conversion-table td); `css/pages/ido.css` (.conversion-table th, .conversion-table td); `css/pages/sebesseg.css` (.conversion-table th, .conversion-table td); `css/pages/terfogat.css` (.conversion-table th, .conversion-table td); `css/pages/terulet.css` (.conversion-table th, .conversion-table td); `css/pages/tomeg.css` (.conversion-table th, .conversion-table td)
- `css/pages/afa.css` (.page-afa); `css/pages/auto.css` (.page-auto); `css/pages/beton.css` (.page-beton); `css/pages/bmi.css` (.page-bmi); `css/pages/csempe.css` (.page-csempe); `css/pages/etf.css` (.page-etf); `css/pages/hatarido.css` (.page-hatarido); `css/pages/hitel-kepesseg.css` (.page-hitelkep); `css/pages/hitel-torleszto.css` (.page-hitel); `css/pages/inflacio.css` (.page-inflacio); `css/pages/kaloria.css` (.page-kaloria); `css/pages/kamatos-kamat.css` (.page-kamatos); `css/pages/lakashitel-onero.css` (.page-onero); `css/pages/milliomos.css` (.page-milliomos); `css/pages/netto-brutto.css` (.page-netto); `css/pages/osztalek.css` (.page-osztalek); `css/pages/szamla-teljesites.css` (.page-szamla); `css/pages/szazalek.css` (.page-szazalek)
- `css/pages/afa.css` (.page-afa .hero); `css/pages/auto.css` (.page-auto .hero); `css/pages/beton.css` (.page-beton .hero); `css/pages/bmi.css` (.page-bmi .hero); `css/pages/csempe.css` (.page-csempe .hero); `css/pages/etf.css` (.page-etf .hero); `css/pages/hatarido.css` (.page-hatarido .hero)
- További 61 csoport a gépi auditban található.

## Nagy erőforrások

- `css/components/images/health.png`: 1757.9 KB
- `css/components/images/auto.png`: 1671.5 KB
- `css/components/images/general.png`: 1645.2 KB
- `css/components/images/building.png`: 1597.9 KB
- `css/components/images/finance.png`: 1464.5 KB
- `images/kalkulator-bazis-og.jpg`: 578.1 KB

## Változtatási terv

1. A generált SEO-blokkokat tartalmi klaszterenként, kalkulátorspecifikus szövegre és eltérő szerkezetre cseréljük; a működő kalkulátorformokat és számítási JavaScriptet érintetlenül hagyjuk.
2. A kiemelt pénzügyi és építőipari oldalakon az egymást átfedő szakmai blokkokat összevonjuk, az ismétlődő GYIK-et eltávolítjuk.
3. A hat kategóriaoldal saját döntési helyzetet, kezdőpontot és válogatási logikát kap.
4. A főoldalt a hero + kereső, gyors kategóriaválasztó, népszerű kalkulátorok, pénzügyi alapozó, bizalmi blokk, rövid bemutatkozás és akadálymentes GYIK sorrendre rendezzük.
5. A pénzügyi tudatosság landing fejlécében a meglévő `favicon/kb-logo-mark.png` logót használjuk.
6. Az AdSense betöltőkódot minden nyilvános HTML headjében pontosan egyszer egységesítjük; a hirdetési blokkok és publisher ID változatlanok maradnak.
7. Javítjuk a bizonyítható HTML-, meta-, link-, focus-, label- és accordion-problémákat; a számítási logikát csak dokumentált hiba esetén érintjük.
8. A módosítások után újrafuttatjuk ezt az auditot, a link- és szintaxisellenőrzést, majd több szélességen böngészős ellenőrzést végzünk.

