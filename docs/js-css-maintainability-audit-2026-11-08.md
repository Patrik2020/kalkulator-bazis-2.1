# Kalkulátor Bázis 2.1 – JavaScript/CSS fenntarthatósági audit (3/8)

**Dátum:** 2026-11-08. **Kiinduló main:** f0589f988743deb83669adb693fd862f031e2e7a.  
**Módszer:** GitHubon ellenőrzött statikus forrás, konfiguráció és célzott kódútvonalak; külön, ismételhető, csak olvasó JS/CSS-leltár és izolált egységtesztek. **Nem teljes böngészős regressziós bizonyítás és nem automatikus törlési lista.**

Kapcsolódó: [kötelező fejlesztési szabályok](engineering-development-contract.md), [2. lépés függőségtérképe](dependency-map-2026-11-08.md) (a #362 PR-ben, a felméréskor még nem volt mergelve).

## Felső vezetői megállapítás

**A rétegezés bizonyítható, de nem minden réteg hibás.** Például a főoldali CSS-ben korábbi, már nem létező különálló képekre mutató szabályokat később új, meglévő képatlaszokra mutató, erősebb szabályok írják felül. Több kalkulátorhoz egyszerre két, utólagos UI-modul van hozzárendelve. Ezeket a működés veszélyeztetése nélkül, célzott regresszió mellett lehet rendezni.

A meglévő vizsgálati kapuk értékesek: a CSS-szerződés már figyeli a főoldali stíluslapokat, a JS-szkópok és a globális head ellenőrzöttek. Nem indokolt tömeges, ellenőrizetlen újraírás.

## Bizonyítékok és besorolás

### JCSS-01 – Régi képhivatkozások új CSS-atlasszal elfedve
**Tények:** css/pages/home-redesign-v17.css 194–209. sorában szezononként négy külön AVIF és kategóriánként hat külön AVIF fájl hivatkozása van. A main Git tree-ben ezek hiányoznak. Az ugyanazon fájl 245–268. sora létező season-atlas.avif és category-atlas.avif fájlokat állít be **!important** szabállyal a .home-redesign-v17 osztályú főoldalhoz. A főoldal index.html body eleme valóban viseli ezt az osztályt. **Ez konkrét bizonyíték a régi kódot későbbi felülírással elfedő megoldásra.**
**Értékelés:** magas tisztítási prioritás; aktuális látogatói hiba nem bizonyított.
**Biztonságos tisztítás:** ellenőrzés valamennyi évszakra, kategóriára, mobil és asztali nézetre, kép-404-re, screenshot referenciára; utána csak a bizonyítottan leváltott képreferencia- és háttérszabályok eltávolítása, a szín- és szezon-tokenek megőrzése mellett.

### JCSS-02 – Párhuzamos kalkulátor-kiegészítő modulok
**Tények:** js/global-head-config.js nyolc slugFeature családot definiál. Összesen 78 különböző oldal-slug szerepel; ebből **54 slug két funkciócsaládot** kap. Példa: hitelkepesseg-kalkulator egyszerre tölti a priority-upgrades.js és finance-quality-upgrades.js JS/CSS párt. A priority-upgrades.js 75–153. sorában saját JTM-alapú hitelteherbírási/stressz számító panel és eseménykezelők vannak, a finance-quality-upgrades.js 103–150. sorában külön JTM összehasonlító panel és saját számítás/figyelők. Más modellkérdéseket is vizsgálnak, tehát a kettő **nem bizonyítottan ugyanazt számolja**, de a funkcionális átfedés valós.
**Értékelés:** magas vizsgálati prioritás; önmagában nem igazolt bug vagy duplán regisztrált azonos callback.
**Biztonságos tisztítás:** oldalpáronként funkciógazda-, input-, eredmény- és eseménykezelő-térkép; a két JTM panel értékének termékoldali megítélése; ugyanazon feladat indokolatlanul duplikált logikájának összevonása, matematikai referenciatesztek és valós böngészőellenőrzés után.

### JCSS-03 – A főoldalhoz továbbra is betöltött régi vizuális CSS
**Tények:** index.html betölti a css/pages/index.css fájlt (29759 bájt), valamint a css/pages/home-redesign-v17.css fájlt (77643 bájt). Az index.css 68 különböző, egyszerű reguláris kifejezéssel kigyűjtött osztályjelölője közül **64 nem található a jelenlegi index.html statikus class attribútumaiban**. Tipikus régi osztály: .home-hero, .home-hero-layout. Az új HTML ehelyett .hero és .hero-grid elemeket használ. A CSS egy része JavaScript által létrehozott vagy fallback DOM-hoz tartozhat, így a 64 jelölő **nem 64 bizonyítottan felesleges szelektor**.
**Értékelés:** közepes-magas vizsgálati prioritás, különösen a főoldali CSS terjedelem és örökség szempontjából.
**Biztonságos tisztítás:** runtime DOM-, fallback/recovery- és képernyőméret-vizsgálat; a ténylegesen aktív és csak korábbi főoldalhoz tartozó stílusok szétválasztása. Ne töröljük vakon az egész index.css-t!

### JCSS-04 – Régi évszakos stílusok potenciálisan felesleges betöltése
**Tények:** a js/theme.js 20–79. sora a css/seasonal-theme.css-t feltétel nélkül betölti. Ez a 15527 bájtos CSS többnyire a .home-professional és .home-hero régi szerkezetre hivatkozik; a jelenlegi index.html body: home-page home-redesign-v17. A home-current.js fallback ág akár a régi style linket is eltávolítja, miközben más általános évszakszabályok lehetnek aktívak.
**Értékelés:** közepes vizsgálati prioritás. A season CSS **nem nyilvánítható teljesen feleslegesnek**, mert általános body és szezonváltozó szabályokat is tartalmaz.
**Biztonságos tisztítás:** compute-style diff a négy évszak és dark/light mellett; kizárólag bizonyítottan használt általános tokenek tartása, régi célosztályok és betöltés optimalizálása.

### JCSS-05 – Konkrét örökségkód a nettó–bruttó kalkulátornál
**Tények:** a js/penzugyi/netto-brutto.js 8–30. sorának upgradeFamilyFields függvénye a korábbi #family mező meglétét ellenőrzi. A jelenlegi kalkulatorok/netto-brutto-kalkulator.html már eleve #family-dependants és #family-eligible mezőkkel rendelkezik. A vizsgált aktuális oldalon a függvény korán visszatér. **Fontos:** a fájl 77–81. sora betölti az aktív netto-brutto-shadow.js API-klienst, amely nem törölhető a régi családmező-adapterrel együtt.
**Értékelés:** közepes, kis kockázattal izolálható jelölt.
**Biztonságos tisztítás:** minden legacy HTML/generátor hivatkozás ellenőrzése; eltartottak-számítása és hibás inputok HU/EN/DE regressziója után csak a bizonyítottan szükségtelen adapter törlése.

### JCSS-06 – Közvetlen statikus hivatkozás nélküli, de nem feltétlenül elavult fájlok
**Tények:** a #362 statikus függőségszkenner három vizsgálati jelöltet talált: css/components/site-compatibility.css, css/pages/site-quality-final.css és js/site-compatibility.js. A js/site-quality-final.js fájlt viszont a scripts/quality-3-audit.js explicit felsorolja; annak hiányzó böngészős betöltéséből nem szabad használatlanságra következtetni.
**Értékelés:** alacsony-közepes. A fájlok törléséről nincs bizonyíték.
**Biztonságos tisztítás:** teljes szöveges és generátorfüggőségi gráf; CI, biztonsági fallback és kézi diagnosztikai szerep ellenőrzése; csak utána törlési döntés.

### JCSS-07 – Ismétlődő CSS-szelektorok és !important koncentráció
**Tények:** a css/pages/home-redesign-v17.css forrásban **362 !important előfordulás** és egy egyszerű szöveges parserrel **143 többször előforduló szelektorjelölt** azonosítható. Példák: .hero-grid, .hero, .salary-live-card. Az eltérő media query, állapot és CSS sorrend miatt ez **nem 143 bizonyított ütközés**. A meglévő home-css-contract-audit korábbi CI-futásban dokumentált kivételként kezelte a 362-t.
**Értékelés:** közepes-magas karbantarthatósági kockázat, de nem igazolt működési incidens.
**Biztonságos tisztítás:** AST/cascade-szintű elemzés, selector + media scope + property összevetés; kulcsfontosságú viewport és akadálymentességi vizuális regresszió.

## Ellenpéldák: amit NEM szabad tévesen duplikációnak mondani

- A js/theme.js egy közös KB_THEME állapotkezelő API-t biztosít. A home-redesign-core.js ennek set metódusát hívja, tehát nem bizonyítottan két egymástól független témavezérlő.
- A js/help-widget.js a kalkulátoroldali segítség-UI-t létrehozza, a js/home-redesign-help.js pedig a főoldalon már létező panelt működteti. A hasonló név itt **külön oldal-specifikus felelősség** is lehet.
- A nyolc feature-modul statikusan definiált id attribútumai között a célzott forrásvizsgálat során nem találtunk azonos literális ID-t **két külön modul között**. Ez nem zárja ki a generált vagy runtime DOM-ütközést.

## Megismételhető ellenőrző

Új, csak olvasó statikus szkenner:
- scripts/js-css-maintainability-audit.js
- scripts/js-css-maintainability-audit.test.js
- .github/workflows/js-css-maintainability.yml

A szkenner valamennyi követett js/*.js és css/*.css fájlt bejárja, és hivatkozás- valamint struktúra-jelölteket jelent; nem módosít, nem töröl, nem bélyegez halott kódnak semmit. A workflow csak releváns JS/CSS/főoldali vagy auditkód-változásnál fut, és **nem buktatja a CI-t a korábbi ismert technikai adósság puszta megléte miatt**. Az új parser hibája vagy regressziós tesztje valódi hiba.

A szkenner szelektorismétlési eredményei egyszerű heurisztikák, nem helyettesítik a böngésző CSS cascade- és JavaScript-állapot vizsgálatát.

## Javasolt javítási sorrend (nem része ennek a PR-nek)

| Sorrend | Tétel | Külön PR célja | Minimum védőteszt |
| --- | --- | --- | --- |
| 1 | JCSS-05 | Elavult bérkalkulátor UI-adapter kiváltásának ellenőrzése | HU/EN/DE bér UI + API referencia és form input |
| 2 | JCSS-01 | Régi CSS képútvonalak és azokat elfedő réteg egyesítése | Mobil/desktop, 4 évszak, 6 kategória, képek 200 |
| 3 | JCSS-02 | Hitelképességi dupla JTM panel szakmai és UX összevetése | Különböző JTM küszöbök, inputok, számítási invariánsok |
| 4 | JCSS-03/04 | Régi főoldali/seasonális CSS-szerkezet célzott tisztítása | Oldal- és fallback DOM, világos/sötét, akadálymentes, viewport |
| 5 | JCSS-06/07 | További jelöltek és CSS cascade konszolidációja | Fájlhasználati gráf, összehasonlító screenshot, CI |

## Ellenőrzési státusz

A fenti megállapítások **statikus forrásvizsgálatból** származnak. Nem futott külön e felméréshez egy teljes helyi npm ci, Chrome visual QA vagy élő production kéréssorozat. Az új audit workflow és tesztek végrehajtási eredményét a PR GitHub Actions ellenőrzése fogja igazolni; zöld ellenőrzés nélkül nem állítjuk a készletet validáltnak. A meglévő weboldal HTML, JS, CSS, számításai és hirdetései ebben a PR-ben **változatlanok maradnak**.
