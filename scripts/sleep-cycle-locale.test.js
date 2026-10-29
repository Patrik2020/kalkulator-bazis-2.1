"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {translate}=require("../js/altalanos/sleep-cycle-locale.js");
const page="alvasciklus-kalkulator";

test("sleep-cycle labels, guidance and limitations have English and German translations",()=>{
  assert.equal(translate(page,"Felkelés órája","en"),"Wake-up hour");
  assert.equal(translate(page,"Mi fontosabb a ciklusoknál?","de"),"Was ist wichtiger als die Zyklen?");
  assert.equal(translate(page,"Fontos, hogy a 90 perc nem biológiai szabály. Az NHLBI/NIH összefoglalója szerint az alvási ciklus jellemzően 80–100 percenként indul újra, és a ciklusok ugyanazon éjszakán belül is változhatnak. A kalkulátor ezért nem azt mondja meg, mikor fogsz biztosan könnyen felébredni, hanem egy egyszerű időtervezési modellt ad.","en").includes("not a biological rule"),true);
});
test("dynamic result headings translate while clock values remain unchanged",()=>{
  assert.equal(translate(page,"Példa: 6 × 90 perc + 15 perc elalvás","en"),"Example: 6 × 90 minutes + 15 minutes to fall asleep");
  assert.equal(translate(page,"21:45","de"),null);
});
test("Hungarian and unrelated page content stays unchanged",()=>{
  assert.equal(translate(page,"Felkelés órája","hu"),null);
  assert.equal(translate("other","Felkelés órája","en"),null);
});
