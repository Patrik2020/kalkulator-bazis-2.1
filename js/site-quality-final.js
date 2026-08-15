(() => {
  "use strict";

  const root = window.KB_PROJECT_ROOT || "";
  let relativePath = window.location.pathname;
  if (root && relativePath.startsWith(root)) relativePath = relativePath.slice(root.length);
  relativePath = relativePath.replace(/^\/+|\/+$/g, "") || "index.html";
  if (!/\.html$/i.test(relativePath) && relativePath !== "index.html") relativePath += ".html";

  const main = document.querySelector("main");
  if (!main || document.querySelector('[data-quality-final="2026-08"]')) return;

  const link = (href, label) => `<a href="${href}">${label}</a>`;
  const cards = (items) => `<div class="sqf-grid">${items.map(([title, text]) => `<article class="sqf-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
  const flow = (items) => `<div class="sqf-flow">${items.map(([title, text]) => `<article class="sqf-step"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
  const matrix = (items) => `<div class="sqf-matrix">${items.map(([a, b]) => `<div>${a}</div><div>${b}</div>`).join("")}</div>`;
  const checklist = (items) => `<ul class="sqf-checklist">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

  const renderers = {
    "index.html": () => `
      <p class="sqf-kicker">Hogyan használd az oldalt?</p>
      <h2>A jó számítás nem az eredménynél ér véget</h2>
      <p>A Kalkulátor Bázis főoldaláról érdemes kérdésből indulni: mit szeretnél eldönteni, melyik adat bizonytalan, és mi változtatná meg a döntésedet? A kalkulátor eredménye ezután ellenőrzési pont, nem önmagában álló válasz.</p>
      ${flow([
        ["Kérdés", "Fogalmazd meg, mire keresel választ: havi teher, anyagmennyiség, idő, arány vagy becslés."],
        ["Bemenet", "Ellenőrizd a mértékegységet, időszakot, árat, százalékot és az esetleges alapfeltételezést."],
        ["Eredmény", "Nézd meg a magyarázatot, a kerekítést, a korlátot és azt, mit nem tartalmaz a számítás."],
        ["Döntés", "Nagy összegnél, egészségügyi, jogi vagy műszaki kockázatnál ellenőrizd hivatalos vagy szakmai forrásból is."]
      ])}
      <div class="sqf-note"><strong>Minőségi útvonal:</strong> ${link(`${root}/miert-bizhatsz-bennunk.html`, "bizalmi elvek")} · ${link(`${root}/szamitasi-modszertan.html`, "számítási módszertan")} · ${link(`${root}/elethelyzetek.html`, "élethelyzetek")}</div>`,

    "kalkulatorok.html": () => `
      <p class="sqf-kicker">Kalkulátorválasztó</p>
      <h2>Ugyanaz a téma több külön kérdést is jelenthet</h2>
      <p>A teljes listában nem csak kulcsszó alapján érdemes választani. Előbb döntsd el, hogy mennyiséget, költséget, időt, arányt, jövőbeli forgatókönyvet vagy egy meglévő érték ellenőrzését keresed.</p>
      ${cards([
        ["Mennyiség", "Építőanyag, folyadék, energia, terület vagy térfogat esetén a mértékegység és a ráhagyás a kritikus pont."],
        ["Költség", "Autó, hitel, költségvetés vagy vásárlás esetén válaszd szét az egyszeri, rendszeres és rejtett költségeket."],
        ["Idő", "Határidőnél, életkornál vagy menetidőnél tisztázd, naptári vagy időtartam-logikáról van-e szó."],
        ["Forgatókönyv", "Befektetésnél, hitelnél és inflációnál egyetlen feltételezés helyett több lehetséges kimenetet hasonlíts össze."]
      ])}
      <p>Ha több kalkulátor együtt ad értelmes képet, indulj az ${link(`${root}/elethelyzetek.html`, "Élethelyzetek")} oldalról.</p>`,

    "elethelyzetek.html": () => `
      <p class="sqf-kicker">Összekapcsolt döntések</p>
      <h2>Mikor kevés egyetlen kalkulátor?</h2>
      <p>Amikor az egyik eredmény a következő számítás bemenete. Lakásvásárlásnál például a havi mozgástér befolyásolja a vállalható törlesztőt; felújításnál a nettó felület után jön a ráhagyás és a csomagolás; autózásnál a fogyasztás csak egy része a teljes költségnek.</p>
      ${matrix([
        ["Lakás", "keret → önerő → hitel → törlesztő → tartalék"],
        ["Autó", "fogyasztás → útiköltség → éves költség → Ft/km → értékvesztés"],
        ["Fizetés", "bruttó/nettó → munkaidő → órabér → havi költségvetés"],
        ["Befektetés", "cél → időtáv → hozamfeltételezés → költség → infláció"],
        ["Felújítás", "méret → nettó felület → veszteség → csomagolás → kivitelezési sorrend"],
        ["Családi pénz", "bevétel → fix kiadás → változó kiadás → ritka kiadás → tartalék"]
      ])}`,

    "landing-pages/elethelyzetek/lakasvasarlas.html": () => `
      <p class="sqf-kicker">Lakásvásárlási döntési kapu</p>
      <h2>Az önerő nem azonos a teljes induló készpénzigénnyel</h2>
      <p>A vásárlás előtt külön soron kezeld a saját forrást, a tranzakcióhoz kapcsolódó kiadásokat, az azonnali felújítást vagy költözést és azt a tartalékot, amelynek a vásárlás után is meg kell maradnia.</p>
      ${checklist([
        "A vételárhoz képest nézd meg a saját forrás és a finanszírozás arányát.",
        "Különítsd el a hitelhez, szerződéshez, költözéshez és induló javításokhoz kötődő költségeket.",
        "A havi törlesztőt ne csak a mai kiadások mellett, hanem rosszabb hónappal is teszteld.",
        "A banki maximumot ne kezeld automatikusan kényelmes háztartási maximumnak."
      ])}
      <div class="sqf-note">Kapcsolódó módszertan: ${link(`${root}/kalkulatorok/lakas-hitel-onero-kalkulator.html`, "önerő")} · ${link(`${root}/kalkulatorok/hitel-torleszto-kalkulator.html`, "törlesztő")} · ${link(`${root}/kalkulatorok/havi-koltsegvetes-kalkulator.html`, "havi mozgástér")}</div>`,

    "landing-pages/elethelyzetek/autofenntartas.html": () => `
      <p class="sqf-kicker">Autótartási költségtérkép</p>
      <h2>A tankolás a legláthatóbb költség, de nem feltétlenül a legnagyobb</h2>
      ${cards([
        ["Használattal nő", "Üzemanyag, útdíj, parkolás és a futással arányos kopás."],
        ["Idővel jelentkezik", "Biztosítás, adók, műszaki vizsga, időszakos szerviz és gumi."],
        ["Nem havi számla", "Értékvesztés: pénzügyi költség akkor is, ha nem minden hónapban fizeted ki."],
        ["Váratlan", "Javítás és meghibásodás: ezért érdemes külön autós céltartalékot kezelni."]
      ])}
      <p>Egy út döntéséhez a marginális költség lehet elég; autó birtoklásának összehasonlításához viszont a teljes éves költség a relevánsabb.</p>`,

    "landing-pages/elethelyzetek/fizetes-munkaber.html": () => `
      <p class="sqf-kicker">Munkabér értelmezési lánc</p>
      <h2>A havi nettó és a munka valódi időértéke két külön kérdés</h2>
      ${flow([
        ["Bruttó", "A szerződéses bér és a bérösszetevők kiindulópontja."],
        ["Nettó", "A levonások és kedvezmények után ténylegesen kifizetett összeg becslése."],
        ["Fizetett idő", "A bérhez kapcsolódó elszámolt munkaórák."],
        ["Teljes idő", "Utazás, előkészület vagy nem fizetett idő hozzáadásával más effektív óradíj adódhat."],
        ["Háztartási érték", "Végül az számít, mennyi marad a fix és változó havi kiadások után."]
      ])}
      <div class="sqf-note">Adó- és bérszámításnál az aktuális szabály és a tényleges bérjegyzék az irányadó; a kalkulátor ellenőrző és tervező eszköz.</div>`,

    "landing-pages/elethelyzetek/befektetes-kezdoknek.html": () => `
      <p class="sqf-kicker">Befektetési feltételezés-létra</p>
      <h2>A hozam nem bemeneti igazság, hanem forgatókönyv</h2>
      ${matrix([
        ["Időtáv", "Mikor kellhet a pénz, és mennyire fér bele közben az árfolyam-ingadozás?"],
        ["Befizetés", "Egyszeri összeg, rendszeres megtakarítás vagy mindkettő?"],
        ["Hozam", "Ne egyetlen optimista százalékból indulj; használj alacsonyabb és magasabb forgatókönyvet is."],
        ["Költség", "Alapkezelési, szolgáltatói, tranzakciós és devizaköltség csökkentheti a végeredményt."],
        ["Infláció", "A nominális jövőérték és a mai vásárlóerő nem ugyanaz."],
        ["Adó", "Az adózási környezet és számlatípus a nettó eredményt módosíthatja."]
      ])}
      <p>A kalkulátorok nem árfolyam-előrejelzések; a cél a feltételezések következményének láthatóvá tétele.</p>`,

    "landing-pages/elethelyzetek/felujitas-tervezese.html": () => `
      <p class="sqf-kicker">Felújítási mennyiséglánc</p>
      <h2>A geometriai mennyiség és a megvásárolandó mennyiség ritkán ugyanaz</h2>
      ${flow([
        ["Felmérés", "Mérd meg a tényleges felületet és külön kezeld a nyílásokat, sarkokat, áttöréseket."],
        ["Nettó mennyiség", "Számold ki a tiszta felületet vagy térfogatot."],
        ["Veszteség", "Vágás, törés, mintaismétlés vagy egyenetlen alap miatt tervezz indokolt ráhagyást."],
        ["Csomagolás", "Lap, zsák, tekercs, doboz vagy raklap miatt a vásárlás felfelé kerekít."],
        ["Javítótartalék", "A későbbi pótlás külön kérdés a kivitelezési veszteségtől."]
      ])}
      <div class="sqf-note">Szerkezeti, vízszigetelési, tűzvédelmi vagy statikai döntést ne csak mennyiségi kalkulátorból hozz.</div>`,

    "landing-pages/elethelyzetek/csaladi-koltsegvetes.html": () => `
      <p class="sqf-kicker">Háztartási pénzáramlás</p>
      <h2>A „havi kiadás” három külön időritmust takarhat</h2>
      ${cards([
        ["Minden hónap", "Lakhatás, törlesztő, biztosítás, előfizetések és rendszeres megtakarítás."],
        ["Változó", "Élelmiszer, közlekedés, szabadidő és olyan tételek, amelyek hónapról hónapra mozognak."],
        ["Ritka, de biztos", "Éves díjak, iskolakezdés, karbantartás, ajándékok vagy szezonális kiadások – havi céltartalékkal simíthatók."],
        ["Váratlan", "Vésztartalékból kezelhető események, amelyekre nincs pontos dátum vagy összeg."]
      ])}
      <p>A költségvetés akkor használható döntésre, ha a megtakarítást nem a hónap végén „maradó pénzként”, hanem előre tervezett tételként is képes kezelni.</p>`,

    "rolunk.html": () => `
      <p class="sqf-kicker">Projektidentitás</p>
      <h2>Mit vállal a Kalkulátor Bázis – és mit nem?</h2>
      ${matrix([
        ["Vállaljuk", "érthető számítás, látható feltételezések, javítható hibák, forrásjelzés ahol szükséges, mobilos használhatóság"],
        ["Nem állítjuk", "hogy minden eredmény hivatalos, személyre szabott vagy szakértő által tanúsított"],
        ["Fejlesztési elv", "a kalkulátor funkciója és a magyarázó tartalom ugyanahhoz a valós felhasználói kérdéshez igazodjon"],
        ["Visszacsatolás", "hibát és félreérthető eredményt konkrét bemenettel és URL-lel lehessen jelezni"]
      ])}
      <p>A projekt működésének részletei a ${link(`${root}/miert-bizhatsz-bennunk.html`, "bizalmi oldalon")} és a ${link(`${root}/szamitasi-modszertan.html`, "módszertani oldalon")} követhetők.</p>`,

    "kapcsolat.html": () => `
      <p class="sqf-kicker">Gyorsabb hibajavítás</p>
      <h2>Mit írj bele egy jó hibabejelentésbe?</h2>
      ${checklist([
        "Az érintett oldal pontos URL-je vagy kalkulátorneve.",
        "A megadott bemeneti értékek és mértékegységek.",
        "A kapott eredmény és az, hogy miért tűnik hibásnak vagy félreérthetőnek.",
        "Ha van összehasonlítási alap, annak forrása vagy kézi számítása.",
        "Eszköz/böngésző megnevezése, ha megjelenítési vagy működési hibáról van szó."
      ])}
      <div class="sqf-note">Személyes vagy érzékeny adatot ne küldj csak azért, hogy egy számítási hibát reprodukálni lehessen; a legtöbb hiba anonim példaadatokkal is leírható.</div>`,

    "miert-bizhatsz-bennunk.html": () => `
      <p class="sqf-kicker">Ellenőrizhető bizalmi lánc</p>
      <h2>A „bízz bennünk” helyett legyen ellenőrizhető, miből jött az eredmény</h2>
      ${flow([
        ["Forrás", "Milyen képletből, szabályból, szabványból vagy gyártói adatból indul a számítás?"],
        ["Implementáció", "A programkód ugyanazt a logikát hajtja-e végre, amit az oldal leír?"],
        ["Teszt", "Ismert példák, szélsőértékek és hibás bemenetek mellett is érthetően működik-e?"],
        ["Korlát", "Látható-e, mikor nem elég a kalkulátor és mikor kell más forrás vagy szakember?"],
        ["Frissítés", "Időérzékeny adat változásakor a képlet, szöveg és dátum együtt frissül-e?"]
      ])}`,

    "atlathatosag-es-minoseg.html": () => `
      <p class="sqf-kicker">Minőségi kontroll</p>
      <h2>Nem minden oldal ugyanazt a minőségi ellenőrzést igényli</h2>
      ${cards([
        ["Egyszerű matematika", "Pontosság, mértékegység, kerekítés, hibás bemenet és érthető példa."],
        ["Pénzügy / adó", "Forrás, évszám, szabályváltozás, feltételezés és felelősségi korlát."],
        ["Egészség", "Módszer eredeti célja, populáció, bizonytalanság és világos nem-diagnosztikai keret."],
        ["Építés / autó", "Gyártói vagy járműspecifikus eltérés, ráhagyás, kompatibilitás és kivitelezési biztonsági határ."],
        ["Átváltó", "Egységdefiníció, lineáris/eltolt skála, pontosság és fogalmi félreértés."],
        ["Landing / útmutató", "Ne ismételje a kalkulátorokat; rendezze őket valódi döntési sorrendbe."]
      ])}`,

    "szamitasi-modszertan.html": () => `
      <p class="sqf-kicker">Számítás életciklusa</p>
      <h2>Egy kalkulátor frissítése öt külön dolgot jelenthet</h2>
      ${matrix([
        ["Képlet", "A matematikai vagy szabályalapú összefüggés változik."],
        ["Bemenet", "Új mező, új mértékegység vagy más alapértelmezett feltételezés szükséges."],
        ["Adat", "Árfolyam, adókulcs, határérték vagy más időérzékeny adat frissül."],
        ["Magyarázat", "A képlet változatlan, de a felhasználói értelmezés vagy korlát pontosításra szorul."],
        ["Teszt", "Új szélsőérték vagy korábbi hiba miatt a regressziós ellenőrzést bővíteni kell."]
      ])}
      <p>Ezért az „utolsó frissítés” dátuma csak akkor értékes, ha tényleges tartalmi vagy technikai ellenőrzést jelez, nem automatikus dátumcserét.</p>`,

    "adatvedelem.html": () => `
      <p class="sqf-kicker">Adatvédelmi olvasási térkép</p>
      <h2>Három kérdésből gyorsabban megtalálod, melyik rész vonatkozik rád</h2>
      ${matrix([
        ["Mit adok meg?", "Kalkulátormező, kapcsolatfelvételi adat, sütibe kerülő technikai információ vagy analitikai esemény?"],
        ["Hol történik?", "A böngészőben helyben, a webhely kiszolgálásakor vagy külső szolgáltatás bevonásával?"],
        ["Miért szükséges?", "Alapműködés, biztonság, mérés, hozzájáruláshoz kötött funkció vagy kapcsolatfelvétel?"],
        ["Meddig és hogyan?", "A részletes megőrzési, hozzájárulási és érintetti szabályt a tájékoztató megfelelő pontja tartalmazza."]
      ])}
      <div class="sqf-note">Ez a blokk navigációs segítség; jogi tartalmat nem ír felül. A részletes adatkezelési feltételek mindig ezen oldal fő szövegében irányadók.</div>`,

    "cookie.html": () => `
      <p class="sqf-kicker">Hozzájárulási logika</p>
      <h2>Nem minden süti ugyanazért létezik</h2>
      ${cards([
        ["Szükséges", "A webhely alapműködéséhez vagy biztonságához kapcsolódó technikai funkció."],
        ["Funkcionális", "Felhasználói kényelmet vagy beállítást támogató funkció, ha ilyet a tájékoztató megnevez."],
        ["Analitikai", "Használati mérés; a tényleges működést a hozzájárulási beállítás és a tájékoztató határozza meg."],
        ["Hirdetési", "Hirdetéshez kapcsolódó tárolás vagy jelzés csak az alkalmazott hozzájárulási rendszer szabályai szerint."]
      ])}
      <div class="sqf-note">A kategóriák célja az érthetőség. A pontos szolgáltató, süti, tárolási idő és jogalap a részletes táblázat vagy szöveg szerint értelmezendő.</div>`,

    "felhasznalasi-feltetelek.html": () => `
      <p class="sqf-kicker">Használati határ</p>
      <h2>Mire jó egy kalkulátoreredmény jogi értelemben?</h2>
      ${matrix([
        ["Gyors ellenőrzés", "Igen: saját tervezéshez, összehasonlításhoz és nagyságrendi becsléshez."],
        ["Hivatalos igazolás", "Nem automatikusan: szerződés, hatóság, bank, munkáltató vagy szakértő saját számítása lehet irányadó."],
        ["Személyre szabott tanács", "Nem: a kalkulátor nem ismeri az összes egyedi körülményt."],
        ["Végleges döntés", "A döntés kockázatához mérten ellenőrizd a bemenetet, forrást és a szükséges szakmai feltételeket."]
      ])}`,

    "jogi-nyilatkozat.html": () => `
      <p class="sqf-kicker">Kockázati döntési mátrix</p>
      <h2>Minél nagyobb a következmény, annál több ellenőrzés kell</h2>
      ${cards([
        ["Alacsony kockázat", "Hétköznapi százalék, mértékegység vagy becslés: általában elég a bemenet és a képlet ellenőrzése."],
        ["Pénzügyi / adó", "Nagyobb összeg vagy jogszabályi következmény esetén aktuális hivatalos forrás és szükség esetén szakember."],
        ["Egészség", "A képletes becslés nem diagnózis; tünet, betegség, gyógyszer vagy speciális élethelyzet külön szakmai értékelést igényelhet."],
        ["Műszaki / kivitelezés", "Mennyiségi kalkuláció nem helyettesít statikai, tűzvédelmi, villamos vagy más szakági tervezést."]
      ])}`,

    "impresszum.html": () => `
      <p class="sqf-kicker">Üzemeltetői adatok</p>
      <h2>Mit érdemes ezen az oldalon keresni?</h2>
      ${checklist([
        "Ki üzemelteti vagy felel a webhelyért?",
        "Milyen közvetlen kapcsolatfelvételi lehetőség áll rendelkezésre?",
        "Hol érhetők el az adatvédelmi, felhasználási és jogi feltételek?",
        "Hogyan lehet hibát, jogi vagy tartalmi észrevételt jelezni?"
      ])}
      <div class="sqf-note">Az impresszum az üzemeltetői azonosíthatóságot szolgálja; a számítási módszertant és minőségbiztosítást külön oldalak részletezik.</div>`,

    "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html": () => `
      <p class="sqf-kicker">Pénzügyi sorrend</p>
      <h2>Nem mindig a legmagasabb várható hozam a következő jó lépés</h2>
      ${flow([
        ["Likviditás", "Előbb lásd a havi pénzáramlást és a rövid távú tartalékot."],
        ["Drága teher", "Hitel és kötelező kiadások mellett mérd fel, mi viszi el a legtöbb biztos pénzt."],
        ["Cél", "Különítsd el a rövid, közép- és hosszú távú pénzügyi célokat."],
        ["Befektetés", "A hozamfeltételezéshez rendelj időtávot, költséget, kockázatot és inflációt."],
        ["Visszamérés", "Időnként a tervet a tényleges bevételhez, kiadáshoz és megtakarításhoz igazítsd."]
      ])}
      <p>Ez az oldal oktatási és tervezési keret, nem egyedi befektetési ajánlás.</p>`,

    "landing-pages/wise/wise.html": () => `
      <p class="sqf-kicker">Devizás döntés</p>
      <h2>Árfolyam helyett a ténylegesen elküldött és megérkező összeget hasonlítsd</h2>
      ${matrix([
        ["Kiinduló összeg", "Mennyit terhelnek a számládra vagy kártyádra?"],
        ["Átváltási árfolyam", "Milyen referencia vagy szolgáltatói árfolyam alapján történik az átváltás?"],
        ["Díjak", "Fix és százalékos díj, kártyás felár vagy más költség külön jelenik-e meg?"],
        ["Címzett kap", "A végső összehasonlításnál ez az egyik legfontosabb érték."],
        ["Idő", "A becsült teljesítési idő és sürgősség is része lehet a döntésnek."]
      ])}
      <div class="sqf-note"><strong>Partneri átláthatóság:</strong> ha az oldalon partnerlink szerepel, azt elkülönítve kezeld a saját összehasonlításodtól. A szolgáltató aktuális díja és feltétele a végleges.</div>`,

    "kalkulatorok/multifunkcios-szamologep.html": () => `
      <p class="sqf-kicker">Számológép-ellenőrző</p>
      <h2>Három módon ellenőrizd, hogy nem a bevitel értelmezése okozta az eltérést</h2>
      ${cards([
        ["Műveleti sorrend", "Zárójelek nélkül a szorzás és osztás megelőzi az összeadást és kivonást; összetett kifejezésnél tedd láthatóvá a szándékot zárójellel."],
        ["Százalék", "A „20%-kal nő” és az „eredeti érték 120%-a” ugyanarra az új értékre vezethet, de más kérdést fogalmaz meg."],
        ["Kerekítés", "Köztes eredményt ne kerekíts túl korán; lehetőleg a végén kerekíts a kívánt pontosságra."],
        ["Visszaellenőrzés", "Ha lehet, fordított művelettel vagy nagyságrendi becsléssel nézd meg, reális-e a végeredmény."]
      ])}
      <div class="sqf-note">A multifunkciós számológép általános matematikai eszköz; jogi, pénzügyi vagy egészségügyi szabályt önmagában nem alkalmaz.</div>`
  };

  const renderer = renderers[relativePath];
  if (!renderer) return;

  const section = document.createElement("section");
  section.className = "site-quality-final";
  section.dataset.qualityFinal = "2026-08";
  section.dataset.qualityKey = relativePath;
  section.innerHTML = renderer();
  main.appendChild(section);
})();
