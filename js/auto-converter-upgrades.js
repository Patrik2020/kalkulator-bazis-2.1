(() => {
  "use strict";
  const slug = window.location.pathname.split("/").pop()?.replace(/\.html$/, "") || "";
  const supported = new Set([
    "eves-auto-koltseg-kalkulator","auto-ertekvesztes-kalkulator","kilometerdij-kalkulator","co2-kibocsatas-kalkulator","gumi-meret-kalkulator","uzemanyag-koltseg-kalkulator",
    "adatmeret-atvalto-kalkulator","energia-atvalto-kalkulator","teljesitmeny-atvalto-kalkulator","hosszusag-atvalto-kalkulator","tomeg-atvalto-kalkulator","terulet-atvalto-kalkulator","terfogat-atvalto-kalkulator","ido-atvalto-kalkulator","sebesseg-atvalto-kalkulator"
  ]);
  if (!supported.has(slug)) return;
  window.KB_AUTO_CONVERTER_UPGRADE_READY = null;
  const card = document.querySelector(".card-calculator");
  if (!card) return;
  const n = (v, f = 0) => { const x = Number(String(v ?? "").replace(/\s/g, "").replace(",", ".")); return Number.isFinite(x) ? x : f; };
  const fmt = (v, d = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: d }).format(v);
  const money = (v) => `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(v)} Ft`;
  const field = (s) => {
    const l = document.createElement("label"); l.className = "ac-field"; l.innerHTML = `<span>${s.label}</span>`;
    let i;
    if (s.options) { i = document.createElement("select"); s.options.forEach(([v,t]) => { const o=document.createElement("option"); o.value=v;o.textContent=t;if(String(v)===String(s.value))o.selected=true;i.appendChild(o); }); }
    else { i=document.createElement("input"); i.type=s.type||"number"; if(s.step)i.step=s.step; if(s.min!==undefined)i.min=s.min; if(s.max!==undefined)i.max=s.max; if(i.type==="number")i.inputMode="decimal"; }
    i.required=s.required!==false;
    i.id=s.id;i.name=s.id;i.value=s.value??"";l.appendChild(i); if(s.help) l.insertAdjacentHTML("beforeend",`<small>${s.help}</small>`); return l;
  };
  const rows = (pairs) => `<dl>${pairs.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>`;
  const refs = {
    length: [["1 km","1000 m"],["1 m","100 cm"],["1 inch","2,54 cm"],["1 mérföld","1,609344 km"]],
    mass: [["1 kg","1000 g"],["1 font","0,45359237 kg"],["1 uncia","28,3495 g"],["1 tonna","1000 kg"]],
    area: [["1 ha","10 000 m²"],["1 km²","1 000 000 m²"],["1 acre","4046,856 m²"],["1 m²","10 000 cm²"]],
    volume: [["1 liter","1000 ml"],["1 m³","1000 liter"],["1 US gallon","3,785411784 liter"],["1 imperial gallon","4,54609 liter"]],
    time: [["1 nap","24 óra"],["1 hét","7 nap"],["1 év","365 vagy 366 nap"],["1 óra","3600 másodperc"]],
    speed: [["1 m/s","3,6 km/h"],["1 mph","1,609344 km/h"],["100 km/h","27,78 m/s"],["1 csomó","1,852 km/h"]]
  };
  const configs = {
    "eves-auto-koltseg-kalkulator": { title:"Éves autóköltség-tervező", fields:[
      {id:"km",label:"Éves futás (km)",value:15000,min:1},{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5,min:0},{id:"fuel",label:"Üzemanyagár (Ft/l)",value:620,min:0},{id:"insurance",label:"Biztosítás évente",value:90000,min:0},{id:"tax",label:"Adó és matrica",value:80000,min:0},{id:"service",label:"Szerviz és javítás",value:220000,min:0},{id:"tyres",label:"Gumi évesített költsége",value:70000,min:0},{id:"parking",label:"Parkolás évente",value:180000,min:0},{id:"depreciation",label:"Értékvesztés évente",value:350000,min:0,help:"Gazdasági költség: nem feltétlenül jelent éves készpénzkiadást."}
    ], compute:v=>{const km=n(v.km),cons=n(v.cons),fuelPrice=n(v.fuel),costs=[n(v.insurance),n(v.tax),n(v.service),n(v.tyres),n(v.parking),n(v.depreciation)];if(km<=0)throw new Error("Az éves futás legyen nagyobb nullánál.");if(cons<0||fuelPrice<0||costs.some(x=>x<0))throw new Error("A fogyasztás és a költségek nem lehetnek negatívak.");const fuel=km*cons/100*fuelPrice,fixed=costs.reduce((a,b)=>a+b,0),total=fuel+fixed;return [["Üzemanyag",money(fuel)],["Egyéb éves költség + értékvesztés",money(fixed)],["Éves teljes gazdasági költség",money(total)],["Havi átlag",money(total/12)],["Teljes költség kilométerenként",`${fmt(total/km,1)} Ft/km`]]; } },
    "auto-ertekvesztes-kalkulator": { title:"Autóérték-vesztési forgatókönyvek", fields:[
      {id:"price",label:"Jelenlegi érték (Ft)",value:5000000,min:0},{id:"years",label:"Időtáv (év)",value:5,min:1,max:80,step:"1"},{id:"firstLow",label:"Példa – óvatos: 1. vizsgált év (%)",value:8,min:0,max:100},{id:"laterLow",label:"Példa – óvatos: további évek (%)",value:5,min:0,max:100},{id:"firstMid",label:"Példa – közép: 1. vizsgált év (%)",value:15,min:0,max:100},{id:"laterMid",label:"Példa – közép: további évek (%)",value:8,min:0,max:100},{id:"firstHigh",label:"Példa – erős: 1. vizsgált év (%)",value:25,min:0,max:100},{id:"laterHigh",label:"Példa – erős: további évek (%)",value:12,min:0,max:100},{id:"infl",label:"Infláció / defláció (%)",value:3.5,min:-99.99,help:"A mai vásárlóérték számításához; -100% nem értelmezhető."}
    ], compute:v=>{const price=n(v.price),years=n(v.years),infl=n(v.infl),rates=[n(v.firstLow),n(v.laterLow),n(v.firstMid),n(v.laterMid),n(v.firstHigh),n(v.laterHigh)];if(price<0)throw new Error("A jelenlegi érték nem lehet negatív.");if(!Number.isInteger(years)||years<1||years>80)throw new Error("Az időtáv 1 és 80 év közötti egész szám legyen.");if(rates.some(x=>x<0||x>100))throw new Error("Az értékvesztési ráták 0 és 100% között legyenek.");if(infl<=-100)throw new Error("Az infláció/defláció értéke legyen nagyobb -100%-nál.");const calc=(a,b)=>{let x=price;for(let y=1;y<=years;y++)x*=1-(y===1?a:b)/100;return x;};const vals=[["Óvatos",calc(rates[0],rates[1])],["Közép",calc(rates[2],rates[3])],["Erős",calc(rates[4],rates[5])]];return vals.flatMap(([name,x])=>[[`${name} nominális érték`,money(x)],[`${name} mai vásárlóértéken`,money(x/Math.pow(1+infl/100,years))]]); } },
    "kilometerdij-kalkulator": { title:"Teljes kilométerköltség-kalkulátor", fields:[{id:"annual",label:"Éves teljes autóköltség (Ft)",value:1200000,min:0},{id:"km",label:"Éves futás (km)",value:15000,min:1},{id:"trip",label:"Vizsgált út (km)",value:200,min:0},{id:"passengers",label:"Fizető utasok száma",value:1,min:1,step:"1"}], compute:v=>{const annual=n(v.annual),km=n(v.km),trip=n(v.trip),passengers=n(v.passengers);if(annual<0||km<=0||trip<0)throw new Error("A költség és a távolság adatai nem lehetnek negatívak; az éves futás legyen pozitív.");if(!Number.isInteger(passengers)||passengers<1)throw new Error("Az utasok száma pozitív egész szám legyen.");const per=annual/km;return [["Teljes költség",`${fmt(per,1)} Ft/km`],["Vizsgált út költsége",money(per*trip)],["Egy főre",money(per*trip/passengers)]];} },
    "co2-kibocsatas-kalkulator": { title:"Közvetlen és életciklusos CO₂-becslés", fields:[
      {id:"type",label:"Hajtás",value:"petrol",options:[["petrol","Benzin"],["diesel","Dízel"],["lpg","LPG"],["hybrid","Hibrid"],["phev","Plug-in hibrid"],["ev","Elektromos"]]},{id:"km",label:"Távolság (km)",value:100,min:0.01},{id:"cons",label:"Fogyasztás (l/100 km, EV-nél kWh/100 km)",value:6.5,min:0,help:"PHEV-nél ez a belső égésű ág fogyasztása; az elektromos ág külön mezőben van."},{id:"tailpipe",label:"Közvetlen tényező (kg CO₂/l)",value:2.31,step:"0.01",min:0,help:"Példa benzines érték. Más üzemanyagnál a tényezőt külön ellenőrizd; a hajtásválasztó nem írja át automatikusan."},{id:"upstream",label:"Üzemanyag-előállítási pótlék (kg CO₂e/l)",value:0.55,step:"0.01",min:0,help:"EV-nél nem használjuk; PHEV-nél csak a folyékony üzemanyag ágára vonatkozik."},{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50,min:0,max:100},{id:"electricCons",label:"PHEV elektromos fogyasztás (kWh/100 km)",value:18,min:0,step:"0.1",help:"Csak PHEV módban használjuk; az elektromosan megtett útszakasz fajlagos fogyasztása."},{id:"grid",label:"Árammix (kg CO₂e/kWh)",value:0.25,step:"0.01",min:0},{id:"chargingLoss",label:"Hálózati többletfogyasztás töltés miatt (%)",value:10,min:0,max:100,help:"10% azt jelenti, hogy 1 kWh akkumulátoroldali energia becsléséhez 1,10 kWh hálózati felvétellel számolunk."}
    ], compute:v=>{const type=String(v.type||""),km=n(v.km),cons=n(v.cons),tailpipe=n(v.tailpipe),upstream=n(v.upstream),grid=n(v.grid),overhead=n(v.chargingLoss);if(!["petrol","diesel","lpg","hybrid","phev","ev"].includes(type))throw new Error("Ismeretlen hajtástípus.");if(km<=0)throw new Error("A távolság legyen nagyobb nullánál.");if([cons,tailpipe,upstream,grid,overhead].some(x=>x<0))throw new Error("A fogyasztási és kibocsátási tényezők nem lehetnek negatívak.");let direct=0,total=0,energy="";if(type==="ev"){const kwh=km*cons/100;total=kwh*(1+overhead/100)*grid;energy=`${fmt(kwh,2)} kWh akkumulátoroldali energia`;}else if(type==="phev"){const share=n(v.electricShare),electricCons=n(v.electricCons);if(share<0||share>100||electricCons<0)throw new Error("A PHEV elektromos arány 0–100%, az elektromos fogyasztás pedig nem negatív legyen.");const es=share/100,fuelLiters=km*(1-es)*cons/100,electricKwh=km*es*electricCons/100;direct=fuelLiters*tailpipe;total=direct+fuelLiters*upstream+electricKwh*(1+overhead/100)*grid;energy=`${fmt(fuelLiters,2)} l üzemanyag + ${fmt(electricKwh,2)} kWh akkumulátoroldali energia`;}else{const liters=km*cons/100;direct=liters*tailpipe;total=direct+liters*upstream;energy=`${fmt(liters,2)} l üzemanyag`;}return [["Közvetlen használati kibocsátás",`${fmt(direct,2)} kg CO₂`],["Közvetlen + energiaellátási becslés",`${fmt(total,2)} kg CO₂e`],["Kilométerenként",`${fmt(total/km*1000,0)} g CO₂e/km`],["Felhasznált energia a modellben",energy],["Fontos","Jármű- és akkumulátorgyártás nincs benne; ez nem teljes életciklus-elemzés"]];} },
    "gumi-meret-kalkulator": { title:"Gumiméret-váltó és sebességeltérés", fields:[{id:"w1",label:"Régi szélesség (mm)",value:185,min:1},{id:"a1",label:"Régi oldalfal (%)",value:60,min:1},{id:"r1",label:"Régi felni (inch)",value:15,min:1},{id:"w2",label:"Új szélesség (mm)",value:195,min:1},{id:"a2",label:"Új oldalfal (%)",value:55,min:1},{id:"r2",label:"Új felni (inch)",value:15,min:1},{id:"speed",label:"Műszer szerinti sebesség",value:100,min:0}], compute:v=>{const dia=(w,a,r)=>2*w*a/100+r*25.4;const d1=dia(n(v.w1),n(v.a1),n(v.r1)),d2=dia(n(v.w2),n(v.a2),n(v.r2)),diff=(d2/d1-1)*100;return [["Régi átmérő",`${fmt(d1,1)} mm`],["Új átmérő",`${fmt(d2,1)} mm`],["Átmérőeltérés",`${fmt(diff,2)}%`],["Elméleti sebesség a geometriai arány alapján",`${fmt(n(v.speed)*d2/d1,1)} km/h`],["Méreteltérés jelzés",Math.abs(diff)<=2.5?"kis geometriai eltérés; a gyártói engedélyezést ettől még ellenőrizd":"nagyobb geometriai eltérés; ellenőrizd a gyártói engedélyezést"]];} },
    "uzemanyag-koltseg-kalkulator": { title:"Útiköltség- és érzékenységkalkulátor", fields:[{id:"distance",label:"Távolság (km)",value:500,min:0},{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5,min:0},{id:"price",label:"Üzemanyagár (Ft/l)",value:620,min:0},{id:"toll",label:"Útdíj és parkolás",value:0,min:0},{id:"people",label:"Utasok száma",value:1,min:1,step:"1"},{id:"priceChange",label:"Árváltozás teszt (%)",value:10,min:-100,help:"-100% esetén a tesztelt üzemanyagár 0 Ft/l; ennél kisebb érték nem értelmezhető."}], compute:v=>{const distance=n(v.distance),cons=n(v.cons),price=n(v.price),toll=n(v.toll),people=n(v.people),priceChange=n(v.priceChange);if([distance,cons,price,toll].some(x=>x<0))throw new Error("A távolság, fogyasztás, ár és díj nem lehet negatív.");if(!Number.isInteger(people)||people<1)throw new Error("Az utasok száma pozitív egész szám legyen.");if(priceChange<-100)throw new Error("Az árváltozás nem lehet -100%-nál kisebb.");const liters=distance*cons/100,cost=liters*price+toll,stress=liters*price*(1+priceChange/100)+toll;return [["Szükséges üzemanyag",`${fmt(liters,1)} l`],["Teljes útiköltség",money(cost)],["Egy főre",money(cost/people)],["Stresszelt költség",money(stress)]];} },
    "adatmeret-atvalto-kalkulator": { title:"Decimális és bináris adatméret-átváltó", fields:[{id:"value",label:"Érték",value:1,min:0},{id:"unit",label:"Kiinduló egység",value:"GB",options:[["KB","KB (1000)"],["MB","MB (1000²)"],["GB","GB (1000³)"],["KiB","KiB (1024)"],["MiB","MiB (1024²)"],["GiB","GiB (1024³)"]]}], compute:v=>{const m={KB:1e3,MB:1e6,GB:1e9,KiB:1024,MiB:1048576,GiB:1073741824};const b=n(v.value)*m[v.unit];return [["Byte",fmt(b,0)],["KB",fmt(b/1e3,4)],["MB",fmt(b/1e6,4)],["GB",fmt(b/1e9,6)],["KiB",fmt(b/1024,4)],["MiB",fmt(b/1048576,4)],["GiB",fmt(b/1073741824,6)]];} },
    "energia-atvalto-kalkulator": { title:"Energiaátváltó kcal/cal pontosítással", fields:[{id:"value",label:"Érték",value:100},{id:"unit",label:"Egység",value:"kcal",options:[["J","joule"],["kJ","kilojoule"],["cal","kis kalória (cal)"],["kcal","táplálkozási kilokalória (kcal)"],["kWh","kilowattóra"]]}], compute:v=>{const m={J:1,kJ:1000,cal:4.184,kcal:4184,kWh:3600000};const j=n(v.value)*m[v.unit];return [["Joule",fmt(j,4)],["Kilojoule",fmt(j/1000,4)],["cal",fmt(j/4.184,4)],["kcal",fmt(j/4184,4)],["kWh",fmt(j/3600000,8)],["Megjegyzés","Az élelmiszercímkék Kalóriája valójában kcal"]];} },
    "teljesitmeny-atvalto-kalkulator": { title:"Teljesítményátváltó kétféle lóerővel", fields:[{id:"value",label:"Érték",value:100},{id:"unit",label:"Egység",value:"kW",options:[["W","watt"],["kW","kilowatt"],["PS","metrikus lóerő (PS)"],["hp","mechanikai lóerő (hp)"]]}], compute:v=>{const m={W:1,kW:1000,PS:735.49875,hp:745.699872};const w=n(v.value)*m[v.unit];return [["W",fmt(w,3)],["kW",fmt(w/1000,4)],["Metrikus lóerő (PS)",fmt(w/735.49875,4)],["Mechanikai lóerő (hp)",fmt(w/745.699872,4)]];} }
  };
  const referenceMap={"hosszusag-atvalto-kalkulator":"length","tomeg-atvalto-kalkulator":"mass","terulet-atvalto-kalkulator":"area","terfogat-atvalto-kalkulator":"volume","ido-atvalto-kalkulator":"time","sebesseg-atvalto-kalkulator":"speed"};
  if(referenceMap[slug]){
    const section=document.createElement("section");section.className="adsense-content ac-note";section.innerHTML=`<h2>Gyors referencia és hétköznapi példák</h2><table class="ac-table"><tbody>${refs[referenceMap[slug]].map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table><p>A referenciaértékek segítenek fejben ellenőrizni az eredményt. A kalkulátor kerekítése miatt az utolsó tizedesek eltérhetnek.</p>`;card.insertAdjacentElement("afterend",section);window.KB_AUTO_CONVERTER_UPGRADE_READY=slug;return;
  }
  // KB_ADSENSE_DOMAIN_METHOD_V2
  const methodCopy = {
    "eves-auto-koltseg-kalkulator": {
      "title": "Mit tartalmaz az éves autóköltség-becslés?",
      "body": "Az éves futásból, fogyasztásból és literárból külön számolja az üzemanyagot, majd hozzáadja a biztosítás, adók és matrica, szerviz, gumi, parkolás és értékvesztés megadott éves összegét. Az értékvesztés gazdasági költség, ezért a havi átlag nem feltétlenül azonos a tényleges havi készpénzkiadással.",
      "source": "A saját autódhoz biztosítói, szerviz-, adó-, útdíj- és üzemanyagadataidat használd. Az alapértékek csak szerkeszthető példák; az aktuális költségeket a szolgáltatói és hivatalos díjtáblák alapján ellenőrizd."
    },
    "auto-ertekvesztes-kalkulator": {
      "title": "Hogyan modellezi az autó értékvesztését?",
      "body": "A modell az első vizsgált évre és a további évekre külön százalékos értékvesztési rátát enged meg, ezért nem feltételezi, hogy minden év azonos. A nominális maradványérték mellett a megadott infláció vagy defláció alapján mai vásárlóértéket is számol.",
      "source": "A jövőbeli használtpiaci ár nem előrejelezhető biztosan. A rátákat saját piaci összehasonlításból vagy megbízható értékbecslési adatokból add meg; a kalkulátor a felhasználói feltételezést számolja tovább."
    },
    "kilometerdij-kalkulator": {
      "title": "Mit jelent a teljes Ft/km érték?",
      "body": "Az éves teljes autóköltséget osztja az éves futással, majd ebből becsüli egy választott út és a fizető utasokra jutó rész költségét. Ez a megközelítés a tankoláson túl a fix, időszakos és gazdasági költségeket is egy közös kilométerértékbe rendezi.",
      "source": "Csak azonos időszakból származó éves költséget és futást hasonlíts össze. Céges vagy adózási kilométer-elszámoláshoz ne ezt az eredményt tekintsd hivatalos díjnak; ott az aktuális jogszabály és NAV-szabály az irányadó."
    },
    "co2-kibocsatas-kalkulator": {
      "title": "Milyen kibocsátást számol a modell?",
      "body": "A belső égésű hajtásnál külön kezeli a közvetlen kipufogó- és az energiaellátási tényezőt, elektromos hajtásnál pedig a fogyasztást, töltési többletet és a megadott árammixot. Plug-in hibridnél a folyékony üzemanyag és az elektromos rész külön ágon fut össze.",
      "source": "A kibocsátási faktorokat az adott üzemanyaghoz és árammixhoz illő, aktuális hivatalos vagy szakmai forrásból add meg. A jármű- és akkumulátorgyártás nincs a modellben, ezért az eredmény nem teljes életciklus-elemzés."
    },
    "gumi-meret-kalkulator": {
      "title": "Hogyan hasonlítja össze a két gumiméretet?",
      "body": "A szélességből, oldalfal-arányból és felniátmérőből kiszámolja mindkét kerék közelítő külső átmérőjét és gördülési kerületét, majd százalékosan összeveti őket. A megadott műszer szerinti sebességből a geometriai eltérés alapján korrigált értéket is becsül.",
      "source": "A geometriai egyezés nem jelent automatikus műszaki megfelelőséget. Csak a jármű gyártója, jóváhagyási dokumentuma vagy hiteles műszaki adat alapján engedélyezett méretet használj."
    },
    "uzemanyag-koltseg-kalkulator": {
      "title": "Miből áll össze az út üzemanyagköltsége?",
      "body": "A távolság és a l/100 km fogyasztás alapján kiszámolja a szükséges üzemanyagmennyiséget, majd ezt megszorozza a megadott literárral. Az eredmény ezért közvetlenül a saját út-, fogyasztás- és áradataidra reagál, nem országos átlagból becsül.",
      "source": "A tényleges fogyasztást befolyásolja a forgalom, hőmérséklet, terhelés és vezetési mód. Aktuális költséghez a tényleges tankolási árat, elszámolási célra pedig az adott szabály szerint alkalmazható hivatalos értéket használd."
    },
    "adatmeret-atvalto-kalkulator": {
      "title": "Miért kell külön figyelni a bináris és decimális adatméretre?",
      "body": "Az átváltásnál nem mindegy, hogy 1000-es vagy 1024-es lépcsőt használsz. A kalkulátor a választott egységkapcsolat szerint számol, ezért tárolókapacitás és operációs rendszer által jelzett méret összevetésekor ugyanazt a szabványt kell követned.",
      "source": "Műszaki dokumentációban ellenőrizd, hogy az adott szolgáltató vagy eszköz SI/decimális vagy IEC/bináris jelölést használ-e. A jelölések összekeverése önmagában több százalékos eltérést okozhat."
    },
    "energia-atvalto-kalkulator": {
      "title": "Mit jelent az energiaegységek közti átváltás?",
      "body": "A kalkulátor rögzített fizikai átváltási arányokkal viszi át a megadott energiát a kiválasztott egységek között. Az energia mennyiségét váltja át, nem teljesítményt és nem időtartamhoz kötött fogyasztási költséget.",
      "source": "Mérési vagy számlázási felhasználásnál ellenőrizd a forrásadat egységét és a szükséges kerekítést. Villamosenergia-költséghez az átváltott kWh mellé külön aktuális tarifára van szükség."
    },
    "teljesitmeny-atvalto-kalkulator": {
      "title": "Mit vált át a teljesítménykalkulátor?",
      "body": "A teljesítmény pillanatnyi energiaátadási rátát fejez ki. A kalkulátor watt, kilowatt, megawatt és más támogatott teljesítményegységek között vált; önmagában nem mondja meg, mennyi energia fogy el egy időszak alatt.",
      "source": "Energiafogyasztás becsléséhez a teljesítmény mellett az üzemidőt és a terhelési profilt is ismerni kell. Eszközméretezésnél a gyártói névleges és csúcsteljesítmény-adat az elsődleges."
    },
    "hosszusag-atvalto-kalkulator": {
      "title": "Hogyan működik a hosszúságátváltás?",
      "body": "A megadott hosszúságot előbb egy közös alapegységre vezeti vissza, majd abból számítja a célmértéket. Így ugyanaz a logika kezeli a metrikus és támogatott angolszász egységeket.",
      "source": "A szabványos hosszúságegységek rögzített arányúak, de műszaki rajznál a kerekítési pontosság számít. Gyártási vagy kivitelezési méretnél őrizd meg az eredeti dokumentum előírt tűrését."
    },
    "tomeg-atvalto-kalkulator": {
      "title": "Mit vált át a tömegkalkulátor?",
      "body": "A kalkulátor tömegegységeket hasonlít össze közös alapegységen keresztül. A kilogramm, gramm, tonna, font és uncia közti arányokat kezeli; a fizikai tömeget nem keveri össze az erőként értelmezett súllyal.",
      "source": "Kereskedelmi vagy műszaki felhasználásnál ellenőrizd, hogy a megadott font/uncia valóban a támogatott avoirdupois rendszerre vonatkozik-e. Erő átváltásához külön newton-alapú számítás szükséges."
    },
    "terulet-atvalto-kalkulator": {
      "title": "Miért négyzetesen változnak a területegységek?",
      "body": "A terület két hosszméret szorzata, ezért például a méter és centiméter közti százas hosszarány a négyzetméter és négyzetcentiméter között tízezres területarányt jelent. A kalkulátor ezeket a négyzetes kapcsolatokat kezeli.",
      "source": "Ingatlan- vagy földterületnél a matematikai átváltás nem helyettesíti a tulajdoni lap, földmérési vagy hatósági területadatot. Hivatalos ügyben mindig a nyilvántartott érték az elsődleges."
    },
    "terfogat-atvalto-kalkulator": {
      "title": "Hogyan kezeli a térfogat különböző rendszereit?",
      "body": "A térfogategységeket közös alapra váltja, így liter és köbméter mellett a támogatott gallon-egységek is összevethetők. Különösen fontos, hogy az amerikai és az imperial gallon nem azonos térfogat.",
      "source": "Recept, tartály vagy műszaki adatlap esetén az eredeti gallonrendszert mindig azonosítsd. Sűrűség nélkül térfogatból nem lehet automatikusan tömeget számolni."
    },
    "ido-atvalto-kalkulator": {
      "title": "Mikor egyszerű és mikor naptárfüggő az időátváltás?",
      "body": "Másodperc, perc, óra és nap között rögzített arányok használhatók, de hónap és év már naptárfüggő lehet. A kalkulátor csak azokat a kapcsolatokat kezeli közvetlenül, amelyekhez egyértelmű számítási szabály tartozik.",
      "source": "Határidő, munkanap vagy naptári hónap számításához ne egyszerű időegység-átváltást használj; azokhoz külön dátum- és munkanaplogika szükséges."
    },
    "sebesseg-atvalto-kalkulator": {
      "title": "Mit jelent a sebességegységek átváltása?",
      "body": "A sebesség megtett út és eltelt idő hányadosa, ezért a kalkulátor a számláló és nevező egységeinek rögzített arányából számít km/h, m/s, mph és a támogatott további egységek között.",
      "source": "Közlekedési vagy műszaki döntésnél az átváltott szám nem írja felül a helyi sebességkorlátozást, műszerpontosságot vagy gyártói specifikációt."
    }
  };
  const cfg=configs[slug]; if(!cfg) return;
  card.innerHTML=`<div class="ac-heading"><h2>${cfg.title}</h2><p>A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.</p></div>`;
  const form=document.createElement("form");form.className="ac-grid";cfg.fields.forEach(s=>form.appendChild(field(s)));const btn=document.createElement("button");btn.type="submit";btn.className="ac-submit";btn.textContent="Számítás";form.appendChild(btn);const out=document.createElement("div");out.className="ac-result";out.innerHTML="Add meg az adatokat.";form.appendChild(out);card.appendChild(form);
  form.addEventListener("submit",e=>{e.preventDefault();if(!form.checkValidity()){out.textContent="Ellenőrizd a kötelező mezőket és az értékhatárokat.";return;}try{const v=Object.fromEntries(new FormData(form).entries());const resultRows=cfg.compute(v);if(resultRows.some(([,value])=>/(?:NaN|Infinity)/.test(String(value))))throw new Error("A megadott adatokból nem számítható véges eredmény.");out.innerHTML=rows(resultRows);}catch(err){out.textContent=err.message||"Hibás adat.";}});
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  const method=methodCopy[slug];
  const note=document.createElement("section");note.className="adsense-content ac-note";note.innerHTML=`<h2>${method.title}</h2><p>${method.body}</p><p><strong>Ellenőrzési alap:</strong> ${method.source}</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="2026-09-16">2026. szeptember 16.</time></p>`;card.insertAdjacentElement("afterend",note);window.KB_AUTO_CONVERTER_UPGRADE_READY=slug;
})();
