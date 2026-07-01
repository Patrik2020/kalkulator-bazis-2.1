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
    compute(v) { requirePositive(v.length, v.width, v.pack); requireNonNegative(v.waste); const area=v.length*v.width; const total=area*(1+v.waste/100); const packs=Math.ceil(total/v.pack); return [['Alapterület', m2(area)], ['Szükséges mennyiség ráhagyással', m2(total)], ['Szükséges csomag', packs+' csomag']]; }
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
    compute(v) { requirePositive(v.area, v.layers, v.board); requireNonNegative(v.waste); const total=v.area*v.layers*(1+v.waste/100); return [['Teljes számolt felület', m2(total)], ['Szükséges lap', Math.ceil(total/v.board)+' db']]; }
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
    compute(v) { requirePositive(v.perimeter, v.height, v.rollWidth, v.rollLength); const strips=Math.ceil(v.perimeter/v.rollWidth); const perRoll=Math.floor(v.rollLength/v.height); if (perRoll < 1) throw new Error('A tekercs rövidebb a belmagasságnál'); return [['Szükséges csíkok', strips+' db'], ['Egy tekercsből vágható', perRoll+' csík'], ['Szükséges tekercs', Math.ceil(strips/perRoll)+' db']]; }
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
    compute(v) { requirePositive(v.area, v.thickness, v.consumption, v.bag); const kg=v.area*v.thickness*v.consumption; return [['Szükséges anyag', kg.toFixed(1).replace('.', ',')+' kg'], ['Szükséges zsák', Math.ceil(kg/v.bag)+' zsák']]; }
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
    compute(v) { requirePositive(v.area, v.pack); requireNonNegative(v.waste); const total=v.area*(1+v.waste/100); return [['Szükséges szigetelés', m2(total)], ['Szükséges csomag', Math.ceil(total/v.pack)+' csomag']]; }
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
    compute(v) { requirePositive(v.length, v.width, v.pieces); requireNonNegative(v.waste); const area=v.length*v.width; const pcs=Math.ceil(area*v.pieces*(1+v.waste/100)); return [['Felület', m2(area)], ['Szükséges térkő', pcs+' db'], ['Kerület szegélyhez', ((v.length+v.width)*2).toFixed(1).replace('.', ',')+' m']]; }
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
    compute(v) { requirePositive(v.area, v.pieces); requireNonNegative(v.waste); const pcs=Math.ceil(v.area*v.pieces*(1+v.waste/100)); return [['Tetőfelület', m2(v.area)], ['Szükséges cserép', pcs+' db']]; }
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
    compute(v) { requirePositive(v.area, v.tileLength, v.tileWidth, v.joint, v.depth); const kg=v.area*((v.tileLength+v.tileWidth)/(v.tileLength*v.tileWidth))*v.joint*v.depth*1.6; return [['Becsült fugázóanyag', kg.toFixed(1).replace('.', ',')+' kg'], ['5 kg-os zsák', Math.ceil(kg/5)+' zsák']]; }
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
    compute(v) { requirePositive(v.weight); requireNonNegative(v.activity); const ml=v.weight*35+v.activity; return [['Becsült napi folyadék', (ml/1000).toFixed(2).replace('.', ',')+' liter'], ['Ez 2,5 dl-es poharakban', Math.round(ml/250)+' pohár']]; }
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
    compute(v) { requirePositive(v.age, v.rest); const max=220-v.age; if (max <= v.rest) throw new Error('A nyugalmi pulzus legyen kisebb a becsült maximális pulzusnál'); const reserve=max-v.rest; return [['Becsült max pulzus', max+' bpm'], ['60–70%-os Karvonen-zóna', Math.round(v.rest+reserve*.6)+'–'+Math.round(v.rest+reserve*.7)+' bpm'], ['70–85%-os Karvonen-zóna', Math.round(v.rest+reserve*.7)+'–'+Math.round(v.rest+reserve*.85)+' bpm']]; }
  },
  "terhessegi-kalkulator": {
    fields: [
    {
        "id": "lmpDate",
        "label": "Az utolsó menstruáció első napja",
        "value": "",
        "type": "date"
    },
    {
        "id": "cycleLength",
        "label": "Átlagos ciklushossz (nap)",
        "value": 28
    }
],
    compute(v) {
      if (!v.lmpDate) return [['Becsült terhességi hét', 'Adj meg egy dátumot'], ['Várható szülési dátum', '–']];
      const lmp = new Date(v.lmpDate + 'T12:00:00');
      if (Number.isNaN(lmp.getTime())) throw new Error('Érvénytelen dátum');
      const cycleLength = Math.round(v.cycleLength || 28);
      if (cycleLength < 21 || cycleLength > 45) throw new Error('A ciklushossz 21 és 45 nap között legyen');
      const adjustment = cycleLength - 28;
      const due = new Date(lmp);
      due.setDate(due.getDate() + 280 + adjustment);
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      if (lmp > today) throw new Error('Az utolsó menstruáció dátuma nem lehet jövőbeli');
      const elapsedDays = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(lmp.getFullYear(), lmp.getMonth(), lmp.getDate())) / 86400000);
      const week = Math.floor(elapsedDays / 7);
      const day = elapsedDays % 7;
      return [['Becsült terhességi kor', week + '. hét ' + day + '. nap'], ['Várható szülési dátum', due.toLocaleDateString('hu-HU')]];
    }
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
    compute(v) { requirePositive(v.height); if (v.height < 152.4) throw new Error('A Devine-képlet 152,4 cm alatt nem ad megbízható becslést'); const base=v.gender>=2?50:45.5; const kg=base+(2.3/2.54)*(v.height-152.4); return [['Devine-képlet szerinti becslés', kg.toFixed(1).replace('.', ',')+' kg'], ['±10%-os tájékoztató sáv', (kg*0.9).toFixed(1).replace('.', ',')+'–'+(kg*1.1).toFixed(1).replace('.', ',')+' kg']]; }
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
    compute(v) { requirePositive(v.waist, v.neck, v.height); if (v.gender < 2) requirePositive(v.hip); const circumference=v.gender>=2 ? v.waist-v.neck : v.waist+v.hip-v.neck; if (circumference <= 0) throw new Error('A körfogatok kombinációja nem lehet nulla vagy negatív'); const log10=Math.log10; const fat=v.gender>=2 ? 495/(1.0324-0.19077*log10(circumference)+0.15456*log10(v.height))-450 : 495/(1.29579-0.35004*log10(circumference)+0.221*log10(v.height))-450; if (!Number.isFinite(fat) || fat <= 0 || fat >= 75) throw new Error('A megadott körfogatokból nem adható életszerű becslés'); return [['Becsült testzsír', fat.toFixed(1).replace('.', ',')+'%']]; }
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
    compute(v) { requirePositive(v.calories); requireNonNegative(v.protein, v.fat); const carb=100-v.protein-v.fat; if (carb < 0) throw new Error('A fehérje és zsír aránya együtt nem lehet 100% felett'); return [['Fehérje', Math.round(v.calories*v.protein/100/4)+' g'], ['Zsír', Math.round(v.calories*v.fat/100/9)+' g'], ['Szénhidrát', Math.round(v.calories*carb/100/4)+' g']]; }
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
    compute(v) { requireNonNegative(v.wakeHour, v.wakeMinute); if (v.wakeHour > 23 || v.wakeMinute > 59) throw new Error('Érvénytelen időpont'); const out=[]; [6,5,4].forEach(c=>{const d=new Date(2000,0,2,v.wakeHour,v.wakeMinute,0,0); d.setMinutes(d.getMinutes()-c*90-15); out.push([c+' ciklus lefekvés', d.toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})]);}); return out; }
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
    compute(v) { requirePositive(v.weight, v.height, v.age); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }
  },
  "derek-csipo-kalkulator": {
    fields: [
    {
        "id": "gender",
        "label": "Nem",
        "value": 1,
        "options": [
            {"value": 1, "label": "Nő"},
            {"value": 2, "label": "Férfi"}
        ]
    },
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
    compute(v) { requirePositive(v.waist, v.hip); const ratio=v.waist/v.hip; const threshold=v.gender>=2?0.90:0.85; return [['Derék-csípő arány', ratio.toFixed(2).replace('.', ',')], ['WHO általános küszöbéhez viszonyítva', ratio>threshold?'a küszöb felett':'a küszöbön vagy alatta'], ['Használt tájékoztató küszöb', threshold.toFixed(2).replace('.', ',')]]; }
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
    compute(v) { requirePositive(v.weight, v.factor); const g=v.weight*v.factor; return [['Napi fehérjeigény', Math.round(g)+' g'], ['Étkezésenként 4 részre', Math.round(g/4)+' g']]; }
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
    compute(v) { requireNonNegative(v.price, v.discount); if (v.discount > 100) throw new Error('A kedvezmény nem lehet 100% felett'); const save=v.price*v.discount/100; return [['Kedvezmény összege', money(save)], ['Akciós ár', money(v.price-save)]]; }
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
    compute(v) { requireNonNegative(v.bill, v.tip); requirePositive(v.people); const tip=v.bill*v.tip/100; return [['Borravaló', money(tip)], ['Fizetendő összesen', money(v.bill+tip)], ['Egy főre', money((v.bill+tip)/v.people)]]; }
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
    compute(v) { requirePositive(v.days, v.hours, v.weeks); const weekly=v.days*v.hours; return [['Heti munkaidő', formatDecimal(weekly, 2)+' óra'], ['Havi becsült munkaidő', formatDecimal(weekly*v.weeks, 1)+' óra']]; }
  },
  "eletkor-kalkulator": {
    fields: [
    {
        "id": "birthDate",
        "label": "Születési dátum",
        "value": "",
        "type": "date"
    }
],
    compute(v) {
      if (!v.birthDate) return [['Pontos életkor', 'Adj meg egy dátumot'], ['Eltelt napok', '–']];
      const birth = new Date(v.birthDate + 'T12:00:00');
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      if (Number.isNaN(birth.getTime()) || birth > today) throw new Error('Érvénytelen dátum');
      let years = today.getFullYear() - birth.getFullYear();
      let cursor = addYearsClamped(birth, years);
      if (cursor > today) {
        years -= 1;
        cursor = addYearsClamped(birth, years);
      }
      let months = 0;
      while (months < 11) {
        const next = addMonthsClamped(cursor, 1);
        if (next > today) break;
        cursor = next;
        months += 1;
      }
      const days = utcDayDifference(cursor, today);
      const totalDays = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate())) / 86400000);
      return [['Pontos életkor', years + ' év ' + months + ' hónap ' + days + ' nap'], ['Eltelt napok', totalDays + ' nap']];
    }
  },
  "datum-kulonbseg-kalkulator": {
    fields: [
    {
        "id": "startDate",
        "label": "Kezdő dátum",
        "value": "",
        "type": "date"
    },
    {
        "id": "endDate",
        "label": "Záró dátum",
        "value": "",
        "type": "date"
    },
    {
        "id": "multiplier",
        "label": "Opcionális napi érték vagy díj",
        "value": 1
    }
],
    compute(v) {
      if (!v.startDate || !v.endDate) return [['Dátumok közötti különbség', 'Adj meg két dátumot'], ['Napi értékkel szorozva', '–']];
      const start = new Date(v.startDate + 'T12:00:00');
      const end = new Date(v.endDate + 'T12:00:00');
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Érvénytelen dátum');
      const days = Math.round(Math.abs(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000);
      requireFinite(v.multiplier); return [['Dátumok közötti különbség', days + ' nap'], ['Napi értékkel szorozva', formatDecimal(days * v.multiplier, 4)]];
    }
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
    compute(v) { requireFinite(v.sum); requirePositive(v.count); return [['Átlag', formatDecimal(v.sum/v.count, 4)]]; }
  },
  "egysegar-kalkulator": {
    fields: [
    {
        "id": "price",
        "label": "Csomag ára (Ft)",
        "value": ""
    },
    {
        "id": "quantity",
        "label": "Csomag mennyisége",
        "value": ""
    },
    {
        "id": "unit",
        "label": "Összehasonlítási mennyiség (pl. 1 vagy 1000)",
        "value": 1
    }
],
    compute(v) {
      requireNonNegative(v.price);
      requirePositive(v.quantity, v.unit);
      return [['Egységár', money(v.price / v.quantity * v.unit) + ' / választott egység']];
    }
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
    compute(v) { requireNonNegative(v.total, v.extra); requirePositive(v.people); return [['Egy fő alap része', money(v.total/v.people)], ['Saját fizetendő', money(v.total/v.people+v.extra)]]; }
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
    compute(v) { requireNonNegative(v.salary); requirePositive(v.hours); return [['Órabér', money(v.salary/v.hours)], ['8 órás nap értéke', money(v.salary/v.hours*8)]]; }
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
    compute(v) { requireFinite(v.part); requirePositive(v.whole); const pct=v.part/v.whole*100; return [['Arány', formatDecimal(pct, 2)+'%'], ['Rész / egész', formatDecimal(v.part, 4)+' / '+formatDecimal(v.whole, 4)]]; }
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
    compute(v) { requireNonNegative(v.distance, v.consumption, v.price); const liters=v.distance*v.consumption/100; return [['Szükséges üzemanyag', formatDecimal(liters, 2)+' l'], ['Várható költség', money(liters*v.price)]]; }
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
    compute(v) { requireNonNegative(v.liters); requirePositive(v.distance); return [['Átlagfogyasztás', formatDecimal(v.liters/v.distance*100, 2)+' l/100 km']]; }
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
    compute(v) { requireNonNegative(v.fuel); requirePositive(v.consumption); return [['Becsült hatótáv', Math.round(v.fuel/v.consumption*100)+' km']]; }
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
    compute(v) { requireNonNegative(v.fuel, v.insurance, v.service, v.tax, v.other); const total=v.fuel+v.insurance+v.service+v.tax+v.other; return [['Éves költség', money(total)], ['Havi átlag', money(total/12)]]; }
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
    compute(v) { requireNonNegative(v.price, v.rate, v.years); if (v.rate > 100) throw new Error('Az éves értékvesztés nem lehet 100% felett'); const value=v.price*Math.pow(1-v.rate/100,v.years); return [['Becsült érték', money(value)], ['Értékvesztés', money(v.price-value)]]; }
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
    compute(v) { requireNonNegative(v.monthly); requirePositive(v.km); return [['Költség kilométerenként', money(v.monthly/v.km)+' / km']]; }
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
    compute(v) { requireNonNegative(v.distance, v.consumption, v.factor); const kg=v.distance*v.consumption/100*v.factor; return [['Becsült CO2', formatDecimal(kg, 2)+' kg']]; }
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
    compute(v) { requireNonNegative(v.budget); requirePositive(v.price); return [['Tankolható mennyiség', formatDecimal(v.budget/v.price, 2)+' l']]; }
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
    compute(v) { requirePositive(v.w1, v.p1, v.r1, v.w2, v.p2, v.r2); const d1=v.r1*25.4+2*v.w1*v.p1/100; const d2=v.r2*25.4+2*v.w2*v.p2/100; return [['Régi átmérő', formatDecimal(d1, 1)+' mm'], ['Új átmérő', formatDecimal(d2, 1)+' mm'], ['Eltérés', formatDecimal((d2-d1)/d1*100, 2)+'%']]; }
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
    compute(v) { requireNonNegative(v.fee); requirePositive(v.people); return [['Egy főre jutó díj', money(v.fee/v.people)]]; }
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
    compute(v) { requireNonNegative(v.distance, v.breaks); requirePositive(v.speed); const totalMinutes=Math.round(v.distance/v.speed*60+v.breaks); return [['Várható menetidő', Math.floor(totalMinutes/60)+' óra '+(totalMinutes%60)+' perc']]; }
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
    compute(v) { requireFinite(v.value); const factor=[1,1000,4184,3600000][v.from-1]; if (!factor) throw new Error('Érvénytelen mértékegység'); const j=factor*v.value; return [['Joule', formatDecimal(j, 4)+' J'], ['Kilojoule', formatDecimal(j/1000, 4)+' kJ'], ['Kilokalória', formatDecimal(j/4184, 4)+' kcal'], ['Kilowattóra', formatDecimal(j/3600000, 6)+' kWh']]; }
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
    compute(v) { requireFinite(v.value); const factor=[1,100000,101325,6894.757293168][v.from-1]; if (!factor) throw new Error('Érvénytelen mértékegység'); const pa=factor*v.value; return [['Pascal', formatDecimal(pa, 4)+' Pa'], ['Bar', formatDecimal(pa/100000, 6)+' bar'], ['Atmoszféra', formatDecimal(pa/101325, 6)+' atm'], ['PSI', formatDecimal(pa/6894.757293168, 4)+' psi']]; }
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
    compute(v) { requireFinite(v.value); const factor=[1,1000,735.49875][v.from-1]; if (!factor) throw new Error('Érvénytelen mértékegység'); const w=factor*v.value; return [['Watt', formatDecimal(w, 4)+' W'], ['Kilowatt', formatDecimal(w/1000, 6)+' kW'], ['Metrikus lóerő', formatDecimal(w/735.49875, 4)+' LE']]; }
  }
};

