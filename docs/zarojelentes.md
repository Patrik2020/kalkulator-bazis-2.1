# Kalkulátor Bázis – zárójelentés

Készült: 2026-06-21

## Kiinduló audit

- `docs/projekt-audit-kezdeti.md`: a módosítások előtti, 90 nyilvános HTML-oldalra kiterjedő audit.
- `docs/projekt-audit.md`: újrafuttatható aktuális audit, jelenleg 0 fájlszintű HTML/SEO/tartalmi hibával.
- A kezdeti állapotban 54 generált SEO/GYIK blokk, 90 hiányzó statikus AdSense head-script és 6 darab 500 KB-nál nagyobb helyi erőforrás volt.

## Tartalmi módosítások

### Egyedi kalkulátortartalom

Az alábbi oldalak generikus, ismétlődő cikk- és GYIK-blokkja kalkulátorspecifikus magyarázatra cserélődött. Mindegyik saját használati helyzetet, eredményértelmezést, korlátot és két releváns kérdést kapott:

- `kalkulatorok/adatmeret-atvalto-kalkulator.html` – GB/GiB és 1000/1024 közötti különbség.
- `kalkulatorok/alvasciklus-kalkulator.html` – ciklushossz, elalvási idő és alvászavar korlátai.
- `kalkulatorok/arany-kalkulator.html` – arány, százalék és felosztás különbsége.
- `kalkulatorok/ar-kedvezmeny-kalkulator.html` – egymás utáni kedvezmények és valós megtakarítás.
- `kalkulatorok/atlag-kalkulator.html` – átlag, medián, szélsőérték és súlyozás.
- `kalkulatorok/auto-ertekvesztes-kalkulator.html` – piaci érték, infláció és járműállapot.
- `kalkulatorok/auto-kalkulator.html` – fogyasztás, útiköltség és hatótáv eltérő szerepe.
- `kalkulatorok/autopalyadij-kalkulator.html` – járműkategória, érvényesség és hivatalos díjtábla.
- `kalkulatorok/bmr-kalkulator.html` – alapanyagcsere és napi energiaszükséglet különbsége.
- `kalkulatorok/borravalo-kalkulator.html` – szervizdíj és csoportos számlamegosztás.
- `kalkulatorok/co2-kibocsatas-kalkulator.html` – közvetlen kibocsátás és életciklus-korlát.
- `kalkulatorok/csempe-kalkulator.html` – lapkiosztás, vágási veszteség és gyártási tétel.
- `kalkulatorok/datum-kulonbseg-kalkulator.html` – kezdőnap, zárónap, szökőév és időzóna.
- `kalkulatorok/derek-csipo-kalkulator.html` – helyes mérés és egészségügyi korlát.
- `kalkulatorok/egysegar-kalkulator.html` – nettó mennyiség, kiszerelés és pazarlás.
- `kalkulatorok/eletkor-kalkulator.html` – betöltött életkor és születésnapi logika.
- `kalkulatorok/energia-atvalto-kalkulator.html` – energia és teljesítmény elkülönítése.
- `kalkulatorok/eves-auto-koltseg-kalkulator.html` – fix, változó és ritka évesített kiadások.
- `kalkulatorok/feherje-szukseglet-kalkulator.html` – aktivitás, cél és egészségügyi kivételek.
- `kalkulatorok/fizetesi-hatarido-kalkulator.html` – naptári/munkanap és jogi korlát.
- `kalkulatorok/fuga-kalkulator.html` – hézaggeometria, veszteség és gyártói kiadósság.
- `kalkulatorok/gipszkarton-kalkulator.html` – rétegszám, kétoldali burkolás és kiegészítők.
- `kalkulatorok/gumi-meret-kalkulator.html` – külső átmérő, indexek és homologizáció.
- `kalkulatorok/hatotav-kalkulator.html` – biztonsági tartalék és használható tankmennyiség.
- `kalkulatorok/havi-koltsegvetes-kalkulator.html` – ritka kiadások havi bontása és cash-flow.
- `kalkulatorok/hitelkepesseg-kalkulator.html` – JTM, banki előminősítés és biztonsági tartalék.
- `kalkulatorok/homerseklet-atvalto-kalkulator.html` – skálák nullapontja és Kelvin-jelölés.
- `kalkulatorok/hoszigeteles-kalkulator.html` – csomagszám és energetikai rétegrend különbsége.
- `kalkulatorok/hosszusag-atvalto-kalkulator.html` – mérési pontosság és col/hüvelyk.
- `kalkulatorok/idealis-testsuly-kalkulator.html` – képlettartomány és egyéni különbségek.
- `kalkulatorok/ido-atvalto-kalkulator.html` – időtartam, naptár és időzóna különbsége.
- `kalkulatorok/kilometerdij-kalkulator.html` – teljes járműköltség és elszámolási szabály.
- `kalkulatorok/makro-kalkulator.html` – makrók energiatartalma és étrendminőség.
- `kalkulatorok/munkaido-kalkulator.html` – éjféli műszak, szünet és túlóra korlátai.
- `kalkulatorok/nyomas-atvalto-kalkulator.html` – abszolút nyomás és túlnyomás.
- `kalkulatorok/oraber-kalkulator.html` – bruttó/nettó és számlázható idő.
- `kalkulatorok/padlo-burkolat-kalkulator.html` – csomagra kerekítés, lerakási irány és tartalék.
- `kalkulatorok/pulzus-zona-kalkulator.html` – képlet, gyógyszerek és mérési eltérés.
- `kalkulatorok/rezsi-megosztas-kalkulator.html` – alapdíj, fogyasztás és súlyozott felosztás.
- `kalkulatorok/sebesseg-atvalto-kalkulator.html` – időalap, csomó és menetidő különbsége.
- `kalkulatorok/szamla-teljesites-kalkulator.html` – teljesítés, fizetési határidő és speciális adózási helyzet.
- `kalkulatorok/tankolas-kalkulator.html` – tele tankos mérés és több tankolás átlaga.
- `kalkulatorok/tapeta-kalkulator.html` – csíkszám, rapport és nyílások.
- `kalkulatorok/teljesitmeny-atvalto-kalkulator.html` – watt, lóerő és energiafogyasztás különbsége.
- `kalkulatorok/terfogat-atvalto-kalkulator.html` – térfogat, tömeg és sűrűség.
- `kalkulatorok/terhessegi-kalkulator.html` – utolsó menstruáció, ultrahang és orvosi korlát.
- `kalkulatorok/terkovezes-kalkulator.html` – vágási tartalék, alapréteg és vízelvezetés.
- `kalkulatorok/terulet-atvalto-kalkulator.html` – négyzetes váltószám és ingatlanfogalmak.
- `kalkulatorok/testzsir-kalkulator.html` – módszerek közötti eltérés és trendkövetés.
- `kalkulatorok/tetocserep-kalkulator.html` – ferde tetőfelület, kiegészítők és tartalék.
- `kalkulatorok/tomeg-atvalto-kalkulator.html` – tömeg/súly és liter/kilogramm különbsége.
- `kalkulatorok/utazasi-ido-kalkulator.html` – átlagsebesség, megállások és időzóna.
- `kalkulatorok/vakolat-kalkulator.html` – rétegvastagság, nyíláskávák és termékkiadósság.
- `kalkulatorok/vizfogyasztas-kalkulator.html` – aktivitás, hőség és egészségi kivételek.

