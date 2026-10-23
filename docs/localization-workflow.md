# HU / EN / DE fordítási munkafolyamat

## Közös alap

A `localization-progress.md` a követett HTML-oldalakból és a fordítási modulokból generált nyilvántartás. Frissítés: `node scripts/localization-inventory.js --write`. A CI jelzi az elavult listát. A kész részletes oldalak a `scripts/localization-manifest.js` fájlban szerepelnek. Új oldal csak nyelvi átnézés és célzott böngészős számítási teszt után kerülhet ide.

A `data/localization-glossary.json` az azonos jelentésű kalkulátorcímek és közös feliratok ellenőrzött EN/DE szótára. A teszt a tényleges fordítók kimenetét ellenőrzi; eltérés esetén a jelentést és a szövegkörnyezetet kell tisztázni. Azonos magyar szó különböző jelentéseit nem szabad automatikusan összemosni. A szótár fokozatosan bővülhet a tematikus csomagokkal.

## Csomagolás és minőség

1. Rokon témájú aktív oldalakat válassz. Gyűjtsd össze a magyarázatokat, űrlapokat, példákat, GYIK-et, kapcsolódó ajánlókat, akadálymentes feliratokat, eredményeket és hibaüzeneteket.
2. Használd az adott témához tartozó meglévő fordítómodult. Fogalmazz természetesen angolul és németül; németül következetesen tegező stílusban. A magyarországi pénznem, adózási és jogi környezet maradjon egyértelmű. A fordítás ne változtasson képletet, százalékot vagy mértékegységet. Egy téves forráspéldát külön ellenőrzés alapján javíts.
3. Ellenőrizd a teljes bekezdéseket is, különösen a több HTML-csomópontból összerakott mondatokat. A gépi egyezésvizsgálat nem bizonyít nyelvi minőséget.
4. Futtasd a célzott HU/EN/DE böngészős ellenőrzést mobilon és asztali méretben. Vizsgáld a számításokat, hibás bemenetet, nyelvmegőrzést navigációkor, felhasználói adatok megmaradását, magyarra visszaváltást és túlcsordulást.
5. Frissítsd az eszközverziókat, a tartalomalapú sitemapet és a fordítási nyilvántartást. A teljes kötelező CI a végleges csomagon fusson le, és csak sikeres ellenőrzés után legyen egyesítés. Az éles változatot is ellenőrizd.

## A lefedettségvizsgálat határai

A böngészős főtartalom-ellenőrzés összeveti a magyar szövegeket az EN/DE állapottal, beleértve a bezárt GYIK válaszait és az `aria-label`, `placeholder`, `title` attribútumokat. Nem pusztán ékezeteket keres. A már ellenőrzött oldalon megmaradt magyar szöveg hibát jelez. Csak a valóban nyelvfüggetlen márkanevek, számok, egységek, illetve a szótárban szándékosan azonos fordítások kivételek.

Ez az alapállapot főtartalmának ellenőrzése. A később megjelenő eredményekhez és hibákhoz külön célzott tesztek szükségesek. Az oldalfej, lábléc és sütifelület saját közös tesztet kap. A metaadatok, strukturált adatok, nyelvi URL-ek és keresőoptimalizálás külön végellenőrzési feladatok; ezekre a részletes tartalom kész státusza nem tesz teljesítési ígéretet.

A 13 kivezetett kalkulátort ne számítsd az aktív fordítási hátralékhoz, és ne töröld automatikusan. Az egyéb oldalak állapota tartalmi felmérést jelent, nem azt, hogy minden szövegük fordítatlan.
