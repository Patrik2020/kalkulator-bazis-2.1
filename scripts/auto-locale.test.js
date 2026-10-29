"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {translate}=require("../js/autos/auto-locale.js");
const page="auto-kalkulator";

test("trip calculator content and trip-planning guidance have EN and DE translations",()=>{
  assert.equal(translate(page,"Utazási költség, fogyasztás és hatótáv kalkulátor","en"),"Trip Cost, Fuel Consumption and Range Calculator");
  assert.equal(translate(page,"Üzemanyag ár (Ft/l)","de"),"Kraftstoffpreis (HUF/l)");
  const guide=translate(page,"A szükséges üzemanyag a távolság és fogyasztás szorzata 100-zal osztva. Ezt szorozza a kalkulátor a literárral. Oda-vissza útnál a teljes távolságot add meg, és számolj az autópályadíjjal, parkolással, valamint egyéb költségekkel is.","en");
  assert.ok(guide.includes("divided by 100"));
  assert.ok(translate(page,"A hatótáv képlete:","de")==="Formel für die Reichweite:");
});
test("three live outputs remain numeric and Hungarian labels remain unchanged",()=>{
  assert.equal(translate(page,"Költség:","en"),"Cost:");
  assert.equal(translate(page,"Hatótáv:","de"),"Reichweite:");
  assert.equal(translate(page,"4200 Ft","en"),null);
  assert.equal(translate(page,"Költség:","hu"),null);
});

test("related recommendations and dynamic per-kilometre amounts are localized",()=>{
  assert.equal(translate(page,"Az eredmény után","en"),"What to do after the result");
  assert.equal(translate(page,"Valós fogyasztás","de"),"Tatsächlicher Verbrauch");
  assert.equal(translate(page,"100,3 Ft/km","en"),"100,3 HUF/km");
  assert.equal(translate(page,"100,3 Ft/km","de"),"100,3 HUF/km");
});
