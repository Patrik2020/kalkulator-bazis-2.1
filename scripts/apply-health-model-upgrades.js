const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található egészség-upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) {
    throw new Error(`Nem egyedi egészség-upgrade cél: ${label}`);
  }
  return source.replace(oldText, newText);
}

function replaceAllExact(source, oldText, newText, label) {
  if (!source.includes(oldText)) {
    if (source.includes(newText)) return source;
    throw new Error(`Nem található egészség-upgrade cél: ${label}`);
  }
  return source.split(oldText).join(newText);
}

const transforms = {
  "js/simple-calculators.js": (source) => {
    let output = replaceExact(
      source,
      "compute(v) { requirePositive(v.weight, v.height, v.age); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
      "compute(v) { requirePositive(v.weight, v.height, v.age); if (v.age < 18) throw new Error('A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk'); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
      "BMR felnőtt korhatár"
    );

    output = replaceExact(
      output,
      "compute(v) { requirePositive(v.weight, v.height, v.age); if (v.age < 18) throw new Error('A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk'); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
      "compute(v) { requirePositive(v.weight, v.height, v.age); if (v.age < 18) throw new Error('A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk'); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['Példa: 1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
      "BMR aktivitási példa címke"
    );

    output = replaceExact(
      output,
      "compute(v) { requirePositive(v.weight, v.factor); const g=v.weight*v.factor; return [['Napi fehérjeigény', Math.round(g)+' g'], ['Étkezésenként 4 részre', Math.round(g/4)+' g']]; }",
      "compute(v) { requirePositive(v.weight, v.factor); const g=v.weight*v.factor; return [['Napi fehérje a választott szorzóval', Math.round(g)+' g'], ['Példa: 4 egyenlő részre osztva', Math.round(g/4)+' g']]; }",
      "fehérje eredmény nem előíró címkézése"
    );

    output = replaceExact(
      output,
      "compute(v) { requirePositive(v.age, v.rest); const max=220-v.age; if (max <= v.rest) throw new Error('A nyugalmi pulzus legyen kisebb a becsült maximális pulzusnál'); const reserve=max-v.rest; return [['Becsült max pulzus', max+' bpm'], ['60–70%-os Karvonen-zóna', Math.round(v.rest+reserve*.6)+'–'+Math.round(v.rest+reserve*.7)+' bpm'], ['70–85%-os Karvonen-zóna', Math.round(v.rest+reserve*.7)+'–'+Math.round(v.rest+reserve*.85)+' bpm']]; }",
      "compute(v) { requirePositive(v.age, v.rest); if (v.age < 18) throw new Error('Ezt a pulzustartalékos tervezőt felnőtteknek (18+) használjuk'); const max=220-v.age; if (max <= v.rest) throw new Error('A nyugalmi pulzus legyen kisebb a becsült maximális pulzusnál'); const reserve=max-v.rest; return [['Becsült max pulzus', max+' bpm'], ['Közepes relatív intenzitás – 40–59% pulzustartalék', Math.round(v.rest+reserve*.4)+'–'+Math.round(v.rest+reserve*.59)+' bpm'], ['Intenzív relatív intenzitás – 60–84% pulzustartalék', Math.round(v.rest+reserve*.6)+'–'+Math.round(v.rest+reserve*.84)+' bpm']]; }",
      "pulzustartalék standard relatív intenzitási sávok"
    );

    output = replaceExact(
      output,
      `    compute(v) {
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
    }`,
      `    compute(v) {
      if (!v.lmpDate) return [['Becsült terhességi hét', 'Adj meg egy dátumot'], ['Várható szülési dátum', '–']];
      const lmp = new Date(v.lmpDate + 'T12:00:00');
      if (Number.isNaN(lmp.getTime())) throw new Error('Érvénytelen dátum');
      const rawCycleLength = Number(v.cycleLength || 28);
      if (!Number.isFinite(rawCycleLength) || rawCycleLength < 21 || rawCycleLength > 45) throw new Error('A ciklushossz 21 és 45 nap között legyen');
      const cycleLength = Math.round(rawCycleLength);
      const adjustment = cycleLength - 28;
      const due = new Date(lmp);
      due.setDate(due.getDate() + 280 + adjustment);
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      if (lmp > today) throw new Error('Az utolsó menstruáció dátuma nem lehet jövőbeli');
      const elapsedDays = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(lmp.getFullYear(), lmp.getMonth(), lmp.getDate())) / 86400000);
      if (elapsedDays > 294) throw new Error('A megadott dátum alapján több mint 42 hét telt el. Ellenőrizd az utolsó menstruáció dátumát és a klinikai datálást.');
      const week = Math.floor(elapsedDays / 7);
      const day = elapsedDays % 7;
      const rows = [['Becsült terhességi kor', week + '. hét ' + day + '. nap'], ['Várható szülési dátum', due.toLocaleDateString('hu-HU')]];
      if (!Number.isInteger(rawCycleLength)) rows.push(['Ciklushossz kerekítése', String(rawCycleLength).replace('.', ',') + ' → ' + cycleLength + ' nap']);
      if (elapsedDays === 294) rows.push(['42 hetes modellhatár', 'A naptári becslés elérte a 42 hetet; a klinikai datálás az irányadó.']);
      return rows;
    }`,
      "terhességi ciklushossz és 42 hetes modellhatár"
    );

    output = replaceExact(
      output,
      "compute(v) { requirePositive(v.height); if (v.height < 152.4) throw new Error('A Devine-képlet 152,4 cm alatt nem ad megbízható becslést'); const base=v.gender>=2?50:45.5; const kg=base+(2.3/2.54)*(v.height-152.4); return [['Devine-képlet szerinti becslés', kg.toFixed(1).replace('.', ',')+' kg'], ['±10%-os tájékoztató sáv', (kg*0.9).toFixed(1).replace('.', ',')+'–'+(kg*1.1).toFixed(1).replace('.', ',')+' kg']]; }",
      "compute(v) { requirePositive(v.height); if (v.height < 152.4) throw new Error('A Devine-képlet 152,4 cm alatt nem ad megbízható becslést'); const base=v.gender>=2?50:45.5; const kg=base+(2.3/2.54)*(v.height-152.4); return [['Történeti Devine-becslés', kg.toFixed(1).replace('.', ',')+' kg']]; }",
      "Devine önkényes ±10%-os sáv eltávolítása"
    );

    output = replaceExact(
      output,
      "compute(v) { requireNonNegative(v.wakeHour, v.wakeMinute); if (v.wakeHour > 23 || v.wakeMinute > 59) throw new Error('Érvénytelen időpont'); const out=[]; [6,5,4].forEach(c=>{const d=new Date(2000,0,2,v.wakeHour,v.wakeMinute,0,0); d.setMinutes(d.getMinutes()-c*90-15); out.push([c+' ciklus lefekvés', d.toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})]);}); return out; }",
      "compute(v) { requireNonNegative(v.wakeHour, v.wakeMinute); if (!Number.isInteger(v.wakeHour) || !Number.isInteger(v.wakeMinute) || v.wakeHour > 23 || v.wakeMinute > 59) throw new Error('Az időpont egész óra- és percértékből álljon'); const out=[]; [6,5,4].forEach(c=>{const d=new Date(2000,0,2,v.wakeHour,v.wakeMinute,0,0); d.setMinutes(d.getMinutes()-c*90-15); const label=c===4?'Rövid példa: 4 × 90 perc + 15 perc elalvás':'Példa: '+c+' × 90 perc + 15 perc elalvás'; out.push([label, d.toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})]);}); out.push(['Alvásidő-megjegyzés', 'A 4 × 90 perces példa 6 óra alvás, ami a legtöbb felnőtt számára az általános ajánlott időtartam alatt van.']); return out; }",
      "alvás 90 perces példamodell és egész időpont"
    );

    return output;
  },

  "js/egeszseg/kaloria.js": (source) => {
    let output = replaceExact(
      source,
      "  if (\n    !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) ||\n    !Number.isFinite(act) || w <= 0 || h <= 0 || a <= 0 || act <= 0\n  ) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"\";\n    return;\n  }",
      "  if (\n    !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) ||\n    !Number.isFinite(act) || w <= 0 || h <= 0 || a <= 0 || act <= 0\n  ) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"\";\n    return;\n  }\n\n  if (a < 18) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk.\";\n    return;\n  }",
      "kalória felnőtt korhatár"
    );

    output = replaceExact(
      output,
      "  resultGoal.textContent =\n    \"Fogyás: \" + Math.round(maintenance - 400) +\n    \" kcal | Tömegnövelés: \" + Math.round(maintenance + 400) + \" kcal\";",
      "  const lowerScenario = maintenance - 400;\n  const upperScenario = maintenance + 400;\n  resultGoal.textContent = lowerScenario > 0\n    ? \"Példa a fenntartó értékhez képest: -400 kcal → \" + Math.round(lowerScenario) +\n      \" kcal | +400 kcal → \" + Math.round(upperScenario) + \" kcal\"\n    : \"A -400 kcal-os példaforgatókönyv ennél a becslésnél nem értelmezhető. +400 kcal → \" +\n      Math.round(upperScenario) + \" kcal.\";",
      "kalória ±400 példaforgatókönyv"
    );
    return output;
  },

  "js/priority-upgrades.js": (source) => {
    let output = source;
    output = replaceExact(
      output,
      `    pulse: [
      { label: "American Heart Association – Target Heart Rates", href: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
      { label: "Tanaka és mtsai. – életkor alapján becsült maximális pulzus", href: "https://pubmed.ncbi.nlm.nih.gov/11153730/" }
    ],`,
      `    pulse: [
      { label: "American Heart Association – Target Heart Rates", href: "https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates" },
      { label: "HHS – Physical Activity Guidelines: relative intensity", href: "https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf" },
      { label: "Tanaka és mtsai. – életkor alapján becsült maximális pulzus", href: "https://pubmed.ncbi.nlm.nih.gov/11153730/" }
    ],`,
      "pulzus relatív intenzitás forrás"
    );
    output = replaceExact(
      output,
      `    sleep: [{ label: "CDC – How Much Sleep Do I Need?", href: "https://www.cdc.gov/sleep/about/" }, { label: "American Academy of Sleep Medicine – sleep duration recommendations", href: "https://aasm.org/resources/pdf/sleepdurationrecommendations.pdf" }],`,
      `    sleep: [{ label: "CDC – How Much Sleep Do I Need?", href: "https://www.cdc.gov/sleep/about/" }, { label: "NHLBI/NIH – Sleep Phases and Stages", href: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep" }, { label: "American Academy of Sleep Medicine – sleep duration recommendations", href: "https://aasm.org/resources/pdf/sleepdurationrecommendations.pdf" }],`,
      "alvásciklus NIH forrás"
    );
    output = replaceExact(
      output,
      `    const calculate = () => {
      const age = numberValue(section, "pu-age"); const rest = numberValue(section, "pu-rest"); const formula = selectValue(section, "pu-formula", "tanaka");
      const max = formula === "classic" ? 220 - age : 208 - 0.7 * age; const reserve = max - rest;
      const zone = (low, high) => \`${'${'}Math.round(rest + reserve * low)}–${'${'}Math.round(rest + reserve * high)} bpm\`;
      section.querySelector("[data-results]").innerHTML = resultCards([["Becsült maximális pulzus", Math.round(max) + " bpm"], ["Könnyű 50–60%", zone(.5, .6)], ["Közepes 60–70%", zone(.6, .7)], ["Intenzív 70–85%", zone(.7, .85)], ["220 − életkor kontroll", Math.round(220 - age) + " bpm"], ["Tanaka kontroll", Math.round(208 - .7 * age) + " bpm"]]);
    };`,
      `    const calculate = () => {
      const age = numberValue(section, "pu-age"); const rest = numberValue(section, "pu-rest"); const formula = selectValue(section, "pu-formula", "tanaka");
      const max = formula === "classic" ? 220 - age : 208 - 0.7 * age; const reserve = max - rest;
      if (age < 18 || rest <= 0 || reserve <= 0) {
        section.querySelector("[data-results]").innerHTML = resultCards([["Eredmény", "A felnőtt tervezőhöz 18+ életkort és a becsült maximumnál alacsonyabb pozitív nyugalmi pulzust adj meg."]]);
        return;
      }
      const zone = (low, high) => \`${'${'}Math.round(rest + reserve * low)}–${'${'}Math.round(rest + reserve * high)} bpm\`;
      section.querySelector("[data-results]").innerHTML = resultCards([["Becsült maximális pulzus", Math.round(max) + " bpm"], ["Közepes relatív intenzitás – HRR 40–59%", zone(.4, .59)], ["Intenzív relatív intenzitás – HRR 60–84%", zone(.6, .84)], ["220 − életkor kontroll", Math.round(220 - age) + " bpm"], ["Tanaka kontroll", Math.round(208 - .7 * age) + " bpm"]]);
    };`,
      "priority pulzus HRR sávok és felnőtt guard"
    );
    output = replaceExact(
      output,
      `healthBase("Alvásciklus helyett elsőként a megfelelő alvásidő", "A 90 perces ciklus csak átlagos közelítés. A ciklusok hossza egyénenként és ugyanazon éjszakán belül is változik.", \`<div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Életkor</th><th>Általános napi ajánlott alvásidő</th></tr></thead><tbody><tr><td>6–12 év</td><td>9–12 óra</td></tr><tr><td>13–18 év</td><td>8–10 óra</td></tr><tr><td>18–60 év</td><td>legalább 7 óra</td></tr><tr><td>61–64 év</td><td>7–9 óra</td></tr><tr><td>65 év felett</td><td>7–8 óra</td></tr></tbody></table></div><div class="priority-warning">Rendszeres hangos horkolás, légzéskimaradás, tartós nappali álmosság vagy elalvás közlekedés közben kivizsgálást igényelhet.</div>\`, healthSources.sleep);`,
      `healthBase("Alvásciklus helyett elsőként a megfelelő alvásidő", "A 90 perces ciklus csak egyszerű példaforgatókönyv. Az NHLBI/NIH szerint az alvási ciklus jellemzően 80–100 percenként indul újra, és éjszakán belül is változhat.", \`<div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Életkor</th><th>Általános napi ajánlott alvásidő</th></tr></thead><tbody><tr><td>6–12 év</td><td>9–12 óra</td></tr><tr><td>13–17 év</td><td>8–10 óra</td></tr><tr><td>18–60 év</td><td>legalább 7 óra</td></tr><tr><td>61–64 év</td><td>7–9 óra</td></tr><tr><td>65 év felett</td><td>7–8 óra</td></tr></tbody></table></div><div class="priority-warning">Rendszeres hangos horkolás, légzéskimaradás, tartós nappali álmosság vagy elalvás közlekedés közben kivizsgálást igényelhet.</div>\`, healthSources.sleep);`,
      "alvás korcsoport és 90 perces modell pontosítása"
    );
    return output;
  },

  "kalkulatorok/bmr-kalkulator.html": (source) => {
    let output = replaceAllExact(
      source,
      "BMR kalkulátor az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.",
      "BMR kalkulátor felnőtteknek az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.",
      "BMR meta leírás"
    );
    output = replaceExact(
      output,
      "<section class=\"hero\"><h1>BMR kalkulátor</h1><p>Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.</p></section>",
      "<section class=\"hero\"><h1>BMR kalkulátor</h1><p>Felnőtteknek készült becslés a Mifflin–St Jeor képlettel, testsúly, magasság, életkor és nem alapján.</p></section>",
      "BMR hero scope"
    );
    return output;
  },

  "kalkulatorok/kaloria-kalkulator.html": (source) => {
    let output = replaceAllExact(
      source,
      "Kalória kalkulátor napi energiaigény becsléséhez fogyáshoz, szintentartáshoz vagy tömegnöveléshez, módszertani magyarázattal és gyakorlati útmutatóval.",
      "Kalória kalkulátor felnőttek napi energiaigényének becsléséhez, szintentartási és szemléltető ±400 kcal forgatókönyvekkel, módszertani magyarázattal.",
      "kalória meta leírás"
    );
    output = replaceExact(
      output,
      "<section class=\"hero\"><h1>Kalória kalkulátor</h1><p>Számold ki a becsült napi energiaigényedet, és értsd meg, hogyan használd az eredményt.</p></section>",
      "<section class=\"hero\"><h1>Kalória kalkulátor</h1><p>Felnőtteknek készült becslés a napi energiaigényhez; a ±400 kcal értékek szemléltető forgatókönyvek, nem személyre szabott célok.</p></section>",
      "kalória hero scope"
    );
    output = replaceExact(
      output,
      "<input type=\"number\" id=\"age\" placeholder=\"pl. 30\" step=\"any\" inputmode=\"decimal\">",
      "<input type=\"number\" id=\"age\" placeholder=\"pl. 30\" min=\"18\" step=\"1\" inputmode=\"numeric\">",
      "kalória életkor input"
    );
    return output;
  },

  "kalkulatorok/alvasciklus-kalkulator.html": (source) => {
    let output = replaceAllExact(
      source,
      "Tervezd meg, mikor érdemes lefeküdni vagy felkelni 90 perces ciklusokkal.",
      "Nézz meg 90 perces időzítési példaforgatókönyveket; a ciklushossz nem rögzített biológiai menetrend.",
      "alvás hero és structured-data ígéret"
    );
    output = replaceExact(
      output,
      "<p>A kalkulátor a tervezett ébredési időből visszafelé számol négy, öt vagy hat 90 perces ciklust, és 15 perc becsült elalvási időt is hozzáad. Az eredmény néhány lehetséges lefekvési időpontot mutat, amelyek tervezési támpontként használhatók.</p>",
      "<p>A kalkulátor a tervezett ébredési időből visszafelé számol négy, öt vagy hat <strong>90 perces példaciklust</strong>, és 15 perc becsült elalvási időt is hozzáad. A négyciklusos példa 6 óra alvást jelent, ami a legtöbb felnőtt általános alvásidő-ajánlása alatt van; ezért ez nem ajánlás, csak időzítési példa.</p>",
      "alvás 4 ciklus figyelmeztetés"
    );
    output = replaceExact(
      output,
      "<p>Fontos, hogy a 90 perc nem biológiai szabály. Egy alvásciklus hossza emberenként és ugyanazon embernél éjszakánként is változhat. A kalkulátor ezért nem azt mondja meg, mikor fogsz biztosan könnyen felébredni, hanem egy egyszerű időtervezési modellt ad.</p>",
      "<p>Fontos, hogy a 90 perc nem biológiai szabály. Az NHLBI/NIH összefoglalója szerint az alvási ciklus jellemzően 80–100 percenként indul újra, és a ciklusok ugyanazon éjszakán belül is változhatnak. A kalkulátor ezért nem azt mondja meg, mikor fogsz biztosan könnyen felébredni, hanem egy egyszerű időtervezési modellt ad.</p>",
      "alvás 80–100 perces forrásalapú pontosítás"
    );
    return output;
  },

  "kalkulatorok/pulzus-zona-kalkulator.html": (source) => {
    let output = replaceAllExact(
      source,
      "Pulzuszóna kalkulátor életkor és nyugalmi pulzus alapján. Becsüld meg az edzési pulzustartományokat, értsd meg a módszer korlátait és a zónák gyakorlati használatát.",
      "Pulzuszóna kalkulátor felnőtteknek életkor és nyugalmi pulzus alapján. Becsüld meg a relatív edzési pulzustartományokat és értsd meg a módszer korlátait.",
      "pulzus meta felnőtt scope"
    );
    output = replaceExact(
      output,
      "<section class=\"hero\"><h1>Pulzus zóna kalkulátor</h1><p>Számold ki az edzéshez használható pulzustartományokat, és értsd meg, mire valók.</p></section>",
      "<section class=\"hero\"><h1>Pulzus zóna kalkulátor</h1><p>Felnőtteknek készült tájékoztató pulzustartalékos intenzitásbecslés életkor és nyugalmi pulzus alapján.</p></section>",
      "pulzus hero felnőtt scope"
    );
    output = replaceExact(
      output,
      "<div class=\"example-box\"><h3>Példa 35 éves sportolónál</h3><p>35 éves korban a képlet szerinti maximum 185 bpm. Ha a nyugalmi pulzus 65 bpm, a pulzustartalék 120. A 60–70%-os tartomány így körülbelül 137–149 bpm, a 70–85%-os tartomány pedig 149–167 bpm.</p></div>",
      "<div class=\"example-box\"><h3>Példa 35 éves felnőttnél</h3><p>35 éves korban a 220 − életkor képlet szerinti maximum 185 bpm. Ha a nyugalmi pulzus 65 bpm, a pulzustartalék 120. A HHS relatív intenzitási sávjai alapján a 40–59%-os közepes tartomány körülbelül 113–136 bpm, a 60–84%-os intenzív tartomány pedig 137–166 bpm.</p></div>",
      "pulzus példa standard HRR sávokra"
    );
    output = replaceExact(
      output,
      "<ul><li><strong>Könnyű tartomány:</strong> bemelegítéshez, regeneráló mozgáshoz, hosszabb könnyű edzéshez használható.</li><li><strong>Közepes tartomány:</strong> tartósabb állóképességi munkát jelenthet, ahol a beszéd még többnyire kontrollálható.</li><li><strong>Magasabb tartomány:</strong> nehezebben fenntartható, intenzívebb munka; kezdőként nem ez az elsődleges cél.</li></ul>",
      "<ul><li><strong>Közepes relatív intenzitás (40–59% pulzustartalék):</strong> tájékoztató tartomány; a beszédteszt és a saját terhelésérzet is fontos kontroll.</li><li><strong>Intenzív relatív intenzitás (60–84% pulzustartalék):</strong> nagyobb terhelés; kezdőként, gyógyszer vagy ismert szív-érrendszeri betegség mellett nem önmagában a kalkulált pulzusszám alapján érdemes célozni.</li></ul>",
      "pulzus intenzitási kategóriák"
    );
    return output;
  },
};

function run({ checkOnly = process.argv.includes("--check") } = {}) {
  let changed = 0;
  for (const [relativePath, transform] of Object.entries(transforms)) {
    const filePath = path.join(root, relativePath);
    if (!fs.existsSync(filePath)) throw new Error(`Hiányzó egészség-upgrade fájl: ${relativePath}`);
    const source = fs.readFileSync(filePath, "utf8");
    const expected = transform(source);
    const secondPass = transform(expected);
    if (secondPass !== expected) throw new Error(`Nem idempotens egészség-upgrade: ${relativePath}`);

    if (checkOnly) continue;
    if (source !== expected) {
      fs.writeFileSync(filePath, expected);
      changed += 1;
    }
  }

  console.log(
    checkOnly
      ? `Egészség modell-upgrade audit OK: ${Object.keys(transforms).length} fájl, idempotens.`
      : `Egészség modell-upgrade alkalmazva: ${changed}/${Object.keys(transforms).length} fájl módosult.`
  );
}

if (require.main === module) run();

module.exports = { transforms, run };
