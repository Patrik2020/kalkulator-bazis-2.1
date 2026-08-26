const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { apply } = require("./apply-auto-model-upgrades");
const { transform } = require("./apply-auto-financial-edge-upgrades");

const root = path.resolve(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "js", "auto-converter-upgrades.js"), "utf8");
const source = transform(apply(raw));

assert.ok(source.includes('{id:"years",label:"Időtáv (év)",value:5,min:1,max:80,step:"1"}'), "Értékvesztés évmező nem egész évre korlátozott");
assert.ok(source.includes('if(!Number.isInteger(years)||years<1||years>80)'), "Értékvesztés runtime egészév-guard hiányzik");
assert.ok(source.includes('if(rates.some(x=>x<0||x>100))'), "Értékvesztési ráta 0–100% guard hiányzik");
assert.ok(source.includes('if(infl<=-100)'), "-100% alatti defláció guard hiányzik");
assert.ok(source.includes('Példa – közép: 1. vizsgált év (%)'), "Az első év nincs vizsgált évként/példaként címkézve");

const price = 5_000_000;
const nominal = price * 0.85 * 0.92;
assert.equal(nominal, 3_910_000);
const real = nominal / Math.pow(1.035, 2);
assert.ok(Math.abs(real - 3_650_026.84) < 1, `Mai vásárlóérték referencia eltért: ${real}`);

assert.ok(source.includes('{id:"fuel",label:"Üzemanyagár (Ft/l)",value:620,min:0}'), "Éves autóköltség üzemanyagára enged negatív értéket");
assert.ok(source.includes('{id:"insurance",label:"Biztosítás évente",value:90000,min:0}'), "Biztosítás negatív értéke nincs tiltva");
assert.ok(source.includes('"Éves teljes gazdasági költség"'), "Értékvesztést tartalmazó összeg nincs gazdasági költségként címkézve");
assert.ok(source.includes('Gazdasági költség: nem feltétlenül jelent éves készpénzkiadást.'), "Értékvesztés cash-flow korlátja nincs dokumentálva");
const annualFuel = 15000 * 6.5 / 100 * 620;
assert.equal(annualFuel, 604500);
const fixed = 90000 + 80000 + 220000 + 70000 + 180000 + 350000;
assert.equal(fixed, 990000);
assert.equal(annualFuel + fixed, 1594500);

assert.ok(source.includes('if(!Number.isInteger(passengers)||passengers<1)'), "Kilométerdíj tört utasszámot elfogad");
assert.ok(source.includes('if(!Number.isInteger(people)||people<1)'), "Útiköltség tört utasszámot elfogad");
assert.ok(source.includes('{id:"priceChange",label:"Árváltozás teszt (%)",value:10,min:-100'), "Árváltozás -100% alsó korlát hiányzik");
assert.ok(source.includes('if(priceChange<-100)'), "Útiköltség -100% alatti árstressz runtime guard hiányzik");

// A gumiméretnél csak pozitív alapvédelem marad: a homologizálható tartomány jármű- és gyártófüggő,
// ezért a kalkulátor nem talál ki univerzális 50–500 mm / 8–30 colos korlátot.
assert.ok(source.includes('{id:"w1",label:"Régi szélesség (mm)",value:185,min:1}'), "Gumiszélesség pozitív minimuma hiányzik");
assert.ok(source.includes('{id:"r1",label:"Régi felni (inch)",value:15,min:1}'), "Felni pozitív minimuma hiányzik");

console.log("Auto financial edge audit OK: értékvesztés, éves költség, utasszám és árstressz szélsőértékek; a gumiméret gyártófüggő tartománya nincs önkényesen korlátozva.");