### Összevont tartalmi blokkok

Az alábbi oldalakon a hosszú régi cikk és a később hozzáadott második SEO-blokk helyett egyetlen, 240–315 szavas, példát, korlátot, GYIK-et és kapcsolódó linkeket tartalmazó blokk maradt:

- `kalkulatorok/festek-kalkulator.html`
- `kalkulatorok/tegla-kalkulator.html`
- `kalkulatorok/szazalek-kalkulator.html`
- `kalkulatorok/afa-kalkulator.html`
- `kalkulatorok/osztalek-kalkulator.html`
- `kalkulatorok/kamatos-kamat-kalkulator.html`
- `kalkulatorok/hitel-torleszto-kalkulator.html`
- `kalkulatorok/milliomos-kalkulator.html`
- `kalkulatorok/auto-fogyasztas-kalkulator.html`
- `kalkulatorok/uzemanyag-koltseg-kalkulator.html`

Az automatikus kapcsolódó blokk már nem jelenik meg ott, ahol kézzel válogatott `.related-links` lista található.

### Kategóriaoldalak

- `penzugyi.html` – jövedelem → költségvetés → hitel → megtakarítás döntési sorrend.
- `epitoipari.html` – négylépéses mérési és rendelési ellenőrzőlista.
- `egeszseg.html` – trendkövetés/tervezés kétoszlopos szerkezet és külön egészségügyi figyelmeztetés.
- `mindennapi.html` – élethelyzetek szerint rendezett használati lista.
- `auto.html` – indulás előtti, tankolás utáni, éves és autóválasztási folyamat.
- `atvaltok.html` – definíciós lista fizikai, műszaki, digitális és pénzügyi egységcsoportokkal.
- `js/site-data.js` – a hat központi kategórialeírás és keresési alias egyedivé vált.

