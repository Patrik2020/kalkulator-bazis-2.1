# Autós + átváltó kategória – egyedi minőségi fejlesztés

Dátum: 2026-08-15
Branch: `adsense-quality-auto-converters-2026-08`

## Cél

Az autós és átváltó kategória minden oldala saját, témaspecifikus hozzáadott értéket kapjon. A fejlesztés nem szószámot növel, hanem oldalanként más döntési hibát, értelmezési problémát vagy interaktív második lépést kezel.

## Autós oldalak

| Oldal | Egyedi fejlesztés |
|---|---|
| `auto.html` | Út előtti becslés → tankolás utáni ellenőrzés → éves teljes költség döntési útvonal. |
| `auto-kalkulator.html` | Marginalis útiköltség kontra teljes birtoklási költség ráosztása. |
| `uzemanyag-koltseg-kalkulator.html` | Fogyasztási bizonytalanság alsó–közép–felső költségforgatókönyvvel. |
| `auto-fogyasztas-kalkulator.html` | Több tankolásból helyesen súlyozott összesített fogyasztás. |
| `hatotav-kalkulator.html` | Matematikai maximum és biztonsági tartalékkal tervezhető hatótáv szétválasztása. |
| `eves-auto-koltseg-kalkulator.html` | Cashflow, időszakos céltartalék és nem készpénzes értékvesztés elkülönítése. |
| `auto-ertekvesztes-kalkulator.html` | Csökkenő bázis, piaci ugrások, nominális/reálérték és realizált eladási ár értelmezése. |
| `kilometerdij-kalkulator.html` | Üzemanyag-, változó-, teljes- és határköltség Ft/km fogalmak elkülönítése. |
| `co2-kibocsatas-kalkulator.html` | Kipufogó, energia-előállítás és járműgyártás rendszerhatárainak szétválasztása. |
| `tankolas-kalkulator.html` | Literenkénti árengedmény tankolási keretre gyakorolt hatása. |
| `gumi-meret-kalkulator.html` | Geometriai egyezés után felni, ET, index, kerékjárati hely és gyártói jóváhagyás ellenőrzése. |
| `autopalyadij-kalkulator.html` | Felhasználó által megadott aktuális díjakból rövid kontra hosszabb jogosultság nullszaldója. |
| `utazasi-ido-kalkulator.html` | Átlagsebesség-változás valós percnyeresége megállásokkal együtt. |

## Átváltó oldalak

| Oldal | Egyedi fejlesztés |
|---|---|
| `atvaltok.html` | Mennyiségazonosítás → lineáris/négyzetes/köbös/eltolt skála → fogalmi határ döntési útvonal. |
| `homerseklet-atvalto-kalkulator.html` | Abszolút hőmérséklet és hőmérséklet-különbség közti eltérés. |
| `hosszusag-atvalto-kalkulator.html` | Mérési pontosság kontra kijelzett tizedesjegyek. |
| `tomeg-atvalto-kalkulator.html` | Tömeg és súlyerő fogalmi szétválasztása. |
| `terulet-atvalto-kalkulator.html` | Interaktív négyzetes skála: 1 m² = 10 000 cm² logikája. |
| `terfogat-atvalto-kalkulator.html` | Interaktív köbös skála és m³–liter kapcsolat. |
| `ido-atvalto-kalkulator.html` | Időtartam kontra naptári hónap/év és időzóna kérdés. |
| `sebesseg-atvalto-kalkulator.html` | km/h → m/s értelmezése egy- és kétmásodperces megtett távolsággal. |
| `adatmeret-atvalto-kalkulator.html` | bit/byte, decimális/bináris egység és kapacitás/adatsebesség elkülönítése. |
| `deviza-atvalto-kalkulator.html` | Középárfolyam kontra spread/felár/fix díj interaktív hatása. |
| `energia-atvalto-kalkulator.html` | Energia kontra teljesítmény és kWh kontra kW értelmezése. |
| `nyomas-atvalto-kalkulator.html` | Abszolút és gauge/túlnyomás szétválasztása. |
| `teljesitmeny-atvalto-kalkulator.html` | W/kW, metrikus PS/LE és mechanikai hp fogalmi különbségei. |

## People-first elv

A két kategóriában 24 kalkulátor szerepel, de egyik új minőségi modul sem ugyanazt a tartalmi sablont ismétli. Az autós oldalakon a valódi használati döntés és költségértelmezés, az átváltóknál pedig az adott mértékegységre jellemző tipikus fogalmi vagy nagyságrendi hiba a központi elem.

## Frissülő adatok kezelése

Aktuális üzemanyagárat, autópályadíjat, deviza spreadet vagy kibocsátási tényezőt az új réteg nem éget be állandó igazságként. Ahol ilyen adat számít, a felhasználó szerkeszthető bemenetet kap, így az oldal nem válik egy díj- vagy árváltozás után automatikusan pontatlanná.

## Technikai megoldás

- `js/auto-converter-quality-upgrades.js`: két kategóriaoldal + 24 kalkulátor oldalanként eltérő moduljai.
- `css/pages/auto-converter-quality-upgrades.css`: közös vizuális alap a különböző szerkezetű modulokhoz.
- `js/global-head.js`: csak az autós/átváltó kategóriaoldalakon és a 24 érintett kalkulátoron tölti be az új réteget.
- A meglévő `js/auto-converter-upgrades.js` haladó kalkulátorait nem írja felül; az új csomag ezekhez külön értelmezési és döntési pluszt ad.
