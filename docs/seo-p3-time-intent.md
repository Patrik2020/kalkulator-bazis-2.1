# SEO P3 – időátváltási keresési szándék konszolidáció

## Kiinduló GSC-baseline

Utolsó 28 nap a P3 indításakor:

- `/kalkulatorok/ido-atvalto-kalkulator`: 9 625 megjelenés, 27 kattintás, 0,28% CTR, 6,57 átlagpozíció.
- `/kalkulatorok/mertekegyseg-atvalto-kalkulator`: 107 megjelenés, 1 kattintás, 0,93% CTR, 7,92 átlagpozíció.
- A régi `.html` időátváltó változat csak 108 megjelenést kapott, ezért a fő probléma nem URL-megosztás.

Jellemző lekérdezések: `óra átváltás`, `óra kalkulátor`, `óra számítás`, `óra perc kalkulátor`, `1 óra hány másodperc`, `24 óra hány perc`, `72 óra hány nap`, valamint hónap/év alapú átváltások.

## P3 megoldás

A régi időátváltó már `noindex,follow` és a közös mértékegység-átváltóra canonicalizál, ezért nem kap új önálló indexelhető oldalt.

A konszolidáció helyette:

- a régi extensionless és `.html` URL-t `mertekegyseg-atvalto-kalkulator#ido` célra irányítja;
- `#ido` esetén automatikusan az Idő kategóriát választja;
- időre releváns title/meta/H1 szöveget ad a kanonikus hubnak;
- statikus időátváltási blokkot és látható FAQ-kat materializál;
- megőrzi a régi kalkulátor átlagos hónap- és évfunkcióját (30,436875 illetve 365,2425 nap);
- regresszióteszttel védi a faktorokat, a `#ido` előválasztást és a két 301 szabályt.

## Utómérés

A változás után a következő 28 napos ablakot a fenti baseline-hoz kell hasonlítani. Figyelendő:

1. csökken-e a kivezetett `ido-atvalto-kalkulator` megjelenési részesedése;
2. nő-e a kanonikus `mertekegyseg-atvalto-kalkulator` megjelenése és kattintása az óra/perc/másodperc/nap query-kre;
3. hogyan változik a konszolidált idő-intent CTR-je és átlagpozíciója;
4. nem jelenik-e meg újra `.html` URL-megosztás.

A siker fő jele nem önmagában a régi URL visszaesése, hanem az, hogy a releváns keresési láthatóság a kanonikus hubon jelenik meg.