## Főoldal

- `index.html` – új sorrend: kompakt hero és kereső, kategóriák, népszerű kalkulátorok, pénzügyi alapozó, bizalmi sáv, rövid bemutatkozás, GYIK, partnerbanner, hirdetési hely.
- `css/pages/index.css` – mobile-first főoldali rendszer 320 px-től, stabil kártyaméretekkel és túlméretezett szöveg nélkül.
- `css/components/site-sections.css` – kereső, tartalmi elrendezések, kategória-specifikus listák és egyedi kalkulátorcikk-szerkezetek.
- `js/site-ui.js` – ékezet nélküli és rokon kulcsszavas keresés, találatrangsor, maximum 10 találat, üres állapot, nyílbillentyű, Enter, Escape és ARIA combobox állapot.

## Technikai módosítások

### Logó

- `landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html`
- `landing-pages/penzugyi-tudatossag/css/penzugyi-tudatossag.css`

A szöveges kék KB négyzet helyére a közös `favicon/kb-logo-mark.png` került 34×34 px-es, torzításmentes megjelenítéssel.

### AdSense

- Hozzáadva: mind a 90 nyilvános HTML-oldal `<head>` részéhez.
- Már jelen volt a kezdeti auditkor: 0 fájl.
- Duplikált volt: 0 fájl.
- Body részből kellett áthelyezni: 0 fájl.
- Végállapot: mind a 90 oldalon pontosan 1 példány, a `ca-pub-2639795157074812` azonosító változtatása nélkül.
- A kézi hirdetési helyek és a cookie-döntéshez kötött hirdetés-inicializálás nem változott.

### HTML és SEO

- Mind a 90 nyilvános oldalon egyedi title, meta description, egy H1, canonical és Open Graph cím/leírás található.
- 87 oldal kapott hiányzó Open Graph metaadatot.
- 8 oldal kapott hiányzó canonical URL-t.
- `adatvedelem.html`, `cookie.html`, `felhasznalasi-feltetelek.html` egyedi meta descriptiont kapott.
- A 404 oldal `noindex, follow` maradt, és nem került a sitemapbe.
- `sitemap.xml` 89 indexelhető URL-t tartalmaz, beleértve mindkét landinget és a négy Wise tájékoztató oldalt.
- A nem látható generikus kérdéseket állító dinamikus FAQPage schema eltűnt; a pénzügyi landing látható tartalmához illeszkedő Article schema maradt.

### Akadálymentesség és működés

- `components/header.html`, `js/utils.js` – helyes mobilmenü `aria-expanded`, dinamikus címke, Escape-zárás és linkkattintás utáni bezárás.
- `js/site-ui.js` – natív details GYIK-ekből egyszerre legfeljebb egy nyitott; kereső billentyűzettel kezelhető.
- `landing-pages/wise/js/wise.js`, `landing-pages/penzugyi-tudatossag/js/penzugyi-tudatossag.js` – landing GYIK-ek egyszerre egy nyitott elemmel.
- 115 statikus űrlapfelirat kapcsolódott technikailag a mezőjéhez; 0 címke nélküli vezérlő maradt.
- `css/style.css`, mindkét landing CSS – látható focus-visible állapot és reduced-motion támogatás.

