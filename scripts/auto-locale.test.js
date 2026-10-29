"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {translate}=require("../js/autos/auto-locale.js");

test("trip calculator content and trip-planning guidance have EN and DE translations",()=>{
  assert.equal(translate("Utazási költség, fogyasztás és hatótáv kalkulátor","en"),"Trip Cost, Fuel Consumption and Range Calculator");
  assert.equal(translate("Üzemanyag ár (Ft/l)","de"),"Kraftstoffpreis (HUF/l)");
  const guide=translate("A szükséges üzemanyag a távolság és fogyasztás szorzata 100-zal osztva. Ezt szorozza a kalkulátor a literárral. Oda-vissza útnál a teljes távolságot add meg, és számolj az autópályadíjjal, parkolással, valamint egyéb költségekkel is.","en");
  assert.ok(guide.includes("divided by 100"));
  assert.ok(translate("Mindig hagyj biztonsági tartalékot.","de")===null);
});
test("three live outputs remain numeric and Hungarian labels remain unchanged",()=>{
  assert.equal(translate("Költség:","en"),"Cost:");
  assert.equal(translate("Hatótáv:","de"),"Reichweite:");
  assert.equal(translate("4200 Ft","en"),null);
  assert.equal(translate("Költség:","hu"),null);
});
