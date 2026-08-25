const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "js", "auto-converter-upgrades.js");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található autós upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi autós upgrade cél: ${label}`);
  return source.replace(oldText, newText);
}

function apply(source) {
  let out = source;

  out = replaceExact(
    out,
    'else { i=document.createElement("input"); i.type=s.type||"number"; if(s.step)i.step=s.step; if(s.min!==undefined)i.min=s.min; if(i.type==="number")i.inputMode="decimal"; }',
    'else { i=document.createElement("input"); i.type=s.type||"number"; if(s.step)i.step=s.step; if(s.min!==undefined)i.min=s.min; if(s.max!==undefined)i.max=s.max; if(i.type==="number")i.inputMode="decimal"; }',
    "input max támogatás"
  );

  const fieldReplacements = [
    ['{id:"km",label:"Éves futás (km)",value:15000}', '{id:"km",label:"Éves futás (km)",value:15000,min:1}'],
    ['{id:"km",label:"Éves futás (km)",value:15000},{id:"trip",label:"Vizsgált út (km)",value:200},{id:"passengers",label:"Fizető utasok száma",value:1}', '{id:"km",label:"Éves futás (km)",value:15000,min:1},{id:"trip",label:"Vizsgált út (km)",value:200,min:0},{id:"passengers",label:"Fizető utasok száma",value:1,min:1,step:"1"}'],
    ['{id:"km",label:"Távolság (km)",value:100},{id:"cons",label:"Fogyasztás (l/100 km vagy kWh/100 km)",value:6.5}', '{id:"km",label:"Távolság (km)",value:100,min:0.01},{id:"cons",label:"Fogyasztás (l/100 km vagy kWh/100 km)",value:6.5,min:0}'],
    ['{id:"tailpipe",label:"Közvetlen tényező (kg CO₂/l)",value:2.31,step:"0.01",help:', '{id:"tailpipe",label:"Közvetlen tényező (kg CO₂/l)",value:2.31,step:"0.01",min:0,help:'],
    ['{id:"upstream",label:"Üzemanyag/áram előállítási pótlék (kg/l vagy kg/kWh)",value:0.55,step:"0.01"}', '{id:"upstream",label:"Üzemanyag/áram előállítási pótlék (kg/l vagy kg/kWh)",value:0.55,step:"0.01",min:0}'],
    ['{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50}', '{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50,min:0,max:100}'],
    ['{id:"grid",label:"Árammix (kg CO₂/kWh)",value:0.25,step:"0.01"}', '{id:"grid",label:"Árammix (kg CO₂/kWh)",value:0.25,step:"0.01",min:0}'],
    ['{id:"chargingLoss",label:"Töltési veszteség (%)",value:10}', '{id:"chargingLoss",label:"Töltési veszteség (%)",value:10,min:0,max:100}'],
    ['{id:"w1",label:"Régi szélesség (mm)",value:185}', '{id:"w1",label:"Régi szélesség (mm)",value:185,min:1}'],
    ['{id:"a1",label:"Régi oldalfal (%)",value:60}', '{id:"a1",label:"Régi oldalfal (%)",value:60,min:1}'],
    ['{id:"r1",label:"Régi felni (inch)",value:15}', '{id:"r1",label:"Régi felni (inch)",value:15,min:1}'],
    ['{id:"w2",label:"Új szélesség (mm)",value:195}', '{id:"w2",label:"Új szélesség (mm)",value:195,min:1}'],
    ['{id:"a2",label:"Új oldalfal (%)",value:55}', '{id:"a2",label:"Új oldalfal (%)",value:55,min:1}'],
    ['{id:"r2",label:"Új felni (inch)",value:15}', '{id:"r2",label:"Új felni (inch)",value:15,min:1}'],
    ['{id:"speed",label:"Műszer szerinti sebesség",value:100}', '{id:"speed",label:"Műszer szerinti sebesség",value:100,min:0}'],
    ['{id:"distance",label:"Távolság (km)",value:500}', '{id:"distance",label:"Távolság (km)",value:500,min:0}'],
    ['{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5}', '{id:"cons",label:"Fogyasztás (l/100 km)",value:6.5,min:0}'],
    ['{id:"price",label:"Üzemanyagár (Ft/l)",value:620}', '{id:"price",label:"Üzemanyagár (Ft/l)",value:620,min:0}'],
    ['{id:"toll",label:"Útdíj és parkolás",value:0}', '{id:"toll",label:"Útdíj és parkolás",value:0,min:0}'],
    ['{id:"people",label:"Utasok száma",value:1}', '{id:"people",label:"Utasok száma",value:1,min:1,step:"1"}'],
  ];

  for (const [oldText, newText] of fieldReplacements) {
    out = replaceExact(out, oldText, newText, oldText.slice(0, 45));
  }

  out = replaceExact(
    out,
    'try{const v=Object.fromEntries(new FormData(form).entries());out.innerHTML=rows(cfg.compute(v));}catch(err){out.textContent=err.message||"Hibás adat.";}',
    'try{const v=Object.fromEntries(new FormData(form).entries());const resultRows=cfg.compute(v);if(resultRows.some(([,value])=>/(?:NaN|Infinity)/.test(String(value))))throw new Error("A megadott adatokból nem számítható véges eredmény.");out.innerHTML=rows(resultRows);}catch(err){out.textContent=err.message||"Hibás adat.";}',
    "nem véges autós eredmény védelme"
  );

  return out;
}

const source = fs.readFileSync(target, "utf8");
const expected = apply(source);
if (apply(expected) !== expected) throw new Error("Az autós modell-upgrade nem idempotens.");
if (!checkOnly && expected !== source) fs.writeFileSync(target, expected, "utf8");

console.log(
  checkOnly
    ? "Autós modell-upgrade audit OK: inputkorlátok és véges-eredmény védelem idempotens."
    : expected === source ? "Autós modell-upgrade már alkalmazva." : "Autós modell-upgrade alkalmazva."
);

module.exports = { apply };
