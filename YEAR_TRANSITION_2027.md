# Kalkulátor Bázis — 2027 évváltási munkanapló

Branch: `year-transition/2027`

## Cél
A 2026 → 2027 évváltás előkészítése úgy, hogy a 2027-ben hatályos, Kalkulátor Bázist érintő szabályok és számítási paraméterek ellenőrzötten, elkülönítve kerüljenek beépítésre, miközben a `main` ág érintetlen marad a végső jóváhagyásig.

## Figyelt témák
- SZJA és személyi kedvezmények
- családi kedvezmény és családi járulékkedvezmény
- 25 év alattiak, 30 év alatti anyák és egyéb életkor/családi állapot szerinti kedvezmények
- TB-járulék és szocho
- minimálbér és garantált bérminimum
- béren kívüli és egyéb juttatások, ha van kapcsolódó kalkulátor
- nyugdíj-, egészségpénztári és megtakarítási adószabályok, ha érintik a kalkulátorokat
- gépjármű-, üzemanyag-, utazási vagy költségtérítési szabályok, ha érintik a kalkulátorokat
- számlázási, fizetési határidő-, áfa- és vállalkozási szabályok, ha van hozzá kalkulátor
- bármely más 2027-es jogszabályi vagy hivatalos paraméterváltozás, amely meglévő kalkulátor eredményét vagy magyarázó szövegét módosítja

## Forráselv
Elsődleges forrás szükséges: Magyar Közlöny, NAV, kormany.hu, jogszabálytár vagy más illetékes hivatalos szerv. Sajtóhír, tervezet vagy politikai bejelentés önmagában nem elég a számítási logika módosításához.

## Beépítési szabály
1. Ellenőrizni, hogy a változás ténylegesen 2027-re hatályos és releváns-e.
2. Azonosítani az érintett kalkulátort és fájlokat.
3. Módosítani kizárólag a `year-transition/2027` ágon.
4. A kapcsolódó számítási logikát, magyarázó szöveget és szükséges SEO-elemeket konzisztensen frissíteni.
5. Rögzíteni itt a forrást, kihirdetés/hatálybalépés dátumát és az érintett kalkulátort.
6. Bizonytalan vagy még nem végleges szabályt nem szabad kész számításként beépíteni.
7. A `main` ághoz csak külön felhasználói jóváhagyás után nyúlunk.

## Változásnapló

### 2026-09-15 — Két gyermeket nevelő anyák SZJA-kedvezménye
- **Hatálybalépés:** 2027-01-01.
- **Változás:** 2027-től a két gyermeket nevelő anyák kedvezményének következő korcsoportja lép be: azok az anyák is jogosulttá válnak, akik az 50. életévüket 2026. december 31. után töltik be.
- **Jogalap:** 2025. évi XIV. törvény; Szja tv. 29/H. §.
- **Hivatalos forrás:** NAV — Két gyermeket nevelő anyák kedvezménye: https://nav.gov.hu/ado/szja/Ket_gyermeket_nevelo_anyak_kedvezmenye
- **Érintett kalkulátor:** `kalkulatorok/netto-brutto-kalkulator.html`.
- **Érintett kliensfájlok:** `js/penzugyi/netto-brutto.js`, `js/penzugyi/netto-brutto-shadow.js`.
- **Előkészítés:** a szabály bekerült a `data/years/2027.json` központi 2027-es szabályadatba.
- **Integrációs megjegyzés:** a nettó–bruttó üzleti számítás jelenleg API-only módban fut. A tényleges számítási logika aktiválását az API 2027-es szabálykezelésével együtt kell elvégezni; a 2026-os éles viselkedést ezen az ágon sem írjuk felül idő előtt.
