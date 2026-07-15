# Kalkulátor Bázis – AdSense és EEAT minőségi audit

Készült: 2026-07-15

## Módszer

- Ez statikus, értékalapú audit: nem garantál AdSense-elfogadást és nem helyettesíti a böngészős, mobilos, PageSpeed vagy Search Console ellenőrzést.
- A közös `site-ui.js` által renderelt kalkulátoroldali hitelességi blokkot és dinamikus strukturált adatot külön figyelembe veszi, mert ezek a betöltött oldalon ténylegesen megjelennek.
- A `priority-upgrades.js` által betöltött szakmai kalkulátorbővítéseket is figyelembe veszi forrás-, módszertani és korlátjelként, mert ezek nem opcionális hirdetési elemek, hanem a felhasználónak megjelenő tartalmi modulok.
- A pontszám a dokumentált minőségi jeleket méri: metaadatok, canonical, H1, strukturált adat, saját tartalmi mélység, módszertan, forrás, GYIK, szerzői/bizalmi jel, belső linkek, hirdetési és affiliate arány.
- A szószám csak egy jel. Rövid, de pontos tájékoztató oldal nem kap ugyanazt az elvárást, mint egy kalkulátor vagy kategóriaoldal.

## Összesítés

- Vizsgált HTML-oldalak: **97**
- Webhely átlagpontszám: **83/100**
- 90+ pontos oldalak: **27**
- 80 pont alatti oldalak: **27**

## Oldalpontszámok

