const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const calculators = [
  // Építőipar
  ["padlo-burkolat-kalkulator", "Padlóburkolat kalkulátor", "epitoipari", "Számold ki a szükséges laminált padló, parketta vagy burkolat mennyiségét.", "padló burkolat laminált parketta alapterület veszteség", [
    ["length", "Helyiség hossza (m)"], ["width", "Helyiség szélessége (m)"], ["waste", "Ráhagyás (%)", 8], ["pack", "Csomag fedése (m²)", 2.2]
  ], "const area=v.length*v.width; const total=area*(1+v.waste/100); const packs=Math.ceil(total/v.pack); return [['Alapterület', m2(area)], ['Szükséges mennyiség ráhagyással', m2(total)], ['Szükséges csomag', packs+' csomag']];"],
  ["gipszkarton-kalkulator", "Gipszkarton kalkulátor", "epitoipari", "Becsüld meg, hány gipszkarton lapra lesz szükséged falhoz vagy mennyezethez.", "gipszkarton lap fal mennyezet építés", [
    ["area", "Burkolandó felület (m²)"], ["layers", "Rétegek száma", 1], ["waste", "Ráhagyás (%)", 10], ["board", "Egy lap fedése (m²)", 3]
  ], "const total=v.area*v.layers*(1+v.waste/100); return [['Teljes számolt felület', m2(total)], ['Szükséges lap', Math.ceil(total/v.board)+' db']];"],
  ["tapeta-kalkulator", "Tapéta kalkulátor", "epitoipari", "Számold ki, hány tekercs tapétára lehet szükség egy helyiségben.", "tapéta tekercs fal lakásfelújítás", [
    ["perimeter", "Falak kerülete (m)"], ["height", "Belmagasság (m)"], ["rollWidth", "Tekercs szélessége (m)", 0.53], ["rollLength", "Tekercs hossza (m)", 10.05]
  ], "const strips=Math.ceil(v.perimeter/v.rollWidth); const perRoll=Math.floor(v.rollLength/v.height)||1; return [['Szükséges csíkok', strips+' db'], ['Egy tekercsből vágható', perRoll+' csík'], ['Szükséges tekercs', Math.ceil(strips/perRoll)+' db']];"],
  ["vakolat-kalkulator", "Vakolat kalkulátor", "epitoipari", "Becsüld meg a vakolat vagy glettanyag mennyiségét felület és rétegvastagság alapján.", "vakolat glett anyag fal vastagság", [
    ["area", "Felület (m²)"], ["thickness", "Rétegvastagság (mm)", 10], ["consumption", "Anyagszükséglet (kg/m²/mm)", 1.4], ["bag", "Zsák mérete (kg)", 25]
  ], "const kg=v.area*v.thickness*v.consumption; return [['Szükséges anyag', kg.toFixed(1).replace('.', ',')+' kg'], ['Szükséges zsák', Math.ceil(kg/v.bag)+' zsák']];"],
  ["hoszigeteles-kalkulator", "Hőszigetelés kalkulátor", "epitoipari", "Tervezd meg a homlokzati vagy födémszigetelés lapmennyiségét.", "hőszigetelés homlokzat eps xps kőzetgyapot", [
    ["area", "Szigetelendő felület (m²)"], ["waste", "Ráhagyás (%)", 5], ["pack", "Csomag fedése (m²)", 5]
  ], "const total=v.area*(1+v.waste/100); return [['Szükséges szigetelés', m2(total)], ['Szükséges csomag', Math.ceil(total/v.pack)+' csomag']];"],
  ["terkovezes-kalkulator", "Térkövezés kalkulátor", "epitoipari", "Számold ki térkő, szegélykő és ráhagyás becsült mennyiségét.", "térkő udvar járda kert térkövezés", [
    ["length", "Felület hossza (m)"], ["width", "Felület szélessége (m)"], ["pieces", "Térkő igény (db/m²)", 36], ["waste", "Ráhagyás (%)", 5]
  ], "const area=v.length*v.width; const pcs=Math.ceil(area*v.pieces*(1+v.waste/100)); return [['Felület', m2(area)], ['Szükséges térkő', pcs+' db'], ['Kerület szegélyhez', ((v.length+v.width)*2).toFixed(1).replace('.', ',')+' m']];"],
  ["tetocserep-kalkulator", "Tetőcserép kalkulátor", "epitoipari", "Becsüld meg a tetőfedéshez szükséges cserepek számát.", "tető cserép tetőfedés építkezés", [
    ["area", "Tetőfelület (m²)"], ["pieces", "Cserép igény (db/m²)", 10], ["waste", "Ráhagyás (%)", 8]
  ], "const pcs=Math.ceil(v.area*v.pieces*(1+v.waste/100)); return [['Tetőfelület', m2(v.area)], ['Szükséges cserép', pcs+' db']];"],
  ["fuga-kalkulator", "Fuga kalkulátor", "epitoipari", "Számold ki a várható fugázóanyag-szükségletet burkoláshoz.", "fuga burkolás csempe járólap fugázó", [
    ["area", "Burkolt felület (m²)"], ["tileLength", "Lap hossza (mm)", 300], ["tileWidth", "Lap szélessége (mm)", 300], ["joint", "Fugaszélesség (mm)", 3], ["depth", "Fugamélység (mm)", 8]
  ], "const kg=v.area*((v.tileLength+v.tileWidth)/(v.tileLength*v.tileWidth))*v.joint*v.depth*1.6; return [['Becsült fugázóanyag', kg.toFixed(1).replace('.', ',')+' kg'], ['5 kg-os zsák', Math.ceil(kg/5)+' zsák']];"],

  // Egészség
  ["vizfogyasztas-kalkulator", "Vízfogyasztás kalkulátor", "egeszseg", "Becsüld meg a napi ajánlott folyadékbevitelt testsúly és aktivitás alapján.", "vízfogyasztás folyadék testsúly hidratálás", [["weight","Testsúly (kg)"],["activity","Aktivitás pótlás (ml)",500]], "const ml=v.weight*35+v.activity; return [['Ajánlott napi folyadék', (ml/1000).toFixed(2).replace('.', ',')+' liter'], ['Ez poharakban', Math.round(ml/250)+' pohár']];"],
  ["pulzus-zona-kalkulator", "Pulzus zóna kalkulátor", "egeszseg", "Számold ki az edzéshez használható pulzustartományokat.", "pulzus edzés kardió zóna sport", [["age","Életkor"],["rest","Nyugalmi pulzus",65]], "const max=220-v.age; const reserve=max-v.rest; return [['Becsült max pulzus', max+' bpm'], ['Zsírégető zóna', Math.round(v.rest+reserve*.6)+'-'+Math.round(v.rest+reserve*.7)+' bpm'], ['Állóképességi zóna', Math.round(v.rest+reserve*.7)+'-'+Math.round(v.rest+reserve*.85)+' bpm']];"],
  ["terhessegi-kalkulator", "Terhességi kalkulátor", "egeszseg", "Számold ki a várható szülési dátumot az utolsó menstruáció alapján.", "terhesség szülés dátum kalkulátor", [["days","Hány nap telt el az utolsó menstruáció óta?"]], "const due=new Date(); due.setDate(due.getDate()+(280-v.days)); const week=Math.floor(v.days/7); return [['Becsült terhességi hét', week+'. hét'], ['Várható szülési dátum', due.toLocaleDateString('hu-HU')]];"],
  ["idealis-testsuly-kalkulator", "Ideális testsúly kalkulátor", "egeszseg", "Becsüld meg az ideális testsúlyt magasság és nem alapján.", "ideális testsúly magasság egészség", [["height","Magasság (cm)"],["gender","Nem: 1=nő, 2=férfi",1]], "const base=v.gender>=2?50:45.5; const kg=base+0.9*(v.height-152); return [['Becsült ideális testsúly', kg.toFixed(1).replace('.', ',')+' kg'], ['Egészséges tartomány', (kg*0.9).toFixed(1).replace('.', ',')+' - '+(kg*1.1).toFixed(1).replace('.', ',')+' kg']];"],
  ["testzsir-kalkulator", "Testzsír százalék kalkulátor", "egeszseg", "Becsüld meg a testzsírszázalékot derék, nyak, csípő és magasság alapján.", "testzsír százalék derék csípő egészség", [["gender","Nem: 1=nő, 2=férfi",1],["waist","Derék (cm)"],["neck","Nyak (cm)"],["hip","Csípő (cm, férfinál 0)",0],["height","Magasság (cm)"]], "const log10=Math.log10; const fat=v.gender>=2 ? 495/(1.0324-0.19077*log10(v.waist-v.neck)+0.15456*log10(v.height))-450 : 495/(1.29579-0.35004*log10(v.waist+v.hip-v.neck)+0.221*log10(v.height))-450; return [['Becsült testzsír', fat.toFixed(1).replace('.', ',')+'%']];"],
  ["makro-kalkulator", "Makró kalkulátor", "egeszseg", "Oszd fel a napi kalóriát fehérje, szénhidrát és zsír között.", "makró fehérje szénhidrát zsír étrend", [["calories","Napi kalória (kcal)"],["protein","Fehérje arány (%)",30],["fat","Zsír arány (%)",25]], "const carb=100-v.protein-v.fat; return [['Fehérje', Math.round(v.calories*v.protein/100/4)+' g'], ['Zsír', Math.round(v.calories*v.fat/100/9)+' g'], ['Szénhidrát', Math.round(v.calories*carb/100/4)+' g']];"],
  ["alvasciklus-kalkulator", "Alvásciklus kalkulátor", "egeszseg", "Tervezd meg, mikor érdemes lefeküdni vagy felkelni 90 perces ciklusokkal.", "alvás ciklus lefekvés felkelés", [["wakeHour","Felkelés órája",7],["wakeMinute","Felkelés perce",0]], "const out=[]; [6,5,4].forEach(c=>{const d=new Date(); d.setHours(v.wakeHour, v.wakeMinute,0,0); d.setMinutes(d.getMinutes()-c*90-15); out.push([c+' ciklus lefekvés', d.toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})]);}); return out;"],
  ["bmr-kalkulator", "BMR kalkulátor", "egeszseg", "Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.", "bmr alapanyagcsere kalória", [["gender","Nem: 1=nő, 2=férfi",1],["weight","Testsúly (kg)"],["height","Magasság (cm)"],["age","Életkor"]], "const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); return [['BMR', Math.round(bmr)+' kcal/nap'], ['Könnyű aktivitással', Math.round(bmr*1.375)+' kcal/nap']];"],
  ["derek-csipo-kalkulator", "Derék-csípő arány kalkulátor", "egeszseg", "Számold ki a derék-csípő arányt, egy egyszerű egészségi mutatót.", "derék csípő arány whr", [["waist","Derékbőség (cm)"],["hip","Csípőbőség (cm)"]], "const ratio=v.waist/v.hip; return [['Derék-csípő arány', ratio.toFixed(2).replace('.', ',')], ['Értékelés', ratio<0.85?'alacsonyabb kockázati tartomány':'magasabb kockázati tartomány']];"],
  ["feherje-szukseglet-kalkulator", "Fehérje szükséglet kalkulátor", "egeszseg", "Becsüld meg a napi fehérjeigényt testsúly és cél alapján.", "fehérje protein edzés fogyás", [["weight","Testsúly (kg)"],["factor","Cél szorzó (g/kg)",1.6]], "const g=v.weight*v.factor; return [['Napi fehérjeigény', Math.round(g)+' g'], ['Étkezésenként 4 részre', Math.round(g/4)+' g']];"],
  // Mindennapi
  ["ar-kedvezmeny-kalkulator", "Árkedvezmény kalkulátor", "mindennapi", "Számold ki az akciós árat, kedvezményt és megtakarítást.", "kedvezmény akció ár százalék", [["price","Eredeti ár (Ft)"],["discount","Kedvezmény (%)"]], "const save=v.price*v.discount/100; return [['Kedvezmény összege', money(save)], ['Akciós ár', money(v.price-save)]];"],
  ["borravalo-kalkulator", "Borravaló kalkulátor", "mindennapi", "Oszd el a számlát és számold ki a borravalót több főre.", "borravaló számla étterem", [["bill","Számla összege (Ft)"],["tip","Borravaló (%)",10],["people","Fő",2]], "const tip=v.bill*v.tip/100; return [['Borravaló', money(tip)], ['Fizetendő összesen', money(v.bill+tip)], ['Egy főre', money((v.bill+tip)/v.people)]];"],
  ["munkaido-kalkulator", "Munkaidő kalkulátor", "mindennapi", "Számold ki a heti és havi munkaórát napi óraszám alapján.", "munkaidő óra hét hónap", [["days","Munkanap hetente",5],["hours","Óra naponta",8],["weeks","Hetek",4.33]], "const weekly=v.days*v.hours; return [['Heti munkaidő', weekly+' óra'], ['Havi becsült munkaidő', (weekly*v.weeks).toFixed(1).replace('.', ',')+' óra']];"],
  ["eletkor-kalkulator", "Életkor kalkulátor", "mindennapi", "Számold ki az életkort években, hónapokban és napokban.", "életkor születésnap dátum", [["birthYear","Születési év"],["birthMonth","Születési hónap",1],["birthDay","Születési nap",1]], "const b=new Date(v.birthYear,v.birthMonth-1,v.birthDay); const now=new Date(); const days=Math.floor((now-b)/86400000); return [['Életkor napokban', days+' nap'], ['Életkor években', Math.floor(days/365.2425)+' év']];"],
  ["datum-kulonbseg-kalkulator", "Dátum különbség kalkulátor", "mindennapi", "Számold ki két dátum közötti napok számát egyszerűen.", "dátum különbség napok", [["days","Eltelt napok száma"],["multiplier","Szorzó vagy díj/nap",1]], "return [['Napok száma', v.days+' nap'], ['Szorzott érték', format(v.days*v.multiplier)]];"],
  ["atlag-kalkulator", "Átlag kalkulátor", "mindennapi", "Számold ki több érték átlagát darabszám és összeg alapján.", "átlag számítás összeg darab", [["sum","Értékek összege"],["count","Darabszám"]], "return [['Átlag', format(v.sum/v.count)]];"],
  ["egysegar-kalkulator", "Egységár kalkulátor", "mindennapi", "Hasonlítsd össze termékek egységárát kiszerelés alapján.", "egységár ár kiszerelés vásárlás", [["price","Ár (Ft)"],["quantity","Mennyiség"],["unit","Egység szorzó",1]], "return [['Egységár', money(v.price/(v.quantity*v.unit))+' / egység']];"],
  ["rezsi-megosztas-kalkulator", "Rezsi megosztás kalkulátor", "mindennapi", "Oszd szét a közös költségeket lakótársak vagy családtagok között.", "rezsi megosztás lakótárs közös költség", [["total","Teljes költség (Ft)"],["people","Fő",2],["extra","Saját extra költség (Ft)",0]], "return [['Egy fő alap része', money(v.total/v.people)], ['Saját fizetendő', money(v.total/v.people+v.extra)]];"],
  ["oraber-kalkulator", "Órabér kalkulátor", "mindennapi", "Számold ki az órabéred havi bér és munkaóra alapján.", "órabér fizetés munkaóra", [["salary","Havi bér (Ft)"],["hours","Havi munkaóra",174]], "return [['Órabér', money(v.salary/v.hours)], ['8 órás nap értéke', money(v.salary/v.hours*8)]];"],
  ["arany-kalkulator", "Arány kalkulátor", "mindennapi", "Számold ki egy rész arányát az egészhez képest.", "arány rész egész százalék", [["part","Rész"],["whole","Egész"]], "const pct=v.part/v.whole*100; return [['Arány', pct.toFixed(2).replace('.', ',')+'%'], ['Rész / egész', v.part+' / '+v.whole]];"],

  // Autó
  ["uzemanyag-koltseg-kalkulator", "Üzemanyag költség kalkulátor", "auto", "Számold ki egy út várható üzemanyagköltségét.", "üzemanyag benzin dízel útiköltség", [["distance","Távolság (km)"],["consumption","Fogyasztás (l/100 km)"],["price","Üzemanyagár (Ft/l)"]], "const liters=v.distance*v.consumption/100; return [['Szükséges üzemanyag', liters.toFixed(1).replace('.', ',')+' l'], ['Várható költség', money(liters*v.price)]];"],
  ["auto-fogyasztas-kalkulator", "Autó fogyasztás kalkulátor", "auto", "Számold ki a valós fogyasztást tankolás és megtett kilométer alapján.", "fogyasztás tankolás autó liter", [["liters","Tankolt mennyiség (l)"],["distance","Megtett távolság (km)"]], "return [['Átlagfogyasztás', (v.liters/v.distance*100).toFixed(2).replace('.', ',')+' l/100 km']];"],
  ["hatotav-kalkulator", "Hatótáv kalkulátor", "auto", "Becsüld meg, hány kilométert tehetsz meg a tankban lévő üzemanyaggal.", "hatótáv tank fogyasztás", [["fuel","Üzemanyag a tankban (l)"],["consumption","Fogyasztás (l/100 km)"]], "return [['Becsült hatótáv', Math.round(v.fuel/v.consumption*100)+' km']];"],
  ["eves-auto-koltseg-kalkulator", "Éves autóköltség kalkulátor", "auto", "Becsüld meg az autó éves fenntartási költségét.", "autó fenntartás éves költség biztosítás szerviz", [["fuel","Éves üzemanyag (Ft)"],["insurance","Biztosítás (Ft)"],["service","Szerviz (Ft)"],["tax","Adó és díjak (Ft)"],["other","Egyéb (Ft)",0]], "const total=v.fuel+v.insurance+v.service+v.tax+v.other; return [['Éves költség', money(total)], ['Havi átlag', money(total/12)]];"],
  ["auto-ertekvesztes-kalkulator", "Autó értékvesztés kalkulátor", "auto", "Számold ki, mennyit veszíthet az autó az értékéből évente.", "autó amortizáció értékvesztés", [["price","Vételár (Ft)"],["rate","Éves értékvesztés (%)",12],["years","Évek száma",3]], "const value=v.price*Math.pow(1-v.rate/100,v.years); return [['Becsült érték', money(value)], ['Értékvesztés', money(v.price-value)]];"],
  ["kilometerdij-kalkulator", "Kilométerdíj kalkulátor", "auto", "Számold ki, mennyibe kerül egy kilométer az autóddal.", "kilométerdíj autó költség km", [["monthly","Havi autóköltség (Ft)"],["km","Havi megtett km"]], "return [['Költség kilométerenként', money(v.monthly/v.km)+' / km']];"],
  ["co2-kibocsatas-kalkulator", "CO2 kibocsátás kalkulátor", "auto", "Becsüld meg az utazás szén-dioxid kibocsátását üzemanyag alapján.", "co2 kibocsátás autó környezet", [["distance","Távolság (km)"],["consumption","Fogyasztás (l/100 km)"],["factor","CO2 kg/l",2.31]], "const kg=v.distance*v.consumption/100*v.factor; return [['Becsült CO2', kg.toFixed(1).replace('.', ',')+' kg']];"],
  ["tankolas-kalkulator", "Tankolás kalkulátor", "auto", "Számold ki, mennyibe kerül a tankolás és mennyi liter fér bele.", "tankolás üzemanyag liter ár", [["budget","Tankolási keret (Ft)"],["price","Üzemanyagár (Ft/l)"]], "return [['Tankolható mennyiség', (v.budget/v.price).toFixed(1).replace('.', ',')+' l']];"],
  ["gumi-meret-kalkulator", "Gumiméret váltó kalkulátor", "auto", "Hasonlíts össze két gumiméretet átmérő és eltérés alapján.", "gumiméret váltó kerék átmérő", [["w1","Régi szélesség (mm)",205],["p1","Régi profil (%)",55],["r1","Régi felni (coll)",16],["w2","Új szélesség (mm)",225],["p2","Új profil (%)",45],["r2","Új felni (coll)",17]], "const d1=v.r1*25.4+2*v.w1*v.p1/100; const d2=v.r2*25.4+2*v.w2*v.p2/100; return [['Régi átmérő', d1.toFixed(1).replace('.', ',')+' mm'], ['Új átmérő', d2.toFixed(1).replace('.', ',')+' mm'], ['Eltérés', ((d2-d1)/d1*100).toFixed(2).replace('.', ',')+'%']];"],
  ["autopalyadij-kalkulator", "Autópályadíj kalkulátor", "auto", "Oszd el az autópályadíjat utasok között.", "autópálya matrica díj utazás", [["fee","Autópályadíj (Ft)"],["people","Utasok száma",2]], "return [['Egy főre jutó díj', money(v.fee/v.people)]];"],
  ["utazasi-ido-kalkulator", "Utazási idő kalkulátor", "auto", "Számold ki a várható menetidőt távolság és átlagsebesség alapján.", "utazási idő távolság sebesség", [["distance","Távolság (km)"],["speed","Átlagsebesség (km/h)",90],["breaks","Pihenőidő (perc)",0]], "const min=v.distance/v.speed*60+v.breaks; return [['Várható menetidő', Math.floor(min/60)+' óra '+Math.round(min%60)+' perc']];"],

  // Átváltók
  ["energia-atvalto-kalkulator", "Energia átváltó kalkulátor", "atvaltok", "Válts át joule, kilojoule, kalória és kilowattóra között.", "energia joule kalória kwh átváltás", [["value","Érték"],["from","Forrás: 1=J, 2=kJ, 3=kcal, 4=kWh",2]], "const j=[1,1000,4184,3600000][v.from-1]*v.value; return [['Joule', format(j)+' J'], ['Kilojoule', format(j/1000)+' kJ'], ['Kilokalória', (j/4184).toFixed(2).replace('.', ',')+' kcal'], ['Kilowattóra', (j/3600000).toFixed(4).replace('.', ',')+' kWh']];"],
  ["nyomas-atvalto-kalkulator", "Nyomás átváltó kalkulátor", "atvaltok", "Válts át pascal, bar, atmoszféra és PSI között.", "nyomás bar psi pascal átváltás", [["value","Érték"],["from","Forrás: 1=Pa, 2=bar, 3=atm, 4=psi",2]], "const pa=[1,100000,101325,6894.76][v.from-1]*v.value; return [['Pascal', format(pa)+' Pa'], ['Bar', (pa/100000).toFixed(4).replace('.', ',')+' bar'], ['Atmoszféra', (pa/101325).toFixed(4).replace('.', ',')+' atm'], ['PSI', (pa/6894.76).toFixed(2).replace('.', ',')+' psi']];"],
  ["teljesitmeny-atvalto-kalkulator", "Teljesítmény átváltó kalkulátor", "atvaltok", "Válts át watt, kilowatt és lóerő között.", "teljesítmény watt kilowatt lóerő átváltás", [["value","Érték"],["from","Forrás: 1=W, 2=kW, 3=LE",2]], "const w=[1,1000,735.5][v.from-1]*v.value; return [['Watt', format(w)+' W'], ['Kilowatt', (w/1000).toFixed(3).replace('.', ',')+' kW'], ['Lóerő', (w/735.5).toFixed(2).replace('.', ',')+' LE']];"],
];

