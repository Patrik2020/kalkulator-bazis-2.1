# Építőipari kategória – egyedi minőségi fejlesztés

Dátum: 2026-08-15
Branch: `adsense-quality-construction-2026-08`

## Cél

Az építőipari kategória minden oldala kapjon olyan saját hozzáadott értéket, amely nem egyszerűen a kalkulátor képletét magyarázza újra. A fejlesztés a valós felújítási és beszerzési döntések következő lépését teszi láthatóvá: rendelési tartalék, csomagolás, felületi állapot, rendszerkompatibilitás, logisztika, csomópont vagy geometriai ellenőrzés.

## Oldalankénti egyedi érték

| Oldal | Egyedi fejlesztés |
|---|---|
| `epitoipari.html` | Felújítási döntési útvonal: geometria → alapfelület → kiosztás → rendszerben gondolkodás. |
| `beton-kalkulator.html` | Rendelési tartalék + mixerforduló-tervező a geometriai térfogat után. |
| `csempe-kalkulator.html` | Fal- és padlóburkolat külön dobozkerekítése, plusz javítótartalék. |
| `festek-kalkulator.html` | Felületi állapot szerinti fedőképesség-stresszteszt és vödörkerekítés. |
| `tegla-kalkulator.html` | Raklaplogisztika: darabszám, külön tartalék, raklapra kerekített rendelés. |
| `gipszkarton-kalkulator.html` | Rendszerkapu normál, nedves, hanggátló és tűzvédelmi igényhez. |
| `tapeta-kalkulator.html` | Mintaismétlés, csíkhossz, gyártási tétel és javítótartalék döntési keret. |
| `vakolat-kalkulator.html` | Hárompontos rétegvastagság-térkép átlaggal és felületi eltérés értelmezésével. |
| `hoszigeteles-kalkulator.html` | Rendszerkompatibilitási checklist és előrehaladásjelző. |
| `terkovezes-kalkulator.html` | Lejtésből geometriai szintkülönbség-számító a vízelvezetés tervezéséhez. |
| `tetocserep-kalkulator.html` | Gerinc, vápa, eresz, orom, áttörés és javítótartalék kiegészítőlista. |
| `fuga-kalkulator.html` | Felhasználási zóna szerinti értelmezés: száraz fal, padló, vizes zóna, kültér. |
| `padlo-burkolat-kalkulator.html` | Csomagkerekítés és a vágási ráhagyástól külön kezelt maradék/javítótartalék. |

## People-first elv

A modulok nem ugyanazt a „mi ez / képlet / példa / GYIK” mintát ismétlik. Minden oldal más gyakorlati hibát vagy második döntési lépést kezel. A cél, hogy a felhasználó ne csak egy számot kapjon, hanem megértse, mit kell még ellenőrizni a vásárlás vagy kivitelezés előtt.

## Biztonsági és szakmai határ

- A kalkulátorok mennyiségi és geometriai becslések.
- Statikai, tűzvédelmi, vízszigetelési, páratechnikai vagy szerkezeti döntést nem automatizálnak.
- A konkrét termék kiadósságát, csomagolását, rétegrendjét és kompatibilitását a gyártói adatlap alapján kell véglegesíteni.
- Szerkezeti vagy nagy értékű munkánál a helyszíni felmérés és szakember ellenőrzése elsődleges.

## Technikai megoldás

- `js/construction-quality-upgrades.js`: 12 kalkulátor + kategóriaoldal oldalanként külön renderelt minőségi moduljai.
- `css/pages/construction-quality-upgrades.css`: közös vizuális alap a különböző szerkezetű modulokhoz.
- `js/global-head.js`: csak az építőipari kategóriaoldalon és a 12 építőipari kalkulátoron tölti be az új csomagot.
- A meglévő `js/construction-upgrades.js` haladó kalkulátorait nem írja felül; az új réteg ezekhez döntési és értelmezési pluszt ad.