| Fájl | Típus | Szó | Pontszám | Fő hiányok |
|---|---|---:|---:|---|
| `404.html` | hibaoldal | 48 | 69 | Értékalapú tartalmi mélység; Szerzői vagy üzemeltetői jelzés; Valós frissítési/ellenőrzési jel; Kapcsolat és hibabejelentés |
| `adatvedelem.html` | tájékoztató | 438 | 90 | Strukturált adat jelen van; Kapcsolódó belső útvonalak |
| `atlathatosag-es-minoseg.html` | tartalmi oldal | 554 | 100 | nincs kritikus statikus hiány |
| `atvaltok.html` | kategória | 587 | 92 | Értékalapú tartalmi mélység |
| `auto.html` | kategória | 647 | 92 | Értékalapú tartalmi mélység |
| `cookie.html` | tájékoztató | 269 | 80 | Strukturált adat jelen van; Szerzői vagy üzemeltetői jelzés; Bizalmi/jogi oldalak elérhetők; Kapcsolódó belső útvonalak |
| `egeszseg.html` | kategória | 629 | 92 | Értékalapú tartalmi mélység |
| `epitoipari.html` | kategória | 618 | 92 | Értékalapú tartalmi mélység |
| `felhasznalasi-feltetelek.html` | tájékoztató | 105 | 82 | Strukturált adat jelen van; Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `index.html` | tartalmi oldal | 593 | 86 | Szerzői vagy üzemeltetői jelzés; Kapcsolat és hibabejelentés; Bizalmi/jogi oldalak elérhetők |
| `jogi-nyilatkozat.html` | tájékoztató | 201 | 77 | Strukturált adat jelen van; Értékalapú tartalmi mélység; Szerzői vagy üzemeltetői jelzés; Kapcsolat és hibabejelentés |
| `kalkulatorok.html` | tartalmi oldal | 725 | 80 | Strukturált adat jelen van; Szerzői vagy üzemeltetői jelzés; Kapcsolat és hibabejelentés; Bizalmi/jogi oldalak elérhetők |
| `kalkulatorok/adatmeret-atvalto-kalkulator.html` | kalkulátor | 894 | 78 | Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/afa-kalkulator.html` | kalkulátor | 641 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/alvasciklus-kalkulator.html` | kalkulátor | 483 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/ar-kedvezmeny-kalkulator.html` | kalkulátor | 220 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/arany-kalkulator.html` | kalkulátor | 226 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/atlag-kalkulator.html` | kalkulátor | 244 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/auto-ertekvesztes-kalkulator.html` | kalkulátor | 252 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/auto-fogyasztas-kalkulator.html` | kalkulátor | 242 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/auto-kalkulator.html` | kalkulátor | 338 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/autopalyadij-kalkulator.html` | kalkulátor | 321 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/beton-kalkulator.html` | kalkulátor | 428 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/bmi-kalkulator.html` | kalkulátor | 612 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/bmr-kalkulator.html` | kalkulátor | 460 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/borravalo-kalkulator.html` | kalkulátor | 252 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/co2-kibocsatas-kalkulator.html` | kalkulátor | 262 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/csempe-kalkulator.html` | kalkulátor | 302 | 73 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Példa vagy gyakorlati értelmezés; Gyakori hibák vagy korlátok |
| `kalkulatorok/datum-kulonbseg-kalkulator.html` | kalkulátor | 252 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/derek-csipo-kalkulator.html` | kalkulátor | 443 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/deviza-atvalto-kalkulator.html` | kalkulátor | 965 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/egysegar-kalkulator.html` | kalkulátor | 338 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/eletkor-kalkulator.html` | kalkulátor | 248 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/energia-atvalto-kalkulator.html` | kalkulátor | 236 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/etf-kalkulator.html` | kalkulátor | 926 | 85 | Forrás vagy ellenőrizhető hivatkozási alap; Példa vagy gyakorlati értelmezés; Gyakori hibák vagy korlátok |
| `kalkulatorok/eves-auto-koltseg-kalkulator.html` | kalkulátor | 262 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/feherje-szukseglet-kalkulator.html` | kalkulátor | 496 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/festek-kalkulator.html` | kalkulátor | 351 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/fizetesi-hatarido-kalkulator.html` | kalkulátor | 437 | 83 | Értékalapú tartalmi mélység; Példa vagy gyakorlati értelmezés; Kapcsolódó belső útvonalak |
| `kalkulatorok/fuga-kalkulator.html` | kalkulátor | 318 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/gipszkarton-kalkulator.html` | kalkulátor | 262 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/gumi-meret-kalkulator.html` | kalkulátor | 255 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/hatotav-kalkulator.html` | kalkulátor | 229 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/havi-koltsegvetes-kalkulator.html` | kalkulátor | 608 | 91 | Példa vagy gyakorlati értelmezés; Kapcsolódó belső útvonalak |
| `kalkulatorok/hitel-torleszto-kalkulator.html` | kalkulátor | 675 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/hitelkepesseg-kalkulator.html` | kalkulátor | 574 | 91 | Példa vagy gyakorlati értelmezés; Kapcsolódó belső útvonalak |
| `kalkulatorok/homerseklet-atvalto-kalkulator.html` | kalkulátor | 547 | 80 | Forrás vagy ellenőrizhető hivatkozási alap; Példa vagy gyakorlati értelmezés; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/hoszigeteles-kalkulator.html` | kalkulátor | 318 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/hosszusag-atvalto-kalkulator.html` | kalkulátor | 714 | 91 | Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/idealis-testsuly-kalkulator.html` | kalkulátor | 436 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/ido-atvalto-kalkulator.html` | kalkulátor | 664 | 78 | Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/inflacio-kalkulator.html` | kalkulátor | 950 | 100 | nincs kritikus statikus hiány |
| `kalkulatorok/kaloria-kalkulator.html` | kalkulátor | 557 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/kamatos-kamat-kalkulator.html` | kalkulátor | 622 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/kilometerdij-kalkulator.html` | kalkulátor | 275 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/lakas-hitel-onero-kalkulator.html` | kalkulátor | 749 | 93 | Kapcsolódó belső útvonalak; Nincs sablonos AI/SEO fordulat |
| `kalkulatorok/makro-kalkulator.html` | kalkulátor | 464 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/milliomos-kalkulator.html` | kalkulátor | 553 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/multifunkcios-szamologep.html` | tartalmi oldal | 770 | 86 | Szerzői vagy üzemeltetői jelzés; Kapcsolat és hibabejelentés; Bizalmi/jogi oldalak elérhetők |
| `kalkulatorok/munkaido-kalkulator.html` | kalkulátor | 235 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/netto-brutto-kalkulator.html` | kalkulátor | 558 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/nyomas-atvalto-kalkulator.html` | kalkulátor | 328 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/oraber-kalkulator.html` | kalkulátor | 251 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/osztalek-kalkulator.html` | kalkulátor | 1139 | 89 | Módszertan vagy működési magyarázat; Gyakori hibák vagy korlátok |
| `kalkulatorok/padlo-burkolat-kalkulator.html` | kalkulátor | 322 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/pulzus-zona-kalkulator.html` | kalkulátor | 540 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/rezsi-megosztas-kalkulator.html` | kalkulátor | 309 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/sebesseg-atvalto-kalkulator.html` | kalkulátor | 684 | 89 | Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/szamla-teljesites-kalkulator.html` | kalkulátor | 454 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/szazalek-kalkulator.html` | kalkulátor | 325 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/tankolas-kalkulator.html` | kalkulátor | 461 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/tapeta-kalkulator.html` | kalkulátor | 276 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/tegla-kalkulator.html` | kalkulátor | 357 | 77 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/teljesitmeny-atvalto-kalkulator.html` | kalkulátor | 291 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/terfogat-atvalto-kalkulator.html` | kalkulátor | 651 | 73 | Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Példa vagy gyakorlati értelmezés; Gyakori hibák vagy korlátok |
| `kalkulatorok/terhessegi-kalkulator.html` | kalkulátor | 507 | 95 | Kapcsolódó belső útvonalak |
| `kalkulatorok/terkovezes-kalkulator.html` | kalkulátor | 306 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/terulet-atvalto-kalkulator.html` | kalkulátor | 647 | 73 | Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Példa vagy gyakorlati értelmezés; Gyakori hibák vagy korlátok |
| `kalkulatorok/testzsir-kalkulator.html` | kalkulátor | 465 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/tetocserep-kalkulator.html` | kalkulátor | 241 | 74 | Értékalapú tartalmi mélység; Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/tomeg-atvalto-kalkulator.html` | kalkulátor | 691 | 78 | Módszertan vagy működési magyarázat; Forrás vagy ellenőrizhető hivatkozási alap; Gyakori hibák vagy korlátok; Kapcsolódó belső útvonalak |
| `kalkulatorok/utazasi-ido-kalkulator.html` | kalkulátor | 308 | 88 | Értékalapú tartalmi mélység; Kapcsolódó belső útvonalak |
| `kalkulatorok/uzemanyag-koltseg-kalkulator.html` | kalkulátor | 247 | 86 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap |
| `kalkulatorok/vakolat-kalkulator.html` | kalkulátor | 238 | 81 | Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap; Kapcsolódó belső útvonalak |
| `kalkulatorok/vizfogyasztas-kalkulator.html` | kalkulátor | 544 | 95 | Kapcsolódó belső útvonalak |
| `kapcsolat.html` | tájékoztató | 165 | 73 | Strukturált adat jelen van; Értékalapú tartalmi mélység; Szerzői vagy üzemeltetői jelzés; Bizalmi/jogi oldalak elérhetők |
| `landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html` | landing | 1409 | 90 | GYIK vagy kérdés-válasz tartalom; Szerzői vagy üzemeltetői jelzés |
| `landing-pages/wise/adatkezelesi-tajekoztato.html` | landing | 33 | 48 | Strukturált adat jelen van; Indexelési döntés tiszta; Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap |
| `landing-pages/wise/cookie-tajekoztato.html` | landing | 31 | 48 | Strukturált adat jelen van; Indexelési döntés tiszta; Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap |
| `landing-pages/wise/jogi-nyilatkozat.html` | landing | 33 | 52 | Strukturált adat jelen van; Indexelési döntés tiszta; Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap |
| `landing-pages/wise/kapcsolat.html` | landing | 29 | 48 | Strukturált adat jelen van; Indexelési döntés tiszta; Értékalapú tartalmi mélység; Forrás vagy ellenőrizhető hivatkozási alap |
| `landing-pages/wise/wise.html` | landing | 1055 | 95 | Szerzői vagy üzemeltetői jelzés |
| `miert-bizhatsz-bennunk.html` | tartalmi oldal | 581 | 95 | Szerzői vagy üzemeltetői jelzés |
| `mindennapi.html` | kategória | 630 | 92 | Értékalapú tartalmi mélység |
| `penzugyi.html` | kategória | 691 | 92 | Értékalapú tartalmi mélység |
| `rolunk.html` | tartalmi oldal | 260 | 84 | Értékalapú tartalmi mélység; Bizalmi/jogi oldalak elérhetők; Kapcsolódó belső útvonalak |
| `szamitasi-modszertan.html` | tartalmi oldal | 392 | 77 | Strukturált adat jelen van; Értékalapú tartalmi mélység; Szerzői vagy üzemeltetői jelzés; Kapcsolódó belső útvonalak |

