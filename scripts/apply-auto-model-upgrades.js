const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const jsTarget = path.join(root, "js", "auto-converter-upgrades.js");
const co2Target = path.join(root, "kalkulatorok", "co2-kibocsatas-kalkulator.html");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található autós upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi autós upgrade cél: ${label}`);
  return source.replace(oldText, newText);
}

function replaceAllExact(source, oldText, newText, label) {
  if (!source.includes(oldText)) {
    if (source.includes(newText)) return source;
    throw new Error(`Nem található autós upgrade cél: ${label}`);
  }
  return source.split(oldText).join(newText);
}

function apply(source) {
  let out = source;

  out = replaceExact(
    out,
    'else { i=document.createElement("input"); i.type=s.type||"number"; if(s.step)i.step=s.step; if(s.min!==undefined)i.min=s.min; if(i.type==="number")i.inputMode="decimal"; }',
    'else { i=document.createElement("input"); i.type=s.type||"number"; if(s.step)i.step=s.step; if(s.min!==undefined)i.min=s.min; if(s.max!==undefined)i.max=s.max; if(i.type==="number")i.inputMode="decimal"; }',
    "input max támogatás"
  );

  const sharedFields = [
    ['{id:"km",label:"Éves futás (km)",value:15000}', '{id:"km",label:"Éves futás (km)",value:15000,min:1}'],
    ['{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5}', '{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5,min:0}'],
    ['{id:"price",label:"Üzemanyagár (Ft/l)",value:620}', '{id:"price",label:"Üzemanyagár (Ft/l)",value:620,min:0}'],
  ];
  for (const [oldText, newText] of sharedFields) out = replaceAllExact(out, oldText, newText, oldText.slice(0, 45));

  const uniqueFields = [
    ['{id:"fuel",label:"Üzemanyagár (Ft/l)",value:620}', '{id:"fuel",label:"Üzemanyagár (Ft/l)",value:620,min:0}'],
    ['{id:"insurance",label:"Biztosítás évente",value:90000}', '{id:"insurance",label:"Biztosítás évente",value:90000,min:0}'],
    ['{id:"tax",label:"Adó és matrica",value:80000}', '{id:"tax",label:"Adó és matrica",value:80000,min:0}'],
    ['{id:"service",label:"Szerviz és javítás",value:220000}', '{id:"service",label:"Szerviz és javítás",value:220000,min:0}'],
    ['{id:"tyres",label:"Gumi évesített költsége",value:70000}', '{id:"tyres",label:"Gumi évesített költsége",value:70000,min:0}'],
    ['{id:"parking",label:"Parkolás évente",value:180000}', '{id:"parking",label:"Parkolás évente",value:180000,min:0}'],
    ['{id:"depreciation",label:"Értékvesztés évente",value:350000}', '{id:"depreciation",label:"Értékvesztés évente",value:350000,min:0,help:"Gazdasági költség: nem feltétlenül jelent éves készpénzkiadást."}'],
    ['{id:"price",label:"Jelenlegi érték (Ft)",value:5000000}', '{id:"price",label:"Jelenlegi érték (Ft)",value:5000000,min:0}'],
    ['{id:"years",label:"Időtáv (év)",value:5}', '{id:"years",label:"Időtáv (év)",value:5,min:1,max:80,step:"1"}'],
    ['{id:"firstLow",label:"Óvatos: első év (%)",value:8}', '{id:"firstLow",label:"Példa – óvatos: 1. vizsgált év (%)",value:8,min:0,max:100}'],
    ['{id:"laterLow",label:"Óvatos: későbbi évek (%)",value:5}', '{id:"laterLow",label:"Példa – óvatos: további évek (%)",value:5,min:0,max:100}'],
    ['{id:"firstMid",label:"Közép: első év (%)",value:15}', '{id:"firstMid",label:"Példa – közép: 1. vizsgált év (%)",value:15,min:0,max:100}'],
    ['{id:"laterMid",label:"Közép: későbbi évek (%)",value:8}', '{id:"laterMid",label:"Példa – közép: további évek (%)",value:8,min:0,max:100}'],
    ['{id:"firstHigh",label:"Erős: első év (%)",value:25}', '{id:"firstHigh",label:"Példa – erős: 1. vizsgált év (%)",value:25,min:0,max:100}'],
    ['{id:"laterHigh",label:"Erős: későbbi évek (%)",value:12}', '{id:"laterHigh",label:"Példa – erős: további évek (%)",value:12,min:0,max:100}'],
    ['{id:"infl",label:"Infláció (%)",value:3.5}', '{id:"infl",label:"Infláció / defláció (%)",value:3.5,min:-99.99,help:"A mai vásárlóérték számításához; -100% nem értelmezhető."}'],
    ['{id:"annual",label:"Éves teljes autóköltség (Ft)",value:1200000}', '{id:"annual",label:"Éves teljes autóköltség (Ft)",value:1200000,min:0}'],
    ['{id:"trip",label:"Vizsgált út (km)",value:200}', '{id:"trip",label:"Vizsgált út (km)",value:200,min:0}'],
    ['{id:"passengers",label:"Fizető utasok száma",value:1}', '{id:"passengers",label:"Fizető utasok száma",value:1,min:1,step:"1"}'],
    ['{id:"km",label:"Távolság (km)",value:100}', '{id:"km",label:"Távolság (km)",value:100,min:0.01}'],
    ['{id:"cons",label:"Fogyasztás (l/100 km vagy kWh/100 km)",value:6.5}', '{id:"cons",label:"Fogyasztás (l/100 km, EV-nél kWh/100 km)",value:6.5,min:0,help:"PHEV-nél ez a belső égésű ág fogyasztása; az elektromos ág külön mezőben van."}'],
    ['{id:"tailpipe",label:"Közvetlen tényező (kg CO₂/l)",value:2.31,step:"0.01",help:"Szerkeszthető; a forrás és év eltérhet."}', '{id:"tailpipe",label:"Közvetlen tényező (kg CO₂/l)",value:2.31,step:"0.01",min:0,help:"Példa benzines érték. Dízel/LPG/hibrid választásnál a tényezőt külön ellenőrizd: a hajtáslista nem írja át automatikusan."}'],
    ['{id:"upstream",label:"Üzemanyag/áram előállítási pótlék (kg/l vagy kg/kWh)",value:0.55,step:"0.01"}', '{id:"upstream",label:"Üzemanyag-előállítási pótlék (kg CO₂e/l)",value:0.55,step:"0.01",min:0,help:"EV-nél nem használjuk; PHEV-nél csak a folyékony üzemanyag ágára vonatkozik."}'],
    ['{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50}', '{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50,min:0,max:100},{id:"electricCons",label:"PHEV elektromos fogyasztás (kWh/100 km)",value:18,min:0,step:"0.1",help:"Csak PHEV módban használjuk; az elektromosan megtett útszakasz fajlagos fogyasztása."}'],
    ['{id:"grid",label:"Árammix (kg CO₂/kWh)",value:0.25,step:"0.01"}', '{id:"grid",label:"Árammix (kg CO₂e/kWh)",value:0.25,step:"0.01",min:0}'],
    ['{id:"chargingLoss",label:"Töltési veszteség (%)",value:10}', '{id:"chargingLoss",label:"Hálózati többletfogyasztás töltés miatt (%)",value:10,min:0,max:100,help:"10% azt jelenti, hogy 1 kWh akkumulátoroldali energia becsléséhez 1,10 kWh hálózati felvétellel számolunk."}'],
    ['{id:"w1",label:"Régi szélesség (mm)",value:185}', '{id:"w1",label:"Régi szélesség (mm)",value:185,min:50,max:500}'],
    ['{id:"a1",label:"Régi oldalfal (%)",value:60}', '{id:"a1",label:"Régi oldalfal (%)",value:60,min:10,max:100}'],
    ['{id:"r1",label:"Régi felni (inch)",value:15}', '{id:"r1",label:"Régi felni (inch)",value:15,min:8,max:30}'],
    ['{id:"w2",label:"Új szélesség (mm)",value:195}', '{id:"w2",label:"Új szélesség (mm)",value:195,min:50,max:500}'],
    ['{id:"a2",label:"Új oldalfal (%)",value:55}', '{id:"a2",label:"Új oldalfal (%)",value:55,min:10,max:100}'],
    ['{id:"r2",label:"Új felni (inch)",value:15}', '{id:"r2",label:"Új felni (inch)",value:15,min:8,max:30}'],
    ['{id:"speed",label:"Műszer szerinti sebesség",value:100}', '{id:"speed",label:"Műszer szerinti sebesség",value:100,min:0,max:400}'],
    ['{id:"distance",label:"Távolság (km)",value:500}', '{id:"distance",label:"Távolság (km)",value:500,min:0}'],
    ['{id:"toll",label:"Útdíj és parkolás",value:0}', '{id:"toll",label:"Útdíj és parkolás",value:0,min:0}'],
    ['{id:"people",label:"Utasok száma",value:1}', '{id:"people",label:"Utasok száma",value:1,min:1,step:"1"}'],
    ['{id:"priceChange",label:"Árváltozás teszt (%)",value:10}', '{id:"priceChange",label:"Árváltozás teszt (%)",value:10,min:-100,help:"-100% esetén a tesztelt üzemanyagár 0 Ft/l; ennél kisebb érték nem értelmezhető."}'],
  ];
  for (const [oldText, newText] of uniqueFields) out = replaceExact(out, oldText, newText, oldText.slice(0, 55));

  out = replaceExact(
    out,
    '], compute:v=>{const fuel=n(v.km)*n(v.cons)/100*n(v.fuel);const fixed=n(v.insurance)+n(v.tax)+n(v.service)+n(v.tyres)+n(v.parking)+n(v.depreciation);const total=fuel+fixed;return [["Üzemanyag",money(fuel)],["Fix és fenntartási költség",money(fixed)],["Éves összes költség",money(total)],["Havi átlag",money(total/12)],["Teljes költség kilométerenként",`${fmt(total/n(v.km),1)} Ft/km`]]; } },',
    '], compute:v=>{const km=n(v.km),cons=n(v.cons),fuelPrice=n(v.fuel),costs=[n(v.insurance),n(v.tax),n(v.service),n(v.tyres),n(v.parking),n(v.depreciation)];if(km<=0)throw new Error("Az éves futás legyen nagyobb nullánál.");if(cons<0||fuelPrice<0||costs.some(x=>x<0))throw new Error("A fogyasztás és a költségek nem lehetnek negatívak.");const fuel=km*cons/100*fuelPrice;const fixed=costs.reduce((a,b)=>a+b,0);const total=fuel+fixed;return [["Üzemanyag",money(fuel)],["Egyéb éves költség + értékvesztés",money(fixed)],["Éves teljes gazdasági költség",money(total)],["Havi átlag",money(total/12)],["Teljes költség kilométerenként",`${fmt(total/km,1)} Ft/km`]]; } },',
    "éves autóköltség modellguard és elnevezés"
  );

  out = replaceExact(
    out,
    '], compute:v=>{const calc=(a,b)=>{let x=n(v.price);for(let y=1;y<=n(v.years);y++)x*=1-(y===1?a:b)/100;return x;};const vals=[["Óvatos",calc(n(v.firstLow),n(v.laterLow))],["Közép",calc(n(v.firstMid),n(v.laterMid))],["Erős",calc(n(v.firstHigh),n(v.laterHigh))]];return vals.flatMap(([name,x])=>[[`${name} nominális érték`,money(x)],[`${name} mai vásárlóértéken`,money(x/Math.pow(1+n(v.infl)/100,n(v.years)))]]); } },',
    '], compute:v=>{const price=n(v.price),years=n(v.years),infl=n(v.infl),rates=[n(v.firstLow),n(v.laterLow),n(v.firstMid),n(v.laterMid),n(v.firstHigh),n(v.laterHigh)];if(price<0)throw new Error("A jelenlegi érték nem lehet negatív.");if(!Number.isInteger(years)||years<1||years>80)throw new Error("Az időtáv 1 és 80 év közötti egész szám legyen.");if(rates.some(x=>x<0||x>100))throw new Error("Az értékvesztési ráták 0 és 100% között legyenek.");if(infl<=-100)throw new Error("Az infláció/defláció értéke legyen nagyobb -100%-nál.");const calc=(a,b)=>{let x=price;for(let y=1;y<=years;y++)x*=1-(y===1?a:b)/100;return x;};const vals=[["Óvatos",calc(rates[0],rates[1])],["Közép",calc(rates[2],rates[3])],["Erős",calc(rates[4],rates[5])]];return vals.flatMap(([name,x])=>[[`${name} nominális érték`,money(x)],[`${name} mai vásárlóértéken`,money(x/Math.pow(1+infl/100,years))]]); } },',
    "értékvesztés egész év és rátahatárok"
  );

  out = replaceExact(
    out,
    'fields:[{id:"annual",label:"Éves teljes autóköltség (Ft)",value:1200000},{id:"km",label:"Éves futás (km)",value:15000},{id:"trip",label:"Vizsgált út (km)",value:200},{id:"passengers",label:"Fizető utasok száma",value:1}], compute:v=>{const per=n(v.annual)/n(v.km);return [["Teljes költség",`${fmt(per,1)} Ft/km`],["Vizsgált út költsége",money(per*n(v.trip))],["Egy főre",money(per*n(v.trip)/Math.max(1,n(v.passengers)))]];} },',
    'fields:[{id:"annual",label:"Éves teljes autóköltség (Ft)",value:1200000,min:0},{id:"km",label:"Éves futás (km)",value:15000,min:1},{id:"trip",label:"Vizsgált út (km)",value:200,min:0},{id:"passengers",label:"Fizető utasok száma",value:1,min:1,step:"1"}], compute:v=>{const annual=n(v.annual),km=n(v.km),trip=n(v.trip),passengers=n(v.passengers);if(annual<0||km<=0||trip<0)throw new Error("A költség és a távolság adatai nem lehetnek negatívak; az éves futás legyen pozitív.");if(!Number.isInteger(passengers)||passengers<1)throw new Error("Az utasok száma pozitív egész szám legyen.");const per=annual/km;return [["Teljes költség",`${fmt(per,1)} Ft/km`],["Vizsgált út költsége",money(per*trip)],["Egy főre",money(per*trip/passengers)]];} },',
    "kilométerdíj utasszám és nullaosztás guard"
  );

  out = replaceExact(
    out,
    '], compute:v=>{let direct=0,lifecycle=0;const qty=n(v.km)*n(v.cons)/100;if(v.type==="ev"){lifecycle=qty*(1+n(v.chargingLoss)/100)*n(v.grid);}else if(v.type==="phev"){const es=n(v.electricShare)/100;direct=qty*(1-es)*n(v.tailpipe);lifecycle=direct+qty*(1-es)*n(v.upstream)+qty*es*(1+n(v.chargingLoss)/100)*n(v.grid);}else{direct=qty*n(v.tailpipe);lifecycle=direct+qty*n(v.upstream);}return [["Közvetlen használati kibocsátás",`${fmt(direct,2)} kg CO₂`],["Használati életciklus-becslés",`${fmt(lifecycle,2)} kg CO₂e`],["Kilométerenként",`${fmt(lifecycle/n(v.km)*1000,0)} g CO₂e/km`],["Fontos","Gyártás és akkumulátorgyártás nincs automatikusan benne"]];} },',
    '], compute:v=>{const allowed=new Set(["petrol","diesel","lpg","hybrid","phev","ev"]),type=String(v.type||""),km=n(v.km),cons=n(v.cons),tailpipe=n(v.tailpipe),upstream=n(v.upstream),grid=n(v.grid),overhead=n(v.chargingLoss);if(!allowed.has(type))throw new Error("Ismeretlen hajtástípus.");if(km<=0)throw new Error("A távolság legyen nagyobb nullánál.");if([cons,tailpipe,upstream,grid,overhead].some(x=>x<0))throw new Error("A fogyasztási és kibocsátási tényezők nem lehetnek negatívak.");let direct=0,supply=0,energy="";if(type==="ev"){const kwh=km*cons/100;supply=kwh*(1+overhead/100)*grid;energy=`${fmt(kwh,2)} kWh akkumulátoroldali energia`;}else if(type==="phev"){const share=n(v.electricShare),electricCons=n(v.electricCons);if(share<0||share>100||electricCons<0)throw new Error("A PHEV elektromos arány 0–100%, az elektromos fogyasztás pedig nem negatív legyen.");const es=share/100,fuelLiters=km*(1-es)*cons/100,electricKwh=km*es*electricCons/100;direct=fuelLiters*tailpipe;supply=direct+fuelLiters*upstream+electricKwh*(1+overhead/100)*grid;energy=`${fmt(fuelLiters,2)} l üzemanyag + ${fmt(electricKwh,2)} kWh akkumulátoroldali energia`;}else{const liters=km*cons/100;direct=liters*tailpipe;supply=direct+liters*upstream;energy=`${fmt(liters,2)} l üzemanyag`;}return [["Közvetlen használati kibocsátás",`${fmt(direct,2)} kg CO₂`],["Közvetlen + energiaellátási becslés",`${fmt(supply,2)} kg CO₂e`],["Kilométerenként",`${fmt(supply/km*1000,0)} g CO₂e/km`],["Felhasznált energia a modellben",energy],["Fontos","Jármű- és akkumulátorgyártás nincs benne; ez nem teljes életciklus-elemzés"]];} },',
    "PHEV külön liter és kWh fogyasztás"
  );

  out = replaceExact(
    out,
    'return [["Régi átmérő",`${fmt(d1,1)} mm`],["Új átmérő",`${fmt(d2,1)} mm`],["Átmérőeltérés",`${fmt(diff,2)}%`],["Valós sebesség az új mérettel",`${fmt(n(v.speed)*d2/d1,1)} km/h`],["Ajánlás",Math.abs(diff)<=2.5?"általában kis eltérés":"ellenőrizd a gyártói engedélyezést"]];',
    'return [["Régi átmérő",`${fmt(d1,1)} mm`],["Új átmérő",`${fmt(d2,1)} mm`],["Átmérőeltérés",`${fmt(diff,2)}%`],["Elméleti sebesség a geometriai arány alapján",`${fmt(n(v.speed)*d2/d1,1)} km/h`],["Méreteltérés jelzés",Math.abs(diff)<=2.5?"kis geometriai eltérés; a gyártói engedélyezést ettől még ellenőrizd":"nagyobb geometriai eltérés; ellenőrizd a gyártói engedélyezést"]];',
    "gumiméret sebesség és ajánlás pontosítása"
  );

  out = replaceExact(
    out,
    'fields:[{id:"distance",label:"Távolság (km)",value:500},{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5},{id:"price",label:"Üzemanyagár (Ft/l)",value:620},{id:"toll",label:"Útdíj és parkolás",value:0},{id:"people",label:"Utasok száma",value:1},{id:"priceChange",label:"Árváltozás teszt (%)",value:10}], compute:v=>{const liters=n(v.distance)*n(v.cons)/100,cost=liters*n(v.price)+n(v.toll),stress=liters*n(v.price)*(1+n(v.priceChange)/100)+n(v.toll);return [["Szükséges üzemanyag",`${fmt(liters,1)} l`],["Teljes útiköltség",money(cost)],["Egy főre",money(cost/Math.max(1,n(v.people)))],["Stresszelt költség",money(stress)]];} },',
    'fields:[{id:"distance",label:"Távolság (km)",value:500,min:0},{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5,min:0},{id:"price",label:"Üzemanyagár (Ft/l)",value:620,min:0},{id:"toll",label:"Útdíj és parkolás",value:0,min:0},{id:"people",label:"Utasok száma",value:1,min:1,step:"1"},{id:"priceChange",label:"Árváltozás teszt (%)",value:10,min:-100,help:"-100% esetén a tesztelt üzemanyagár 0 Ft/l; ennél kisebb érték nem értelmezhető."}], compute:v=>{const distance=n(v.distance),cons=n(v.cons),price=n(v.price),toll=n(v.toll),people=n(v.people),priceChange=n(v.priceChange);if([distance,cons,price,toll].some(x=>x<0))throw new Error("A távolság, fogyasztás, ár és díj nem lehet negatív.");if(!Number.isInteger(people)||people<1)throw new Error("Az utasok száma pozitív egész szám legyen.");if(priceChange<-100)throw new Error("Az árváltozás nem lehet -100%-nál kisebb.");const liters=distance*cons/100,cost=liters*price+toll,stress=liters*price*(1+priceChange/100)+toll;return [["Szükséges üzemanyag",`${fmt(liters,1)} l`],["Teljes útiköltség",money(cost)],["Egy főre",money(cost/people)],["Stresszelt költség",money(stress)]];} },',
    "útiköltség utasszám és stresszteszt guard"
  );

  out = replaceExact(
    out,
    'try{const v=Object.fromEntries(new FormData(form).entries());out.innerHTML=rows(cfg.compute(v));}catch(err){out.textContent=err.message||"Hibás adat.";}',
    'try{const v=Object.fromEntries(new FormData(form).entries());const resultRows=cfg.compute(v);if(resultRows.some(([,value])=>/(?:NaN|Infinity)/.test(String(value))))throw new Error("A megadott adatokból nem számítható véges eredmény.");out.innerHTML=rows(resultRows);}catch(err){out.textContent=err.message||"Hibás adat.";}',
    "nem véges autós eredmény védelme"
  );

  return out;
}

function applyCo2Content(source) {
  let out = source;
  out = replaceAllExact(
    out,
    "Autós CO2-kibocsátás kalkulátor: becsüld meg egy út közvetlen szén-dioxid-kibocsátását fogyasztás, távolság és üzemanyag-tényező alapján.",
    "Autós CO2-kibocsátás kalkulátor: becsüld meg egy út közvetlen és energiaellátási kibocsátását benzines, dízel, PHEV vagy elektromos hajtásnál.",
    "CO2 meta leírás"
  );
  out = replaceExact(
    out,
    "<p>Becsüld meg az autós utazás közvetlen szén-dioxid-kibocsátását.</p>",
    "<p>Becsüld meg az autós utazás közvetlen és energiaellátási kibocsátását, külön PHEV- és elektromos számítási ággal.</p>",
    "CO2 hero"
  );
  out = replaceExact(
    out,
    '<p>A kalkulátor a megtett távolságból, az autó átlagfogyasztásából és az üzemanyaghoz tartozó literenkénti kibocsátási tényezőből becsüli meg az út <strong>közvetlen, kipufogóból származó</strong> szén-dioxid-kibocsátását. Ez abban különbözik a gyári g/km adattól, hogy a saját, valós fogyasztásodat is megadhatod.</p>\n<p>A számítás nem teljes életciklus-elemzés: nem tartalmazza az üzemanyag kitermelését és finomítását, a szállítást, az autó vagy az akkumulátor gyártását, az útépítést és más közvetett kibocsátásokat.</p>',
    '<p>A kalkulátor a megtett távolságból és a megadott fogyasztási/kibocsátási tényezőkből két külön eredményt készít: <strong>közvetlen használati kibocsátást</strong>, valamint egy energiaellátási tényezőkkel bővített becslést. Elektromos autónál a helyi közvetlen CO₂ nulla; PHEV-nél a folyékony üzemanyag és az elektromos ág külön fogyasztással számol.</p>\n<p>A számítás nem teljes életciklus-elemzés: a felhasználó által megadott upstream üzemanyag- vagy árammix-tényezőket figyelembe tudja venni, de az autó és az akkumulátor gyártását, az infrastruktúrát és az életciklus más szakaszait nem modellezi.</p>',
    "CO2 módszertani bevezető"
  );
  out = replaceExact(
    out,
    '<p>Először a felhasznált üzemanyag mennyisége készül el: <strong>távolság × fogyasztás / 100</strong>. Ezt az értéket szorozza meg a kalkulátor a megadott kg CO₂/liter tényezővel.</p>',
    '<p>Üzemanyag-alapú hajtásnál a felhasznált liter <strong>távolság × l/100 km / 100</strong>. EV-nél a kWh ugyanez a képlet kWh/100 km-rel. PHEV-nél az elektromosan és belső égésű motorral megtett útrészt külön választjuk szét, ezért a két ág külön fajlagos fogyasztást használ.</p>',
    "CO2 számítás menete"
  );
  out = replaceAllExact(
    out,
    "Ott az elfogyasztott kWh-t kellene megszorozni a felhasznált villamos energia kibocsátási tényezőjével; ezt ez a kalkulátor nem végzi el.",
    "Igen. EV módban kWh/100 km és árammix-tényező alapján számol; a helyi közvetlen CO₂-t nullának veszi. Ez továbbra sem teljes életciklus-elemzés.",
    "CO2 EV FAQ"
  );
  out = replaceExact(
    out,
    '<ul><li>elektromos autó teljes kibocsátásának becslésére, mert ott kWh/100 km és árammix-adat szükséges;</li><li>hivatalos környezetvédelmi jelentéshez vagy vállalati karbonleltárhoz;</li><li>teljes életciklus-kibocsátás meghatározására;</li><li>gyári homologizációs g/km érték helyettesítésére.</li></ul>',
    '<ul><li>hivatalos környezetvédelmi jelentéshez vagy vállalati karbonleltárhoz;</li><li>teljes életciklus-kibocsátás meghatározására, mert a jármű- és akkumulátorgyártás nincs benne;</li><li>gyári homologizációs g/km érték helyettesítésére;</li><li>PHEV-nél olyan becslésre, ahol a benzin/dízel és az elektromos fogyasztást egyetlen közös fajlagos értékkel akarod helyettesíteni.</li></ul>',
    "CO2 mire nem alkalmas"
  );
  out = replaceExact(
    out,
    '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-08">2026. augusztus 8.</time></p>',
    '<p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-26">2026. augusztus 26.</time></p>',
    "CO2 felülvizsgálati dátum"
  );
  return out;
}

function run({ checkOnly = process.argv.includes("--check") } = {}) {
  const targets = [
    [jsTarget, apply, "autós runtime"],
    [co2Target, applyCo2Content, "CO2 módszertani tartalom"],
  ];
  let changed = 0;
  for (const [target, transform, label] of targets) {
    const source = fs.readFileSync(target, "utf8");
    const expected = transform(source);
    if (transform(expected) !== expected) throw new Error(`Az autós modell-upgrade nem idempotens: ${label}.`);
    if (!checkOnly && expected !== source) {
      fs.writeFileSync(target, expected, "utf8");
      changed += 1;
    }
  }

  console.log(
    checkOnly
      ? "Autós modell-upgrade audit OK: inputkorlátok, CO2/PHEV modell és tartalmi leírás idempotens."
      : changed === 0 ? "Autós modell-upgrade már alkalmazva." : `Autós modell-upgrade alkalmazva: ${changed}/${targets.length} fájl.`
  );
}

if (require.main === module) run();

module.exports = { apply, applyCo2Content, run };