function requireFinite(...values) {
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Minden mezőben érvényes szám szerepeljen");
  }
}

function requirePositive(...values) {
  requireFinite(...values);
  if (values.some((value) => value <= 0)) {
    throw new Error("Az értékek legyenek nagyobbak nullánál");
  }
}

function requireNonNegative(...values) {
  requireFinite(...values);
  if (values.some((value) => value < 0)) {
    throw new Error("Az értékek nem lehetnek negatívak");
  }
}

function formatDecimal(value, maximumFractionDigits = 2) {
  requireFinite(value);
  return new Intl.NumberFormat("hu-HU", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function addYearsClamped(date, years) {
  const year = date.getFullYear() + years;
  const month = date.getMonth();
  const day = Math.min(date.getDate(), daysInMonth(year, month));
  return new Date(year, month, day, 12, 0, 0, 0);
}

function addMonthsClamped(date, months) {
  const targetMonthIndex = date.getMonth() + months;
  const year = date.getFullYear() + Math.floor(targetMonthIndex / 12);
  const month = ((targetMonthIndex % 12) + 12) % 12;
  const day = Math.min(date.getDate(), daysInMonth(year, month));
  return new Date(year, month, day, 12, 0, 0, 0);
}

function utcDayDifference(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86400000);
}

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

    const inputType = field.type === "date" || field.type === "time" ? field.type : "text";
    return `
      <div>
        <label for="${fieldId}">${escapeHtml(field.label)}</label>
        <input type="${inputType}" id="${fieldId}" value="${fieldValue}" />
      </div>
    `;
  }).join("");

  const inputs = calc.fields.map((field) => document.getElementById(field.id));
  let hasTrackedStart = false;

  const run = () => {
    const values = {};
    inputs.forEach((input) => {
      values[input.id] = input.type === "date" || input.type === "time"
        ? input.value
        : parseValue(input.value);
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