const categoryNames = {
  epitoipari: "Építőipari",
  egeszseg: "Egészség",
  mindennapi: "Mindennapi",
  auto: "Autó",
  atvaltok: "Átváltók",
};

function esc(value) {
  return value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function normalizeField([id, label, value]) {
  if (label.startsWith("Nem:")) {
    return {
      id,
      label: "Nem",
      value: value ?? 1,
      options: [
        { value: 1, label: "Nő" },
        { value: 2, label: "Férfi" },
      ],
    };
  }

  const sourceMatch = label.match(/^Forrás:\s*(.+)$/);

  if (sourceMatch) {
    const options = sourceMatch[1].split(",").map((item) => {
      const [optionValue, optionLabel] = item.trim().split("=");

      return {
        value: Number(optionValue),
        label: optionLabel,
      };
    });

    return {
      id,
      label: "Forrás egység",
      value: value ?? options[0]?.value ?? "",
      options,
    };
  }

  return { id, label, value: value ?? "" };
}

function pageHtml(calc) {
  const [slug, title, category, description] = calc;
  return `<!doctype html>
<html lang="hu">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/${slug}.html" />
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/pages/simple-calculator.css" />
  <script src="../js/global-head.js"></script>
</head>

<body>
  <div id="header"></div>

  <main class="container page-simple-calculator" data-simple-calc="${slug}">
    <section class="hero">
      <h1>${esc(title)}</h1>
      <p>${esc(description)}</p>
    </section>

    <section class="card card-calculator">
      <div class="calc-grid" id="simpleCalcFields"></div>
      <div class="result-box">
        <p>Eredmény:</p>
        <div id="simpleCalcResults">–</div>
      </div>
    </section>

    <section class="article">
      <div class="info-box">
        <strong>Tipp:</strong> A kalkulátor gyors becslést ad, de nagyobb döntés előtt mindig érdemes a saját helyzetedhez igazított adatokkal újraszámolni.
      </div>
      <h2>${esc(title)} használata</h2>
      <p>${esc(description)} Add meg a kért adatokat, és az oldal azonnal kiszámolja a legfontosabb eredményeket.</p>
      <p>A ${esc(categoryNames[category].toLowerCase())} témájú számításoknál sokszor már egy gyors becslés is segít abban, hogy jobban tervezhető legyen a következő lépés.</p>
      <h2>Mikor hasznos?</h2>
      <p>Akkor érdemes használni, amikor szeretnéd elkerülni a fejben számolgatást, és gyorsan összehasonlítható, áttekinthető eredményt szeretnél kapni.</p>
    </section>
  </main>

  <div id="footer"></div>
  <script src="../js/utils.js"></script>
  <script src="../js/simple-calculators.js" defer></script>
</body>

</html>
`;
}

function simpleEngine() {
  const config = calculators.map(([slug, title, category, description, keywords, fields, compute]) => ({
    slug,
    title,
    fields: fields.map(normalizeField),
    compute,
  }));
  return `const SIMPLE_CALCULATORS = {
${config.map((calc) => `  "${calc.slug}": {
    fields: ${JSON.stringify(calc.fields, null, 4)},
    compute(v) { ${calc.compute} }
  }`).join(",\n")}
};

function format(value) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(value));
}

function money(value) {
  return format(value) + " Ft";
}

function m2(value) {
  return value.toFixed(2).replace(".", ",") + " m²";
}

function parseValue(value) {
  return parseFloat(value.toString().replace(/\\s/g, "").replace(",", ".")) || 0;
}

function escapeHtml(value) {
  return (value ?? "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function initSimpleCalculator() {
  const root = document.querySelector("[data-simple-calc]");
  if (!root) return;

  const calc = SIMPLE_CALCULATORS[root.dataset.simpleCalc];
  const fieldsTarget = document.getElementById("simpleCalcFields");
  const resultsTarget = document.getElementById("simpleCalcResults");
  if (!calc || !fieldsTarget || !resultsTarget) return;

  fieldsTarget.innerHTML = calc.fields.map((field) => {
    const fieldId = escapeAttribute(field.id);
    const fieldValue = escapeAttribute(field.value);

    if (field.options) {
      return \`
        <div>
          <label for="\${fieldId}">\${escapeHtml(field.label)}</label>
          <select id="\${fieldId}">
            \${field.options.map((option) => \`
              <option value="\${escapeAttribute(option.value)}" \${Number(option.value) === Number(field.value) ? "selected" : ""}>\${escapeHtml(option.label)}</option>
            \`).join("")}
          </select>
        </div>
      \`;
    }

    return \`
      <div>
        <label for="\${fieldId}">\${escapeHtml(field.label)}</label>
        <input type="text" id="\${fieldId}" value="\${fieldValue}" />
      </div>
    \`;
  }).join("");

  const inputs = calc.fields.map((field) => document.getElementById(field.id));
  let hasTrackedStart = false;

  const run = () => {
    const values = {};
    inputs.forEach((input) => {
      values[input.id] = parseValue(input.value);
    });

    try {
      const rows = calc.compute(values);
      resultsTarget.innerHTML = rows.map(([label, value]) => \`
        <p><strong>\${escapeHtml(label)}:</strong> \${escapeHtml(value)}</p>
      \`).join("");
    } catch (error) {
      resultsTarget.textContent = "Adj meg érvényes adatokat a számításhoz.";
    }
  };

  const onUserChange = () => {
    if (!hasTrackedStart && typeof window.KB_TRACK_EVENT === "function") {
      hasTrackedStart = true;
      window.KB_TRACK_EVENT("calculator_start", { calculator: root.dataset.simpleCalc });
    }

    run();
  };

  inputs.forEach((input) => {
    input.addEventListener("input", onUserChange);
    input.addEventListener("change", onUserChange);
  });
  run();
}

document.addEventListener("DOMContentLoaded", initSimpleCalculator);
`;
}

function updateSiteData() {
  const siteDataPath = path.join(root, "js", "site-data.js");
  let text = fs.readFileSync(siteDataPath, "utf8");
  const existing = new Set([...text.matchAll(/url: "([^"]+)"/g)].map((match) => match[1]));
  const additions = calculators
    .filter(([slug]) => !existing.has(`kalkulatorok/${slug}.html`))
    .map(([slug, title, category, description, keywords]) => `    {
      title: "${title}",
      url: "kalkulatorok/${slug}.html",
      category: "${category}",
      description: "${description}",
      keywords: "${keywords}",
    },`)
    .join("\n");

  if (additions) {
    text = text.replace("  ];\n\n  window.KB_DATA", `${additions}\n  ];\n\n  window.KB_DATA`);
    fs.writeFileSync(siteDataPath, text, "utf8");
  }
}

function updateSitemap() {
  const sitemapPath = path.join(root, "sitemap.xml");
  let text = fs.readFileSync(sitemapPath, "utf8");
  const additions = calculators
    .filter(([slug]) => !text.includes(`kalkulatorok/${slug}.html`))
    .map(([slug]) => `    <url>
        <loc>https://kalkulatorbazis.hu/kalkulatorok/${slug}.html</loc>
        <priority>0.8</priority>
    </url>`)
    .join("\n");

  if (additions) {
    text = text.replace("\n</urlset>", `\n${additions}\n\n</urlset>`);
    fs.writeFileSync(sitemapPath, text, "utf8");
  }
}

function writeFiles() {
  fs.mkdirSync(path.join(root, "css", "pages"), { recursive: true });
  fs.writeFileSync(path.join(root, "js", "simple-calculators.js"), simpleEngine(), "utf8");
  fs.writeFileSync(path.join(root, "css", "pages", "simple-calculator.css"), `.page-simple-calculator { max-width: 820px; margin: 0 auto; }
.page-simple-calculator #simpleCalcResults p { margin-bottom: 8px; }
.page-simple-calculator #simpleCalcResults strong { color: var(--text); }
`, "utf8");

  calculators.forEach((calc) => {
    fs.writeFileSync(path.join(root, "kalkulatorok", `${calc[0]}.html`), pageHtml(calc), "utf8");
  });
}

writeFiles();
updateSiteData();
updateSitemap();

console.log(`Added or refreshed ${calculators.length} category calculators.`);