### CSS és erőforrások

- `css/style.css` – a nem használt régi főoldali highlight és SEO-details komponens eltávolítva.
- `css/components/buttons.css` – hibás, nem létező `#decline-button` szabály eltávolítva.
- `css/components/cards.css` – H2/H3 kártyacímek egységesítve, WebP kategóriaképek bekötve.
- `css/components/images/*.webp` – öt kategóriakép összesen körülbelül 25 KB.
- A korábbi öt, összesen több mint 8 MB-os PNG eltávolítva.
- `images/kalkulator-bazis-og.jpg` – 1536×1024/578 KB-ról 1200×800/204 KB körüli optimalizált JPEG-re csökkent.

### Karbantartó scriptek

- `scripts/audit-site.js` – fájlonkénti audit és jelentés.
- `scripts/refine-content.js` – egyedi tartalmi katalógus és biztonságos összevonások.
- `scripts/normalize-adsense.js` – pontosan egy head-script biztosítása.
- `scripts/normalize-heads.js` – meta, canonical, OG és global-head normalizálás.
- `scripts/normalize-form-labels.js` – űrlapfelirat-kapcsolatok ellenőrzése és javítása.
- `scripts/browser-qa.js` – függőségmentes Chrome/CDP reszponzív és működési teszt.
- `scripts/rebuild-site.js` – a régi, generikus tartalmat visszaíró működés helyett idempotens karbantartó orchestrátor.
- `scripts/generate-sitemap.js` – a Wise jogi oldalakkal bővített 89 URL-es sitemap.

## Nem módosított elemek

- Egyetlen kalkulátor számítási képlete vagy számítási JavaScriptje sem változott.
- Egyetlen meglévő URL vagy HTML-fájlnév sem változott.
- A Wise ajánlói azonosító `camref:1100l5Km25` és a kreatívazonosítók változatlanok.
- A publisher ID, a kézi hirdetési helyek és a cookie-hozzájárulás döntési logikája változatlan.
- Nem történt keretrendszercsere vagy külső futásidejű függőség hozzáadása.
- A CSS-ben talált, külön oldalakhoz tartozó hasonló deklarációkat nem vontuk össze vakon, mert ez széles vizuális regressziót okozhatott volna.

## Tesztelés

- 90/90 nyilvános HTML-oldal HTTP 200 státusszal betöltött a helyi szerveren.
- 0 hibás helyi href/src hivatkozás.
- 0 JavaScript szintaktikai hiba.
- 0 CSS kapcsoszáró-egyensúly hiba.
- 0 main/section/details nyitó-záró eltérés.
- 0 duplikált/missing AdSense script.
- 0 aktuális auditprobléma.
- 60 Chrome/CDP layoutteszt: 10 fontos oldal × 6 szélesség (320, 375, 390, 768, 1024, 1440 px).
- 0 vízszintes túlcsordulás vagy kilógó látható elem.
- 0 saját konzolhiba.
- Kereső: ékezet nélküli „epitoanyag”, rangsorolt „etf”, üres találat, nyílbillentyű és Enter navigáció ellenőrizve.
- Mobilmenü: főoldal, Wise landing és pénzügyi tudatosság landing nyitás/ESC-zárás ellenőrizve.
- GYIK: főoldal és mindkét landing egyszerre egy nyitott elemmel működik.
- Cookie banner: megjelenés, elutasítás, localStorage-mentés és eltűnés ellenőrizve.
- Kalkulátorpróba: nettó–bruttó, beton, BMI, százalék, autófogyasztás, hosszúság-átváltó, kamatos kamat és milliomos kalkulátor valós eredményt adott.

## Ismert maradványkockázat

- A Wise banner, AdSense és Analytics külső szolgáltatás; elérhetőségük és böngészőkonzol-üzeneteik a külső hálózattól és szolgáltatói kódtól is függhetnek.
- Az automatizált audit nem helyettesít jogi, adózási, orvosi vagy statikai szakmai felülvizsgálatot.
