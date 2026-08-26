const fs = require("fs");
const path = require("path");
const { apply: applyBase } = require("./apply-auto-model-upgrades");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "js", "auto-converter-upgrades.js");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található autós edge-upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi autós edge-upgrade cél: ${label}`);
  return source.replace(oldText, newText);
}

function transform(source) {
  let out = source;
  const fields = [
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
    ['{id:"priceChange",label:"Árváltozás teszt (%)",value:10}', '{id:"priceChange",label:"Árváltozás teszt (%)",value:10,min:-100,help:"-100% esetén a tesztelt üzemanyagár 0 Ft/l; ennél kisebb érték nem értelmezhető."}'],
    ['{id:"w1",label:"Régi szélesség (mm)",value:185,min:1}', '{id:"w1",label:"Régi szélesség (mm)",value:185,min:50,max:500}'],
    ['{id:"a1",label:"Régi oldalfal (%)",value:60,min:1}', '{id:"a1",label:"Régi oldalfal (%)",value:60,min:10,max:100}'],
    ['{id:"r1",label:"Régi felni (inch)",value:15,min:1}', '{id:"r1",label:"Régi felni (inch)",value:15,min:8,max:30}'],
    ['{id:"w2",label:"Új szélesség (mm)",value:195,min:1}', '{id:"w2",label:"Új szélesség (mm)",value:195,min:50,max:500}'],
    ['{id:"a2",label:"Új oldalfal (%)",value:55,min:1}', '{id:"a2",label:"Új oldalfal (%)",value:55,min:10,max:100}'],
    ['{id:"r2",label:"Új felni (inch)",value:15,min:1}', '{id:"r2",label:"Új felni (inch)",value:15,min:8,max:30}'],
    ['{id:"speed",label:"Műszer szerinti sebesség",value:100,min:0}', '{id:"speed",label:"Műszer szerinti sebesség",value:100,min:0,max:400}'],
  ];
  for (const [a,b] of fields) out = replaceExact(out, a, b, a.slice(0,55));

  out = replaceExact(out,
    'compute:v=>{const fuel=n(v.km)*n(v.cons)/100*n(v.fuel);const fixed=n(v.insurance)+n(v.tax)+n(v.service)+n(v.tyres)+n(v.parking)+n(v.depreciation);const total=fuel+fixed;return [["Üzemanyag",money(fuel)],["Fix és fenntartási költség",money(fixed)],["Éves összes költség",money(total)],["Havi átlag",money(total/12)],["Teljes költség kilométerenként",`${fmt(total/n(v.km),1)} Ft/km`]]; }',
    'compute:v=>{const km=n(v.km),cons=n(v.cons),fuelPrice=n(v.fuel),costs=[n(v.insurance),n(v.tax),n(v.service),n(v.tyres),n(v.parking),n(v.depreciation)];if(km<=0)throw new Error("Az éves futás legyen nagyobb nullánál.");if(cons<0||fuelPrice<0||costs.some(x=>x<0))throw new Error("A fogyasztás és a költségek nem lehetnek negatívak.");const fuel=km*cons/100*fuelPrice,fixed=costs.reduce((a,b)=>a+b,0),total=fuel+fixed;return [["Üzemanyag",money(fuel)],["Egyéb éves költség + értékvesztés",money(fixed)],["Éves teljes gazdasági költség",money(total)],["Havi átlag",money(total/12)],["Teljes költség kilométerenként",`${fmt(total/km,1)} Ft/km`]]; }',
    "éves autóköltség negatív költségek és elnevezés");

  out = replaceExact(out,
    'compute:v=>{const calc=(a,b)=>{let x=n(v.price);for(let y=1;y<=n(v.years);y++)x*=1-(y===1?a:b)/100;return x;};const vals=[["Óvatos",calc(n(v.firstLow),n(v.laterLow))],["Közép",calc(n(v.firstMid),n(v.laterMid))],["Erős",calc(n(v.firstHigh),n(v.laterHigh))]];return vals.flatMap(([name,x])=>[[`${name} nominális érték`,money(x)],[`${name} mai vásárlóértéken`,money(x/Math.pow(1+n(v.infl)/100,n(v.years)))]]); }',
    'compute:v=>{const price=n(v.price),years=n(v.years),infl=n(v.infl),rates=[n(v.firstLow),n(v.laterLow),n(v.firstMid),n(v.laterMid),n(v.firstHigh),n(v.laterHigh)];if(price<0)throw new Error("A jelenlegi érték nem lehet negatív.");if(!Number.isInteger(years)||years<1||years>80)throw new Error("Az időtáv 1 és 80 év közötti egész szám legyen.");if(rates.some(x=>x<0||x>100))throw new Error("Az értékvesztési ráták 0 és 100% között legyenek.");if(infl<=-100)throw new Error("Az infláció/defláció értéke legyen nagyobb -100%-nál.");const calc=(a,b)=>{let x=price;for(let y=1;y<=years;y++)x*=1-(y===1?a:b)/100;return x;};const vals=[["Óvatos",calc(rates[0],rates[1])],["Közép",calc(rates[2],rates[3])],["Erős",calc(rates[4],rates[5])]];return vals.flatMap(([name,x])=>[[`${name} nominális érték`,money(x)],[`${name} mai vásárlóértéken`,money(x/Math.pow(1+infl/100,years))]]); }',
    "értékvesztés egész év, ráta és defláció guard");

  out = replaceExact(out,
    'compute:v=>{const per=n(v.annual)/n(v.km);return [["Teljes költség",`${fmt(per,1)} Ft/km`],["Vizsgált út költsége",money(per*n(v.trip))],["Egy főre",money(per*n(v.trip)/Math.max(1,n(v.passengers)))]];}',
    'compute:v=>{const annual=n(v.annual),km=n(v.km),trip=n(v.trip),passengers=n(v.passengers);if(annual<0||km<=0||trip<0)throw new Error("A költség és a távolság adatai nem lehetnek negatívak; az éves futás legyen pozitív.");if(!Number.isInteger(passengers)||passengers<1)throw new Error("Az utasok száma pozitív egész szám legyen.");const per=annual/km;return [["Teljes költség",`${fmt(per,1)} Ft/km`],["Vizsgált út költsége",money(per*trip)],["Egy főre",money(per*trip/passengers)]];}',
    "kilométerdíj egész utasszám");

  out = replaceExact(out,
    'compute:v=>{const liters=n(v.distance)*n(v.cons)/100,cost=liters*n(v.price)+n(v.toll),stress=liters*n(v.price)*(1+n(v.priceChange)/100)+n(v.toll);return [["Szükséges üzemanyag",`${fmt(liters,1)} l`],["Teljes útiköltség",money(cost)],["Egy főre",money(cost/Math.max(1,n(v.people)))],["Stresszelt költség",money(stress)]];}',
    'compute:v=>{const distance=n(v.distance),cons=n(v.cons),price=n(v.price),toll=n(v.toll),people=n(v.people),priceChange=n(v.priceChange);if([distance,cons,price,toll].some(x=>x<0))throw new Error("A távolság, fogyasztás, ár és díj nem lehet negatív.");if(!Number.isInteger(people)||people<1)throw new Error("Az utasok száma pozitív egész szám legyen.");if(priceChange<-100)throw new Error("Az árváltozás nem lehet -100%-nál kisebb.");const liters=distance*cons/100,cost=liters*price+toll,stress=liters*price*(1+priceChange/100)+toll;return [["Szükséges üzemanyag",`${fmt(liters,1)} l`],["Teljes útiköltség",money(cost)],["Egy főre",money(cost/people)],["Stresszelt költség",money(stress)]];}',
    "útiköltség egész utasszám és árváltozás");
  return out;
}

function run() {
  const source = fs.readFileSync(target, "utf8");
  const base = applyBase(source);
  const expected = transform(base);
  if (transform(expected) !== expected) throw new Error("Az autós pénzügyi edge-upgrade nem idempotens.");
  if (!checkOnly && expected !== source) fs.writeFileSync(target, expected, "utf8");
  console.log(checkOnly ? "Autós pénzügyi edge-audit OK: idempotens." : expected === source ? "Autós pénzügyi edge-upgrade már alkalmazva." : "Autós pénzügyi edge-upgrade alkalmazva.");
}
if (require.main === module) run();
module.exports = { transform, run };
