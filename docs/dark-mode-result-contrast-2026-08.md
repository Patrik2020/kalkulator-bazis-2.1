# Dark mode eredmény-kontraszt regresszió – 2026-08

## Tünet

Kézi sötét témában egyes dinamikusan hozzáadott kalkulátor-eredményfelületek világos háttérrel, de a sötét témából örökölt világos szöveggel jelentek meg. A konkrét észlelt eset az Üzemanyagköltség kalkulátor „Útiköltség- és érzékenységkalkulátor” paneljének `.ac-result` eleme volt.

## Gyökérok

Az upgrade CSS-ek több helyen `var(--soft-bg, #f3f4f6)` vagy hasonló világos fallbacket használtak, miközben a globális téma nem definiálta a `--soft-bg` kompatibilitási aliast. Kézi `data-theme="dark"` váltásnál emiatt a háttér világos fallbackre esett, a szöveg viszont világos dark-theme színt örökölt.

Hasonló minta szerepelt az everyday és priority upgrade eredményfelületeiben is.

## Védelem

- a közös dark-mode hardening definiálja a régi/upgrade aliasokat (`--soft-bg`, `--muted-text`, `--primary-color`);
- a dinamikus eredményfelületek explicit `data-theme="dark"` felület- és szövegszínt kapnak;
- a priority note/warning/source elemek kézi témaváltásra is külön dark szabályt kapnak;
- a theme regression audit blokkolja a szükséges aliasok vagy célzott dark szelektorok későbbi eltűnését.

A regresszióteszt célja, hogy a sötét téma ne csak a fő `.result-box` komponensnél, hanem a később hozzáadott upgrade modulok eredményeinél is konzisztens maradjon.
