const SIMPLE_CALCULATORS = {
  "padlo-burkolat-kalkulator": {
    fields: [
    {
        "id": "length",
        "label": "Helyiség hossza (m)",
        "value": ""
    },
    {
        "id": "width",
        "label": "Helyiség szélessége (m)",
        "value": ""
    },
    {
        "id": "waste",
        "label": "Ráhagyás (%)",
        "value": 8
    },
    {
        "id": "pack",
        "label": "Csomag fedése (m²)",
        "value": 2.2
    }
],
    compute(v) { const area=v.length*v.width; const total=area*(1+v.waste/100); const packs=Math.ceil(total/v.pack); return [['Alapterület', m2(area)], ['Szükséges mennyiség ráhagyással', m2(total)], ['Szükséges csomag', packs+' csomag']]; }
  },
  "gipszkarton-kalkulator": {
    fields: [
    {
        "id": "area",
        "label": "Burkolandó felület (m²)",
        "value": ""
    },
    {
        "id": "layers",
        "label": "Rétegek száma",
        "value": 1
    },
    {
        "id": "waste",
        "label": "Ráhagyás (%)",
        "value": 10
    },
    {
        "id": "board",
        "label": "Egy lap fedése (m²)",
        "value": 3
    }
],
    compute(v) { const total=v.area*v.layers*(1+v.waste/100); return [['Teljes számolt felület', m2(total)], ['Szükséges lap', Math.ceil(total/v.board)+' db']]; }
  },
  "tapeta-kalkulator": {
    fields: [
    {
        "id": "perimeter",
        "label": "Falak kerülete (m)",
        "value": ""
    },
    {
        "id": "height",
        "label": "Belmagasság (m)",
        "value": ""
    },
    {
        "id": "rollWidth",
        "label": "Tekercs szélessége (m)",
        "value": 0.53
    },
    {
        "id": "rollLength",
        "label": "Tekercs hossza (m)",
        "value": 10.05
    }
],
    compute(v) { const strips=Math.ceil(v.perimeter/v.rollWidth); const perRoll=Math.floor(v.rollLength/v.height)||1; return [['Szükséges csíkok', strips+' db'], ['Egy tekercsből vágható', perRoll+' csík'], ['Szükséges tekercs', Math.ceil(strips/perRoll)+' db']]; }
  },
  "vakolat-kalkulator": {
    fields: [
    {
        "id": "area",
        "label": "Felület (m²)",
        "value": ""
    },
    {
        "id": "thickness",
        "label": "Rétegvastagság (mm)",
        "value": 10
    },
    {
        "id": "consumption",
        "label": "Anyagszükséglet (kg/m²/mm)",
        "value": 1.4
    },
    {
        "id": "bag",
        "label": "Zsák mérete (kg)",
        "value": 25
    }
],
    compute(v) { const kg=v.area*v.thickness*v.consumption; return [['Szükséges anyag', kg.toFixed(1).replace('.', ',')+' kg'], ['Szükséges zsák', Math.ceil(kg/v.bag)+' zsák']]; }
  },
  "hoszigeteles-kalkulator": {
    fields: [
    {
        "id": "area",
        "label": "Szigetelendő felület (m²)",
        "value": ""
    },
    {
        "id": "waste",
        "label": "Ráhagyás (%)",
        "value": 5
    },
    {
        "id": "pack",
        "label": "Csomag fedése (m²)",
        "value": 5
    }
],
    compute(v) { const total=v.area*(1+v.waste/100); return [['Szükséges szigetelés', m2(total)], ['Szükséges csomag', Math.ceil(total/v.pack)+' csomag']]; }
  },
  "terkovezes-kalkulator": {
    fields: [
    {
        "id": "length",
        "label": "Felület hossza (m)",
        "value": ""
    },
    {
        "id": "width",
        "label": "Felület szélessége (m)",
        "value": ""
    },
    {
        "id": "pieces",
        "label": "Térkő igény (db/m²)",
        "value": 36
    },
    {
        "id": "waste",
        "label": "Ráhagyás (%)",
        "value": 5
    }
],
    compute(v) { const area=v.length*v.width; const pcs=Math.ceil(area*v.pieces*(1+v.waste/100)); return [['Felület', m2(area)], ['Szükséges térkő', pcs+' db'], ['Kerület szegélyhez', ((v.length+v.width)*2).toFixed(1).replace('.', ',')+' m']]; }
  },
  "tetocserep-kalkulator": {
    fields: [
    {
        "id": "area",
        "label": "Tetőfelület (m²)",
        "value": ""
    },
    {
        "id": "pieces",
        "label": "Cserép igény (db/m²)",
        "value": 10
    },
    {
        "id": "waste",
        "label": "Ráhagyás (%)",
        "value": 8
    }
],
    compute(v) { const pcs=Math.ceil(v.area*v.pieces*(1+v.waste/100)); return [['Tetőfelület', m2(v.area)], ['Szükséges cserép', pcs+' db']]; }
  },
  "fuga-kalkulator": {
    fields: [
    {
        "id": "area",
        "label": "Burkolt felület (m²)",
        "value": ""
    },
    {
        "id": "tileLength",
        "label": "Lap hossza (mm)",
        "value": 300
    },
    {
        "id": "tileWidth",
        "label": "Lap szélessége (mm)",
        "value": 300
    },
    {
        "id": "joint",
        "label": "Fugaszélesség (mm)",
        "value": 3
    },
    {
        "id": "depth",
        "label": "Fugamélység (mm)",
        "value": 8
    }
],
    compute(v) { const kg=v.area*((v.tileLength+v.tileWidth)/(v.tileLength*v.tileWidth))*v.joint*v.depth*1.6; return [['Becsült fugázóanyag', kg.toFixed(1).replace('.', ',')+' kg'], ['5 kg-os zsák', Math.ceil(kg/5)+' zsák']]; }
  },
  "vizfogyasztas-kalkulator": {
    fields: [
    {
        "id": "weight",
        "label": "Testsúly (kg)",
        "value": ""
    },
    {
        "id": "activity",
        "label": "Aktivitás pótlás (ml)",
        "value": 500
    }
],
    compute(v) { const ml=v.weight*35+v.activity; return [['Ajánlott napi folyadék', (ml/1000).toFixed(2).replace('.', ',')+' liter'], ['Ez poharakban', Math.round(ml/250)+' pohár']]; }
  },
  "pulzus-zona-kalkulator": {
    fields: [
    {
        "id": "age",
        "label": "Életkor",
        "value": ""
    },
    {
        "id": "rest",
        "label": "Nyugalmi pulzus",
        "value": 65
    }
],
    compute(v) { const max=220-v.age; const reserve=max-v.rest; return [['Becsült max pulzus', max+' bpm'], ['Zsírégető zóna', Math.round(v.rest+reserve*.6)+'-'+Math.round(v.rest+reserve*.7)+' bpm'], ['Állóképességi zóna', Math.round(v.rest+reserve*.7)+'-'+Math.round(v.rest+reserve*.85)+' bpm']]; }
  },
  "terhessegi-kalkulator": {
    fields: [
    {
        "id": "days",
        "label": "Hány nap telt el az utolsó menstruáció óta?",
        "value": ""
    }
],
    compute(v) { const due=new Date(); due.setDate(due.getDate()+(280-v.days)); const week=Math.floor(v.days/7); return [['Becsült terhességi hét', week+'. hét'], ['Várható szülési dátum', due.toLocaleDateString('hu-HU')]]; }
  },
  "idealis-testsuly-kalkulator": {
    fields: [
    {
        "id": "height",
        "label": "Magasság (cm)",
        "value": ""
    },
    {
        "id": "gender",
        "label": "Nem",
        "value": 1,
        "options": [
            {
                "value": 1,
                "label": "Nő"
            },
            {
                "value": 2,
                "label": "Férfi"
            }
        ]
    }
],
    compute(v) { const base=v.gender>=2?50:45.5; const kg=base+0.9*(v.height-152); return [['Becsült ideális testsúly', kg.toFixed(1).replace('.', ',')+' kg'], ['Egészséges tartomány', (kg*0.9).toFixed(1).replace('.', ',')+' - '+(kg*1.1).toFixed(1).replace('.', ',')+' kg']]; }
  },
  "testzsir-kalkulator": {
    fields: [
    {
        "id": "gender",
        "label": "Nem",
        "value": 1,
        "options": [
            {
                "value": 1,
                "label": "Nő"
            },
            {
                "value": 2,
                "label": "Férfi"
            }
        ]
    },
    {
        "id": "waist",
        "label": "Derék (cm)",
        "value": ""
    },
    {
        "id": "neck",
        "label": "Nyak (cm)",
        "value": ""
    },
    {
        "id": "hip",
        "label": "Csípő (cm, férfinál 0)",
        "value": 0
    },
    {
        "id": "height",
        "label": "Magasság (cm)",
        "value": ""
    }
],
    compute(v) { const log10=Math.log10; const fat=v.gender>=2 ? 495/(1.0324-0.19077*log10(v.waist-v.neck)+0.15456*log10(v.height))-450 : 495/(1.29579-0.35004*log10(v.waist+v.hip-v.neck)+0.221*log10(v.height))-450; return [['Becsült testzsír', fat.toFixed(1).replace('.', ',')+'%']]; }
  },
  "makro-kalkulator": {
    fields: [
    {
        "id": "calories",
        "label": "Napi kalória (kcal)",
        "value": ""
    },
    {
        "id": "protein",
        "label": "Fehérje arány (%)",
        "value": 30
    },
    {
        "id": "fat",
        "label": "Zsír arány (%)",
        "value": 25
    }
],
    compute(v) { const carb=100-v.protein-v.fat; return [['Fehérje', Math.round(v.calories*v.protein/100/4)+' g'], ['Zsír', Math.round(v.calories*v.fat/100/9)+' g'], ['Szénhidrát', Math.round(v.calories*carb/100/4)+' g']]; }
  },
  "alvasciklus-kalkulator": {
    fields: [
    {
        "id": "wakeHour",
        "label": "Felkelés órája",
        "value": 7
    },
    {
        "id": "wakeMinute",
        "label": "Felkelés perce",
        "value": 0
    }
],
    compute(v) { const out=[]; [6,5,4].forEach(c=>{const d=new Date(); d.setHours(v.wakeHour, v.wakeMinute,0,0); d.setMinutes(d.getMinutes()-c*90-15); out.push([c+' ciklus lefekvés', d.toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})]);}); return out; }
  },
  "bmr-kalkulator": {
    fields: [
    {
        "id": "gender",
        "label": "Nem",
        "value": 1,
        "options": [
            {
                "value": 1,
                "label": "Nő"
            },
            {
                "value": 2,
                "label": "Férfi"
            }
        ]
    },
    {
        "id": "weight",
        "label": "Testsúly (kg)",
        "value": ""
    },
    {
        "id": "height",
        "label": "Magasság (cm)",
        "value": ""
    },
    {
        "id": "age",
        "label": "Életkor",
        "value": ""
    }
],
    compute(v) { const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); return [['BMR', Math.round(bmr)+' kcal/nap'], ['Könnyű aktivitással', Math.round(bmr*1.375)+' kcal/nap']]; }
  },
  "derek-csipo-kalkulator": {
    fields: [
    {
        "id": "waist",
        "label": "Derékbőség (cm)",
        "value": ""
    },
    {
        "id": "hip",
        "label": "Csípőbőség (cm)",
        "value": ""
    }
],
    compute(v) { const ratio=v.waist/v.hip; return [['Derék-csípő arány', ratio.toFixed(2).replace('.', ',')], ['Értékelés', ratio<0.85?'alacsonyabb kockázati tartomány':'magasabb kockázati tartomány']]; }
  },
  "feherje-szukseglet-kalkulator": {
    fields: [
    {
        "id": "weight",
        "label": "Testsúly (kg)",
        "value": ""
    },
    {
        "id": "factor",
        "label": "Cél szorzó (g/kg)",
        "value": 1.6
    }
],
    compute(v) { const g=v.weight*v.factor; return [['Napi fehérjeigény', Math.round(g)+' g'], ['Étkezésenként 4 részre', Math.round(g/4)+' g']]; }
  },
  "ar-kedvezmeny-kalkulator": {
    fields: [
    {
        "id": "price",
        "label": "Eredeti ár (Ft)",
        "value": ""
    },
    {
        "id": "discount",
        "label": "Kedvezmény (%)",
        "value": ""
    }
],
    compute(v) { const save=v.price*v.discount/100; return [['Kedvezmény összege', money(save)], ['Akciós ár', money(v.price-save)]]; }
  },
  "borravalo-kalkulator": {
    fields: [
    {
        "id": "bill",
        "label": "Számla összege (Ft)",
        "value": ""
    },
    {
        "id": "tip",
        "label": "Borravaló (%)",
        "value": 10
    },
    {
        "id": "people",
        "label": "Fő",
        "value": 2
    }
],
    compute(v) { const tip=v.bill*v.tip/100; return [['Borravaló', money(tip)], ['Fizetendő összesen', money(v.bill+tip)], ['Egy főre', money((v.bill+tip)/v.people)]]; }
  },
  "munkaido-kalkulator": {
    fields: [
    {
        "id": "days",
        "label": "Munkanap hetente",
        "value": 5
    },
    {
        "id": "hours",
        "label": "Óra naponta",
        "value": 8
    },
    {
        "id": "weeks",
        "label": "Hetek",
        "value": 4.33
    }
],
    compute(v) { const weekly=v.days*v.hours; return [['Heti munkaidő', weekly+' óra'], ['Havi becsült munkaidő', (weekly*v.weeks).toFixed(1).replace('.', ',')+' óra']]; }
  },
  "eletkor-kalkulator": {
    fields: [
    {
        "id": "birthYear",
        "label": "Születési év",
        "value": ""
    },
    {
        "id": "birthMonth",
        "label": "Születési hónap",
        "value": 1
    },
    {
        "id": "birthDay",
        "label": "Születési nap",
        "value": 1
    }
],
    compute(v) { const b=new Date(v.birthYear,v.birthMonth-1,v.birthDay); const now=new Date(); const days=Math.floor((now-b)/86400000); return [['Életkor napokban', days+' nap'], ['Életkor években', Math.floor(days/365.2425)+' év']]; }
  },
  "datum-kulonbseg-kalkulator": {
    fields: [
    {
        "id": "days",
        "label": "Eltelt napok száma",
        "value": ""
    },
    {
        "id": "multiplier",
        "label": "Szorzó vagy díj/nap",
        "value": 1
    }
],
    compute(v) { return [['Napok száma', v.days+' nap'], ['Szorzott érték', format(v.days*v.multiplier)]]; }
  },
  "atlag-kalkulator": {
    fields: [
    {
        "id": "sum",
        "label": "Értékek összege",
        "value": ""
    },
    {
        "id": "count",
        "label": "Darabszám",
        "value": ""
    }
],
    compute(v) { return [['Átlag', format(v.sum/v.count)]]; }
  },
  "egysegar-kalkulator": {
    fields: [
    {
        "id": "price",
        "label": "Ár (Ft)",
        "value": ""
    },
    {
        "id": "quantity",
        "label": "Mennyiség",
        "value": ""
    },
    {
        "id": "unit",
        "label": "Egység szorzó",
        "value": 1
    }
],
    compute(v) { return [['Egységár', money(v.price/(v.quantity*v.unit))+' / egység']]; }
  },
  "rezsi-megosztas-kalkulator": {
    fields: [
    {
        "id": "total",
        "label": "Teljes költség (Ft)",
        "value": ""
    },
    {
        "id": "people",
        "label": "Fő",
        "value": 2
    },
    {
        "id": "extra",
        "label": "Saját extra költség (Ft)",
        "value": 0
    }
],
    compute(v) { return [['Egy fő alap része', money(v.total/v.people)], ['Saját fizetendő', money(v.total/v.people+v.extra)]]; }
  },
  "oraber-kalkulator": {
    fields: [
    {
        "id": "salary",
        "label": "Havi bér (Ft)",
        "value": ""
    },
    {
        "id": "hours",
        "label": "Havi munkaóra",
        "value": 174
    }
],
    compute(v) { return [['Órabér', money(v.salary/v.hours)], ['8 órás nap értéke', money(v.salary/v.hours*8)]]; }
  },
  "arany-kalkulator": {
    fields: [
    {
        "id": "part",
        "label": "Rész",
        "value": ""
    },
    {
        "id": "whole",
        "label": "Egész",
        "value": ""
    }
],
    compute(v) { const pct=v.part/v.whole*100; return [['Arány', pct.toFixed(2).replace('.', ',')+'%'], ['Rész / egész', v.part+' / '+v.whole]]; }
  },
  "uzemanyag-koltseg-kalkulator": {
    fields: [
    {
        "id": "distance",
        "label": "Távolság (km)",
        "value": ""
    },
    {
        "id": "consumption",
        "label": "Fogyasztás (l/100 km)",
        "value": ""
    },
    {
        "id": "price",
        "label": "Üzemanyagár (Ft/l)",
        "value": ""
    }
],
    compute(v) { const liters=v.distance*v.consumption/100; return [['Szükséges üzemanyag', liters.toFixed(1).replace('.', ',')+' l'], ['Várható költség', money(liters*v.price)]]; }
  },
  "auto-fogyasztas-kalkulator": {
    fields: [
    {
        "id": "liters",
        "label": "Tankolt mennyiség (l)",
        "value": ""
    },
    {
        "id": "distance",
        "label": "Megtett távolság (km)",
        "value": ""
    }
],
    compute(v) { return [['Átlagfogyasztás', (v.liters/v.distance*100).toFixed(2).replace('.', ',')+' l/100 km']]; }
  },
  "hatotav-kalkulator": {
    fields: [
    {
        "id": "fuel",
        "label": "Üzemanyag a tankban (l)",
        "value": ""
    },
    {
        "id": "consumption",
        "label": "Fogyasztás (l/100 km)",
        "value": ""
    }
],
    compute(v) { return [['Becsült hatótáv', Math.round(v.fuel/v.consumption*100)+' km']]; }
  },
  "eves-auto-koltseg-kalkulator": {
    fields: [
    {
        "id": "fuel",
        "label": "Éves üzemanyag (Ft)",
        "value": ""
    },
    {
        "id": "insurance",
        "label": "Biztosítás (Ft)",
        "value": ""
    },
    {
        "id": "service",
        "label": "Szerviz (Ft)",
        "value": ""
    },
    {
        "id": "tax",
        "label": "Adó és díjak (Ft)",
        "value": ""
    },
    {
        "id": "other",
        "label": "Egyéb (Ft)",
        "value": 0
    }
],
    compute(v) { const total=v.fuel+v.insurance+v.service+v.tax+v.other; return [['Éves költség', money(total)], ['Havi átlag', money(total/12)]]; }
  },
  "auto-ertekvesztes-kalkulator": {
    fields: [
    {
        "id": "price",
        "label": "Vételár (Ft)",
        "value": ""
    },
    {
        "id": "rate",
        "label": "Éves értékvesztés (%)",
        "value": 12
    },
    {
        "id": "years",
        "label": "Évek száma",
        "value": 3
    }
],
    compute(v) { const value=v.price*Math.pow(1-v.rate/100,v.years); return [['Becsült érték', money(value)], ['Értékvesztés', money(v.price-value)]]; }
  },
  "kilometerdij-kalkulator": {
    fields: [
    {
        "id": "monthly",
        "label": "Havi autóköltség (Ft)",
        "value": ""
    },
    {
        "id": "km",
        "label": "Havi megtett km",
        "value": ""
    }
],
    compute(v) { return [['Költség kilométerenként', money(v.monthly/v.km)+' / km']]; }
  },
  "co2-kibocsatas-kalkulator": {
    fields: [
    {
        "id": "distance",
        "label": "Távolság (km)",
        "value": ""
    },
    {
        "id": "consumption",
        "label": "Fogyasztás (l/100 km)",
        "value": ""
    },
    {
        "id": "factor",
        "label": "CO2 kg/l",
        "value": 2.31
    }
],
    compute(v) { const kg=v.distance*v.consumption/100*v.factor; return [['Becsült CO2', kg.toFixed(1).replace('.', ',')+' kg']]; }
  },
  "tankolas-kalkulator": {
    fields: [
    {
        "id": "budget",
        "label": "Tankolási keret (Ft)",
        "value": ""
    },
    {
        "id": "price",
        "label": "Üzemanyagár (Ft/l)",
        "value": ""
    }
],
    compute(v) { return [['Tankolható mennyiség', (v.budget/v.price).toFixed(1).replace('.', ',')+' l']]; }
  },
  "gumi-meret-kalkulator": {
    fields: [
    {
        "id": "w1",
        "label": "Régi szélesség (mm)",
        "value": 205
    },
    {
        "id": "p1",
        "label": "Régi profil (%)",
        "value": 55
    },
    {
        "id": "r1",
        "label": "Régi felni (coll)",
        "value": 16
    },
    {
        "id": "w2",
        "label": "Új szélesség (mm)",
        "value": 225
    },
    {
        "id": "p2",
        "label": "Új profil (%)",
        "value": 45
    },
    {
        "id": "r2",
        "label": "Új felni (coll)",
        "value": 17
    }
],
    compute(v) { const d1=v.r1*25.4+2*v.w1*v.p1/100; const d2=v.r2*25.4+2*v.w2*v.p2/100; return [['Régi átmérő', d1.toFixed(1).replace('.', ',')+' mm'], ['Új átmérő', d2.toFixed(1).replace('.', ',')+' mm'], ['Eltérés', ((d2-d1)/d1*100).toFixed(2).replace('.', ',')+'%']]; }
  },
  "autopalyadij-kalkulator": {
    fields: [
    {
        "id": "fee",
        "label": "Autópályadíj (Ft)",
        "value": ""
    },
    {
        "id": "people",
        "label": "Utasok száma",
        "value": 2
    }
],
    compute(v) { return [['Egy főre jutó díj', money(v.fee/v.people)]]; }
  },
  "utazasi-ido-kalkulator": {
    fields: [
    {
        "id": "distance",
        "label": "Távolság (km)",
        "value": ""
    },
    {
        "id": "speed",
        "label": "Átlagsebesség (km/h)",
        "value": 90
    },
    {
        "id": "breaks",
        "label": "Pihenőidő (perc)",
        "value": 0
    }
],
    compute(v) { const min=v.distance/v.speed*60+v.breaks; return [['Várható menetidő', Math.floor(min/60)+' óra '+Math.round(min%60)+' perc']]; }
  },
  "energia-atvalto-kalkulator": {
    fields: [
    {
        "id": "value",
        "label": "Érték",
        "value": ""
    },
    {
        "id": "from",
        "label": "Forrás egység",
        "value": 2,
        "options": [
            {
                "value": 1,
                "label": "J"
            },
            {
                "value": 2,
                "label": "kJ"
            },
            {
                "value": 3,
                "label": "kcal"
            },
            {
                "value": 4,
                "label": "kWh"
            }
        ]
    }
],
    compute(v) { const j=[1,1000,4184,3600000][v.from-1]*v.value; return [['Joule', format(j)+' J'], ['Kilojoule', format(j/1000)+' kJ'], ['Kilokalória', (j/4184).toFixed(2).replace('.', ',')+' kcal'], ['Kilowattóra', (j/3600000).toFixed(4).replace('.', ',')+' kWh']]; }
  },
  "nyomas-atvalto-kalkulator": {
    fields: [
    {
        "id": "value",
        "label": "Érték",
        "value": ""
    },
    {
        "id": "from",
        "label": "Forrás egység",
        "value": 2,
        "options": [
            {
                "value": 1,
                "label": "Pa"
            },
            {
                "value": 2,
                "label": "bar"
            },
            {
                "value": 3,
                "label": "atm"
            },
            {
                "value": 4,
                "label": "psi"
            }
        ]
    }
],
    compute(v) { const pa=[1,100000,101325,6894.76][v.from-1]*v.value; return [['Pascal', format(pa)+' Pa'], ['Bar', (pa/100000).toFixed(4).replace('.', ',')+' bar'], ['Atmoszféra', (pa/101325).toFixed(4).replace('.', ',')+' atm'], ['PSI', (pa/6894.76).toFixed(2).replace('.', ',')+' psi']]; }
  },
  "teljesitmeny-atvalto-kalkulator": {
    fields: [
    {
        "id": "value",
        "label": "Érték",
        "value": ""
    },
    {
        "id": "from",
        "label": "Forrás egység",
        "value": 2,
        "options": [
            {
                "value": 1,
                "label": "W"
            },
            {
                "value": 2,
                "label": "kW"
            },
            {
                "value": 3,
                "label": "LE"
            }
        ]
    }
],
    compute(v) { const w=[1,1000,735.5][v.from-1]*v.value; return [['Watt', format(w)+' W'], ['Kilowatt', (w/1000).toFixed(3).replace('.', ',')+' kW'], ['Lóerő', (w/735.5).toFixed(2).replace('.', ',')+' LE']]; }
  }
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
  return parseFloat(value.toString().replace(/\s/g, "").replace(",", ".")) || 0;
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
      return `
        <div>
          <label for="${fieldId}">${escapeHtml(field.label)}</label>
          <select id="${fieldId}">
            ${field.options.map((option) => `
              <option value="${escapeAttribute(option.value)}" ${Number(option.value) === Number(field.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>
            `).join("")}
          </select>
        </div>
      `;
    }

    return `
      <div>
        <label for="${fieldId}">${escapeHtml(field.label)}</label>
        <input type="text" id="${fieldId}" value="${fieldValue}" />
      </div>
    `;
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
      resultsTarget.innerHTML = rows.map(([label, value]) => `
        <p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>
      `).join("");
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
