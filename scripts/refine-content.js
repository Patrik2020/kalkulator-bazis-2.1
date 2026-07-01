const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// [főcím, bevezető, alcím, értelmezés/korlát, GYIK-cím, kérdés, válasz, kérdés, válasz]
const guides = {
  "adatmeret-atvalto-kalkulator": [
    "Bájt, megabájt vagy gigabájt?",
    "Fájlmásolás, tárhelyválasztás és adatforgalom becslése közben könnyű összekeverni az egységeket. Az átváltó ugyanazt az adatmennyiséget mutatja meg több léptékben, így például egy videó mérete összevethető a rendelkezésre álló tárhellyel.",
    "A gyártói és informatikai jelölés eltérhet",
    "A tárhelygyártók gyakran ezres, az operációs rendszerek sokszor 1024-es váltószámot használnak. Emiatt egy névleg 1 TB-os meghajtó kijelzett kapacitása kisebbnek tűnhet; vásárlásnál mindig nézd meg, melyik definíció szerepel a specifikációban.",
    "Adatméretnél felmerül",
    "Ugyanaz a GB és a GiB?",
    "Nem. A GB tízes alapú, a GiB kettes alapú egység; 1 GiB 1 073 741 824 bájt.",
    "A fájl ténylegesen ennyi helyet foglal?",
    "Nem feltétlenül: a fájlrendszer blokkmérete, a tömörítés és a metaadatok is módosíthatják a lemezen elfoglalt helyet."
  ],
  "alvasciklus-kalkulator": [
    "Az ébresztés időpontja csak egy kapaszkodó",
    "A kalkulátor 90 perces ciklusokkal vissza- vagy előreszámol, ezért esti tervezéshez és korai indulás előtt adhat kézzelfogható időpontokat. Érdemes a lefekvéshez hozzáadni azt az időt is, amennyi alatt általában elalszol.",
    "Az alvás nem metronóm",
    "Egy ciklus hossza személyenként és éjszakánként változhat, ezért a kapott időpont nem garantál könnyű ébredést. Tartós fáradtság, horkolás vagy alvászavar esetén a ciklusszámolás helyett orvosi kivizsgálás indokolt.",
    "Alvástervezési kérdések",
    "Elég négy vagy öt ciklus?",
    "A ciklusok száma önmagában nem cél: felnőtteknél a rendszeres, elegendő teljes alvásidő fontosabb.",
    "Számoljak az elalvási idővel?",
    "Igen. Ha jellemzően 15–30 perc alatt alszol el, ezt add hozzá a tervezett lefekvési időhöz."
  ],
  "arany-kalkulator": [
    "Arányok felosztáshoz és összehasonlításhoz",
    "Receptek, keverékek, költségmegosztás vagy képméretezés során az arány azt mutatja meg, hogyan viszonyul két mennyiség egymáshoz. A számítás akkor értelmes, ha a két adat azonos vagy összehasonlítható mértékegységben szerepel.",
    "Az arány nem százalék",
    "A 2:3 arány két rész és három rész kapcsolatát jelenti, míg a százalék száz egységhez viszonyít. Felosztásnál előbb add össze az arányrészeket, majd a teljes mennyiséget oszd el ezzel az összeggel.",
    "Arányértelmezés",
    "Lehet tizedes szám az arányban?",
    "Igen, de áttekinthetőbb lehet mindkét oldalt ugyanazzal a számmal megszorozva egész arányra hozni.",
    "Mi történik nulla megadásakor?",
    "Nullával osztani nem lehet; ilyen esetben az arány matematikailag nem értelmezhető a szokásos módon."
  ],
  "ar-kedvezmeny-kalkulator": [
    "Az akció valódi értéke",
    "Az eredeti ár és a kedvezmény százaléka alapján látható az új ár és a forintban mért megtakarítás. Több kiszerelés vagy üzlet összehasonlításakor az egységárat is érdemes mellé tenni, mert az alacsonyabb végösszeg nem mindig jelent jobb vételt.",
    "A kedvezmények nem mindig adódnak össze",
    "Két egymás utáni 10%-os engedmény nem 20%, hanem összesen 19% csökkenés: a második kedvezmény már az alacsonyabb árból indul. Kuponnál ellenőrizd azt is, hogy szállítási díjra vagy akciós termékre alkalmazható-e.",
    "Akciós ár kérdések",
    "Melyik árból számoljak?",
    "Abból az ellenőrizhető árból, amelyet a kedvezmény előtt ténylegesen alkalmaztak, nem egy pusztán áthúzott referenciaárból.",
    "A pénztári kerekítés eltérést okozhat?",
    "Igen, az üzlet kerekítési szabálya miatt néhány forintos különbség előfordulhat."
  ],
  "atlag-kalkulator": [
    "Mit mond el az átlag az adatsorról?",
    "Az egyszerű számtani átlag jól összefoglalhat hasonló értékeket, például havi kiadásokat vagy mérési eredményeket. Nagyon eltérő adatoknál azonban egyetlen szélsőséges érték is erősen elhúzhatja.",
    "Néha a medián a jobb választás",
    "Jövedelmeknél, ingatlanáraknál vagy ferde eloszlásnál érdemes az átlag mellett a mediánt és a minimum–maximum tartományt is megnézni. Súlyozott eredményhez – például eltérő kreditértékű jegyeknél – az egyszerű átlag nem elegendő.",
    "Átlagolási kérdések",
    "Beírhatok negatív értéket?",
    "Igen, ha az adat jelentése megengedi; például hőmérsékletnél vagy egyenlegváltozásnál ez természetes lehet.",
    "Az üres és a nulla ugyanaz?",
    "Nem. A nulla valódi adat, az üres elem pedig hiányzó megfigyelés, ezért ne kezeld őket automatikusan azonosként."
  ],
  "auto-ertekvesztes-kalkulator": [
    "Az autó ára évről évre más ütemben változik",
    "A vételár, az éves értékvesztési arány és a használati idő alapján becsülhető a későbbi érték. Ez hasznos lehet teljes autóköltség vagy várható cserekeret tervezésekor.",
    "A piaci ár nem szabályos görbe",
    "Új autóknál gyakran az első években a legnagyobb az értékvesztés, később lassulhat. Futásteljesítmény, szervizelőélet, sérülés, felszereltség és a típus keresettsége a százalékos modellnél sokkal erősebben is hathat.",
    "Értékvesztési kérdések",
    "Az inflációt figyelembe veszi a becslés?",
    "A százalékos eredmény névleges érték; magas infláció mellett a forintár és a reálérték eltérően mozoghat.",
    "Használható eladási ár meghatározására?",
    "Kiindulópontnak igen, de hirdetés előtt hasonlítsd össze azonos évjáratú és állapotú autók aktuális áraival."
  ],
  "auto-kalkulator": [
    "Három külön kérdés egy autós oldalon",
    "A fogyasztás, az út üzemanyagköltsége és a tankkal elérhető hatótáv más-más döntést támogat. Tankolási adatokból valós fogyasztást, út előtt várható kiadást, hosszabb szakasz előtt pedig biztonságos hatótávot becsülhetsz.",
    "A valós út mindig hozzátesz valamit",
    "Forgalom, hidegindítás, tetőcsomagtartó, terhelés, guminyomás és vezetési tempó mind eltérítheti az eredményt. Költségtervezésnél az autópályadíj, parkolás és az autó kopása nincs benne az üzemanyagárban.",
    "Autós számítások röviden",
    "Miért tér el a fedélzeti számítógép értéke?",
    "A kijelzett adat kalibráció és mérési módszer miatt eltérhet; a több tankolásból számított átlag megbízhatóbb összevetés.",
    "Nullára tervezhetem a tankot?",
    "Nem. A kijelzett hatótáv becslés, ezért hosszabb úton mindig hagyj érdemi üzemanyag-tartalékot."
  ],
  "autopalyadij-kalkulator": [
    "Matrica vagy szakaszdíj az útvonalhoz",
    "Az autópályadíj előzetes becslése segít eldönteni, hogy egy útvonal gyorsabb vagy olcsóbb alternatívája éri-e meg. A járműkategória, az ország, az érvényesség és az érintett útszakasz mind befolyásolhatja a fizetendő összeget.",
    "Az aktuális díjtábla az irányadó",
    "Az útdíjak és kategóriaszabályok változhatnak, külföldön pedig kapus, elektronikus és kilométer-alapú rendszer is előfordul. Indulás előtt mindig az útkezelő hivatalos oldalán ellenőrizd az árat és a vásárlás módját.",
    "Útdíjtervezés",
    "Az oda-vissza út mindig két díj?",
    "Nem feltétlenül: időalapú matrica esetén ugyanaz az érvényesség mindkét irányt lefedheti.",
    "A pótdíjat is kiszámolja?",
    "Nem; jogosulatlan úthasználatnál a hivatalos pótdíjszabályok érvényesek."
  ],
  "bmr-kalkulator": [
    "Az alapanyagcsere a nyugalmi minimum becslése",
    "A BMR azt közelíti, mennyi energiát használna fel a szervezet teljes nyugalomban az alapvető működéshez. Nem azonos a napi kalóriakerettel, mert a mozgás, munka és emésztés további energiát igényel.",
    "Képletből nem lesz személyre szabott mérés",
    "A testösszetétel, életkor, hormonális állapot és betegségek miatt az egyenlet eltérhet a tényleges energiafelhasználástól. Hosszabb távú testsúlyváltozás alapján érdemes finomítani, egészségügyi cél esetén dietetikussal egyeztetve.",
    "BMR-értelmezés",
    "Ehetek tartósan a BMR alatt?",
    "Önállóan nem célszerű ilyen célt kitűzni; túl alacsony bevitel mellett nő a hiányállapot és az izomvesztés kockázata.",
    "Miért más a kalóriakalkulátor eredménye?",
    "A napi szükséglet a BMR-t aktivitási szorzóval egészíti ki, ezért természetesen magasabb."
  ],
  "borravalo-kalkulator": [
    "Borravaló és számla felosztása vita nélkül",
    "A számlaösszegből és a választott százalékból gyorsan kiszámítható a borravaló, a teljes fizetendő összeg és személyenkénti rész. Csoportnál előre tisztázható, hogy mindenki egyenlően fizet-e vagy a saját fogyasztása alapján.",
    "Nézd meg, van-e már szervizdíj",
    "Az étlap vagy a számla tartalmazhat felszolgálási díjat, amely nem ugyanaz minden helyen és nem feltétlenül indokol további borravalót. Kártyás fizetésnél kérdezd meg, hogyan adható hozzá.",
    "Fizetésnél gyakori",
    "A százalékot a nettó vagy a teljes számlából számoljam?",
    "Magánfogyasztásnál általában a vendég által fizetendő teljes számlaösszegből szokás kiindulni.",
    "Hogyan osszak, ha valaki jóval kevesebbet fogyasztott?",
    "Ilyenkor igazságosabb lehet előbb egyéni fogyasztásra bontani, és csak a közös tételeket osztani egyenlően."
  ],
  "co2-kibocsatas-kalkulator": [
    "Az üzemanyagból becsült közvetlen kibocsátás",
    "A megtett út, a fogyasztás és az üzemanyagtípus alapján közelíthető az elégetéskor keletkező szén-dioxid. Ez útvonalak, közlekedési módok vagy éves autóhasználat nagyságrendi összevetéséhez hasznos.",
    "A teljes életciklus ennél szélesebb",
    "A számítás általában nem tartalmazza az üzemanyag előállítását, az autó gyártását, az akkumulátort vagy az infrastruktúrát. A valós értéket a tényleges fogyasztás és a választott kibocsátási tényező pontossága határozza meg.",
    "Kibocsátás-becslés",
    "Miért nem azonos két kalkulátor eredménye?",
    "Eltérő emissziós tényezőt, bioüzemanyag-arányt vagy teljes életciklusú módszert használhatnak.",
    "A fedélzeti fogyasztás jó bemenet?",
    "Kiindulásnak igen, de több tankolás mért átlaga általában közelebb áll a valós használathoz."
  ],
  "csempe-kalkulator": [
    "Burkolattervezés darabszámmal, nem csak négyzetméterrel",
    "A felület és a lapméret alapján becsülhető, hány egész csempe szükséges. A helyiség pontos felmérésekor külön kezeld a falakat, nyílásokat, beugrókat és a csak részben burkolt sávokat.",
    "A kiosztás határozza meg a ráhagyást",
    "Egyenes rakásnál rendszerint kevesebb a vágás, átlós vagy mintába rendezett burkolatnál több. Azonos gyártási tételből érdemes tartalékot venni, mert később a színárnyalat és kaliber nehezen pótolható.",
    "Burkolás előtt",
    "Levonjam az ajtót és az ablakot?",
    "Nagy nyílásokat igen, de kis felületeknél a levonásnál fontosabb lehet a vágási veszteség és a javítási tartalék.",
    "A ragasztót is kiszámolja?",
    "Nem. A ragasztó mennyisége a lapmérettől, fogazott glettvastól és az aljzat síkjától függ."
  ],
  "datum-kulonbseg-kalkulator": [
    "Két dátum között nem mindig ugyanazt értjük",
    "Határidő, életkor vagy események közötti idő számításakor előre döntsd el, hogy a kezdőnapot és a zárónapot beleszámítod-e. A kalkulátor a megadott dátumok naptári távolságát teszi átláthatóvá.",
    "Szökőév és időzóna is számíthat",
    "Hosszabb időszaknál február 29., online eseménynél pedig az időzóna módosíthatja az eredményt. Jogi vagy szerződéses határidőnél a naptári nap és munkanap fogalmát külön szabály határozhatja meg.",
    "Dátumszámítási kérdések",
    "Miért lehet egy nappal eltérő a kézi számolás?",
    "Leggyakrabban azért, mert az egyik módszer beleszámítja a kezdőnapot, a másik nem.",
    "Órákban is pontos az eredmény?",
    "Csak akkor, ha a kalkulátor időpontot és időzónát is kezel; a puszta dátumokból ez nem következik."
  ],
  "derek-csipo-kalkulator": [
    "A testarány kockázati jelzés, nem diagnózis",
    "A derék- és csípőkörfogat hányadosa a hasi zsíreloszlás egyik egyszerű mutatója. Azonos mérési ponton, lazán állva és nem behúzott hassal érdemes mérni, különben az összehasonlítás félrevezető lehet.",
    "A határértékek csak tájékozódási pontok",
    "A nem, az életkor és a szakmai ajánlás szerint eltérő küszöbök használhatók, a mérőszalag hibája pedig könnyen módosítja a kategóriát. Magas kockázati érték vagy más panasz esetén orvosi értékelés szükséges.",
    "Mérés és értelmezés",
    "Hol mérjem a derekamat?",
    "A választott szakmai protokoll szerinti ponton mérj, és később mindig ugyanott ismételd meg.",
    "Fogyás közben melyik adat fontosabb?",
    "A testsúly mellett a derékkörfogat trendje is hasznos lehet, de egyik mutató sem értelmezhető önmagában."
  ],
  "egysegar-kalkulator": [
    "Különböző kiszerelések közös nevezőn",
    "Az egységár megmutatja, mennyibe kerül egy kilogramm, liter, darab vagy más azonos mennyiség. Akciók és eltérő csomagméretek összevetésekor ez gyakran többet mond, mint a polcon látható végösszeg.",
    "Csak azonos tartalmat hasonlíts össze",
    "A nettó tömeg, darabszám, koncentráció és minőség különbségeit is vedd figyelembe. A nagyobb csomag egységára lehet alacsonyabb, de pazarlás esetén mégsem az a gazdaságosabb választás.",
    "Egységáras döntések",
    "A csomagolás tömegét beleszámítsam?",
    "Nem, élelmiszernél és terméknél a nettó tömegből vagy térfogatból indulj ki.",
    "Összehasonlítható a darabár és a kilogrammár?",
    "Csak akkor, ha ismered egy darab tömegét és egységes mértékegységre váltasz."
  ],
  "eletkor-kalkulator": [
    "Életkor évben, hónapban és napban",
    "Születési dátum és egy választott viszonyítási nap között pontosabban látható az eltelt idő, mint pusztán az évszámok kivonásával. Ez évforduló, korhatár vagy adminisztratív adat ellenőrzésénél lehet praktikus.",
    "A születésnap még nem mindig telt el",
    "Az adott évben csak a születésnap után növekszik a betöltött évek száma. Február 29-i születésnél és hivatalos korhatárnál az alkalmazandó jogi szabályt külön kell ellenőrizni.",
    "Életkorszámítás",
    "A mai nap beleszámít?",
    "A betöltött életkor a két dátum naptári viszonyán alapul; a napközbeni órák általában nem részei a számításnak.",
    "Jogi korhatárhoz használható?",
    "Ellenőrzésre igen, de vitás vagy hivatalos ügyben az adott szabályozás és okirat az irányadó."
  ],
  "energia-atvalto-kalkulator": [
    "Joule, kilowattóra és kalória ugyanannak más léptéke",
    "Energiafogyasztás, fűtés vagy fizikai feladat során különböző egységek jelenhetnek meg. Az átváltás akkor helyes, ha valóban energiát hasonlítasz energiával, és nem kevered a teljesítménnyel.",
    "Az energia nem teljesítmény",
    "A kilowatt a pillanatnyi teljesítmény, a kilowattóra az idő alatt felhasznált energia. Egy 2 kW-os készülék félórás működése ideális esetben 1 kWh energiát jelent.",
    "Energiaegységek",
    "A táplálkozási kcal ugyanaz, mint a fizikai kalória?",
    "A címkén szereplő 1 kcal 1000 kis kalóriának felel meg, és körülbelül 4,184 kJ.",
    "Áramköltséget is ad az átváltó?",
    "Önmagában nem; ehhez az energia mellett az aktuális egységár és esetleges díjtételek is kellenek."
  ],
  "eves-auto-koltseg-kalkulator": [
    "Az autó éves ára jóval több a tankolásnál",
    "Biztosítás, adók, szerviz, gumi, parkolás, útdíj és üzemanyag együtt mutatja meg, mennyibe kerül a használat. Havi átlagra bontva könnyebb más közlekedési megoldással vagy másik autóval összevetni.",
    "A ritka nagy kiadásokat is oszd szét",
    "Egy többévente esedékes gumiszett vagy nagy szerviz évesített része nélkül a havi költség túl kedvezőnek látszik. Az értékvesztés különösen újabb autónál lehet a legnagyobb, mégis gyakran kimarad.",
    "Autóköltség-tervezés",
    "A hiteltörlesztőt költségként vegyem fel?",
    "A havi pénzáramlásban igen, de gazdasági összehasonlításnál a tőkerész és a kamat külön kezelése pontosabb.",
    "Mennyi időszak ad reális átlagot?",
    "Legalább egy teljes év, mert így a szezonális és éves tételek is megjelennek."
  ],
  "feherje-szukseglet-kalkulator": [
    "Fehérjecél testsúlyhoz és aktivitáshoz",
    "A napi becslés a testsúly és a választott aktivitás vagy cél alapján ad grammban kifejezett tartományt. Érdemes több étkezés között elosztani, és nem csak egyetlen forrásból fedezni.",
    "A több nem automatikusan jobb",
    "Edzésmúlt, energia-bevitel, életkor és testösszetétel módosíthatja az igényt. Vesebetegség, várandósság vagy speciális étrend esetén ne általános kalkulátorból állíts be célt, hanem kérj dietetikusi vagy orvosi segítséget.",
    "Fehérjebevitel",
    "A teljes testsúllyal számoljak?",
    "Általános esetben igen, de jelentős túlsúlynál szakember korrigált vagy céltestsúly alapú számítást javasolhat.",
    "Csak az állati fehérje számít?",
    "Nem. Növényi források is beleszámítanak; a változatosság és az aminosav-összetétel fontos."
  ],
  "fizetesi-hatarido-kalkulator": [
    "Mikor jár le ténylegesen a számla?",
    "A kiállítás vagy más kezdő dátum és a vállalt napok alapján tervezhető a fizetési határidő. Munkanapos számításnál a hétvégék kezelése eltér a naptári napoktól, ami pénzforgalmi tervezésnél lényeges.",
    "Szerződés és jogszabály felülírhatja az egyszerű számolást",
    "Ünnepnap, banki feldolgozás, szerződéses kikötés vagy külön ágazati szabály módosíthatja, mikor minősül időben teljesítettnek a fizetés. Követeléskezelés előtt könyvelővel vagy jogásszal ellenőrizd az alkalmazandó szabályt.",
    "Határidőnél tisztázandó",
    "A kiállítás napja az első nap?",
    "Ez a szerződés és a határidő-számítás szabályától függ; a kalkulátor választott módszerét ennek megfelelően használd.",
    "A munkanap mód figyeli az ünnepnapokat?",
    "Csak akkor, ha az oldal ünnepnapi naptárt is használ; ennek hiányában a hétvégeket kezeli, az egyedi munkarendet nem."
  ],
  "fuga-kalkulator": [
    "A fugamennyiség a hézag geometriájából indul",
    "A lap mérete, vastagsága, a fuga szélessége és a burkolt felület együtt határozza meg az anyagigényt. Keskenyebb lapoknál ugyanakkora felületen több fugahossz keletkezik.",
    "A gyártói kiadósság legyen az utolsó ellenőrzés",
    "A képlet ideális hézaggal számol, de a mélység, felületi veszteség és keverési maradék növelheti a fogyást. A zsákon szereplő táblázatot és a kivitelező tapasztalatát mindig vesd össze a becsléssel.",
    "Fugázás előtt",
    "Kell ráhagyás?",
    "Igen, kisebb munkánál különösen, mert a keverőedényben és tisztításkor arányaiban több anyag veszhet el.",
    "Szilikonfugára is használható?",
    "Nem; a perem- és dilatációs hézagok tömítőanyagát folyóméter és hézagkeresztmetszet alapján kell tervezni."
  ],
  "gipszkarton-kalkulator": [
    "Lapigény rétegszámmal és szabási tartalékkal",
    "A burkolandó felület, a rétegek száma és egy tábla fedése alapján becsülhető a szükséges darabszám. Falnál mindkét oldalt külön felületként kezeld, ha mindkettő burkolást kap.",
    "A lapdarab nem teljes anyaglista",
    "Vázprofil, csavar, hézagerősítő, glett, szigetelés és nyíláskiváltás nincs benne a táblaszámban. Tűz-, hang- vagy páratechnikai követelménynél a rendszer gyártói előírása az irányadó.",
    "Gipszkarton-tervezés",
    "Levonom az ajtónyílást?",
    "Nagy nyílást érdemes levonni, de a körülötte szükséges szabások és merevítések miatt ne számolj túl szűken.",
    "Miért kell több réteget megadni?",
    "Bizonyos hang-, tűz- vagy teherbírási igény két réteg burkolatot kívánhat; ezt a választott rendszer határozza meg."
  ],
  "gumi-meret-kalkulator": [
    "A váltóméret átmérője számít",
    "A gumi szélességéből, oldalfal-arányából és felniátmérőjéből számítható a teljes kerékátmérő és kerület. A hasonló külső méret segít, hogy a sebességmérő és a futómű geometriája ne térjen el túlzottan.",
    "A geometria önmagában nem engedély",
    "Terhelési és sebességindex, felni szélessége, ET, fékhely, karosszéria és gyártói homologizáció is szükséges a biztonságos választáshoz. Vásárlás előtt ellenőrizd a jármű dokumentációját vagy kérj gumis szakvéleményt.",
    "Váltóméret-kérdések",
    "Mekkora eltérés elfogadható?",
    "Gyakori ökölszabály a néhány százalékon belüli átmérő, de a hivatalos gyártói méretlista az elsődleges.",
    "A kalkulátor megmondja, elfér-e a kerék?",
    "Nem; ehhez a felni paraméterei, a futómű és a karosszéria szabad helye is kell."
  ],
  "hatotav-kalkulator": [
    "Meddig elég a rendelkezésre álló üzemanyag?",
    "A tankban lévő mennyiség és a várható átlagfogyasztás alapján becsülhető a megtehető távolság. Hosszú út előtt ez segít megtervezni a tankolási pontot, különösen ritkán lakott szakaszon.",
    "A tartalék nem felhasználási cél",
    "Emelkedő, szembeszél, utánfutó, hideg és nagy sebesség csökkentheti a hatótávot. Ne az elméleti maximumig tervezz: a műszer pontatlansága és a forgalmi kerülő miatt hagyj biztonsági tartalékot.",
    "Hatótáv-tervezés",
    "A névleges tankméret teljesen felhasználható?",
    "Nem biztos; a konstrukció, a betöltés és a jeladó miatt a ténylegesen használható mennyiség eltérhet.",
    "Elektromos autóra is jó?",
    "Ehhez energiafogyasztás és akkukapacitás alapú számítás kell, nem liter és l/100 km."
  ],
  "havi-koltsegvetes-kalkulator": [
    "A hónap végi maradvány legyen tervezett, ne véletlen",
    "A bevétel és a fő kiadási csoportok egy helyen megmutatják, mekkora összeg marad megtakarításra vagy váratlan tételekre. A legjobb bemenetet bankszámlakivonatból és több hónap átlagából kapod.",
    "A ritka kiadásokat alakítsd havi tétellé",
    "Biztosítás, éves előfizetés, iskolakezdés vagy autószerviz akkor is része a költségvetésnek, ha nem minden hónapban jelentkezik. Ha az eredmény tartósan negatív, előbb a fix kötelezettségeket és a nagy változó kategóriákat vizsgáld meg.",
    "Költségvetési döntések",
    "A hitelkártyás vásárlást mikor számoljam el?",
    "A költés hónapjában, különben a következő havi visszafizetés hamis képet adhat a fogyasztás időpontjáról.",
    "Mekkora megtakarítási arány a jó?",
    "Nincs mindenkire érvényes százalék; a stabil, fenntartható és célhoz kötött összeg fontosabb."
  ],
  "hitelkepesseg-kalkulator": [
    "Jövedelmi teherbírás banki ajánlat előtt",
    "A nettó jövedelem, meglévő törlesztések, kamat és futamidő alapján becsülhető, mekkora új havi részlet férhet bele. Több kamatszinttel érdemes számolni, hogy egy drágább ajánlat hatása is látható legyen.",
    "A bank döntése ennél több adatból áll",
    "A JTM-korlát mellett számít a jövedelem elfogadhatósága, munkaviszony, fedezet, életkor, hitelmúlt és banki belső szabály. Az eredmény nem hitelígéret és nem tartalmaz minden díjat; konkrét döntéshez banki előminősítés kell.",
    "Hitelkeret értelmezése",
    "A maximális részletet célszerű teljesen kihasználni?",
    "Általában nem: a jogszabályi plafon nem azonos a kényelmes háztartási teherrel, ezért hagyj tartalékot.",
    "A hitelkártya-keret is meglévő teher?",
    "A bankok a fel nem használt keret egy részét is figyelembe vehetik; ezt az adott intézménynél ellenőrizd."
  ],
  "homerseklet-atvalto-kalkulator": [
    "Celsius, Fahrenheit és Kelvin között",
    "Utazás, recept, időjárási adat vagy műszaki leírás esetén a hőmérséklet-skálák közötti átváltás gyorsan elvégezhető. A Celsius–Fahrenheit kapcsolat nem egyszerű szorzás, mert a nullapontjuk is eltér.",
    "A Kelvin nem fok",
    "A kelvin abszolút skála, ezért a jelölése K, fokjel nélkül. Fizikailag 0 K alatti klasszikus hőmérséklet nem értelmezhető; a kerekítés tudományos számításnál érdemi eltérést okozhat.",
    "Hőmérsékleti kérdések",
    "Mikor azonos a Celsius és Fahrenheit számértéke?",
    "–40-nél: –40 °C pontosan –40 °F.",
    "Átváltható a sütő fokozata is?",
    "A hőfok igen, de a légkeverés és a sütő tényleges kalibrációja miatt a recept eredménye eltérhet."
  ],
  "hoszigeteles-kalkulator": [
    "Szigetelőanyag csomagszámra kerekítve",
    "A nettó felülethez adott ráhagyásból és a csomag fedéséből becsülhető a rendelési mennyiség. Homlokzatnál külön mérd a falsíkokat, és csak ezután vond le a nagy nyílásokat.",
    "A négyzetméter nem mondja meg a megfelelő rétegrendet",
    "Anyagtípus, vastagság, hővezetési tényező, dübelezés, ragasztás és páratechnika szakmai tervezést igényel. A kalkulátor csomagszámot ad, energetikai megfelelőséget nem igazol.",
    "Szigetelési anyagterv",
    "Mennyi ráhagyás indokolt?",
    "Egyszerű sík felületen kisebb, sok éllel és nyílással tagolt homlokzaton nagyobb tartalék lehet ésszerű.",
    "A ragasztó és háló is benne van?",
    "Nem; ezeket a választott rendszer gyártói fogyási adata alapján külön kell számolni."
  ],
  "hosszusag-atvalto-kalkulator": [
    "Hosszúságegységek közös skálán",
    "Millimétertől kilométerig vagy hüvelyktől lábig ugyanaz a méret más számmal jelenik meg. Tervrajz, képernyőméret, utazás vagy külföldi termékadat esetén az átváltó csökkenti az egységkeverés kockázatát.",
    "A pontosságot ne növeld mesterségesen",
    "Egy durván mért adat átváltva sem lesz pontosabb. Műszaki munkánál annyi tizedest tarts meg, amennyit az eredeti mérés és a szükséges tűrés indokol.",
    "Hosszúságváltás",
    "A col és a hüvelyk ugyanaz?",
    "Igen, a magyar köznyelvi col az inch megfelelője; 1 inch pontosan 25,4 mm.",
    "Miért tér el a kijelzett kerek érték?",
    "A véges tizedesre kerekítés miatt; továbbszámoláshoz lehetőleg a nem kerekített értéket használd."
  ],
  "idealis-testsuly-kalkulator": [
    "Az ideális testsúly nem egyetlen kötelező szám",
    "A testmagasságból számított képletek tájékozódási pontot adnak, de nem látják a csontozatot, izomtömeget, életkort vagy egészségi állapotot. Érdemes inkább tartományként, nem célparancsként olvasni az eredményt.",
    "A jó cél egészségi állapothoz és életmódhoz illeszkedik",
    "Sportolónál vagy idősebb korban ugyanaz a kilogrammérték mást jelenthet. Jelentős fogyás, evészavar, várandósság vagy krónikus betegség esetén az egyéni célt orvos vagy dietetikus segítségével állítsd be.",
    "Testsúlycélok",
    "Miért adnak eltérő számot a képletek?",
    "Más népességi mintából és feltételezésekből indulnak, ezért nincs egyetlen univerzális eredmény.",
    "A BMI-t is nézzem meg?",
    "Kiegészítő támpont lehet, de a BMI-nek is vannak korlátai, ezért a trendek és más egészségi adatok együtt értelmezendők."
  ],
  "ido-atvalto-kalkulator": [
    "Másodperctől napig ugyanaz az időtartam",
    "Munkaidő, sporteredmény vagy technikai adat átváltásakor az időtartamot lehet más egységben kifejezni. A számítás 60 másodperces perccel és 60 perces órával dolgozik.",
    "Az időtartam nem naptári idő",
    "Egy hónap nem állandó számú nap, egy nap pedig óraátállításkor helyi idő szerint lehet 23 vagy 25 óra. Naptári határidőhöz dátumkalkulátor, időzónákhoz külön időpont-átváltás szükséges.",
    "Időegységek",
    "Átváltható egy hónap órákra?",
    "Csak választott feltételezéssel, mert a hónapok hossza eltér.",
    "A tizedes óra mit jelent?",
    "Például 1,5 óra 1 óra 30 perc, nem 1 óra 50 perc."
  ],
  "kilometerdij-kalkulator": [
    "Egy üzleti kilométer valós költsége",
    "A távolság és az alkalmazott kilométerdíj alapján becsülhető az elszámolható vagy ajánlatba építendő összeg. Vállalkozásnál ez segít, hogy a kiszállás ne csak az üzemanyagot fedezze.",
    "A díjban legyen világos, mi szerepel",
    "Üzemanyag, kopás, értékvesztés, biztosítás és munkaidő eltérő módon épülhet be. Adózási vagy költségtérítési elszámolásnál mindig az aktuális hivatalos szabály és dokumentáció az irányadó.",
    "Kilométerdíj elszámolás",
    "Az oda-vissza távolságot adjam meg?",
    "Ha mindkét irány a szolgáltatás miatt merül fel, általában a teljes megtett útból érdemes kiindulni.",
    "Az autópályadíj része a kilométerdíjnak?",
    "Csak akkor, ha ezt előre így határoztad meg; különben átláthatóbb külön tételként kezelni."
  ],
  "makro-kalkulator": [
    "Fehérje, zsír és szénhidrát a napi keretben",
    "A makrók grammban osztják fel a becsült energiabevitelt. Egy gramm fehérje és szénhidrát közel 4, egy gramm zsír körülbelül 9 kilokalóriát képvisel, ezért a százalék és a gramm nem azonos arány.",
    "A számok mellett az élelmiszer minősége is számít",
    "Rost, vitaminok, telítettség és egyéni tolerancia nem látszik a makróarányból. Sportcél, betegség, várandósság vagy jelentős fogyás esetén személyre szabott étrendet dietetikussal érdemes készíteni.",
    "Makrótervezés",
    "Pontosan el kell találnom minden nap?",
    "Nem; a többnapos átlag és a következetes, tartható étkezés fontosabb a grammra tökéletes napoknál.",
    "Az alkohol melyik makró?",
    "Egyik sem, de energiát ad, ezért a napi kalóriamérlegben külön számolni kell vele."
  ],
  "munkaido-kalkulator": [
    "A jelenléti időből tényleges munkaidő",
    "Kezdés, befejezés és szünet alapján kiszámítható a ledolgozott idő. Több műszaknál vagy éjfélen átnyúló munkánál különösen könnyű kézzel egy órát tévedni.",
    "A szünet jogi kezelése külön kérdés",
    "Nem minden szünet számít munkaidőnek, és a műszakpótlék sem pusztán az óraszámból következik. Bér- vagy munkaügyi vita esetén a munkaszerződés, nyilvántartás és hatályos szabály az irányadó.",
    "Munkaidő-rögzítés",
    "Hogyan számoljak éjfél után végződő műszakkal?",
    "A befejezést a következő nap időpontjaként kell kezelni, nem korábbi óraként.",
    "A túlórát automatikusan megmutatja?",
    "Csak akkor, ha a rendes munkaidő kerete is meg van adva; a puszta időtartam ezt nem dönti el."
  ],
  "nyomas-atvalto-kalkulator": [
    "Pascal, bar és psi egy rendszerben",
    "Guminyomás, gépészet vagy időjárási adat esetén ugyanaz a nyomás több egységben jelenhet meg. Átváltás előtt ellenőrizd, hogy tizedesvesszőt és megfelelő nagyságrendet adtál-e meg.",
    "Abszolút és túlnyomás nem ugyanaz",
    "A műszerek gyakran a légköri nyomáshoz viszonyított túlnyomást mutatják, miközben műszaki számítás abszolút nyomást kérhet. Az egységváltás ezt a referencia-különbséget nem korrigálja automatikusan.",
    "Nyomásegységek",
    "Mennyi 1 bar pascalban?",
    "1 bar pontosan 100 000 pascal.",
    "Autóguminál hideg vagy meleg értéket használjak?",
    "A gyártói ajánlás jellemzően hideg abroncsra vonatkozik; az autó kézikönyve az irányadó."
  ],
  "oraber-kalkulator": [
    "Havi jövedelemből valódi óradíj",
    "A havi összeg és ledolgozott órák alapján kiszámítható az alap órabér. Vállalkozói díjnál azonban a számlázható órák száma kisebb a teljes munkaidőnél, mert adminisztráció és ügyfélszerzés is időt visz el.",
    "Bruttó, nettó és vállalkozói díj külön fogalom",
    "Munkabérnél az adók és pótlékok, vállalkozásnál a költségek, szabadság és kockázat változtatja a kézhez kapott összeget. Ajánlatadáshoz ne csak a kívánt nettó jövedelmet oszd el 160 órával.",
    "Óradíj-számítás",
    "A fizetett szabadságot beleszámítsam?",
    "Alkalmazotti összehasonlításnál igen, vállalkozói célárnál pedig a nem számlázható napokat külön fedezni kell.",
    "Miért más a túlóra óradíja?",
    "Pótlék vagy eltérő megállapodás kapcsolódhat hozzá, amit az alap órabér önmagában nem tartalmaz."
  ],
  "padlo-burkolat-kalkulator": [
    "Csomagra kerekített padlóburkolat",
    "A helyiség alapterületéhez hozzáadott szabási tartalék és a csomag fedése megmutatja, hány teljes csomagot kell megvenni. L alakú helyiséget célszerű téglalapokra bontva felmérni.",
    "A lerakási irány anyagot változtathat",
    "Átlós minta, sok ajtófülke vagy keskeny helyiség több vágással járhat. Vásárlásnál azonos gyártási tételt válassz, és maradjon néhány elem későbbi javításhoz.",
    "Padlóanyag tervezése",
    "Levonjam a beépített szekrényt?",
    "Csak akkor, ha biztosan nem kerül alá burkolat és a későbbi átrendezés sem igényli.",
    "Az alátét és szegőléc is benne van?",
    "Nem; az alátétet négyzetméterben, a szegőlécet a helyiség kerületéből kell külön számolni."
  ],
  "pulzus-zona-kalkulator": [
    "Edzésintenzitás becsült pulzustartományokkal",
    "Az életkorból becsült maximális pulzus és a választott intenzitás alapján kijelölhetők könnyű, közepes vagy erős zónák. Kezdőként a beszédteszt és a terhelésérzet jó kiegészítő visszajelzés.",
    "A maximális pulzus képlete átlagot ír le",
    "Egyéni eltérés akár jelentős is lehet, gyógyszerek és szív-érrendszeri állapot pedig módosíthatja a pulzusválaszt. Mellkasi fájdalom, szédülés vagy ismert betegség esetén edzés előtt kérj orvosi tanácsot.",
    "Pulzuszónák",
    "Csuklós óra elég pontos?",
    "Egyenletes mozgásnál hasznos lehet, gyors változásnál vagy rossz illeszkedésnél mellkaspánt pontosabb.",
    "Miért magas a pulzusom ugyanazon a tempón?",
    "Hőség, dehidratáció, stressz, koffein, betegség és fáradtság is emelheti."
  ],
  "rezsi-megosztas-kalkulator": [
    "Közös költség méltányos felosztása",
    "Lakótársak vagy közös háztartás esetén az összes rezsi egyenlően, létszám, ott töltött napok vagy fogyasztás szerint osztható. A módszert még a számla érkezése előtt érdemes közösen rögzíteni.",
    "Az egyenlő rész nem mindig igazságos",
    "Eltérő beköltözési idő, külön mérő vagy nagy fogyasztású saját eszköz indokolhat súlyozást. Az alapdíjat és a fogyasztási díjat akár külön szabály szerint is lehet felosztani.",
    "Rezsi megosztása",
    "Hogyan kezeljem a vendégeket?",
    "Tartós ott-tartózkodásnál érdemes előre megállapodni, mikortól számít plusz fogyasztónak.",
    "Kerekíthetek egész forintra?",
    "Igen, de a kerekítési különbözetet következetesen kezeld, hogy ne mindig ugyanaz fizessen többet."
  ],
  "sebesseg-atvalto-kalkulator": [
    "Kilométer/óra, méter/másodperc és mérföld/óra",
    "Közlekedési, sport- és műszaki adatok eltérő sebességegységet használhatnak. Az átváltás ugyanazt a mozgási sebességet fejezi ki más skálán, nem számol utazási időt vagy gyorsulást.",
    "Egység és időalap együtt változik",
    "A km/h és m/s közötti váltásnál nemcsak a kilométer–méter, hanem az óra–másodperc arányt is figyelembe kell venni. Emiatt 36 km/h pontosan 10 m/s.",
    "Sebességváltás",
    "A csomó milyen egység?",
    "Egy tengeri mérföld óránként; hajózásban és repülésben használják.",
    "Kiszámítható ebből a menetidő?",
    "Igen, külön távolság/idő összefüggéssel, de a változó sebesség és megállások miatt ez csak becslés."
  ],
  "szamla-teljesites-kalkulator": [
    "A teljesítési dátum nem pusztán adminisztráció",
    "Kiállítás, teljesítés és fizetési határidő eltérő dátum lehet. A kalkulátor segít időrendbe tenni őket, de előbb az ügylet típusát és a szerződés szerinti teljesítést kell helyesen azonosítani.",
    "Áfa- és számviteli következménye lehet",
    "Folyamatos teljesítés, előleg, időszakos elszámolás vagy módosító számla speciális szabály alá eshet. Bizonytalan esetben ne a dátumkalkulátor alapján állíts ki bizonylatot, hanem kérdezd meg a könyvelőt.",
    "Számladátumok",
    "A fizetés napja mindig a teljesítés napja?",
    "Nem. Sok ügyletnél a szolgáltatás vagy termékátadás időpontja határozza meg a teljesítést.",
    "Folyamatos szolgáltatásnál használható?",
    "Csak az időszakos elszámolás aktuális szabályainak ismeretében; önmagában a napok hozzáadása nem elég."
  ],
  "tankolas-kalkulator": [
    "Tankolási keretből számolt liter",
    "A kalkulátor azt mutatja meg, hogy a megadott forintösszegből hány liter üzemanyagot lehet vásárolni az aktuális literenkénti ár mellett. Nem fogyasztásmérésre szolgál; ahhoz a megtett kilométer és az utántöltött liter szükséges.",
    "A képlet egyszerű, de az ár legyen pontos",
    "A számítás a tankolható liter = keret / Ft/l képletet használja. Kupon, flottakedvezmény, pontbeváltás vagy eltérő üzemanyagtípus esetén a ténylegesen fizetett ár módosíthatja az eredményt.",
    "Tankolási költségtervezés",
    "A teljes útiköltséget is kiszámolja?",
    "Nem. Ehhez távolságra és fogyasztásra is szükség van, ezért az üzemanyag költség kalkulátor illik hozzá jobban.",
    "Benzinhez és dízelhez is használható?",
    "Igen, ha a megfelelő literenkénti árat adod meg forintban."
  ],
  "tapeta-kalkulator": [
    "Tekercsszám a szükséges csíkokból",
    "A falak kerülete, belmagasság, tekercsszélesség és tekercshossz alapján becsülhető, hány teljes csík vágható és hány tekercs kell. A falakat több ponton mérd, mert a belmagasság eltérhet.",
    "A mintaillesztés sokat változtathat",
    "Nagy rapportnál minden csík vágásakor veszteség keletkezik, amit az egyszerű geometriai modell nem feltétlenül tartalmaz. Ablakoknál és ajtóknál is kellhet teljes hosszúságú csík a pontos illesztéshez.",
    "Tapétázási kérdések",
    "Levonjam az ajtókat és ablakokat?",
    "Nagy nyílásnál igen, de mintás tapétánál a megtakarítás kisebb lehet a csíkos kiosztás miatt.",
    "A ragasztó mennyiségét is megkapom?",
    "Nem; azt a tapéta anyaga és a ragasztó gyártói kiadóssága alapján számold."
  ],
  "teljesitmeny-atvalto-kalkulator": [
    "Watt, kilowatt és lóerő",
    "Motorok, gépek és háztartási eszközök teljesítményét különböző egységekben adják meg. Az átváltó azonos fizikai teljesítményt fejez ki, így összevethetővé teszi a specifikációkat.",
    "A teljesítmény nem fogyasztás",
    "Egy 2 kW-os eszköz névleges teljesítménye nem jelenti, hogy minden órában pontosan 2 kWh-t használ; termosztát, terhelés és hatásfok módosítja. Járműnél a motorteljesítményből önmagában gyorsulás vagy fogyasztás sem következik.",
    "Teljesítményegységek",
    "A metrikus és angolszász lóerő azonos?",
    "Nem teljesen; a PS és hp értéke kismértékben eltér, ezért nézd meg, melyiket használja a forrás.",
    "Áramfelvétel kiszámítható wattból?",
    "Feszültség, fázisszám, teljesítménytényező és hatásfok is kellhet hozzá."
  ],
  "terfogat-atvalto-kalkulator": [
    "Liter, köbméter és más térfogategységek",
    "Folyadék, tartály vagy építőanyag mennyiségénél ugyanaz a térfogat több egységben szerepelhet. Egy köbméter pontosan 1000 liter, ami nagyobb mennyiségeknél gyors ellenőrzési pont.",
    "Térfogat és tömeg csak sűrűséggel kapcsolható össze",
    "Egy liter víz tömege közel egy kilogramm, de olajnál, üzemanyagnál vagy ömlesztett anyagnál ez nem igaz. Literből kilogrammot csak az adott anyag sűrűségével válts.",
    "Térfogatváltás",
    "A milliliter és köbcentiméter azonos?",
    "Igen, 1 ml pontosan 1 cm³.",
    "A tartály névleges térfogata teljesen használható?",
    "Nem feltétlenül; holttér, biztonsági légrés és forma miatt a hasznos térfogat kisebb lehet."
  ],
  "terhessegi-kalkulator": [
    "Várható időpont az utolsó menstruáció alapján",
    "A terhességi kor és a becsült szülési dátum rendszerint az utolsó menstruáció első napjától számított 40 hétből indul. Ez különösen szabályos ciklus mellett ad használható első támpontot.",
    "Az ultrahang pontosíthatja a dátumot",
    "Ciklushossz, ovuláció időpontja és beágyazódás eltérése módosíthatja a becslést. A kalkulátor nem igazolja a terhességet és nem helyettesíti a várandósgondozást; fájdalom vagy vérzés esetén kérj azonnali orvosi segítséget.",
    "Várandóssági időszámítás",
    "Miért két héttel korábbról számolnak, mint a fogantatás?",
    "Mert az orvosi terhességi kor az utolsó menstruáció első napjától indul, amikor a fogantatás még nem történt meg.",
    "A kiírt napon születik a baba?",
    "Csak kis részük születik pontosan azon a napon; ez egy középérték, nem határidő."
  ],
  "terkovezes-kalkulator": [
    "Térkő darabszám felületből és ráhagyásból",
    "A burkolandó terület és az egy négyzetméterre jutó kőmennyiség alapján tervezhető a rendelés. Íves szél, sok vágás vagy összetett minta nagyobb tartalékot kíván, mint egy egyszerű téglalap.",
    "A felső burkolat csak a rendszer egyik része",
    "Szegély, ágyazóanyag, tömörített alapréteg, geotextil és vízelvezetés nincs benne a térkő darabszámában. Teherautóval terhelt felületnél a rétegrendet szakemberrel kell méretezni.",
    "Térköves anyagterv",
    "Mennyi követ tegyek félre javításhoz?",
    "Néhány százalék azonos gyártási tételből hasznos lehet, mert később az árnyalat nehezen pótolható.",
    "Lejtést is számol a kalkulátor?",
    "Nem; a megfelelő vízelvezetési lejtést helyszíni magassági terv alapján kell kialakítani."
  ],
  "terulet-atvalto-kalkulator": [
    "Négyzetméter, hektár és négyzetláb",
    "Ingatlan, telek, burkolat vagy külföldi alaprajz adatai könnyen közös egységre hozhatók. Területnél a hosszúság váltószáma négyzetre emelkedik, ezért 1 m² nem 100, hanem 10 000 cm².",
    "A térképi és hasznos terület eltérhet",
    "Ingatlannál a nettó, bruttó, hasznos és tulajdoni lap szerinti terület más fogalom lehet. Az átváltó az egységet változtatja, a mérési vagy jogi definíciót nem.",
    "Területegységek",
    "Mekkora egy hektár?",
    "10 000 m², vagyis egy 100 méter oldalhosszúságú négyzet területe.",
    "Átváltható a folyóméter négyzetméterre?",
    "Csak ismert szélességgel; a folyóméter hosszúság, a négyzetméter terület."
  ],
  "testzsir-kalkulator": [
    "Testzsírszázalékból csak becslés készül",
    "Körfogatok vagy más egyszerű adatok alapján követhető a testösszetétel változásának iránya. Azonos napszakban, azonos mérési pontokon végzett ismétlés többet ér, mint egyetlen elszigetelt szám.",
    "A módszerek között több százalékpont eltérés lehet",
    "Bőrredő, bioimpedancia, DEXA és körfogatképlet más elven működik. Hidratáltság, izomtömeg és mérési technika is torzít; egészségügyi értékeléshez szakember és megfelelő mérés szükséges.",
    "Testösszetétel",
    "Miért változik egyik napról a másikra?",
    "A valódi zsír nem változik ilyen gyorsan; folyadékállapot és mérési hiba okozza a legtöbb napi ingadozást.",
    "Melyik százalék az egészséges?",
    "A nem, az életkor és az egyéni állapot szerint eltérő tartományok használhatók, ezért egyetlen univerzális határ félrevezető."
  ],
  "tetocserep-kalkulator": [
    "Tetőfelületből rendelhető cserépmennyiség",
    "A tetősíkok területe, a cserép négyzetméterenkénti igénye és a tartalék alapján becsülhető a darabszám. Minden tetősíkot külön mérj, és a ferde hosszt használd, ne a vízszintes vetületet.",
    "Hajlatok és kiegészítők növelik az anyaglistát",
    "Vápák, élek, áttörések és vágott sorok több veszteséget okoznak. Kúpcserép, szellőzőelem, rögzítő és alátétfólia külön tétel; a kiosztást és viharbiztos rögzítést tetőfedővel ellenőriztesd.",
    "Tetőfedési kérdések",
    "A hajlásszög változtatja a darabigényt?",
    "A tényleges tetőfelületet igen, a gyártói fedési szélességet és léctávolságot pedig a termékrendszer határozza meg.",
    "Mennyi tartalék maradjon?",
    "Bonyolult tetőn több, egyszerű nyeregtetőn kevesebb lehet indokolt; néhány ép darabot javításhoz is tegyél félre."
  ],
  "tomeg-atvalto-kalkulator": [
    "Milligrammtól tonnáig, illetve fontig",
    "Recept, csomagsúly vagy külföldi termékadat esetén a tömeg egysége gyorsan átváltható. Nagy léptékkülönbségnél különösen figyelj a tizedesjelre, mert egy elütés ezerszeres hibát okozhat.",
    "A tömeg és a súly a hétköznapokban keveredik",
    "A kilogramm tömeg, a fizikai súly pedig erő és newtonban mérhető. Hétköznapi mérlegelésnél a kilogrammos átváltás megfelelő, mérnöki számításnál viszont a fogalmakat külön kell kezelni.",
    "Tömegegységek",
    "Mennyi egy font?",
    "Egy nemzetközi avoirdupois font pontosan 0,45359237 kilogramm.",
    "Literből válthatok kilogrammra?",
    "Csak az anyag sűrűségének ismeretében; vízre használható közelítés más folyadékra nem általánosítható."
  ],
  "utazasi-ido-kalkulator": [
    "Menetidő távolságból és átlagsebességből",
    "Az elméleti idő jó útvonal-összehasonlításra és indulási idő becslésére. Reális bemenetként ne a megengedett legnagyobb sebességet, hanem az út típusához illő várható átlagot add meg.",
    "A megállások külön időt jelentenek",
    "Forgalom, pihenő, tankolás, határátkelés és parkolókeresés nincs benne az egyenletes sebességű modellben. Hosszabb útnál biztonsági és pihenőidő-tartalékot is adj a kapott eredményhez.",
    "Menetidő tervezése",
    "Autópályán 130 km/h-val számoljak?",
    "Nem célszerű, mert lassítások és forgalom miatt a teljes út átlaga alacsonyabb lesz.",
    "Kompot vagy időzónát kezel a számítás?",
    "Nem; ezek menetrendi, várakozási és helyi idő szerinti korrekciót igényelnek."
  ],
  "vakolat-kalkulator": [
    "Zsákszám felületből és rétegvastagságból",
    "A vakolandó négyzetméter, az átlagos vastagság és a gyártói kg/m²/mm fogyás alapján becsülhető az anyagtömeg. A fal egyenetlenségét több ponton mérve reálisabb átlag adható meg.",
    "A névleges vastagság ritkán mindenhol azonos",
    "Élek, javítások, keverési veszteség és lehulló anyag növeli a fogyást. A megengedett egy- vagy többrétegű vastagságot, alapozást és száradási feltételeket a termék adatlapja szerint tartsd be.",
    "Vakolási anyagigény",
    "Levonjam a nyílásokat?",
    "Nagy ajtót és ablakot igen, de a kávák felületét add vissza a számításhoz.",
    "Minden vakolat fogyása azonos?",
    "Nem; gipszes, meszes, cementes és gépi termékek kiadóssága eltér, ezért a csomag adatát használd."
  ],
  "vizfogyasztas-kalkulator": [
    "Napi folyadékigény kiinduló becslése",
    "Testsúly és aktivitás alapján meghatározható egy hozzávetőleges napi mennyiség. A víz mellett leves, tej, tea és magas víztartalmú élelmiszer is hozzájárulhat a teljes folyadékbevitelhez.",
    "Hőség és egészségi állapot felülírhatja az átlagot",
    "Sport, láz, szoptatás és meleg idő növelheti az igényt, míg szív- vagy vesebetegség esetén orvos korlátozást írhat elő. Szélsőséges mennyiség rövid idő alatti elfogyasztása veszélyes lehet.",
    "Folyadékpótlás",
    "A kávé beleszámít?",
    "Mérsékelt fogyasztásnál folyadékot is biztosít, de ne kizárólag koffeines italból fedezd a napi mennyiséget.",
    "Edzés után csak vizet igyak?",
    "Hosszú, intenzív vagy nagy izzadással járó terhelésnél elektrolitpótlásra is szükség lehet."
  ]
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const section = (guide, index) => {
  const [heading, lead, subheading, detail, faqHeading, q1, a1, q2, a2] = guide;
  const orders = [
    `<h2>${escapeHtml(heading)}</h2>\n      <p>${escapeHtml(lead)}</p>\n      <h3>${escapeHtml(subheading)}</h3>\n      <p>${escapeHtml(detail)}</p>`,
    `<h2>${escapeHtml(subheading)}</h2>\n      <p>${escapeHtml(detail)}</p>\n      <h3>${escapeHtml(heading)}</h3>\n      <p>${escapeHtml(lead)}</p>`,
    `<h2>${escapeHtml(heading)}</h2>\n      <div class="content-split">\n        <div><h3>${escapeHtml(subheading)}</h3><p>${escapeHtml(detail)}</p></div>\n        <p>${escapeHtml(lead)}</p>\n      </div>`
  ];

  return `    <section class="article calculator-guide">
      ${orders[index % orders.length]}
      <h2>${escapeHtml(faqHeading)}</h2>
      <div class="faq-list" data-accordion="single">
        <details>
          <summary>${escapeHtml(q1)}</summary>
          <p>${escapeHtml(a1)}</p>
        </details>
        <details>
          <summary>${escapeHtml(q2)}</summary>
          <p>${escapeHtml(a2)}</p>
        </details>
      </div>
    </section>`;
};

const generatedPattern = /\s*<section class="article generated-seo" data-generated-seo="calculator">[\s\S]*?<\/section>/;
const genericIntroPattern = /\s*<section class="article">(?=[\s\S]*?<strong>Tipp:<\/strong>\s*A kalkulátor gyors becslést ad)[\s\S]*?<\/section>/;
let changed = 0;

Object.entries(guides).forEach(([slug, guide], index) => {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó kalkulátoroldal: ${slug}`);

  const original = fs.readFileSync(file, "utf8");
  if (!generatedPattern.test(original)) return;

  const withoutGenericIntro = original.replace(genericIntroPattern, "");
  const updated = withoutGenericIntro.replace(generatedPattern, `\n${section(guide, index)}`);
  fs.writeFileSync(file, updated, "utf8");
  changed += 1;
});

const mergedPriorityPages = [
  "festek-kalkulator",
  "tegla-kalkulator",
  "szazalek-kalkulator",
  "afa-kalkulator",
  "osztalek-kalkulator",
  "kamatos-kamat-kalkulator",
  "hitel-torleszto-kalkulator",
  "milliomos-kalkulator",
  "auto-fogyasztas-kalkulator",
  "uzemanyag-koltseg-kalkulator"
];

let merged = 0;
mergedPriorityPages.forEach((slug) => {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  const original = fs.readFileSync(file, "utf8");
  const withoutLegacyArticle = original.replace(
    /\s*<section class="article">[\s\S]*?<\/section>/,
    ""
  );
  const updated = withoutLegacyArticle.replace(
    /\s*<section class="article-recommendation">[\s\S]*?<\/section>/,
    ""
  );

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    merged += 1;
  }
});

console.log(`${changed} generált tartalmi blokk frissítve, ${merged} kiemelt oldal összevonva.`);