## 80 pont alatti oldalak részletei

### `404.html` – 69/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 48; a hibaoldal oldalaknál legalább 80 szónyi saját érték ajánlott.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Valós frissítési/ellenőrzési jel:** Adj látható, valós frissítési vagy ellenőrzési dátumot.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.
- **Bizalmi/jogi oldalak elérhetők:** Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `jogi-nyilatkozat.html` – 77/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 201; a tájékoztató oldalaknál legalább 250 szónyi saját érték ajánlott.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.

### `kalkulatorok/adatmeret-atvalto-kalkulator.html` – 78/100
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/auto-fogyasztas-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 242; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/auto-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 338; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/beton-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 428; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/csempe-kalkulator.html` – 73/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 302; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Példa vagy gyakorlati értelmezés:** Adj legalább egy valós példát vagy eredményértelmezést.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/energia-atvalto-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 236; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/festek-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 351; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/gumi-meret-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 255; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/hoszigeteles-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 318; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/ido-atvalto-kalkulator.html` – 78/100
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/munkaido-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 235; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/padlo-burkolat-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 322; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/szazalek-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 325; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/tegla-kalkulator.html` – 77/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 357; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/teljesitmeny-atvalto-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 291; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/terfogat-atvalto-kalkulator.html` – 73/100
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Példa vagy gyakorlati értelmezés:** Adj legalább egy valós példát vagy eredményértelmezést.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/terulet-atvalto-kalkulator.html` – 73/100
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Példa vagy gyakorlati értelmezés:** Adj legalább egy valós példát vagy eredményértelmezést.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/tetocserep-kalkulator.html` – 74/100
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 241; a kalkulátor oldalaknál legalább 500 szónyi saját érték ajánlott.
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kalkulatorok/tomeg-atvalto-kalkulator.html` – 78/100
- **Módszertan vagy működési magyarázat:** Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **Gyakori hibák vagy korlátok:** Mutasd be, hol tévedhet félre a felhasználó.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `kapcsolat.html` – 73/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 165; a tájékoztató oldalaknál legalább 250 szónyi saját érték ajánlott.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Bizalmi/jogi oldalak elérhetők:** Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `landing-pages/wise/adatkezelesi-tajekoztato.html` – 48/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Indexelési döntés tiszta:** Csak a 404 legyen noindex.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 33; a landing oldalaknál legalább 700 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **GYIK vagy kérdés-válasz tartalom:** Adj oldalspecifikus GYIK-et.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Valós frissítési/ellenőrzési jel:** Adj látható, valós frissítési vagy ellenőrzési dátumot.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.
- **Bizalmi/jogi oldalak elérhetők:** Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `landing-pages/wise/cookie-tajekoztato.html` – 48/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Indexelési döntés tiszta:** Csak a 404 legyen noindex.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 31; a landing oldalaknál legalább 700 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **GYIK vagy kérdés-válasz tartalom:** Adj oldalspecifikus GYIK-et.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Valós frissítési/ellenőrzési jel:** Adj látható, valós frissítési vagy ellenőrzési dátumot.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.
- **Bizalmi/jogi oldalak elérhetők:** Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `landing-pages/wise/jogi-nyilatkozat.html` – 52/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Indexelési döntés tiszta:** Csak a 404 legyen noindex.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 33; a landing oldalaknál legalább 700 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **GYIK vagy kérdés-válasz tartalom:** Adj oldalspecifikus GYIK-et.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Valós frissítési/ellenőrzési jel:** Adj látható, valós frissítési vagy ellenőrzési dátumot.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `landing-pages/wise/kapcsolat.html` – 48/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Indexelési döntés tiszta:** Csak a 404 legyen noindex.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 29; a landing oldalaknál legalább 700 szónyi saját érték ajánlott.
- **Forrás vagy ellenőrizhető hivatkozási alap:** Adj témaspecifikus elsődleges vagy megbízható forrást.
- **GYIK vagy kérdés-válasz tartalom:** Adj oldalspecifikus GYIK-et.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Valós frissítési/ellenőrzési jel:** Adj látható, valós frissítési vagy ellenőrzési dátumot.
- **Kapcsolat és hibabejelentés:** Legyen elérhető hibabejelentési útvonal.
- **Bizalmi/jogi oldalak elérhetők:** Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

### `szamitasi-modszertan.html` – 77/100
- **Strukturált adat jelen van:** Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.
- **Értékalapú tartalmi mélység:** A jelenlegi szószám kb. 392; a tartalmi oldal oldalaknál legalább 450 szónyi saját érték ajánlott.
- **Szerzői vagy üzemeltetői jelzés:** Legyen szerző, üzemeltető vagy projektfelelős jelzés.
- **Kapcsolódó belső útvonalak:** Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket.

