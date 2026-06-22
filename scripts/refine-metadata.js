const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const metadata = {
  "auto.html": {
    title: "Autós kalkulátorok | Fogyasztás, üzemanyag és fenntartás",
    description: "Autós kalkulátorok fogyasztás, üzemanyagköltség, hatótáv, éves fenntartás, kilométerdíj és utazási idő becsléséhez.",
  },
  "kalkulatorok/netto-brutto-kalkulator.html": {
    title: "Nettó–bruttó kalkulátor | Fizetés és bérkalkuláció",
    description: "Nettó–bruttó kalkulátor bértervezéshez. Számolj nettóból bruttót, bruttóból nettót, családi és első házas kedvezményt, valamint munkáltatói költséget.",
  },
  "kalkulatorok/hitel-torleszto-kalkulator.html": {
    title: "Hitel törlesztő kalkulátor | Havi részlet és kamat",
    description: "Hitel törlesztő kalkulátor havi részlethez, teljes visszafizetéshez és kamatteherhez. Hasonlíts össze hitelösszeget, kamatot és futamidőt.",
  },
  "kalkulatorok/hitelkepesseg-kalkulator.html": {
    title: "Hitelképesség kalkulátor | Jövedelmi teherbírás",
    description: "Hitelképesség kalkulátor jövedelmi teherbírás becsléséhez. Nézd meg, mekkora havi részlet és hitelösszeg adódik a rögzített tervezési aránnyal.",
  },
  "kalkulatorok/kamatos-kamat-kalkulator.html": {
    title: "Kamatos kamat kalkulátor | Megtakarítás és hozam",
    description: "Kamatos kamat kalkulátor kezdőtőkéhez és rendszeres befizetéshez. Becsüld meg a futamidő végi összeget, a befizetést és a várható hozamot.",
  },
  "kalkulatorok/osztalek-kalkulator.html": {
    title: "Osztalék kalkulátor | Bruttó és nettó bevétel",
    description: "Osztalék kalkulátor befektetett összeghez és osztalékhozamhoz. Lásd az éves bruttó és a megadott adókulccsal becsült nettó bevételt.",
  },
  "kalkulatorok/bmi-kalkulator.html": {
    title: "BMI kalkulátor | Testtömegindex számítás és értelmezés",
    description: "BMI kalkulátor testtömegindex-számításhoz, felnőtteknek szóló értelmezési sávokkal és a módszer fontos korlátainak bemutatásával.",
  },
  "kalkulatorok/afa-kalkulator.html": {
    title: "ÁFA kalkulátor | Nettó, bruttó és adótartalom",
    description: "ÁFA kalkulátor nettó–bruttó átváltáshoz és adótartalom számításához. Adj meg egy összeget és áfakulcsot, majd nézd meg mindhárom értéket.",
  },
  "kalkulatorok/auto-kalkulator.html": {
    title: "Autós út- és hatótáv kalkulátor | Fogyasztás",
    description: "Autós út- és hatótáv kalkulátor: számold ki a fogyasztást, az üzemanyagköltséget és a becsült hatótávot egyetlen eszközben.",
  },
  "kalkulatorok/alvasciklus-kalkulator.html": {
    title: "Alvásciklus kalkulátor | Lefekvési és ébredési idő",
    description: "Alvásciklus kalkulátor tervezett lefekvéshez vagy ébredéshez. Számolj 90 perces ciklusokkal és becsült elalvási idővel.",
  },
  "kalkulatorok/ar-kedvezmeny-kalkulator.html": {
    title: "Árkedvezmény kalkulátor | Akciós ár és megtakarítás",
    description: "Árkedvezmény kalkulátor akciós árhoz: add meg az eredeti árat és a kedvezmény százalékát, majd lásd a fizetendő összeget és megtakarítást.",
  },
  "kalkulatorok/arany-kalkulator.html": {
    title: "Arány kalkulátor | Rész, egész és százalék",
    description: "Arány kalkulátor egy rész és az egész kapcsolatának meghatározásához. Számíts százalékos arányt két megadott értékből.",
  },
  "kalkulatorok/atlag-kalkulator.html": {
    title: "Átlag kalkulátor | Számtani közép több értékből",
    description: "Átlag kalkulátor tetszőleges számsorhoz. Add meg az értékeket, és az eszköz megmutatja az összeget, a darabszámot és a számtani átlagot.",
  },
  "kalkulatorok/auto-ertekvesztes-kalkulator.html": {
    title: "Autó értékvesztés kalkulátor | Maradványérték becslése",
    description: "Autó értékvesztés kalkulátor vételár, éves értékcsökkenés és használati idő alapján. Becsüld meg a jármű későbbi maradványértékét.",
  },
  "kalkulatorok/autopalyadij-kalkulator.html": {
    title: "Autópályadíj megosztó | Költség utasonként",
    description: "Autópályadíj kalkulátor közös utazáshoz. Oszd el a matrica vagy útdíj összegét az utasok között, és lásd az egy főre jutó részt.",
  },
  "kalkulatorok/bmr-kalkulator.html": {
    title: "BMR kalkulátor | Alapanyagcsere becslése",
    description: "BMR kalkulátor az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.",
  },
  "kalkulatorok/borravalo-kalkulator.html": {
    title: "Borravaló kalkulátor | Számla és fejenkénti összeg",
    description: "Borravaló kalkulátor éttermi számlához. Válassz százalékot, add meg a létszámot, és számold ki a teljes és fejenként fizetendő összeget.",
  },
  "kalkulatorok/co2-kibocsatas-kalkulator.html": {
    title: "Autós CO2-kibocsátás kalkulátor | Utazási becslés",
    description: "CO2-kibocsátás kalkulátor autós utazáshoz. Becsüld meg a megtett út és az üzemanyag-felhasználás alapján keletkező szén-dioxid mennyiségét.",
  },
  "kalkulatorok/datum-kulonbseg-kalkulator.html": {
    title: "Dátumkülönbség kalkulátor | Napok két dátum között",
    description: "Dátumkülönbség kalkulátor két időpont távolságához. Válassz kezdő- és záródátumot, majd nézd meg a közöttük eltelt napok számát.",
  },
  "kalkulatorok/derek-csipo-kalkulator.html": {
    title: "Derék–csípő arány kalkulátor | WHR értelmezéssel",
    description: "Derék–csípő arány kalkulátor a két körfogatból számított WHR becsléséhez. Az eredmény tájékoztató, nem helyettesít egészségügyi vizsgálatot.",
  },
  "kalkulatorok/egysegar-kalkulator.html": {
    title: "Egységár kalkulátor | Kiszerelések összehasonlítása",
    description: "Egységár kalkulátor eltérő árú és kiszerelésű termékekhez. Hasonlítsd össze, melyik ajánlat kerül kevesebbe kilogrammonként vagy literenként.",
  },
  "kalkulatorok/eletkor-kalkulator.html": {
    title: "Életkor kalkulátor | Pontos kor évben, hónapban, napban",
    description: "Életkor kalkulátor születési dátumból. Nézd meg a betöltött éveket, valamint a pontos életkort években, hónapokban és napokban.",
  },
  "kalkulatorok/energia-atvalto-kalkulator.html": {
    title: "Energia átváltó | Joule, kalória és kilowattóra",
    description: "Energia átváltó joule, kilojoule, kalória és kilowattóra között. Adj meg egy értéket és váltsd át a gyakori energia-mértékegységekre.",
  },
  "kalkulatorok/eves-auto-koltseg-kalkulator.html": {
    title: "Éves autóköltség kalkulátor | Fenntartás összesítése",
    description: "Éves autóköltség kalkulátor üzemanyaghoz, biztosításhoz, szervizhez és egyéb kiadásokhoz. Becsüld meg a havi és éves fenntartást.",
  },
  "kalkulatorok/feherje-szukseglet-kalkulator.html": {
    title: "Fehérjeszükséglet kalkulátor | Napi gramm becslése",
    description: "Fehérjeszükséglet kalkulátor testsúly és aktivitási cél alapján. Becsüld meg a napi fehérjebevitelt tájékoztató jelleggel.",
  },
  "kalkulatorok/fuga-kalkulator.html": {
    title: "Fuga kalkulátor | Fugázóanyag-szükséglet becslése",
    description: "Fuga kalkulátor burkolólapméret, fugaszélesség, mélység és felület alapján. Becsüld meg, mennyi fugázóanyagot érdemes beszerezni.",
  },
  "kalkulatorok/gumi-meret-kalkulator.html": {
    title: "Gumiméret-váltó | Kerékátmérő és eltérés számítása",
    description: "Gumiméret-váltó két abroncsméret összehasonlításához. Nézd meg a teljes átmérőt és a százalékos eltérést csere előtt.",
  },
  "kalkulatorok/hatotav-kalkulator.html": {
    title: "Autó hatótáv kalkulátor | Megtehető kilométer",
    description: "Hatótáv kalkulátor tankban lévő üzemanyag és átlagfogyasztás alapján. Becsüld meg, hány kilométert tehetsz még meg tankolás előtt.",
  },
  "kalkulatorok/hoszigeteles-kalkulator.html": {
    title: "Hőszigetelés kalkulátor | Anyagmennyiség és csomagszám",
    description: "Hőszigetelés kalkulátor homlokzati felülethez. Becsüld meg a szükséges szigetelőlap-mennyiséget, csomagszámot és ráhagyást.",
  },
  "kalkulatorok/ido-atvalto-kalkulator.html": {
    title: "Idő átváltó | Másodperc, perc, óra, nap és év",
    description: "Idő átváltás másodperc, perc, óra, nap, hét, hónap és év között. Add meg az értéket, majd válaszd ki a kiinduló és a célmértékegységet.",
  },
  "kalkulatorok/gipszkarton-kalkulator.html": {
    title: "Gipszkarton kalkulátor | Lap-, profil- és csavarszükséglet",
    description: "Gipszkarton kalkulátor fal vagy mennyezet mérete alapján. Becsüld meg a szükséges lapok, profilok és rögzítőelemek mennyiségét.",
  },
  "kalkulatorok/idealis-testsuly-kalkulator.html": {
    title: "Ideális testsúly kalkulátor | Tájékoztató súlytartomány",
    description: "Ideális testsúly kalkulátor testmagasság alapján, több ismert becslési módszerrel. Az eredmény tájékoztató tartomány, nem egészségügyi célérték.",
  },
  "kalkulatorok/kilometerdij-kalkulator.html": {
    title: "Kilométerdíj kalkulátor | Autóköltség kilométerenként",
    description: "Kilométerdíj kalkulátor üzemanyag- és fenntartási költségekhez. Becsüld meg, mennyibe kerül egy kilométer a saját autóddal.",
  },
  "kalkulatorok/makro-kalkulator.html": {
    title: "Makró kalkulátor | Fehérje, zsír és szénhidrát",
    description: "Makró kalkulátor napi kalóriacélhoz. Becsüld meg a fehérje, zsír és szénhidrát grammját a választott megoszlás alapján.",
  },
  "kalkulatorok/milliomos-kalkulator.html": {
    title: "Mikor leszek milliomos? | Célösszeg kalkulátor",
    description: "Célösszeg-kalkulátor induló megtakarításhoz, havi befizetéshez és becsült hozamhoz. Nézd meg, várhatóan mikor érheted el a pénzügyi célt.",
  },
  "kalkulatorok/munkaido-kalkulator.html": {
    title: "Munkaidő kalkulátor | Heti és havi óraszám",
    description: "Munkaidő kalkulátor napi óraszám és munkanapok alapján. Számold ki a heti és havi munkaórát egyszerű tervezéshez.",
  },
  "kalkulatorok/nyomas-atvalto-kalkulator.html": {
    title: "Nyomás átváltó | Pascal, bar, atmoszféra és PSI",
    description: "Nyomás átváltó pascal, kilopascal, bar, atmoszféra és PSI között. Válassz kiinduló és célmértékegységet a gyors konverzióhoz.",
  },
  "kalkulatorok/oraber-kalkulator.html": {
    title: "Órabér kalkulátor | Havi fizetésből óradíj",
    description: "Órabér kalkulátor havi bér és ledolgozott munkaóra alapján. Számold ki a becsült bruttó vagy nettó óradíjat összehasonlításhoz.",
  },
  "kalkulatorok/padlo-burkolat-kalkulator.html": {
    title: "Padlóburkolat kalkulátor | Csomagszám és ráhagyás",
    description: "Padlóburkolat kalkulátor helyiségméret, csomagonkénti fedés és ráhagyás alapján. Becsüld meg a megvásárolandó csomagok számát.",
  },
  "kalkulatorok/pulzus-zona-kalkulator.html": {
    title: "Pulzuszóna kalkulátor | Edzési tartományok becslése",
    description: "Pulzuszóna kalkulátor életkor és intenzitás alapján. Becsüld meg az edzési pulzustartományokat tájékoztató jelleggel.",
  },
  "kalkulatorok/rezsi-megosztas-kalkulator.html": {
    title: "Rezsi megosztás kalkulátor | Közös költségek elosztása",
    description: "Rezsi megosztás kalkulátor lakótársaknak és családoknak. Oszd el a közös kiadásokat egyenlően vagy a megadott létszám szerint.",
  },
  "kalkulatorok/tankolas-kalkulator.html": {
    title: "Tankolás kalkulátor | Liter, üzemanyagár és végösszeg",
    description: "Tankolás kalkulátor üzemanyag-mennyiséghez és költséghez. Számold ki, hány liter fér a keretbe, vagy mennyibe kerül a megadott tankolás.",
  },
  "kalkulatorok/tapeta-kalkulator.html": {
    title: "Tapéta kalkulátor | Tekercsszám falméret alapján",
    description: "Tapéta kalkulátor falméret, nyílások és tekercsméret alapján. Becsüld meg a szükséges tekercsek számát vásárlás előtt.",
  },
  "kalkulatorok/teljesitmeny-atvalto-kalkulator.html": {
    title: "Teljesítmény átváltó | Watt, kilowatt és lóerő",
    description: "Teljesítmény átváltó watt, kilowatt, metrikus lóerő és angolszász horsepower között. Váltsd át gyorsan a megadott értéket.",
  },
  "kalkulatorok/terhessegi-kalkulator.html": {
    title: "Terhességi kalkulátor | Várható szülési idő becslése",
    description: "Terhességi kalkulátor az utolsó menstruáció első napja alapján. Becsüld meg a terhességi kort és a várható szülési dátumot.",
  },
  "kalkulatorok/tomeg-atvalto-kalkulator.html": {
    title: "Tömeg átváltó | Gramm, kilogramm, tonna és font",
    description: "Tömeg átváltás milligramm, gramm, dekagramm, kilogramm, tonna, uncia és font között, gyors kétirányú mértékegység-konverzióval.",
  },
  "kalkulatorok/terkovezes-kalkulator.html": {
    title: "Térkövezés kalkulátor | Térkő és ágyazat mennyisége",
    description: "Térkövezés kalkulátor felület, térkőméret és ráhagyás alapján. Becsüld meg a szükséges darabszámot és anyagmennyiséget.",
  },
  "kalkulatorok/tetocserep-kalkulator.html": {
    title: "Tetőcserép kalkulátor | Darabszám és ráhagyás",
    description: "Tetőcserép kalkulátor tetőfelület, négyzetméterenkénti cserépszükséglet és ráhagyás alapján. Tervezd meg a beszerzendő mennyiséget.",
  },
  "kalkulatorok/utazasi-ido-kalkulator.html": {
    title: "Utazási idő kalkulátor | Távolság és átlagsebesség",
    description: "Utazási idő kalkulátor távolság és átlagsebesség alapján. Becsüld meg a menetidőt, majd tervezz külön tartalékot a megállásokra.",
  },
  "kalkulatorok/vakolat-kalkulator.html": {
    title: "Vakolat kalkulátor | Habarcs- és anyagszükséglet",
    description: "Vakolat kalkulátor falfelület, rétegvastagság és anyagkiadósság alapján. Becsüld meg a szükséges szárazhabarcs mennyiségét ráhagyással.",
  },
  "kalkulatorok/vizfogyasztas-kalkulator.html": {
    title: "Vízfogyasztás kalkulátor | Napi folyadékigény becslése",
    description: "Vízfogyasztás kalkulátor testsúly és aktivitás alapján. Becsüld meg a napi folyadékbevitelt tájékoztató jelleggel, egyéni körülményeid figyelembevételével.",
  },
};

const escapeAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let changed = 0;
Object.entries(metadata).forEach(([name, values]) => {
  const file = path.join(root, name);
  let html = fs.readFileSync(file, "utf8");
  const next = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${values.title}</title>`)
    .replace(
      /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,
      `<meta name="description" content="${escapeAttribute(values.description)}" />`
    );

  if (next !== html) {
    fs.writeFileSync(file, next, "utf8");
    changed += 1;
  }
});

console.log(`${changed} oldal title/meta leírása frissítve.`);
